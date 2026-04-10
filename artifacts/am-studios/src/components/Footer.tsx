import React from 'react';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.topGlow}></div>
      <div className={styles.dotGrid}></div>

      <div className={styles.footerContent}>
        <div className={styles.bootLine}>
          <span className={styles.bootPath}>~/amStudios</span>
          <span className={styles.bootChevron}>›</span>
          <span className={styles.bootText}>system.boot --all-systems-operational --year={currentYear}</span>
          <span className={styles.voidCursor}></span>
        </div>

        <div className={styles.voidMain}>
          <div className={styles.voidLogo}>
            <span className={styles.logoPrefix}>./</span>
            A<span className={styles.logoAmp}>&amp;</span>M STUDIOS
          </div>

          <div className={styles.ctaBlock}>
            <div className={styles.ctaPrompt}>init_project.exe --new-client</div>
            <div className={styles.ctaHeadline}>Your Next Site Lives Here</div>
            <div className={styles.ctaSub}>// transmission open · awaiting your signal</div>
          </div>

          <div className={styles.voidStatus}>
            <div className={styles.statusLine}>
              <span className={styles.statusDot}></span>
              <span>all_systems.operational</span>
            </div>
            <div className={styles.statusCopy}>&copy; {currentYear} A&amp;M Studios</div>
            <div className={styles.statusBuild}>build v2.4.1 · stable</div>
          </div>
        </div>

        <div className={styles.voidBottom}>
          <div className={styles.bottomLeft}>
            <span className={styles.exitCmd}>exit(0)</span>
            <span>·</span>
            <span>process terminated cleanly</span>
          </div>
          <div className={styles.bottomRight}>
            [OK] shutdown sequence complete<span className={styles.voidCursor} style={{ animationDelay: '0.6s' }}></span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
