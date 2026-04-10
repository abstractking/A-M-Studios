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
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
    >
      <div className={styles.gridBg}>
        <svg viewBox="0 0 1200 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="footerGridFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,245,212,0.25)" />
              <stop offset="100%" stopColor="rgba(0,245,212,0.02)" />
            </linearGradient>
          </defs>
          {[...Array(8)].map((_, i) => {
            const frac = (i + 1) / 9;
            const xStart = 600 - 600 * frac;
            const xEnd = 600 + 600 * frac;
            const yPos = 10 + 150 * (frac ** 1.4);
            return (
              <line key={`fh${i}`} x1={xStart} y1={yPos} x2={xEnd} y2={yPos}
                stroke="url(#footerGridFade)" strokeWidth="0.8" opacity={frac * 0.8} />
            );
          })}
          {[...Array(14)].map((_, i) => {
            const t = i / 13;
            const xTop = 200 + t * 800;
            return (
              <line key={`fv${i}`} x1={xTop} y1={0} x2={600 * (0.1 + t * 0.8)} y2={160}
                stroke="url(#footerGridFade)" strokeWidth="0.7" opacity={0.4} />
            );
          })}
        </svg>
      </div>

      <div className={styles.container}>
        <div className={styles.logo}>A&M Studios</div>

        <div className={styles.links}>
          <a href="#services">Services</a>
          <a href="#projects">Work</a>
          <a href="#contact">Contact</a>
        </div>

        <p className={styles.copyright}>&copy; {currentYear} A&amp;M Studios — All systems operational.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
