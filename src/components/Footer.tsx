import { Link } from 'react-router-dom'
import { FiShield, FiGithub, FiHeart } from 'react-icons/fi'
import styles from './Footer.module.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <Link to="/" className={styles.logo}>
              <FiShield />
              <span>Stego Shield</span>
            </Link>
            <p className={styles.tagline}>
              Secure your secrets with advanced steganography
            </p>
          </div>

          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <h4>Navigation</h4>
              <Link to="/">Home</Link>
              <Link to="/encode">Encode</Link>
              <Link to="/decode">Decode</Link>
              <Link to="/about">About</Link>
            </div>
            <div className={styles.linkGroup}>
              <h4>Learn More</h4>
              <a href="#steganography">Steganography</a>
              <a href="#cryptography">Cryptography</a>
              <a href="#how-it-works">How It Works</a>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {currentYear} Stego Shield. All rights reserved.
          </p>
          <p className={styles.madeWith}>
            Made with <FiHeart className={styles.heart} /> by KMEC Students
          </p>
          <a
            href="https://github.com/Soumith-R/Stego-Shield"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            <FiGithub /> View on GitHub
          </a>
        </div>

        <div className={styles.privacyNote}>
          <p>
            🔒 Your data is processed entirely in your browser. Nothing is uploaded to any server.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
