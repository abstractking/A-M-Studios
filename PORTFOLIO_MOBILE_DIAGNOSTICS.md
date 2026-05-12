# Portfolio Cards Mobile Loading Issues - External AI Diagnostic Report

**Project:** A&M Studios (Vite + React + TypeScript)  
**Component:** `artifacts/am-studios/src/components/Portfolio.tsx`  
**Styles:** `artifacts/am-studios/src/components/Portfolio.module.css`  
**Date:** 2026-05-12  

---

## Problem Statement

Portfolio cards are loading poorly on mobile devices. This document provides all context needed for an external AI assistant to diagnose and fix the issues.

---

## Architecture Overview

```
Portfolio Section
├── 7 Project Cards (all render simultaneously)
│   └── IframePreview Component (for each card)
│       ├── ResizeObserver (dynamic scale calculation)
│       ├── iframe (1440x960px, scaled down)
│       ├── Scanlines overlay
│       └── Click overlay with CTA button
└── No lazy loading implemented
```

### External URLs Being Loaded (7 iframes):
1. `https://ember-oak-burgers-6dvc.vercel.app/`
2. `https://serenity-nails-eight.vercel.app/`
3. `https://precision-home-services-precision-h-six.vercel.app/`
4. `https://www.vecollab.art/`
5. `https://vec-artt.vercel.app/`
6. `https://nephilimsecurity.vercel.app/`
7. `https://ink-heal-buddy.vercel.app/`

---

## IDENTIFIED ISSUES (Prioritized)

### CRITICAL SEVERITY

#### 1. Seven Simultaneous Iframes - No Lazy Loading
**File:** `Portfolio.tsx`, lines 85-117  
**Code:**
```tsx
<div className={styles.grid}>
  {projects.map((project, index) => (
    <div key={project.id} className={styles.card}>
      {/* ... */}
      <IframePreview src={project.href} onClick={() => handleOpen(project.href)} />
      {/* ... */}
    </div>
  ))}
</div>
```

**Problem:** All 7 iframes load immediately when the page renders, even if the Portfolio section isn't visible.

**Mobile Impact:**
- Each iframe creates a separate browsing context (~10-15MB memory each)
- 7 iframes = 70-105MB+ memory consumption
- Mobile browsers typically have 200-500MB memory budget
- 7 simultaneous network requests to external domains
- On 4G (~5Mbps): Each external site may be 1-3MB = 7-21MB bandwidth
- On 3G: Requests timeout or stall completely

---

#### 2. Large Fixed-Dimension Iframes with Dynamic Scaling
**File:** `Portfolio.tsx`, lines 61-76  
**Code:**
```tsx
<iframe
  src={src}
  title="Live preview"
  scrolling="no"
  style={{
    width: '1440px',      // <-- Desktop-sized iframe
    height: '960px',      // <-- Always this size
    transform: `scale(${scale})`,  // <-- Scaled down dynamically
    transformOrigin: 'top left',
    pointerEvents: 'none',
    border: 'none',
    display: 'block',
  }}
/>
```

**Problem:** Each iframe renders at 1440x960px (1.3 million pixels) then CSS-scales it down to fit mobile screens.

**Mobile Impact:**
- Mobile GPU must composite a 1440x960px layer per iframe
- Transform scaling is CPU/GPU intensive on mobile
- Scale value recalculates on every resize event
- Memory overhead for off-screen rendering

---

### HIGH SEVERITY

#### 3. ResizeObserver Thrashing
**File:** `Portfolio.tsx`, lines 49-59  
**Code:**
```tsx
useEffect(() => {
  if (!wrapperRef.current) return;
  const observer = new ResizeObserver(([entry]) => {
    const newScale = Math.max(0.15, Math.min(entry.contentRect.width / 1440, 0.35));
    setScale(newScale);  // <-- State update on EVERY resize
  });
  observer.observe(wrapperRef.current);
  return () => observer.disconnect();
}, []);
```

**Problem:** ResizeObserver fires continuously during:
- Initial page layout
- Scroll events (mobile browser chrome hides/shows)
- Orientation changes
- Soft keyboard appearance/disappearance

**Mobile Impact:**
- Each resize event triggers `setScale()` = React re-render
- 7 cards = 7 observers = 7x the resize callbacks
- Causes layout thrashing and "jank" (dropped frames)
- Main thread blocked during resize storms

---

#### 4. Body-Level Scanlines Pseudo-Element (Continuous Paint)
**File:** `index.css`, lines 47-59  
**Code:**
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.08) 3px,
    rgba(0, 0, 0, 0.08) 4px
  );
  pointer-events: none;
  z-index: 9999;
}
```

**Problem:** Fixed pseudo-element covers entire viewport with scanlines effect.

**Mobile Impact:**
- `position: fixed` + `z-index: 9999` = always composited on top
- Repeating gradient repaints on every scroll
- Cannot be GPU-accelerated efficiently
- Continuous paint operations drain battery

---

### MEDIUM SEVERITY

#### 5. Heavy Font Loading (Render Blocking)
**File:** `index.css`, line 1  
**Code:**
```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=Great+Vibes&family=Space+Grotesk:wght@700;900&family=JetBrains+Mono:wght@400;700&family=VT323&display=swap');
```

**Problem:** 7 font families with multiple weights loaded via CSS @import (blocking).

**Mobile Impact:**
- @import is render-blocking
- ~50-150KB of font files to download
- Delays First Contentful Paint (FCP)
- FOUT (Flash of Unstyled Text) on slow connections

---

#### 6. Complex CSS Hover Effects
**File:** `Portfolio.module.css`, lines 37-47  
**Code:**
```css
.card:hover {
  border-color: var(--neon-pink);
  box-shadow:
    0 0 20px var(--neon-pink-glow),
    0 0 40px rgba(255, 45, 155, 0.1),
    inset 0 0 20px rgba(255, 45, 155, 0.03);
  transform: translateY(-6px);
}
```

**Problem:** Multiple box-shadows + transform on hover/touch.

**Mobile Impact:**
- Touch triggers :hover states briefly
- Multiple box-shadow layers = expensive paint operations
- Combined with transform = composite layer creation
- Not as critical but adds to overall GPU load

---

#### 7. Duplicate Media Query Rules
**File:** `Portfolio.module.css`, lines 181-215  
**Code:**
```css
/* These rules are duplicated multiple times: */
@media (max-width: 1024px) {
  .grid > *:last-child:nth-child(3n - 2) { grid-column: auto; }
}
@media (max-width: 768px) {
  .grid > *:last-child:nth-child(3n - 2) { grid-column: auto; }
}
@media (max-width: 1024px) {
  .grid > *:last-child:nth-child(3n - 2) { grid-column: auto; }
}
@media (max-width: 768px) {
  .grid > *:last-child:nth-child(3n - 2) { grid-column: auto; }
}
```

**Problem:** Same media queries and rules repeated 4 times.

**Mobile Impact:**
- Unnecessary CSS parsing overhead
- `:nth-child(3n - 2)` selector is expensive to evaluate
- Not a major issue but indicates code quality problems

---

#### 8. Missing DNS Prefetch for Iframe Domains
**File:** `index.html`  
**Current preconnects:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Problem:** No preconnect hints for the 7 external iframe domains.

**Mobile Impact:**
- DNS lookup latency on cellular can be 50-200ms per domain
- 7 domains = potential 350-1400ms of DNS lookup time
- Mobile networks have higher latency than WiFi

---

## MOBILE DEVICE CONSTRAINTS

| Resource | Desktop | Mobile | Impact |
|----------|---------|--------|--------|
| **Memory** | 8-16GB | 2-4GB | 7 iframes can consume 50%+ of browser memory budget |
| **CPU** | Multi-core, high freq | Lower freq, thermal throttling | ResizeObserver + scaling overwhelms main thread |
| **GPU** | Dedicated VRAM | Shared memory | 7 x 1440x960 composited layers strain GPU |
| **Network** | 100Mbps+ | 5-25Mbps (4G) | 7 external sites = 7-21MB payload |
| **Battery** | Plugged in | Limited | Continuous paints + network drain battery |

---

## DIAGNOSTIC STEPS FOR DEBUGGING

### Step 1: Check Network Tab
1. Open Chrome DevTools on mobile (or use remote debugging)
2. Go to Network tab
3. Scroll to Portfolio section
4. Observe:
   - How many requests fire?
   - What's the total transfer size?
   - Any failed/timeout requests (red)?
   - How long until all iframes load?

### Step 2: Check Performance Tab
1. DevTools > Performance > Start Recording
2. Scroll to Portfolio and wait
3. Stop recording
4. Look for:
   - Red "Long Task" bars (>50ms)
   - ResizeObserver in call stack
   - Layout/Paint thrashing patterns

### Step 3: Check Memory Tab
1. DevTools > Memory > Take Heap Snapshot
2. Scroll Portfolio into view
3. Take another snapshot
4. Compare: How much memory did Portfolio section add?

### Step 4: Run Lighthouse Mobile Audit
1. DevTools > Lighthouse
2. Select "Mobile" device
3. Run audit
4. Check:
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)
   - Total Blocking Time (TBT)

### Step 5: Rendering Panel
1. DevTools > Rendering > Enable "Paint Flashing"
2. Scroll around Portfolio
3. Watch for green flashes indicating repaints

---

## SYMPTOM CHECKLIST

Check which symptoms the user experiences:

- [ ] Cards take 3-5+ seconds to appear after scrolling to Portfolio
- [ ] Iframes show blank/white space while loading
- [ ] Scrolling is janky (dropped frames) near Portfolio
- [ ] Page feels frozen while cards load
- [ ] Some iframes fail to load entirely (blank or error)
- [ ] Memory warning appears in browser
- [ ] Cards display but content is cut off or scaled wrong
- [ ] Orientation change causes layout issues
- [ ] Works on desktop/WiFi but fails on mobile/4G
- [ ] Battery drains noticeably after viewing page

---

## RECOMMENDED FIXES (for implementing AI)

### Fix 1: Implement Lazy Loading with Intersection Observer
Replace eager iframe loading with lazy loading:
```tsx
const [isVisible, setIsVisible] = useState(false);
const cardRef = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    },
    { rootMargin: '100px' }
  );
  if (cardRef.current) observer.observe(cardRef.current);
  return () => observer.disconnect();
}, []);

// Only render iframe when visible
{isVisible && <IframePreview ... />}
```

### Fix 2: Debounce ResizeObserver
```tsx
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

const debouncedSetScale = useMemo(
  () => debounce((width: number) => {
    setScale(Math.max(0.15, Math.min(width / 1440, 0.35)));
  }, 100),
  []
);
```

### Fix 3: Use Static Screenshots Instead of Live Iframes
Replace live iframes with static preview images:
```tsx
// Add image property to projects
{ id: 1, title: "...", image: "/previews/ember-oak.webp", href: "..." }

// Render image instead of iframe
<img src={project.image} alt={project.title} loading="lazy" />
```

### Fix 4: Add DNS Prefetch for Iframe Domains
```html
<link rel="dns-prefetch" href="https://ember-oak-burgers-6dvc.vercel.app">
<link rel="dns-prefetch" href="https://serenity-nails-eight.vercel.app">
<!-- etc. -->
```

### Fix 5: Optimize Font Loading
```html
<link rel="preload" href="fonts.css" as="style">
```
Or split into critical/non-critical fonts.

### Fix 6: Remove Duplicate CSS Rules
Consolidate the repeated media queries into single declarations.

### Fix 7: Conditionally Disable Body Scanlines on Mobile
```css
@media (max-width: 768px) {
  body::after { display: none; }
}
```

---

## FILES TO MODIFY

| File | Purpose | Priority |
|------|---------|----------|
| `Portfolio.tsx` | Add lazy loading, debounce resize | HIGH |
| `Portfolio.module.css` | Remove duplicate rules, simplify hover | MEDIUM |
| `index.html` | Add DNS prefetch hints | MEDIUM |
| `index.css` | Disable scanlines on mobile, optimize fonts | MEDIUM |

---

## QUESTIONS FOR USER

1. **Which devices/browsers fail?** (iPhone Safari, Android Chrome, specific versions?)
2. **What network conditions?** (WiFi, 4G, 3G?)
3. **What exactly happens?** (Blank cards, slow load, crash, jank?)
4. **Do DevTools show specific errors?** (Network failures, console errors?)
5. **Does it work on desktop but fail on mobile?**

---

## REPRODUCTION STEPS

1. Open A&M Studios site on mobile device
2. Scroll down to "Featured Projects" section
3. Observe card loading behavior
4. Check if all 7 cards eventually display
5. Note any visual glitches, blank frames, or performance issues
6. Compare behavior on WiFi vs. cellular connection

---

## SUMMARY TABLE

| Issue | Severity | Root Cause | Fix Complexity |
|-------|----------|------------|----------------|
| 7 simultaneous iframes | CRITICAL | No lazy loading | Medium |
| 1440x960 scaled iframes | CRITICAL | Desktop-sized in mobile | Medium |
| ResizeObserver thrashing | HIGH | No debouncing | Easy |
| Body scanlines paint | HIGH | Fixed pseudo-element | Easy |
| Blocking font import | MEDIUM | CSS @import | Medium |
| Complex hover effects | MEDIUM | Multiple shadows | Easy |
| Duplicate CSS rules | LOW | Code duplication | Easy |
| No DNS prefetch | LOW | Missing hints | Easy |

---

*This document was generated for external AI troubleshooting. All code references verified against current codebase.*
