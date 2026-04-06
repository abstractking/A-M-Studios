import React from 'react';
import { motion } from 'framer-motion';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className={styles.footer}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.container}>
        <div className={styles.logo}>A&M Studios</div>
        <p className={styles.copyright}>&copy; {currentYear} A&M Studios. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
