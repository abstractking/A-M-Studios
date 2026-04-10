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

  const buttonLabel = loading ? 'Transmitting...' : success ? 'Signal Received ✓' : 'Send Transmission';

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
          <span className={styles.sectionLabel}>// Contact</span>
          <h2 className={styles.title}>Let's Build Something Real</h2>
          <p className={styles.subtitle}>
            Open a channel. We'll have a quote and mock draft back to you within 24 hours.
          </p>

          <div className={styles.terminalWindow}>
            <div className={styles.terminalBar}>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.dot}></span>
              <span className={styles.terminalTitle}>contact@amstudios.io</span>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="_gotcha"
                value={honeypot}
                onChange={e => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className={styles.form}>
                <div className={styles.inputGroup}>
                  <span className={styles.promptLabel}>&gt; name:</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="your name"
                    className={styles.input}
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    disabled={loading || success}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.promptLabel}>&gt; email:</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    className={styles.input}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    disabled={loading || success}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.promptLabel}>&gt; msg:</span>
                  <textarea
                    name="message"
                    placeholder="tell us about your project..."
                    className={styles.textarea}
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    disabled={loading || success}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <motion.button
                  type="submit"
                  className={`${styles.submitButton} ${success ? styles.successButton : ''}`}
                  disabled={loading || success}
                  whileHover={!loading && !success ? { scale: 1.03 } : {}}
                  whileTap={!loading && !success ? { scale: 0.97 } : {}}
                  animate={{ opacity: loading ? 0.75 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {buttonLabel}
                </motion.button>
              </div>

              <AnimatePresence>
                {success && (
                  <motion.p
                    className={styles.successMsg}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    &gt; Signal received. Expect contact within 24hrs.
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
                    &gt; Transmission failed. Please retry.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
