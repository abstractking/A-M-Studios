import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Contact.module.css';

const FORMSPREE_URL = 'https://formspree.io/f/maqlkovd';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(false);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message, _gotcha: honeypot }),
      });

      if (res.ok) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const buttonLabel = loading ? 'Sending...' : success ? 'Message Sent ✓' : 'Request a Quote';

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
          <h2 className={styles.title}>Let's Build Something That Works</h2>
          <p className={styles.subtitle}>Ready to get started? Send us a message and we'll have a quote and mock draft back to you within 24 hours.</p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="_gotcha"
              value={honeypot}
              onChange={e => setHoneypot(e.target.value)}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className={styles.inputGroup}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className={styles.input}
                value={name}
                onChange={e => setName(e.target.value)}
                required
                disabled={loading || success}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className={styles.input}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={loading || success}
              />
            </div>
            <div className={styles.inputGroup}>
              <textarea
                name="message"
                placeholder="Message"
                className={styles.textarea}
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                disabled={loading || success}
              />
            </div>

            <motion.button
              type="submit"
              className={`${styles.submitButton} ${success ? styles.successButton : ''}`}
              disabled={loading || success}
              whileHover={!loading && !success ? { scale: 1.02 } : {}}
              whileTap={!loading && !success ? { scale: 0.98 } : {}}
              animate={{ opacity: loading ? 0.75 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {buttonLabel}
            </motion.button>

            <AnimatePresence>
              {success && (
                <motion.p
                  className={styles.successMsg}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  We received your message and will be in touch soon.
                </motion.p>
              )}
              {error && (
                <motion.p
                  className={styles.errorMsg}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  Something went wrong. Please try again.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
