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
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });

  const validateForm = () => {
    const next = { name: '', email: '', message: '' };
    if (!name.trim()) next.name = 'ERR: name required';
    if (!email.trim()) {
      next.email = 'ERR: email required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'ERR: invalid email format';
    }
    if (!message.trim()) next.message = 'ERR: message required';
    setErrors(next);
    return !next.name && !next.email && !next.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !validateForm()) return;

    setLoading(true);
    setError(false);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
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

  const Cursor = () => <span className={styles.cursor} />;

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
          <h2 className={styles.title}>Let's Build</h2>
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

            <form onSubmit={handleSubmit} noValidate>
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
                  <span className={styles.promptLabel}>
                    &gt; name:{focusedField === 'name' && <Cursor />}
                  </span>
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      name="name"
                      placeholder="your name"
                      className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                        if (errors.name) setErrors(p => ({ ...p, name: '' }));
                      }}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => {
                        setFocusedField(null);
                        if (!name.trim()) setErrors(p => ({ ...p, name: 'ERR: name required' }));
                      }}
                      required
                      disabled={loading || success}
                      aria-label="Your name"
                      aria-invalid={!!errors.name}
                    />
                    <AnimatePresence>
                      {errors.name && (
                        <motion.span
                          className={styles.errorText}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          role="alert"
                        >
                          {errors.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <span className={styles.promptLabel}>
                    &gt; email:{focusedField === 'email' && <Cursor />}
                  </span>
                  <div className={styles.inputWrapper}>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(p => ({ ...p, email: '' }));
                      }}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => {
                        setFocusedField(null);
                        if (!email.trim()) {
                          setErrors(p => ({ ...p, email: 'ERR: email required' }));
                        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                          setErrors(p => ({ ...p, email: 'ERR: invalid email format' }));
                        }
                      }}
                      required
                      disabled={loading || success}
                      aria-label="Your email address"
                      aria-invalid={!!errors.email}
                    />
                    <AnimatePresence>
                      {errors.email && (
                        <motion.span
                          className={styles.errorText}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          role="alert"
                        >
                          {errors.email}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <span className={styles.promptLabel}>
                    &gt; msg:{focusedField === 'message' && <Cursor />}
                  </span>
                  <div className={styles.inputWrapper}>
                    <textarea
                      name="message"
                      placeholder="tell us about your project..."
                      className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                      rows={4}
                      value={message}
                      onChange={e => {
                        setMessage(e.target.value);
                        if (errors.message) setErrors(p => ({ ...p, message: '' }));
                      }}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => {
                        setFocusedField(null);
                        if (!message.trim()) setErrors(p => ({ ...p, message: 'ERR: message required' }));
                      }}
                      required
                      disabled={loading || success}
                      aria-label="Your message"
                      aria-invalid={!!errors.message}
                    />
                    <AnimatePresence>
                      {errors.message && (
                        <motion.span
                          className={styles.errorText}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          role="alert"
                        >
                          {errors.message}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {!success && (
                      <motion.div
                        className={styles.charCount}
                        animate={{ opacity: focusedField === 'message' ? 1 : 0.35 }}
                        transition={{ duration: 0.2 }}
                      >
                        chars: {message.length}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <motion.button
                  type="submit"
                  className={`${styles.submitButton} ${success ? styles.successButton : ''}`}
                  disabled={loading || success}
                  whileHover={!loading && !success ? { scale: 1.03 } : {}}
                  whileTap={!loading && !success ? { scale: 0.97 } : {}}
                >
                  {loading && <span className={styles.spinner} />}
                  {buttonLabel}
                </motion.button>
              </div>

              <AnimatePresence>
                {success && (
                  <motion.div
                    className={styles.successMsg}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className={styles.successLine}>
                      <span className={styles.successPrompt}>&gt; transmission_status:</span>
                      <span className={styles.successValue}>SUCCESS</span>
                    </div>
                    <div className={styles.successLine}>
                      <span className={styles.successPrompt}>&gt; response_time:</span>
                      <span className={styles.successValue}>&lt; 24hrs</span>
                    </div>
                  </motion.div>
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
