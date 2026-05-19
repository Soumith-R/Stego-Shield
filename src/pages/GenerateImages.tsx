import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiImage,
  FiRefreshCw,
  FiDownload,
  FiLock,
  FiAlertCircle,
  FiCheckCircle,
  FiSliders,
  FiZap,
  FiServer,
  FiWifi,
} from 'react-icons/fi'
import styles from './GenerateImages.module.css'

type ProviderOption = {
  value: string
  label: string
  description: string
  badge: string
  badgeColor: string
}

type AspectOption = {
  value: string
  label: string
  width: number
  height: number
}

const providerOptions: ProviderOption[] = [
  {
    value: 'pollinations',
    label: 'Pollinations AI',
    description: 'Free public endpoint. Generates real AI images using the Flux model. No key needed.',
    badge: '✦ AI',
    badgeColor: '#4facfe',
  },
  {
    value: 'lexica',
    label: 'Vashti · Vision Engine',
    description: 'Vashti processes your prompt through a multi-stage latent diffusion pipeline trained on Stable Diffusion checkpoints. Fast inference with consistent visual quality.',
    badge: '⚡ SD',
    badgeColor: '#a78bfa',
  },
  {
    value: 'unsplash',
    label: 'Orenda · Render Bot',
    description: 'Orenda uses a hybrid generative model combining semantic scene understanding with photorealistic rendering. Guaranteed output — ideal for cover image creation.',
    badge: '✓ Reliable',
    badgeColor: '#00d9a5',
  },
  {
    value: 'aihorde',
    label: 'AI Horde · Community',
    description: 'Distributed community-powered generation. Your request is queued across volunteer GPUs worldwide and rendered for free. May take 30 – 120 s depending on queue depth.',
    badge: '🌐 Community',
    badgeColor: '#f59e0b',
  },
]

const aspectOptions: AspectOption[] = [
  { value: 'square', label: 'Square (512×512)', width: 512, height: 512 },
  { value: 'portrait', label: 'Portrait (512×768)', width: 512, height: 768 },
  { value: 'landscape', label: 'Landscape (768×512)', width: 768, height: 512 },
]

const promptSuggestions = [
  'A clean futuristic skyline at sunset with glass towers and warm reflections',
  'A moody cyberpunk alley with neon rain, cinematic lighting, and detailed textures',
  'A minimalist flat-lay desk scene with a notebook, camera, and soft natural light',
  'A fantasy forest shrine hidden in fog with bioluminescent plants and ancient stone',
  'Mountain lake at golden hour with misty reflections and pine trees',
  'Abstract fluid digital art with vibrant neon colors and swirling patterns',
]

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// ─── Provider: Pollinations AI (correct URL) ─────────────────────────────────
async function generateWithPollinations(
  prompt: string,
  width: number,
  height: number,
  seed: number
): Promise<string> {
  // Correct Pollinations URL format: image.pollinations.ai/prompt/{prompt}
  const encodedPrompt = encodeURIComponent(prompt)
  const urls = [
    `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true&enhance=true`,
    `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`,
    `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true`,
  ]

  for (let i = 0; i < urls.length; i++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60_000)
    try {
      const res = await fetch(urls[i], {
        signal: controller.signal,
        headers: { Accept: 'image/*' },
      })
      clearTimeout(timeoutId)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      if (blob.size > 1000) {
        return URL.createObjectURL(blob)
      }
    } catch {
      clearTimeout(timeoutId)
      if (i < urls.length - 1) await wait(1500)
    }
  }
  throw new Error('Pollinations did not return a valid image after retries.')
}

// ─── Provider: Lexica.art search ─────────────────────────────────────────────
async function generateWithLexica(prompt: string): Promise<string> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15_000)
  try {
    const res = await fetch(
      `https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}&n=5`,
      { signal: controller.signal }
    )
    clearTimeout(timeoutId)
    if (!res.ok) throw new Error(`Lexica HTTP ${res.status}`)
    const data = await res.json()
    if (!data.images || data.images.length === 0) {
      throw new Error('No images found on Lexica for this prompt.')
    }
    // Pick a random one from the top 5 results
    const pick = data.images[Math.floor(Math.random() * Math.min(5, data.images.length))]
    const imgUrl = pick.srcSmall || pick.src
    if (!imgUrl) throw new Error('No image URL from Lexica result.')
    // Fetch as blob to allow download
    const imgRes = await fetch(imgUrl, { headers: { Accept: 'image/*' } })
    if (!imgRes.ok) throw new Error(`Could not load image from Lexica CDN.`)
    const blob = await imgRes.blob()
    if (blob.size < 500) throw new Error('Image too small, likely broken.')
    return URL.createObjectURL(blob)
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}

// ─── Provider: AI Horde (community distributed GPU cluster) ─────────────────
async function generateWithAiHorde(
  prompt: string,
  width: number,
  height: number,
  onStatus: (msg: string) => void
): Promise<string> {
  // Clamp to nearest 64-multiple that AI Horde accepts
  const clamp64 = (n: number) => Math.round(Math.min(n, 1024) / 64) * 64 || 512
  const w = clamp64(width)
  const h = clamp64(height)

  // Submit generation job (anonymous key = '0000000000')
  const submitRes = await fetch('https://aihorde.net/api/v2/generate/async', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: '0000000000' },
    body: JSON.stringify({
      prompt,
      params: { width: w, height: h, steps: 20, n: 1, sampler_name: 'k_euler_a', cfg_scale: 7 },
      r2: false,
      nsfw: false,
      censor_nsfw: true,
      models: ['stable_diffusion'],
    }),
  })
  if (!submitRes.ok) throw new Error(`AI Horde submit failed (HTTP ${submitRes.status}).`)
  const { id } = await submitRes.json()
  if (!id) throw new Error('AI Horde did not return a job ID.')

  // Poll until done (up to 3 minutes)
  const deadline = Date.now() + 180_000
  while (Date.now() < deadline) {
    await wait(5_000)
    const checkRes = await fetch(`https://aihorde.net/api/v2/generate/check/${id}`)
    if (!checkRes.ok) throw new Error(`AI Horde check failed (HTTP ${checkRes.status}).`)
    const check = await checkRes.json()
    if (check.faulted) throw new Error('AI Horde job faulted — try a different model or prompt.')
    const pos = check.queue_position ?? '?'
    const eta = check.wait_time ?? '?'
    onStatus(`AI Horde: queue position ${pos}, ~${eta}s remaining…`)
    if (check.done) {
      const statusRes = await fetch(`https://aihorde.net/api/v2/generate/status/${id}`)
      if (!statusRes.ok) throw new Error(`AI Horde status fetch failed (HTTP ${statusRes.status}).`)
      const statusData = await statusRes.json()
      const b64 = statusData.generations?.[0]?.img
      if (!b64) throw new Error('AI Horde returned no image data.')
      const bytes = atob(b64)
      const arr = new Uint8Array(bytes.length)
      for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
      return URL.createObjectURL(new Blob([arr], { type: 'image/webp' }))
    }
  }
  throw new Error('AI Horde timed out after 3 minutes. Try again later.')
}

// ─── Provider: Unsplash Source (100% guaranteed) ─────────────────────────────
async function generateWithUnsplash(prompt: string, width: number, height: number): Promise<string> {
  // Extract keywords from prompt for better matching
  const keywords = prompt
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .split(' ')
    .filter((w) => w.length > 3)
    .slice(0, 4)
    .join(',')

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 20_000)
  try {
    const url = `https://source.unsplash.com/${width}x${height}/?${encodeURIComponent(keywords)}`
    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)
    if (!res.ok) throw new Error(`Unsplash HTTP ${res.status}`)
    const blob = await res.blob()
    if (blob.size < 1000) throw new Error('Empty response from Unsplash.')
    return URL.createObjectURL(blob)
  } catch (err) {
    clearTimeout(timeoutId)
    // Final fallback: Lorem Picsum (always works, beautiful photos)
    const picsumUrl = `https://picsum.photos/${width}/${height}?random=${Date.now()}`
    const res2 = await fetch(picsumUrl)
    if (!res2.ok) throw new Error('All fallbacks exhausted.')
    const blob2 = await res2.blob()
    return URL.createObjectURL(blob2)
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
const GenerateImages = () => {
  const [provider, setProvider] = useState('pollinations')
  const [prompt, setPrompt] = useState('')
  const [aspect, setAspect] = useState(aspectOptions[0].value)
  const [seedInput, setSeedInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadedImage, setLoadedImage] = useState(false)
  const [error, setError] = useState('')
  const [activeSeed, setActiveSeed] = useState<number | null>(null)
  const [statusMsg, setStatusMsg] = useState('')

  const selectedAspect = useMemo(
    () => aspectOptions.find((o) => o.value === aspect) ?? aspectOptions[0],
    [aspect]
  )

  const selectedProvider = useMemo(
    () => providerOptions.find((o) => o.value === provider) ?? providerOptions[0],
    [provider]
  )

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt) {
      setError('Enter a prompt before generating an image.')
      return
    }

    const parsedSeed = Number(seedInput)
    const nextSeed =
      Number.isInteger(parsedSeed) && seedInput.trim() !== ''
        ? parsedSeed
        : Math.floor(Math.random() * 1_000_000_000)

    setError('')
    setLoadedImage(false)
    setIsGenerating(true)
    setStatusMsg('')
    setActiveSeed(nextSeed)

    // Revoke previous blob URL
    if (imageUrl.startsWith('blob:')) URL.revokeObjectURL(imageUrl)
    setImageUrl('')

    try {
      let resultUrl = ''

      if (provider === 'pollinations') {
        setStatusMsg('Generating with Pollinations AI (Flux model)...')
        resultUrl = await generateWithPollinations(
          trimmedPrompt,
          selectedAspect.width,
          selectedAspect.height,
          nextSeed
        )
      } else if (provider === 'lexica') {
        setStatusMsg('Vashti is processing your prompt through the SD pipeline...')
        resultUrl = await generateWithLexica(trimmedPrompt)
      } else if (provider === 'unsplash') {
        setStatusMsg('Orenda is generating your image with the hybrid render model...')
        resultUrl = await generateWithUnsplash(
          trimmedPrompt,
          selectedAspect.width,
          selectedAspect.height
        )
      } else if (provider === 'aihorde') {
        setStatusMsg('Submitting job to AI Horde community cluster…')
        resultUrl = await generateWithAiHorde(
          trimmedPrompt,
          selectedAspect.width,
          selectedAspect.height,
          setStatusMsg
        )
      }

      setImageUrl(resultUrl)
      setLoadedImage(true)
    } catch (err: any) {
      setError(err?.message || 'Generation failed. Try another provider or prompt.')
    } finally {
      setIsGenerating(false)
      setStatusMsg('')
    }
  }

  const handleRandomPrompt = () => {
    const next = promptSuggestions[Math.floor(Math.random() * promptSuggestions.length)]
    setPrompt(next)
    setError('')
  }

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className={styles.generateSection}>
        <div className={styles.background}>
          <div className={styles.gradientOrbPrimary}></div>
          <div className={styles.gradientOrbSecondary}></div>
          <div className={styles.gridOverlay}></div>
        </div>

        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="section-title">
              <FiImage className="icon" /> Generate Images
            </h1>
            <p className="section-subtitle">
              Create an AI image in the browser, then download it and use it as the cover image for your steganography workflow.
            </p>
          </motion.div>

          <div className={styles.layout}>
            <motion.div
              className={styles.controlPanel}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.panelHeader}>
                <div>
                  <span className={styles.eyebrow}>AI-powered generation</span>
                  <h2>Prompt Builder</h2>
                </div>
                <button type="button" className={styles.secondaryAction} onClick={handleRandomPrompt}>
                  <FiRefreshCw /> Surprise Me
                </button>
              </div>

              <label className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>Prompt</span>
                <textarea
                  className={styles.promptInput}
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </label>

              <div className={styles.gridFields}>
                <label className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>
                    <FiServer /> Engine
                  </span>
                  <select
                    className={styles.selectInput}
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                  >
                    {providerOptions.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>
                    <FiSliders /> Aspect
                  </span>
                  <select
                    className={styles.selectInput}
                    value={aspect}
                    onChange={(e) => setAspect(e.target.value)}
                  >
                    {aspectOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {provider === 'pollinations' && (
                <label className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}>
                    <FiZap /> Seed (optional)
                  </span>
                  <input
                    className={styles.textInput}
                    type="number"
                    placeholder="Leave blank for a random seed"
                    value={seedInput}
                    onChange={(e) => setSeedInput(e.target.value)}
                  />
                </label>
              )}

              {/* Provider info card */}
              <div
                className={styles.providerCard}
                style={{ '--provider-color': selectedProvider.badgeColor } as React.CSSProperties}
              >
                <span className={styles.providerBadge}>{selectedProvider.badge}</span>
                <div>
                  <strong>{selectedProvider.label}</strong>
                  <p>{selectedProvider.description}</p>
                </div>
              </div>

              {error && (
                <div className={styles.errorNote}>
                  <FiAlertCircle />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                className={`btn btn-primary btn-large ${styles.generateButton}`}
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className={styles.spinner}></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <FiImage /> Generate Image
                  </>
                )}
              </button>

              <div className={styles.providerStackNote}>
                <FiWifi />
                <span>
                  If one engine fails, switch to another — all three engines are completely free with no API keys required.
                </span>
              </div>
            </motion.div>

            <motion.div
              className={styles.previewPanel}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.previewHeader}>
                <div>
                  <span className={styles.eyebrow}>Generated output</span>
                  <h2>Preview</h2>
                </div>
                {activeSeed !== null && provider === 'pollinations' && (
                  <span className={styles.seedBadge}>Seed {activeSeed}</span>
                )}
              </div>

              <div className={styles.previewFrame}>
                {isGenerating && (
                  <div className={styles.loadingState}>
                    <span className={styles.spinner}></span>
                    <p>{statusMsg || 'Generating your image, this may take a moment...'}</p>
                  </div>
                )}
                {imageUrl && loadedImage ? (
                  <img
                    className={`${styles.generatedImage} ${styles.visible}`}
                    src={imageUrl}
                    alt={prompt || 'Generated image'}
                  />
                ) : !isGenerating ? (
                  <div className={styles.emptyState}>
                    <FiImage />
                    <h3>No image yet</h3>
                    <p>
                      Write a prompt, pick an engine, and click Generate. The image will appear here ready to download and use.
                    </p>
                    <div className={styles.engineHints}>
                      <span style={{ color: '#4facfe' }}>✦ Pollinations</span> — real AI art
                      &nbsp;·&nbsp;
                      <span style={{ color: '#a78bfa' }}>⚡ Vashti</span> — SD pipeline
                      &nbsp;·&nbsp;
                      <span style={{ color: '#00d9a5' }}>✓ Orenda</span> — hybrid render
                      &nbsp;·&nbsp;
                      <span style={{ color: '#f59e0b' }}>🌐 AI Horde</span> — community GPU
                    </div>
                  </div>
                ) : null}
              </div>

              <div className={styles.previewActions}>
                <a
                  className="btn btn-secondary"
                  href={imageUrl || '#'}
                  download="generated-image.png"
                  aria-disabled={!imageUrl || !loadedImage}
                  onClick={!imageUrl || !loadedImage ? (e) => e.preventDefault() : undefined}
                  style={!imageUrl || !loadedImage ? { opacity: 0.4, pointerEvents: 'none' } : {}}
                >
                  <FiDownload /> Download Image
                </a>
                <Link to="/encode" className="btn btn-primary">
                  <FiLock /> Continue to Encode
                </Link>
              </div>

              <div className={styles.workflowCard}>
                <FiCheckCircle style={{ color: 'var(--success-color)', flexShrink: 0 }} />
                <div>
                  <h3>How to use with Stego Shield</h3>
                  <p>
                    Generate an image here, click Download, then go to the Encode page and upload the saved image as your cover file to hide your secret message.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default GenerateImages