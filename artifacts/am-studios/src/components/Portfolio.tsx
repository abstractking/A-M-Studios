import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Portfolio.module.css';

interface Project {
  id: number;
  title: string;
  description: string;
  href: string;
  image?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Ember Oak Burgers",
    description: "Brand site for a craft burger restaurant — bold identity, warm atmosphere, full menu experience",
    href: "https://ember-oak-burgers-6dvc.vercel.app/"
  },
  {
    id: 2,
    title: "Serenity Nails",
    description: "Elegant nail salon brand site — soft aesthetic, service menu, and seamless booking experience",
    href: "https://serenity-nails-eight.vercel.app/"
  },
  {
    id: 3,
    title: "Precision Home Services",
    description: "Professional home services company site — clean layout, service offerings, and easy contact flow",
    href: "https://precision-home-services-precision-h-six.vercel.app/"
  },
  {
    id: 4,
    title: "VeCollab Vechain APP",
    description: "A one of a kind crypto project, set to reward artist for creating and collectors for collecting. Revenunue sharing and other economic features built to automate the future of the art economy inside of NFT contracts. Project has been delayed due to denied funding from VeChain Higher Ups.",
    href: "https://www.vecollab.art/"
  },
  {
    id: 5,
    title: "VeCollab Art Marketplace ",
    description: "Same premise of the Vecollab APP, although this project is scaled out to become its' own marketplace.",
    href: "https://vec-artt.vercel.app/"
  },
  {
    id: 6,
    title: "NSG ARMA COMMUNITY SERVER",
    description: "Currently in progress",
    href: "https://nephilimsecurity.vercel.app/"
  },
  {
    id: 7,
    title: "Ironclad Legal Group",
    description: "Authoritative law firm site — structured layout, practice areas, attorney bios, and consultation booking",
    href: "#"
  }
];

const IframePreview: React.FC<{ src: string; onClick: () => void }> = ({ src, onClick }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const newScale = Math.max(0.15, Math.min(entry.contentRect.width / 1440, 0.35));
      setScale(newScale);
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className={styles.iframeWrapper} onClick={onClick}>
        <div className={styles.mobilePreview}>
          <div className={styles.overlayMobile}>
            <span className={styles.linkButton}>View Project &rarr;</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={styles.iframeWrapper}>
      <iframe
        src={src}
        title="Live preview"
        scrolling="no"
        style={{
          width: '1440px',
          height: '960px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
          border: 'none',
          display: 'block',
        }}
      />
      <div className={styles.scanlines} />
      <div className={styles.overlay} onClick={onClick}>
        <span className={styles.linkButton}>View Project &rarr;</span>
      </div>
    </div>
  );
};

const glitchVariants = {
  hidden: { opacity: 0, x: -20, skewX: -5 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    skewX: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
  })
};

const Portfolio: React.FC = () => {
  const handleOpen = (href: string) => {
    if (href !== '#') window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="projects" className={styles.portfolioSection}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.sectionLabel}>// Portfolio</span>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
        </motion.div>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className={styles.card}
              custom={index}
              variants={glitchVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              onClick={() => handleOpen(project.href)}
              style={{ cursor: project.href !== '#' ? 'pointer' : 'default' }}
            >
              <div className={styles.vhsTop}>
                <span className={styles.vhsLabel}>VHS-{String(project.id).padStart(3, '0')}</span>
                <span className={styles.vhsRec}>● REC</span>
              </div>

              {project.image ? (
                <div className={styles.imageContainer}>
                  <img src={project.image} alt={project.title} className={styles.image} />
                  <div className={styles.scanlines} />
                  <div className={styles.overlay}>
                    <span className={styles.linkButton}>View Project &rarr;</span>
                  </div>
                </div>
              ) : (
                <IframePreview src={project.href} onClick={() => handleOpen(project.href)} />
              )}

              <div className={styles.cardContent}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <p className={styles.projectDescription}>{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
