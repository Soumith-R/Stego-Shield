/**
 * Stego Shield - Steganography Utilities
 * 
 * This module provides LSB (Least Significant Bit) steganography functions
 * for encoding and decoding hidden messages in images.
 */

const BITS_PER_BYTE = 8;
const TERMINATOR = '00000000'; // NUL character as end marker
const CHANNELS_TO_USE = 3; // RGB channels (skip alpha)

/**
 * Convert text to an array of bits
 */
function textToBits(text: string): string[] {
  const bits: string[] = [];
  
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const binary = charCode.toString(2).padStart(BITS_PER_BYTE, '0');
    bits.push(...binary.split(''));
  }
  
  // Append NUL terminator
  bits.push(...TERMINATOR.split(''));
  
  return bits;
}

/**
 * Convert bits to text (stops at NUL terminator)
 */
function bitsToText(bits: string[]): string {
  const chars: string[] = [];
  
  for (let i = 0; i < bits.length; i += BITS_PER_BYTE) {
    const byteBits = bits.slice(i, i + BITS_PER_BYTE);
    
    if (byteBits.length < BITS_PER_BYTE) break;
    
    const byteStr = byteBits.join('');
    
    if (byteStr === TERMINATOR) break;
    
    const charCode = parseInt(byteStr, 2);
    // Skip invalid characters
    if (charCode > 0 && charCode < 65536) {
      chars.push(String.fromCharCode(charCode));
    }
  }
  
  return chars.join('');
}

/**
 * Calculate maximum character capacity for an image
 */
export function calculateCapacity(width: number, height: number): number {
  const totalPixels = width * height;
  const totalBits = totalPixels * CHANNELS_TO_USE;
  const totalBytes = Math.floor(totalBits / BITS_PER_BYTE);
  return Math.max(0, totalBytes - 1); // -1 for terminator
}

/**
 * Load image from data URL and return canvas with image data
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
 * Encode a message into an image
 */
export async function encodeMessage(imageDataUrl: string, message: string): Promise<string> {
  const canvas = await loadImageToCanvas(imageDataUrl);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const bits = textToBits(message);
  const capacity = Math.floor((data.length / 4) * CHANNELS_TO_USE);
  
  if (bits.length > capacity) {
    throw new Error(`Message too long: need ${bits.length} bits, image has ${capacity} bits`);
  }

  let bitIndex = 0;
  
  for (let i = 0; i < data.length && bitIndex < bits.length; i++) {
    // Skip alpha channel (every 4th byte)
    if ((i + 1) % 4 === 0) continue;
    
    const bit = parseInt(bits[bitIndex], 10);
    data[i] = (data[i] & ~1) | bit;
    bitIndex++;
  }

  ctx.putImageData(imageData, 0, 0);
  
  return canvas.toDataURL('image/png');
}

/**
 * Decode a message from an image
 */
export async function decodeMessage(imageDataUrl: string): Promise<string> {
  const canvas = await loadImageToCanvas(imageDataUrl);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  const bits: string[] = [];
  
  for (let i = 0; i < data.length; i++) {
    // Skip alpha channel
    if ((i + 1) % 4 === 0) continue;
    
    bits.push((data[i] & 1).toString());
  }

  return bitsToText(bits);
}
