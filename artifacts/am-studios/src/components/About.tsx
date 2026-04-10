import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.split}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.panel + ' ' + styles.panelThen}>
            <span className={styles.era + ' ' + styles.eraThen}>THEN</span>
            <h3 className={styles.panelTitle}>The Old Way</h3>
            <p className={styles.panelText}>
              Generic templates. Bloated code. Weeks of back-and-forth just to get a homepage live. Websites built to check a box, not move a needle.
            </p>
          </div>

          <div className={styles.panel + ' ' + styles.panelNow}>
            <span className={styles.era + ' ' + styles.eraNow}>NOW</span>
            <h3 className={styles.panelTitleNow}>The A&M Way</h3>
            <p className={styles.panelTextNow}>
              At A&M Studios, every project is treated with precision and care — from the first conversation to launch day. Clean design, blazing performance, and a process that actually feels easy. The future arrived early. You're welcome.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
