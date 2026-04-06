import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>A&M Studios</div>
        <p className={styles.copyright}>&copy; {currentYear} A&M Studios. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
