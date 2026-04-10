import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Process.module.css';

const steps = [
  {
    number: "01",
    cmd: "$ init_conversation",
    title: "Converse",
    desc: "We decode your goals, map your audience, and define what success looks like. No assumptions. No guesswork. Just signal."
  },
  {
    number: "02",
    cmd: "$ compile_vision",
    title: "Design",
    desc: "We render your brand identity into a sharp, modern interface — fused with our instinct for motion-first, conversion-ready design."
  },
  {
    number: "03",
    cmd: "$ deploy --prod",
    title: "Launch",
    desc: "Green light on your approval and we go live — on time, on budget, and ready to perform at scale."
  }
];

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, delay = 0, speed = 30, className }) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [displayed, setDisplayed] = useState('');
  const hasStarted = React.useRef(false);

  React.useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    let i = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const timerId = setTimeout(() => {
      intervalId = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timerId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isInView, text, delay, speed]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {isInView && displayed.length < text.length && (
        <span style={{
          display: 'inline-block',
          width: '0.55em',
          height: '1em',
          background: 'var(--accent)',
          verticalAlign: 'middle',
          marginLeft: '1px',
          animation: 'blink 0.7s step-end infinite',
          boxShadow: '0 0 6px var(--accent-glow)'
        }} />
      )}
    </span>
  );
};

const Process: React.FC = () => {
  return (
    <section id="process" className={styles.processSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionLabel}>// Process</span>
          <h2 className={styles.sectionTitle}>How We Ship</h2>
        </motion.div>

        <div className={styles.grid}>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={styles.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className={styles.terminalHeader}>
                <span className={styles.prompt}>&gt;</span>{' '}
                <TypewriterText
                  text={step.cmd}
                  delay={index * 200 + 300}
                  speed={35}
                />
              </div>
              <span className={styles.number}>{step.number}</span>
              <h3 className={styles.title}>
                <TypewriterText
                  text={step.title}
                  delay={index * 200 + step.cmd.length * 35 + 400}
                  speed={60}
                />
              </h3>
              <p className={styles.desc}>
                <TypewriterText
                  text={step.desc}
                  delay={index * 200 + step.cmd.length * 35 + step.title.length * 60 + 500}
                  speed={12}
                />
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
