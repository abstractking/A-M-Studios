import React from 'react';
import { motion } from 'framer-motion';
import styles from './Services.module.css';

const services = [
  {
    title: "Web Design",
    description: "Striking visual experiences that capture your brand's essence and engage your audience."
  },
  {
    title: "Web Development",
    description: "Robust, scalable, and responsive applications built with modern engineering practices."
  },
  {
    title: "Performance Optimization",
    description: "Lightning-fast load times and seamless interactions to boost conversion rates."
  }
];

const Services: React.FC = () => {
  return (
    <section className={styles.servicesSection}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(13, 224, 202, 0.15)"
              }}
            >
              <div className={styles.iconWrapper}>
                <div className={styles.icon}></div>
              </div>
              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.description}>{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
