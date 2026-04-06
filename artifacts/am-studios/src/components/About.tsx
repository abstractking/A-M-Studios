import React from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className={styles.avatarWrapper}>
            <div className={styles.avatar}></div>
          </div>
          <p className={styles.text}>
            At A&M Studios, we strive for effeciency, low cost, security & comfort . As you can see with our mock up projects. That they are crafted with a clean design, fast-performance, and warm usability.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
