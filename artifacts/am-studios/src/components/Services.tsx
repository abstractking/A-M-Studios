import React from 'react';
import { motion } from 'framer-motion';
import styles from './Services.module.css';

const services = [
  {
    exe: 'web_design.exe',
    title: 'Web Design',
    delay: 0,
    description: 'Interfaces so sharp they cut through the noise. Your brand, rendered in neon and chrome — built to convert and impossible to forget.'
  },
  {
    exe: 'web_dev.exe',
    title: 'Web Development',
    delay: 0.15,
    description: 'Scalable, high-performance applications engineered for speed. Clean code. Modern stack. Zero excuses for slow load times.'
  },
  {
    exe: 'perf_opt.exe',
    title: 'Performance Opt',
    delay: 0.3,
    description: 'We audit, accelerate, and amplify. Faster interactions, better scores, higher conversions. Your site — supercharged.'
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className={styles.servicesSection}>
      <div className={styles.gridBg}></div>
      <div className={styles.topRule}></div>

      <div className={styles.container}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>What We Run</h2>
          <hr className={styles.sectionRule} />
        </motion.div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: service.delay }}
            >
              <div className={styles.cardShimmer}></div>
              <div className={styles.cardChrome}>
                <span className={styles.dot + ' ' + styles.dotR}></span>
                <span className={styles.dot + ' ' + styles.dotY}></span>
                <span className={styles.dot + ' ' + styles.dotG}></span>
                <span className={styles.cardExe}>{service.exe}</span>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.cardFilename}>{service.exe}</span>
                <h3 className={styles.cardTitle}>
                  {service.title}
                  <span
                    className={styles.cursorBlock}
                    style={{ animationDelay: `${service.delay}s` }}
                  ></span>
                </h3>
                <p className={styles.cardDesc}>{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
