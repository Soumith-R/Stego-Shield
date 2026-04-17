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
  FiCpu,
  FiSliders,
  FiZap,
  FiServer
} from 'react-icons/fi'
import styles from './GenerateImages.module.css'

type ModelOption = {
  value: string
  label: string
  description: string
}

type AspectOption = {
  value: string
  label: string
  width: number
  height: number
}

const modelOptions: ModelOption[] = [
  { value: 'flux', label: 'Flux', description: 'Balanced quality and very reliable on the public endpoint.' },
  { value: 'zimage', label: 'Z-Image Turbo', description: 'Sharper details and usually fast generation.' },
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
]

const POLLINATIONS_PUBLISHABLE_KEY = import.meta.env.VITE_POLLINATIONS_PUBLISHABLE_KEY || 'pk_31oNBvU9JLA1ApNX'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const GenerateImages = () => {
  const [provider, setProvider] = useState('pollinations') // 'pollinations' or 'horde'
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('blurry, distorted, low quality, watermark, text')
  const [model, setModel] = useState(modelOptions[0].value)
  const [aspect, setAspect] = useState(aspectOptions[0].value) // square 512x512
  const [seedInput, setSeedInput] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadedImage, setLoadedImage] = useState(false)
  const [error, setError] = useState('')
  const [activeSeed, setActiveSeed] = useState<number | null>(null)
  const [hordeStatus, setHordeStatus] = useState('')

  const selectedAspect = useMemo(
    () => aspectOptions.find((option) => option.value === aspect) ?? aspectOptions[0],
    [aspect]
  )

  const selectedModel = useMemo(
    () => modelOptions.find((option) => option.value === model) ?? modelOptions[0],
    [model]
  )

  const handleGenerate = async () => {
    const trimmedPrompt = prompt.trim()

    if (!trimmedPrompt) {
      setError('Enter a prompt before generating an image.')
      return
    }

    const parsedSeed = Number(seedInput)
    const nextSeed = Number.isInteger(parsedSeed) && seedInput.trim() !== ''
      ? parsedSeed
      : Math.floor(Math.random() * 1_000_000_000)

    const fullParams = new URLSearchParams({
      model,
      width: String(selectedAspect.width),
      height: String(selectedAspect.height),
      seed: String(nextSeed),
    })

    if (negativePrompt.trim()) {
      fullParams.set('negative_prompt', negativePrompt.trim())
    }

    const fallbackParams = new URLSearchParams({
      model,
      seed: String(nextSeed),
    })

    if (negativePrompt.trim()) {
      fallbackParams.set('negative_prompt', negativePrompt.trim())
    }

    setError('')
    setLoadedImage(false)
    setIsGenerating(true)
    setHordeStatus('')
    setActiveSeed(nextSeed)

    // Revoke any previous blob URL to free memory
    if (imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl)
    }
    setImageUrl('')

    if (provider === 'horde') {
      try {
        setHordeStatus('Submitting prompt to AI Horde...')
        const res = await fetch('https://stablehorde.net/api/v2/generate/async', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': '0000000000',
          },
          body: JSON.stringify({
            prompt: trimmedPrompt,
            params: {
              sampler_name: 'k_euler',
              cfg_scale: 7,
              height: selectedAspect.height,
              width: selectedAspect.width,
              seed: String(nextSeed),
              steps: 20,
            },
            censor_nsfw: false,
          }),
        })

        if (!res.ok) throw new Error('Failed to submit prompt to AI Horde.')

        const data = await res.json()
        if (!data.id) throw new Error('No job ID returned by AI Horde.')

        let done = false
        let url = ''
        let attempts = 0
        while (!done) {
          if (attempts > 60) throw new Error('Horde generation timed out after 5 minutes.')
          await wait(5000)
          const statusRes = await fetch(`https://stablehorde.net/api/v2/generate/status/${data.id}`)
          if (!statusRes.ok) continue
          const statusDat = await statusRes.json()

          if (statusDat.faulted) {
            throw new Error('AI Horde job faulted. Try a different prompt or wait a bit.')
          }
          if (statusDat.done) {
            done = true
            url = statusDat.generations[0].img
          } else {
            setHordeStatus(`Waiting in queue... Position: ${statusDat.queue_position || '...'} / Wait time: ~${statusDat.wait_time || 0}s`)
          }
          attempts += 1
        }

        let finalUrl = url
        if (!finalUrl.startsWith('http')) {
          finalUrl = `data:image/webp;base64,${finalUrl}`
        }

        setImageUrl(finalUrl)
        setLoadedImage(true)
      } catch (err: any) {
        setError(err.message || 'AI Horde generation failed.')
      } finally {
        setIsGenerating(false)
        setHordeStatus('')
      }
      return
    }

    const attemptUrls = [
      `https://gen.pollinations.ai/image/${encodeURIComponent(trimmedPrompt)}?${fullParams.toString()}`,
      `https://gen.pollinations.ai/image/${encodeURIComponent(trimmedPrompt)}?${fallbackParams.toString()}`,
      `https://gen.pollinations.ai/image/${encodeURIComponent(trimmedPrompt)}?model=flux`,
    ]

    try {
      let generatedBlob: Blob | null = null

      for (let i = 0; i < attemptUrls.length; i += 1) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 45_000)

        try {
          const response = await fetch(attemptUrls[i], {
            signal: controller.signal,
            headers: {
              Accept: 'image/*',
              Authorization: `Bearer ${POLLINATIONS_PUBLISHABLE_KEY}`,
            },
          })

          if (!response.ok) {
            throw new Error(`Server returned ${response.status}`)
          }

          generatedBlob = await response.blob()
          if (generatedBlob.size > 0) {
            break
          }
        } catch {
          if (i < attemptUrls.length - 1) {
            await wait(1_000 + i * 1_000)
          }
        } finally {
          clearTimeout(timeoutId)
        }
      }

      if (!generatedBlob) {
        throw new Error('No image returned after retries')
      }

      const blob = generatedBlob
      const blobUrl = URL.createObjectURL(blob)
      setImageUrl(blobUrl)
      setLoadedImage(true)
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Image generation timed out (45 s per attempt). Try a simpler prompt or smaller resolution.')
      } else {
        setError('Image generation failed (Pollinations may be busy or rate-limited). Try again in a few seconds.')
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRandomPrompt = () => {
    const nextPrompt = promptSuggestions[Math.floor(Math.random() * promptSuggestions.length)]
    setPrompt(nextPrompt)
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
                  <span className={styles.eyebrow}>Frontend-only generation</span>
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
                  onChange={(event) => setPrompt(event.target.value)}
                />
              </label>

              <label className={styles.fieldGroup}>
                <span className={styles.fieldLabel}>Negative prompt</span>
                <input
                  className={styles.textInput}
                  type="text"
                  placeholder="Things the model should avoid"
                  value={negativePrompt}
                  onChange={(event) => setNegativePrompt(event.target.value)}
                />
              </label>

              <div className={styles.gridFields}>
                <label className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}><FiServer /> Engine</span>
                  <select
                    className={styles.selectInput}
                    value={provider}
                    onChange={(event) => setProvider(event.target.value)}
                  >
                    <option value="pollinations">Pollinations (Fast)</option>
                    <option value="horde">AI Horde (Community/Wait)</option>
                  </select>
                </label>

                {provider === 'pollinations' && (
                  <label className={styles.fieldGroup}>
                    <span className={styles.fieldLabel}><FiCpu /> Model</span>
                    <select
                      className={styles.selectInput}
                      value={model}
                      onChange={(event) => setModel(event.target.value)}
                    >
                      {modelOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}


                <label className={styles.fieldGroup}>
                  <span className={styles.fieldLabel}><FiSliders /> Aspect</span>
                  <select
                    className={styles.selectInput}
                    value={aspect}
                    onChange={(event) => setAspect(event.target.value)}
                  >
                    {aspectOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className={styles.fieldGroup}>
                <span className={styles.fieldLabel}><FiZap /> Seed</span>
                <input
                  className={styles.textInput}
                  type="number"
                  placeholder="Leave blank for a random seed"
                  value={seedInput}
                  onChange={(event) => setSeedInput(event.target.value)}
                />
              </label>

              {selectedModel && (
                <div className={styles.modelNote}>
                  <FiCheckCircle />
                  <span>{selectedModel.description}</span>
                </div>
              )}

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

              <div className={styles.infoCard}>
                <h3>{provider === 'pollinations' ? 'Powered by Pollinations AI' : 'Powered by AI Horde'}</h3>
                <p>
                  {provider === 'pollinations'
                    ? 'This page uses Pollinations public endpoint with a publishable key and automatic retries. If generation fails due to high load, try switching to AI Horde.'
                    : 'AI Horde is a community-driven cluster of image generators. It is free and requires no keys, but relies on volunteers, so you may need to wait in a queue for your image.'}
                </p>
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
                {activeSeed !== null && <span className={styles.seedBadge}>Seed {activeSeed}</span>}
              </div>

              <div className={styles.previewFrame}>
                {isGenerating && (
                  <div className={styles.loadingState}>
                    <span className={styles.spinner}></span>
                    <p>
                      {provider === 'horde' && hordeStatus
                        ? hordeStatus
                        : 'Generating your image, this may take a few seconds...'}
                    </p>
                  </div>
                )}
                {imageUrl && loadedImage ? (
                  <img
                    className={`${styles.generatedImage} ${styles.visible}`}
                    src={imageUrl}
                    alt={prompt || 'Generated AI image'}
                  />
                ) : !isGenerating ? (
                  <div className={styles.emptyState}>
                    <FiImage />
                    <h3>No image yet</h3>
                    <p>Write a prompt, choose a model, and generate an image here before you move to Encode.</p>
                  </div>
                ) : null}
              </div>

              <div className={styles.previewActions}>
                <a
                  className="btn btn-secondary"
                  href={imageUrl || '#'}
                  download="generated-image.png"
                  aria-disabled={!imageUrl || !loadedImage}
                  onClick={(!imageUrl || !loadedImage) ? (e) => e.preventDefault() : undefined}
                  style={(!imageUrl || !loadedImage) ? { opacity: 0.4, pointerEvents: 'none' } : {}}
                >
                  <FiDownload /> Download Image
                </a>
                <Link to="/encode" className="btn btn-primary">
                  <FiLock /> Continue to Encode
                </Link>
              </div>

              <div className={styles.workflowCard}>
                <h3>How to use it with Stego Shield</h3>
                <p>
                  Generate the image here, open it in a new tab, save it locally, then upload that saved image on the Encode page to hide your secret message.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default GenerateImages