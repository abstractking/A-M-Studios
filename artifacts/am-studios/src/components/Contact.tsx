import React from 'react';
import { motion } from 'framer-motion';
import styles from './Contact.module.css';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section id="contact" className={styles.contactSection}>
      <div className={styles.container}>
        <motion.div 
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.title}>Let's Build Something That Works For You</h2>
          <p className={styles.subtitle}>Ready to start your next project? Drop us a line.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input type="text" placeholder="Name" className={styles.input} required />
            </div>
            <div className={styles.inputGroup}>
              <input type="email" placeholder="Email" className={styles.input} required />
            </div>
            <div className={styles.inputGroup}>
              <textarea placeholder="Message" className={styles.textarea} rows={5} required></textarea>
            </div>
            <motion.button 
              type="submit" 
              className={styles.submitButton}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Request a Quote
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
