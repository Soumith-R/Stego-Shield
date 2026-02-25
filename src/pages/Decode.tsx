import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiUnlock, FiUploadCloud, FiX, FiCopy, 
  FiCheckCircle, FiAlertCircle, FiSearch, FiLock
} from 'react-icons/fi'
import { decodeMessage } from '../utils/steganography'
import styles from './Decode.module.css'

const Decode = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [decodedMessage, setDecodedMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleImageLoad = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
      setDecodedMessage(null)
    }
    reader.readAsDataURL(file)
  }

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
    setImagePreview(null)
    setDecodedMessage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDecode = async () => {
    if (!imagePreview) {
      showToast('Please select an image first', 'error')
      return
    }

    setIsProcessing(true)

    try {
      const message = await decodeMessage(imagePreview)
      
      if (!message || message.trim() === '') {
        setDecodedMessage('')
        showToast('No hidden message found in this image', 'error')
      } else {
        setDecodedMessage(message)
        showToast('Message decoded successfully!', 'success')
      }
    } catch (error) {
      showToast(`Decoding failed: ${error}`, 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = async () => {
    if (!decodedMessage) return
    
    try {
      await navigator.clipboard.writeText(decodedMessage)
      showToast('Copied to clipboard!', 'success')
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = decodedMessage
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      showToast('Copied to clipboard!', 'success')
    }
  }

  return (
    <motion.div 
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className={styles.decodeSection}>
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
              <FiUnlock className="icon" /> Decode Message
            </h1>
            <p className="section-subtitle">
              Extract hidden messages from steganographic images
            </p>
          </motion.div>

          <motion.div 
            className={styles.decodeContainer}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Image Upload */}
            <div className={styles.uploadSection}>
              <h3 className={styles.stepTitle}>
                <span className={styles.stepNumber}>1</span>
                Upload Encoded Image
              </h3>
              
              <div 
                className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''} ${imagePreview ? styles.hasImage : ''}`}
                onClick={() => !imagePreview && fileInputRef.current?.click()}
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

                {imagePreview ? (
                  <div className={styles.imagePreview}>
                    <img src={imagePreview} alt="Selected" />
                    <button className={styles.removeBtn} onClick={removeImage}>
                      <FiX />
                    </button>
                  </div>
                ) : (
                  <div className={styles.uploadContent}>
                    <FiUploadCloud className={styles.uploadIcon} />
                    <h4>Drop encoded image here</h4>
                    <p>or click to browse</p>
                    <span className={styles.fileTypes}>PNG recommended for best results</span>
                  </div>
                )}
              </div>
            </div>

            {/* Decode Button */}
            <div className={styles.actionSection}>
              <h3 className={styles.stepTitle}>
                <span className={styles.stepNumber}>2</span>
                Extract Hidden Message
              </h3>

              <button
                className={`btn btn-primary btn-large ${styles.decodeBtn}`}
                onClick={handleDecode}
                disabled={!imagePreview || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className={styles.spinner}></span>
                    Decoding...
                  </>
                ) : (
                  <>
                    <FiSearch /> Decode Message
                  </>
                )}
              </button>
            </div>

            {/* Switch to Encode */}
            <div className={styles.switchAction}>
              <span>Want to hide a secret message?</span>
              <Link to="/encode" className={styles.switchLink}>
                <FiLock /> Go to Encode
              </Link>
            </div>

            {/* Result */}
            {decodedMessage !== null && (
              <motion.div 
                className={styles.resultSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className={styles.resultHeader}>
                  <h3>
                    <FiCheckCircle className={styles.successIcon} />
                    Decoded Message
                  </h3>
                  {decodedMessage && (
                    <button className={styles.copyBtn} onClick={copyToClipboard}>
                      <FiCopy /> Copy
                    </button>
                  )}
                </div>

                <div className={styles.resultContent}>
                  {decodedMessage ? (
                    <p>{decodedMessage}</p>
                  ) : (
                    <p className={styles.noMessage}>
                      No hidden message found in this image, or the message is empty.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
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

export default Decode
