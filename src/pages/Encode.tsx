import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiLock, FiUploadCloud, FiX, FiDownload, 
  FiInfo, FiCheckCircle, FiAlertCircle, FiUnlock
} from 'react-icons/fi'
import { encodeMessage, calculateCapacity } from '../utils/steganography'
import styles from './Encode.module.css'

interface ImageState {
  file: File | null
  preview: string | null
  width: number
  height: number
}

const Encode = () => {
  const [image, setImage] = useState<ImageState>({
    file: null,
    preview: null,
    width: 0,
    height: 0
  })
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const capacity = image.width && image.height 
    ? calculateCapacity(image.width, image.height) 
    : 0

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleImageLoad = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        setImage({
          file,
          preview: e.target?.result as string,
          width: img.naturalWidth,
          height: img.naturalHeight
        })
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleImageLoad(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageLoad(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const removeImage = () => {
    setImage({ file: null, preview: null, width: 0, height: 0 })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleEncode = async () => {
    if (!image.preview || !message.trim()) {
      showToast('Please select an image and enter a message', 'error')
      return
    }

    if (message.length > capacity) {
      showToast(`Message too long! Maximum ${capacity} characters`, 'error')
      return
    }

    setIsProcessing(true)

    try {
      const encodedDataUrl = await encodeMessage(image.preview, message)
      
      // Download the encoded image
      const link = document.createElement('a')
      link.download = 'stego_shield_encoded.png'
      link.href = encodedDataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      showToast('Message encoded successfully! Downloading...', 'success')
    } catch (error) {
      showToast(`Encoding failed: ${error}`, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div 
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className={styles.encodeSection}>
        <div className={styles.background}>
          <div className={styles.gradientOrb}></div>
        </div>

        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="section-title">
              <FiLock className="icon" /> Encode Message
            </h1>
            <p className="section-subtitle">
              Hide your secret message inside an image using LSB steganography
            </p>
          </motion.div>

          <motion.div 
            className={styles.encodeContainer}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Image Upload */}
            <div className={styles.uploadSection}>
              <h3 className={styles.stepTitle}>
                <span className={styles.stepNumber}>1</span>
                Select Image
              </h3>
              
              <div 
                className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''} ${image.preview ? styles.hasImage : ''}`}
                onClick={() => !image.preview && fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  hidden
                />

                {image.preview ? (
                  <div className={styles.imagePreview}>
                    <img src={image.preview} alt="Selected" />
                    <button className={styles.removeBtn} onClick={removeImage}>
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className={styles.uploadContent}>
                    <FiUploadCloud className={styles.uploadIcon} />
                    <h4>Drop your image here</h4>
                    <p>or click to browse</p>
                    <span className={styles.fileTypes}>PNG, JPG, BMP supported</span>
                  </div>
                )}
              </div>

              {capacity > 0 && (
                <div className={styles.capacityInfo}>
                  <FiInfo />
                  <span>
                    Image capacity: <strong>{capacity.toLocaleString()}</strong> characters
                  </span>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className={styles.messageSection}>
              <h3 className={styles.stepTitle}>
                <span className={styles.stepNumber}>2</span>
                Enter Secret Message
              </h3>

              <div className={styles.textareaWrapper}>
                <textarea
                  className={styles.textarea}
                  placeholder="Type your secret message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={capacity || undefined}
                />
                <div className={styles.charCount}>
                  <span className={message.length > capacity && capacity > 0 ? styles.overLimit : ''}>
                    {message.length}
                  </span>
                  {capacity > 0 && <span> / {capacity.toLocaleString()}</span>}
                </div>
              </div>
            </div>

            {/* Encode Button */}
            <div className={styles.actionSection}>
              <h3 className={styles.stepTitle}>
                <span className={styles.stepNumber}>3</span>
                Encode & Download
              </h3>

              <button
                className={`btn btn-primary btn-large ${styles.encodeBtn}`}
                onClick={handleEncode}
                disabled={!image.preview || !message.trim() || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className={styles.spinner}></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <FiDownload /> Encode & Download Image
                  </>
                )}
              </button>

              <p className={styles.privacyNote}>
                <FiLock /> All processing happens in your browser. Nothing is uploaded.
              </p>

              <div className={styles.switchAction}>
                <span>Want to extract a hidden message?</span>
                <Link to="/decode" className={styles.switchLink}>
                  <FiUnlock /> Go to Decode
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Toast Notification */}
      {toast && (
        <motion.div 
          className={`${styles.toast} ${styles[toast.type]}`}
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 50 }}
        >
          {toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          {toast.message}
        </motion.div>
      )}
    </motion.div>
  )
}

export default Encode
