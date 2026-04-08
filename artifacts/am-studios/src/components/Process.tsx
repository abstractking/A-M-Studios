import React from 'react';
import { motion } from 'framer-motion';
import styles from './Process.module.css';

const steps = [
  { number: "01", title: "Converse", desc: "Understanding your goals, needs and audience." },
  { number: "02", title: "Design", desc: "Your two new favorite artist mixing our passion with your vision" },
  { number: "03", title: "Launch", desc: "Test Stage & Phone/Video call review, Then we will be going live." }
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
