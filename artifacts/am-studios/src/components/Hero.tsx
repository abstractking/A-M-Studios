import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 80) {
      x.set(dx * 0.35);
      y.set(dy * 0.35);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.gradientBg}></div>

      <div className={styles.perspectiveGrid}>
        <svg viewBox="0 0 1200 300" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="gridFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(0,245,212,0)" />
              <stop offset="60%" stopColor="rgba(0,245,212,0.18)" />
              <stop offset="100%" stopColor="rgba(0,245,212,0.08)" />
            </linearGradient>
          </defs>
          {[...Array(12)].map((_, i) => {
            const frac = (i + 1) / 13;
            const xStart = 600 - 600 * frac;
            const xEnd = 600 + 600 * frac;
            const yPos = 10 + 290 * (frac ** 1.5);
            return (
              <line key={`h${i}`} x1={xStart} y1={yPos} x2={xEnd} y2={yPos}
                stroke="url(#gridFade)" strokeWidth="0.8" opacity={frac * 0.7} />
            );
          })}
          {[...Array(18)].map((_, i) => {
            const t = i / 17;
            const xTop = 300 + t * 600;
            return (
              <line key={`v${i}`} x1={xTop} y1={0} x2={600 * (0.05 + t * 0.9)} y2={300}
                stroke="url(#gridFade)" strokeWidth="0.8" opacity={0.5} />
            );
          })}
        </svg>
      </div>

      {/* SVG path draw-on decorative neon border */}
      <div className={styles.neonBorderSvg} aria-hidden="true">
        <svg viewBox="0 0 800 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Top neon corner bracket - left */}
          <motion.path
            d="M 60 100 L 60 20 L 200 20"
            stroke="#ff2d9b"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#neonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.0, ease: "easeInOut" }}
          />
          {/* Top neon corner bracket - right */}
          <motion.path
            d="M 740 100 L 740 20 L 600 20"
            stroke="#ff2d9b"
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#neonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 1.2, ease: "easeInOut" }}
          />
          {/* Center accent line - teal */}
          <motion.path
            d="M 220 60 L 580 60"
            stroke="#00f5d4"
            strokeWidth="1"
            strokeLinecap="round"
            filter="url(#neonGlow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.0, delay: 1.6, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <div className={styles.container}>
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            &gt; A&M Studios // Online
          </motion.span>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className={styles.titleGlitch}>The Future</span>
            <span className={styles.titleAccent}>Arrived Early.</span>
          </motion.h1>

          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We design and deploy high-velocity web experiences for businesses that refuse to be ignored. Free quote and mock draft within 24 hours.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <motion.button
              ref={btnRef}
              className={styles.primaryBtn}
              onClick={scrollToProjects}
              style={{ x: springX, y: springY }}
              whileTap={{ scale: 0.95 }}
            >
              View Projects
            </motion.button>
            <motion.button
              className={styles.secondaryBtn}
              onClick={scrollToContact}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get a Quote
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
