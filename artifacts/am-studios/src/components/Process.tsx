import React from 'react';
import { motion } from 'framer-motion';
import styles from './Process.module.css';

const steps = [
  { number: "01", title: "Converse", desc: "We start by understanding your goals, your audience, and what success looks like for you." },
  { number: "02", title: "Design", desc: "We bring your vision to life, blending your brand identity with our eye for clean, modern design." },
  { number: "03", title: "Launch", desc: "After a thorough review and your approval, we go live — on time, on budget." }
];

const Process: React.FC = () => {
  return (
    <section id="process" className={styles.processSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className={styles.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className={styles.number}>{step.number}</div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.desc}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
