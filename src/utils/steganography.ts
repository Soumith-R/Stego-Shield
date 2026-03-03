/**
 * Stego Shield - Edge-Adaptive LSB Steganography with AES-GCM Encryption
 *
 * This module provides:
 * - Edge-adaptive LSB steganography: embeds data in high-edge regions of
 *   the image where modifications are least perceptible to human vision.
 * - AES-GCM authenticated encryption: encrypts messages with a password
 *   using PBKDF2 key derivation + AES-256-GCM.
 *
 * Data format embedded in image:
 *   [4 bytes: payload length][payload: salt(16) + iv(12) + ciphertext+tag]
 */

const CHANNELS_TO_USE = 3; // RGB channels (skip alpha)
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const PBKDF2_ITERATIONS = 100_000;

// ─── AES-GCM Encryption ────────────────────────────────────────────────────

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptAESGCM(plaintext: string, password: string): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plaintext)
  );

  // Combine: salt + iv + ciphertext (includes GCM auth tag)
  const ciphertext = new Uint8Array(ciphertextBuffer);
  const result = new Uint8Array(SALT_LENGTH + IV_LENGTH + ciphertext.length);
  result.set(salt, 0);
  result.set(iv, SALT_LENGTH);
  result.set(ciphertext, SALT_LENGTH + IV_LENGTH);

  return result;
}

async function decryptAESGCM(data: Uint8Array, password: string): Promise<string> {
  const salt = data.slice(0, SALT_LENGTH);
  const iv = data.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = data.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(password, salt);

  const plaintextBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return decoder.decode(plaintextBuffer);
}

// ─── Edge Detection (Sobel Filter) ─────────────────────────────────────────

/**
 * Compute per-pixel edge strength using a Sobel filter on luminance.
 * Uses top 7 bits (value & 0xFE) so the result is identical whether
 * computed from the original image or the stego image (LSB changes ignored).
 */
function computeEdgeMap(imageData: ImageData): Float64Array {
  const { width, height, data } = imageData;
  const edgeStrength = new Float64Array(width * height);

  // Convert to luminance (top 7 bits to be LSB-invariant)
  const lum = new Float64Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    const r = data[idx] & 0xFE;
    const g = data[idx + 1] & 0xFE;
    const b = data[idx + 2] & 0xFE;
    lum[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // Sobel kernels
  // Gx:              Gy:
  // -1  0  +1        -1  -2  -1
  // -2  0  +2         0   0   0
  // +1  0  +1        +1  +2  +1

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const tl = lum[(y - 1) * width + (x - 1)];
      const tc = lum[(y - 1) * width + x];
      const tr = lum[(y - 1) * width + (x + 1)];
      const ml = lum[y * width + (x - 1)];
      const mr = lum[y * width + (x + 1)];
      const bl = lum[(y + 1) * width + (x - 1)];
      const bc = lum[(y + 1) * width + x];
      const br = lum[(y + 1) * width + (x + 1)];

      const gx = -tl + tr - 2 * ml + 2 * mr - bl + br;
      const gy = -tl - 2 * tc - tr + bl + 2 * bc + br;

      edgeStrength[y * width + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  return edgeStrength;
}

/**
 * Get an ordered list of pixel indices sorted by edge strength (descending).
 * Ties are broken by pixel index for deterministic ordering.
 */
function getEdgeAdaptiveOrder(edgeMap: Float64Array): Uint32Array {
  const indices = new Uint32Array(edgeMap.length);
  for (let i = 0; i < indices.length; i++) {
    indices[i] = i;
  }

  // Sort descending by edge strength, then ascending by index for stability
  indices.sort((a, b) => {
    const diff = edgeMap[b] - edgeMap[a];
    return diff !== 0 ? diff : a - b;
  });

  return indices;
}

// ─── Bit Packing / Unpacking ────────────────────────────────────────────────

function bytesToBits(bytes: Uint8Array): number[] {
  const bits: number[] = [];
  for (let i = 0; i < bytes.length; i++) {
    for (let b = 7; b >= 0; b--) {
      bits.push((bytes[i] >> b) & 1);
    }
  }
  return bits;
}

function bitsToBytes(bits: number[]): Uint8Array {
  const byteCount = Math.floor(bits.length / 8);
  const bytes = new Uint8Array(byteCount);
  for (let i = 0; i < byteCount; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bits[i * 8 + b];
    }
    bytes[i] = byte;
  }
  return bytes;
}

/**
 * Encode a 32-bit unsigned integer as 4 bytes (big-endian).
 */
function uint32ToBytes(value: number): Uint8Array {
  const bytes = new Uint8Array(4);
  bytes[0] = (value >>> 24) & 0xFF;
  bytes[1] = (value >>> 16) & 0xFF;
  bytes[2] = (value >>> 8) & 0xFF;
  bytes[3] = value & 0xFF;
  return bytes;
}

function bytesToUint32(bytes: Uint8Array): number {
  return ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Calculate maximum message character capacity for an image.
 * Accounts for encryption overhead (salt + iv + GCM tag) and the 4-byte length header.
 */
export function calculateCapacity(width: number, height: number): number {
  const totalPixels = width * height;
  const totalBits = totalPixels * CHANNELS_TO_USE;
  const totalBytes = Math.floor(totalBits / 8);

  // Overhead: 4 (length header) + 16 (salt) + 12 (iv) + 16 (GCM auth tag)
  const overhead = 4 + SALT_LENGTH + IV_LENGTH + 16;
  const usableBytes = totalBytes - overhead;

  // Each character can be up to 3 bytes in UTF-8, but most are 1 byte.
  // We report a conservative estimate assuming 1 byte per character.
  return Math.max(0, usableBytes);
}

/**
 * Load image from data URL and return canvas with image data.
 */
function loadImageToCanvas(dataUrl: string): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas);
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Encode a message into an image using edge-adaptive LSB steganography
 * with AES-GCM encryption.
 */
export async function encodeMessage(
  imageDataUrl: string,
  message: string,
  password: string
): Promise<string> {
  const canvas = await loadImageToCanvas(imageDataUrl);
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // 1. Encrypt the message
  const encrypted = await encryptAESGCM(message, password);

  // 2. Build the payload: [4-byte length] + [encrypted data]
  const lengthBytes = uint32ToBytes(encrypted.length);
  const payload = new Uint8Array(4 + encrypted.length);
  payload.set(lengthBytes, 0);
  payload.set(encrypted, 4);

  // 3. Convert payload to bits
  const bits = bytesToBits(payload);

  // 4. Check capacity
  const totalPixels = canvas.width * canvas.height;
  const availableBits = totalPixels * CHANNELS_TO_USE;
  if (bits.length > availableBits) {
    throw new Error(
      `Message too long: need ${bits.length} bits, image has ${availableBits} bits available`
    );
  }

  // 5. Compute edge map and get embedding order
  const edgeMap = computeEdgeMap(imageData);
  const order = getEdgeAdaptiveOrder(edgeMap);

  // 6. Embed bits in edge-adaptive order
  let bitIndex = 0;
  for (let i = 0; i < order.length && bitIndex < bits.length; i++) {
    const pixelIdx = order[i];
    const baseIdx = pixelIdx * 4;

    // Embed into R, G, B channels of this pixel
    for (let ch = 0; ch < CHANNELS_TO_USE && bitIndex < bits.length; ch++) {
      const dataIdx = baseIdx + ch;
      pixels[dataIdx] = (pixels[dataIdx] & 0xFE) | bits[bitIndex];
      bitIndex++;
    }
  }

  // 7. Write modified image data back
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL('image/png');
}

/**
 * Decode a message from an image using edge-adaptive LSB steganography
 * with AES-GCM decryption.
 */
export async function decodeMessage(
  imageDataUrl: string,
  password: string
): Promise<string> {
  const canvas = await loadImageToCanvas(imageDataUrl);
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  // 1. Compute edge map and get extraction order (same as encoding)
  const edgeMap = computeEdgeMap(imageData);
  const order = getEdgeAdaptiveOrder(edgeMap);

  // 2. Extract all LSBs in edge-adaptive order
  const allBits: number[] = [];
  for (let i = 0; i < order.length; i++) {
    const pixelIdx = order[i];
    const baseIdx = pixelIdx * 4;
    for (let ch = 0; ch < CHANNELS_TO_USE; ch++) {
      allBits.push(pixels[baseIdx + ch] & 1);
    }
  }

  // 3. Read the 4-byte length header (32 bits)
  if (allBits.length < 32) {
    throw new Error('Image too small to contain a hidden message');
  }
  const lengthBits = allBits.slice(0, 32);
  const lengthBytes = bitsToBytes(lengthBits);
  const payloadLength = bytesToUint32(lengthBytes);

  // 4. Sanity check
  const maxPayload = Math.floor(allBits.length / 8) - 4;
  if (payloadLength === 0 || payloadLength > maxPayload) {
    throw new Error('No valid hidden message found in this image');
  }

  // 5. Extract the encrypted payload
  const payloadBits = allBits.slice(32, 32 + payloadLength * 8);
  if (payloadBits.length < payloadLength * 8) {
    throw new Error('Incomplete hidden message data');
  }
  const encryptedPayload = bitsToBytes(payloadBits);

  // 6. Decrypt
  try {
    return await decryptAESGCM(encryptedPayload, password);
  } catch {
    throw new Error('Decryption failed — wrong password or no hidden message');
  }
}
