import React from 'react';
import { motion } from 'framer-motion';
import styles from './Services.module.css';

const services = [
  {
    prompt: "web_design.exe",
    title: "Web Design",
    description: "Interfaces so sharp they cut through the noise. Your brand, rendered in neon and chrome — built to convert and impossible to forget."
  },
  {
    prompt: "web_dev.exe",
    title: "Web Development",
    description: "Scalable, high-performance applications engineered for speed. Clean code. Modern stack. Zero excuses for slow load times."
  },
  {
    prompt: "perf_opt.exe",
    title: "Performance Optimization",
    description: "We audit, accelerate, and amplify. Faster interactions, better scores, higher conversions. Your site — supercharged."
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className={styles.servicesSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionLabel}>// Services</span>
          <h2 className={styles.sectionTitle}>What We Run</h2>
        </motion.div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className={styles.terminalBar}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.terminalPrompt}>&gt; {service.prompt}</span>
                <h3 className={styles.title}>
                  {service.title}
                  <span className={styles.cursor}></span>
                </h3>
                <p className={styles.description}>{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
