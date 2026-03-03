import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiShield, FiLock, FiUnlock, FiEye, FiEyeOff,
  FiCode, FiKey, FiLayers, FiCheckCircle,
  FiArrowRight, FiImage, FiFileText, FiActivity, FiCrosshair, FiXCircle
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
              <FiShield /> Encrypted & Undetectable
            </motion.div>

            <h1 className={styles.heroTitle}>
              <span className="gradient-text">Stego Shield</span>
            </h1>

            <p className={styles.heroTagline}>
              Hide your secrets in plain sight using edge-adaptive steganography
            </p>

            <p className={styles.heroDescription}>
              Securely embed confidential messages within images using Edge-Adaptive LSB steganography
              powered by Sobel edge detection. Every message is encrypted with AES-256-GCM before
              embedding — dual-layer security that is both invisible and unbreakable.
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
                <span className={styles.statValue}>AES-256</span>
                <span className={styles.statLabel}>GCM Encryption</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>Edge LSB</span>
                <span className={styles.statLabel}>Sobel Adaptive</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>100%</span>
                <span className={styles.statLabel}>Client-Side</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statValue}>Zero</span>
                <span className={styles.statLabel}>Data Upload</span>
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
                <FiActivity />
              </div>
              <h3>Edge-Adaptive LSB</h3>
              <p>
                Our approach uses a Sobel filter to detect edges in the image — regions where pixel
                intensities change sharply. Data bits are embedded into these high-edge pixels first,
                because modifications near edges are far less perceptible to human vision than changes
                in smooth, flat regions.
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
                <FiCrosshair />
              </div>
              <h3>Why Not Sequential LSB?</h3>
              <p>
                Traditional LSB embeds data pixel-by-pixel in scan order, creating statistically
                detectable patterns in flat regions. Edge-adaptive LSB distributes changes across
                textured areas, defeating steganalysis tools like RS analysis and chi-square attacks.
              </p>
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
              <h3>Why Not DCT / Frequency Domain?</h3>
              <p>
                Transform-domain methods (DCT, DWT) are fragile — they break when images are
                re-saved as PNG or resized. Edge-adaptive spatial LSB survives lossless formats
                and provides a better capacity-to-distortion ratio for our use case.
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
              <FiKey className="icon" /> AES-256-GCM Encryption
            </h2>
            <p className="section-subtitle">
              Authenticated encryption that guarantees both confidentiality and integrity
            </p>
          </motion.div>

          <div className={styles.cryptoContent}>
            <motion.div
              className={styles.cryptoMain}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3>Why AES-256-GCM?</h3>
              <p>
                Every message is encrypted before embedding using AES-256 in Galois/Counter Mode (GCM).
                A password-derived key is generated via PBKDF2 with 100,000 iterations and a random salt,
                making brute-force attacks computationally infeasible. GCM provides authenticated encryption —
                if even a single bit of the ciphertext is tampered with, decryption fails entirely.
              </p>

              <div className={styles.methodsGrid}>
                <div className={styles.methodCard}>
                  <h4><FiCheckCircle className={styles.methodCheck} /> AES-GCM (Our Choice)</h4>
                  <p>Authenticated encryption — encrypts and verifies integrity in one pass. Resistant to padding oracle and bit-flip attacks.</p>
                </div>
                <div className={styles.methodCard}>
                  <h4><FiXCircle className={styles.methodX} /> AES-CBC</h4>
                  <p>Encrypt-only mode vulnerable to padding oracle attacks. Requires a separate HMAC for integrity — more complexity, more risk.</p>
                </div>
                <div className={styles.methodCard}>
                  <h4><FiXCircle className={styles.methodX} /> AES-ECB</h4>
                  <p>Encrypts each block independently — identical plaintext blocks produce identical ciphertext. Leaks patterns, never suitable for real use.</p>
                </div>
                <div className={styles.methodCard}>
                  <h4><FiXCircle className={styles.methodX} /> RSA / Asymmetric</h4>
                  <p>Requires key management infrastructure (public/private key pairs). Overkill for password-based single-user steganography.</p>
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
                  <span>PBKDF2 + AES-GCM</span>
                </div>
                <FiArrowRight className={styles.flowArrow} />
                <div className={styles.flowStep}>
                  <div className={styles.flowIcon}><FiLock /></div>
                  <span>Ciphertext + Tag</span>
                </div>
                <FiArrowRight className={styles.flowArrow} />
                <div className={styles.flowStep}>
                  <div className={styles.flowIcon}><FiImage /></div>
                  <span>Hidden in Edges</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dual-Layer Security Pipeline */}
      <section className={`section ${styles.pipelineSection}`} id="pipeline">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">
              <FiLayers className="icon" /> Dual-Layer Security Architecture
            </h2>
            <p className="section-subtitle">
              Two independent defenses — even if one layer is broken, the other stands
            </p>
          </motion.div>

          <div className={styles.pipelineGrid}>
            <motion.div
              className={styles.pipelineCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className={styles.pipelineNumber}>Layer 1</div>
              <div className={`${styles.pipelineIcon} ${styles.pipelineIconCrypto}`}>
                <FiLock />
              </div>
              <h3>Cryptographic Shield</h3>
              <p>
                AES-256-GCM encrypts your message into random-looking ciphertext. Without the exact
                password, the data is indistinguishable from noise — 2<sup>256</sup> possible keys
                makes brute-force impossible.
              </p>
              <div className={styles.pipelineTag}>Confidentiality + Integrity</div>
            </motion.div>

            <motion.div
              className={styles.pipelinePlus}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              +
            </motion.div>

            <motion.div
              className={styles.pipelineCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className={styles.pipelineNumber}>Layer 2</div>
              <div className={`${styles.pipelineIcon} ${styles.pipelineIconStego}`}>
                <FiEyeOff />
              </div>
              <h3>Steganographic Cloak</h3>
              <p>
                Edge-adaptive LSB hides the ciphertext inside image edges using Sobel detection.
                The pixel modifications are statistically undetectable — no one even knows a message
                exists.
              </p>
              <div className={styles.pipelineTag}>Undetectability + Plausible Deniability</div>
            </motion.div>

            <motion.div
              className={styles.pipelineEquals}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              =
            </motion.div>

            <motion.div
              className={`${styles.pipelineCard} ${styles.pipelineCardResult}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className={styles.pipelineNumber}>Result</div>
              <div className={`${styles.pipelineIcon} ${styles.pipelineIconResult}`}>
                <FiShield />
              </div>
              <h3>Invisible & Unbreakable</h3>
              <p>
                An attacker must first discover the message exists (defeat steganography), then
                crack AES-256 encryption (computationally impossible). Neither layer alone provides
                this level of protection.
              </p>
              <div className={styles.pipelineTag}>Maximum Security</div>
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
                <h3>Set Encryption Password</h3>
                <p>Choose a strong password. PBKDF2 derives a 256-bit AES key from it using 100k iterations and a random salt.</p>
              </div>
            </motion.div>

            <motion.div className={styles.step} variants={fadeInUp}>
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepContent}>
                <h3>Enter Your Message</h3>
                <p>Type your secret message. The system shows the maximum characters your image can hold after encryption overhead.</p>
              </div>
            </motion.div>

            <motion.div className={styles.step} variants={fadeInUp}>
              <div className={styles.stepNumber}>04</div>
              <div className={styles.stepContent}>
                <h3>Encode & Download</h3>
                <p>AES-GCM encrypts your message, then the Sobel edge map guides LSB embedding into high-texture regions. Download the stego image.</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            className={styles.features}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className={styles.featuresTitle}>Why Stego Shield?</h3>

            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <FiActivity className={styles.featureIcon} />
                <div>
                  <h4>Edge-Adaptive Embedding</h4>
                  <p>Sobel filter targets high-texture regions, making changes undetectable</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <FiKey className={styles.featureIcon} />
                <div>
                  <h4>AES-256-GCM</h4>
                  <p>Authenticated encryption with PBKDF2 key derivation — tamper-proof</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <FiLock className={styles.featureIcon} />
                <div>
                  <h4>100% Private</h4>
                  <p>Your data never leaves your browser — zero server uploads, zero logs</p>
                </div>
              </div>

              <div className={styles.featureItem}>
                <FiCode className={styles.featureIcon} />
                <div>
                  <h4>Web Crypto API</h4>
                  <p>Native browser cryptography — no third-party libraries, no supply-chain risk</p>
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
