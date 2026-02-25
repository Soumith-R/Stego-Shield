import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  FiShield, FiLock, FiUnlock, FiEye, FiEyeOff, 
  FiCode, FiKey, FiZap, FiLayers, FiCheckCircle,
  FiArrowRight, FiImage, FiFileText
} from 'react-icons/fi'
import styles from './Home.module.css'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const Home = () => {
  return (
    <motion.div 
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
          <div className={styles.gradientOrb3}></div>
          <div className={styles.gridOverlay}></div>
        </div>

        <div className={`container ${styles.heroContainer}`}>
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className={styles.badge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FiShield /> Secure & Private
            </motion.div>

            <h1 className={styles.heroTitle}>
              <span className="gradient-text">Stego Shield</span>
            </h1>

            <p className={styles.heroTagline}>
              Hide your secrets in plain sight using advanced steganography
            </p>

            <p className={styles.heroDescription}>
              Securely embed confidential messages within images using LSB (Least Significant Bit) 
              steganography. Your data remains invisible to the naked eye.
            </p>

            <motion.div 
              className={styles.heroCta}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/encode" className="btn btn-primary btn-large">
                <FiLock /> Encode Message
              </Link>
              <Link to="/decode" className="btn btn-secondary btn-large">
                <FiUnlock /> Decode Message
              </Link>
            </motion.div>

            <motion.div 
              className={styles.heroStats}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className={styles.stat}>
                <span className={styles.statValue}>100%</span>
                <span className={styles.statLabel}>Client-Side</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>Zero</span>
                <span className={styles.statLabel}>Data Upload</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>LSB</span>
                <span className={styles.statLabel}>Algorithm</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className={styles.heroVisual}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className={styles.shieldContainer}>
              <div className={styles.shieldGlow}></div>
              <FiShield className={styles.shieldIcon} />
              <div className={styles.orbitRing}>
                <div className={styles.orbitDot}><FiImage /></div>
                <div className={styles.orbitDot}><FiFileText /></div>
                <div className={styles.orbitDot}><FiKey /></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is Steganography */}
      <section className={`section ${styles.steganographySection}`} id="steganography">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              <FiEyeOff className="icon" /> What is Steganography?
            </h2>
            <p className="section-subtitle">
              The ancient art of hiding information in plain sight
            </p>
          </motion.div>

          <div className={styles.infoGrid}>
            <motion.div 
              className={styles.infoCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.infoIcon}>
                <FiEye />
              </div>
              <h3>Definition</h3>
              <p>
                Steganography is the practice of concealing messages or information within other 
                non-secret data or a physical object. Unlike encryption, which makes data unreadable, 
                steganography hides the very existence of the secret message.
              </p>
            </motion.div>

            <motion.div 
              className={styles.infoCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className={styles.infoIcon}>
                <FiCode />
              </div>
              <h3>How It Works</h3>
              <p>
                Digital steganography modifies digital media files (images, audio, video) at the bit level. 
                In LSB steganography, we alter the least significant bits of pixel values, making changes 
                imperceptible to human senses while encoding binary data.
              </p>
            </motion.div>

            <motion.div 
              className={styles.infoCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.infoIcon}>
                <FiLayers />
              </div>
              <h3>Applications</h3>
              <ul className={styles.usesList}>
                <li><FiCheckCircle /> Secure communication</li>
                <li><FiCheckCircle /> Digital watermarking</li>
                <li><FiCheckCircle /> Copyright protection</li>
                <li><FiCheckCircle /> Confidential data sharing</li>
              </ul>
            </motion.div>

            <motion.div 
              className={styles.infoCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className={styles.infoIcon}>
                <FiShield />
              </div>
              <h3>Why Steganography?</h3>
              <p>
                While encryption protects content, it reveals that secret information exists. 
                Steganography provides an additional layer of security by hiding the fact that 
                any communication is taking place at all.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cryptography Section */}
      <section className={`section ${styles.cryptographySection}`} id="cryptography">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              <FiKey className="icon" /> Understanding Cryptography
            </h2>
            <p className="section-subtitle">
              The science of secure communication through encryption
            </p>
          </motion.div>

          <div className={styles.cryptoContent}>
            <motion.div 
              className={styles.cryptoMain}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3>Why Cryptography Matters</h3>
              <p>
                Cryptography transforms readable data into an unreadable format using mathematical 
                algorithms. When combined with steganography, it creates a powerful two-layer 
                security system: encrypted data hidden within innocent-looking media.
              </p>
              
              <div className={styles.methodsGrid}>
                <div className={styles.methodCard}>
                  <h4>Symmetric Encryption</h4>
                  <p>Same key for encryption and decryption (AES, DES)</p>
                </div>
                <div className={styles.methodCard}>
                  <h4>Asymmetric Encryption</h4>
                  <p>Public-private key pairs (RSA, ECC)</p>
                </div>
                <div className={styles.methodCard}>
                  <h4>Hash Functions</h4>
                  <p>One-way transformation (SHA-256, MD5)</p>
                </div>
                <div className={styles.methodCard}>
                  <h4>AES-256 (Our Choice)</h4>
                  <p>Military-grade encryption for maximum security</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className={styles.cryptoVisual}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className={styles.encryptionFlow}>
                <div className={styles.flowStep}>
                  <div className={styles.flowIcon}><FiFileText /></div>
                  <span>Plain Text</span>
                </div>
                <FiArrowRight className={styles.flowArrow} />
                <div className={styles.flowStep}>
                  <div className={styles.flowIcon}><FiKey /></div>
                  <span>Encryption</span>
                </div>
                <FiArrowRight className={styles.flowArrow} />
                <div className={styles.flowStep}>
                  <div className={styles.flowIcon}><FiImage /></div>
                  <span>Hidden in Image</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Stego Shield */}
      <section className={`section ${styles.aboutSection}`} id="about-stego">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              <FiShield className="icon" /> About Stego Shield
            </h2>
            <p className="section-subtitle">
              Your trusted platform for secure image steganography
            </p>
          </motion.div>

          <motion.div 
            className={styles.howItWorks}
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className={styles.step} variants={fadeInUp}>
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepContent}>
                <h3>Upload Your Image</h3>
                <p>Select any PNG, JPG, or BMP image as your carrier. Higher resolution images can store more data.</p>
              </div>
            </motion.div>

            <motion.div className={styles.step} variants={fadeInUp}>
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepContent}>
                <h3>Enter Your Message</h3>
                <p>Type your secret message. The system calculates how many characters your image can hold.</p>
              </div>
            </motion.div>

            <motion.div className={styles.step} variants={fadeInUp}>
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepContent}>
                <h3>Encode & Download</h3>
                <p>Our LSB algorithm embeds your message into the image pixels, then downloads the encoded file.</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className={styles.features}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className={styles.featuresTitle}>Why Stego Shield is the Best Platform</h3>
            
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <FiZap className={styles.featureIcon} />
                <div>
                  <h4>Lightning Fast</h4>
                  <p>Client-side processing ensures instant encoding/decoding</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <FiLock className={styles.featureIcon} />
                <div>
                  <h4>100% Private</h4>
                  <p>Your data never leaves your browser - zero server uploads</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <FiCode className={styles.featureIcon} />
                <div>
                  <h4>Modern Stack</h4>
                  <p>Built with React, TypeScript, and cutting-edge technologies</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <FiShield className={styles.featureIcon} />
                <div>
                  <h4>Future-Ready</h4>
                  <p>Architecture prepared for AES encryption integration</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className={styles.ctaSection}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3>Ready to Secure Your Messages?</h3>
            <p>Start hiding your secrets in plain sight today</p>
            <div className={styles.ctaButtons}>
              <Link to="/encode" className="btn btn-primary btn-large">
                <FiLock /> Start Encoding
              </Link>
              <Link to="/about" className="btn btn-secondary btn-large">
                Meet the Team <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default Home
