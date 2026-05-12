import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './Portfolio.module.css';

interface Project {
  id: number;
  title: string;
  description: string;
  href: string;
  image?: string;
}

// Custom debounce hook to avoid lodash dependency
const useDebounce = (callback: (arg: any) => void, delay: number = 100) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (arg: any) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(arg);
      }, delay);
    },
    [callback, delay]
  );
};

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
    title: "Ink-Heal-Buddy",
    description: "A draft dashboard site for a potential tattoo shop client, that automates timed check ups for after tattoo skin care, with their artist",
    href: "https://ink-heal-buddy.vercel.app/"
  }
];

const IframePreview: React.FC<{ src: string; onClick: () => void }> = ({ src, onClick }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  // Debounced scale update to prevent thrashing on every resize
  const debouncedSetScale = useDebounce((width: number) => {
    const newScale = Math.max(0.15, Math.min(width / 1440, 0.35));
    setScale(newScale);
  }, 100);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      debouncedSetScale(entry.contentRect.width);
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [debouncedSetScale]);

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

const CardWrapper: React.FC<{ 
  children: React.ReactNode;
  className?: string;
  onVisible: () => void;
}> = ({ children, className, onVisible }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          onVisible();
          observer.disconnect();
        }
      },
      { rootMargin: '100px' } // Load 100px before card enters viewport
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, onVisible]);

    return (
    <div ref={cardRef} className={className}>
      {isVisible ? children : <div className={styles.cardPlaceholder} />}
    </div>
  );
};

const Portfolio: React.FC = () => {
  const handleOpen = (href: string) => {
    if (href !== '#') window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="projects" className={styles.portfolioSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.sectionLabel}>// Portfolio</span>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
        </div>

        <div className={styles.grid}>
                    {projects.map((project) => (
            <CardWrapper key={project.id} className={styles.card} onVisible={() => console.log(`Card ${project.id} visible`)}>
              <div
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
              </div>
            </CardWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
