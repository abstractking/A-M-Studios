import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.panels}>

        <div className={styles.panelThen}>
          <div className={styles.scanlines}></div>
          <div className={styles.labelThen}>THEN</div>
          <div className={styles.panelSubtitle}>The Old Way</div>
          <p className={styles.panelBody}>
            Generic templates. Bloated code. Weeks of back-and-forth just to get a homepage live. Websites built to check a box, not move a needle.
          </p>
        </div>

        <motion.div
          className={styles.panelNow}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <div className={styles.gridFloor}></div>

          <div className={styles.moonWrap}>
            <div className={styles.star + ' ' + styles.star1}></div>
            <div className={styles.star + ' ' + styles.star2}></div>
            <div className={styles.star + ' ' + styles.star3}></div>
            <div className={styles.star + ' ' + styles.star4}></div>
            <div className={styles.star + ' ' + styles.star5}></div>
            <div className={styles.moonOuter}>
              <div className={styles.moonInner}></div>
            </div>
          </div>

          <div className={styles.panelNowContent}>
            <div className={styles.labelNow}>NOW</div>
            <div className={styles.panelSubtitleNow}>The A&amp;M Way</div>
            <p className={styles.panelBodyNow}>
              At A&amp;M Studios, every project is treated with precision and care — from the first conversation to launch day. Clean design, blazing performance, and a process that actually feels easy. The future arrived early. You're welcome.
            </p>
          </div>
        </motion.div>

        <div className={styles.panelDivider}></div>
      </div>
    </section>
  );
};

export default About;
