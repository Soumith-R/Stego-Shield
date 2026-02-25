import { motion } from 'framer-motion'
import { FiLinkedin, FiGithub, FiHeart, FiAward, FiUsers } from 'react-icons/fi'
import styles from './About.module.css'

const teamMembers = [
  {
    name: 'Soumith Reddy Chiluka',
    role: 'CSE (AI & ML)',
    linkedin: 'https://www.linkedin.com/in/soumith-chiluka-052379274/',
    github: 'https://github.com/Soumith-R',
    avatar: 'S'
  },
  {
    name: 'Rishi Pothireddy',
    role: 'CSE (AI & ML)',
    linkedin: 'https://www.linkedin.com/in/rishipothireddy/',
    github: 'https://github.com/rishi7788',
    avatar: 'R'
  },
  {
    name: 'R. Nandita Reddy',
    role: 'CSE (AI & ML)',
    linkedin: 'https://www.linkedin.com/in/nandita-reddy-3aaa0b305/',
    github: 'https://github.com/nandsss',
    avatar: 'N'
  }
]

const About = () => {
  return (
    <motion.div 
      className="page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <section className={styles.aboutSection}>
        <div className={styles.background}>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
        </div>

        <div className="container">
          {/* Guide Section */}
          <motion.div 
            className={styles.guideSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.guideCard}>
              <div className={styles.guideIcon}>
                <FiAward />
              </div>
              <p className={styles.guideLabel}>Project Guide</p>
              <h2 className={styles.guideName}>
                D. Padmaja Usha Rani
              </h2>
              <p className={styles.guideTitle}>
                Assistant Professor
              </p>
              <p className={styles.guideCollege}>
                Keshav Memorial Engineering College
              </p>
              <div className={styles.guideDecor}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div 
            className={styles.teamSection}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.teamHeader}>
              <FiUsers className={styles.teamIcon} />
              <h2>Meet the Team</h2>
              <p>The minds behind Stego Shield</p>
            </div>

            <div className={styles.teamGrid}>
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={member.name}
                  className={styles.memberCard}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <div className={styles.memberAvatar}>
                    {member.avatar}
                  </div>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                  
                  <div className={styles.socialLinks}>
                    <a 
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.linkedinBtn}
                    >
                      <FiLinkedin /> LinkedIn
                    </a>
                    <a 
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.githubBtn}
                    >
                      <FiGithub /> GitHub
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* About Us Section */}
          <motion.div 
            className={styles.aboutUs}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className={styles.aboutUsContent}>
              <div className={styles.aboutUsIcon}>
                <FiHeart />
              </div>
              <h2>About Us</h2>
              <div className={styles.aboutUsText}>
                <p>
                  <strong>Hey there! 👋</strong>
                </p>
                <p>
                  We are a passionate team of students from <strong>Keshav Memorial Engineering College</strong>, 
                  pursuing our degree in <strong>Computer Science Engineering (AI & ML)</strong>. 
                </p>
                <p>
                  <strong>Stego Shield</strong> is our major project, where we've combined our knowledge of 
                  steganography, cryptography, and modern web development to create a secure, user-friendly 
                  platform for hiding messages within images.
                </p>
                <p>
                  Feel free to connect with us on LinkedIn and check out our other projects on GitHub. 
                  We're always excited to collaborate and learn from the community! 🚀
                </p>
              </div>

              {/* <div className={styles.techStack}>
                <h3><FiCode /> Built With</h3>
                <div className={styles.techTags}>
                  <span>React</span>
                  <span>TypeScript</span>
                  <span>Vite</span>
                  <span>Framer Motion</span>
                  <span>LSB Steganography</span>
                  <span>Canvas API</span>
                </div>
              </div> */}
            </div>
          </motion.div>

          {/* College Badge */}
          <motion.div 
            className={styles.collegeBadge}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p>A Major Project by CSE (AI & ML) Students</p>
            <h3>Keshav Memorial Engineering College</h3>
            <p className={styles.year}>Batch of 2026</p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}

export default About
