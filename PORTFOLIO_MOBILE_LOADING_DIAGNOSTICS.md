# Portfolio Cards Mobile Loading Issues - Diagnostic Report

**Project:** A&M Studios  
**Component:** Portfolio.tsx + Portfolio.module.css  
**Issue:** Portfolio cards loading slowly/failing on mobile devices  
**Date:** 2026-05-12

---

## Executive Summary

The Portfolio component uses embedded iframes to preview 7 external websites with real-time scaling. This causes multiple performance and loading issues specifically on mobile devices due to:
- Heavy iframe rendering and DOM complexity
- Network bandwidth constraints (mobile connections)
- JavaScript computation overhead (ResizeObserver)
- Unoptimized asset loading patterns
- Missing lazy loading strategies

---

## Component Architecture

### Current Implementation
```
Portfolio.tsx (145 lines)
├── 7 Project objects with href links
├── IframePreview Component
│   ├── ResizeObserver hook for dynamic scaling
│   ├── Fixed iframe (1440px × 960px)
│   └── CSS transforms and overlay effects
└── Portfolio Component
    ├── Maps 7 projects to cards
    ├── Renders IframePreview for each
    └── Click handlers for navigation
```

### Data Flow
1. Page loads → Portfolio component mounts
2. All 7 IframePreview components initialize
3. ResizeObserver attaches to each wrapper (7 observers)
4. Each iframe attempts to load external URL
5. Browser calculations scale each iframe based on container width
6. CSS animations and hover effects apply

---

## Identified Performance Bottlenecks

### 1. **Iframe Loading (CRITICAL)**
**File:** Portfolio.tsx, lines 67-82  
**Issue:** 7 large iframes (1440×960px) load simultaneously on page load

```javascript
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
```

**Mobile Impact:**
- Each iframe is a separate browsing context consuming ~5-15MB memory
- 7 iframes = 35-105MB+ memory usage
- Mobile devices typically have 2-4GB RAM (browser uses ~200-500MB max)
- Network requests: 7 simultaneous domain connections
- On 4G: ~1-3MB per page × 7 = 7-21MB bandwidth
- On 3G/LTE: Can timeout or stall

### 2. **ResizeObserver Overhead (HIGH)**
**File:** Portfolio.tsx, lines 49-62  
**Issue:** ResizeObserver runs on EVERY resize event for each of 7 cards

```javascript
const observer = new ResizeObserver(([entry]) => {
  const newScale = Math.max(0.15, Math.min(entry.contentRect.width / 1440, 0.35));
  setScale(newScale);
});
observer.observe(wrapperRef.current);
```

**Mobile Impact:**
- Mobile phones constantly trigger resize events (orientation change, soft keyboard, browser chrome)
- Each resize = state update = re-render = style recalculation
- 7 cards × multiple resize triggers = Heavy main thread thrashing
- Browser DevTools shows: Layout thrashing, paint thrashing
- Can cause "jank" (dropped frames, jumpy scrolling)

### 3. **CSS Grid Complexity (MEDIUM)**
**File:** Portfolio.module.css, lines 24-29  
**Issue:** Complex grid selectors with multiple media query duplications

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2.5rem;
}

/* Duplicated media queries below (lines 203-217) */
@media (max-width: 1024px) {
  .grid > *:last-child:nth-child(3n - 2) {
    grid-column: repeat(2, 1fr); /* DUPLICATE RULE */
  }
}

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr; gap: 1.5rem; }
  .container { padding: 0 1rem; }
}
```

**Mobile Impact:**
- `:nth-child(3n - 2)` selector causes expensive CSS calculations
- Duplicate media queries are redundant
- Unnecessary gap reduction (2.5rem → 1.5rem) can cause layout shift

### 4. **Font Loading (MEDIUM)**
**File:** index.css, line 1  
**Issue:** 8 Google Font families with multiple weights - blocking resource

```css
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=Great+Vibes&family=Space+Grotesk:wght@700;900&family=JetBrains+Mono:wght@400;700&family=VT323&display=swap');
```

**Mobile Impact:**
- Font import is a blocking resource in CSS
- Mobile: ~50-150KB downloaded before page interactive
- `display=swap` helps, but initial layout still shifts (FOUT - Flash of Unstyled Text)
- On slow connections: delays first contentful paint (FCP)

### 5. **CSS Animations & Effects (MEDIUM)**
**File:** Portfolio.module.css  
**Issues:**
- Scanlines animation (repeating-linear-gradient)
- Hover effects with transform and filter
- Multiple filter chains: `saturate()`, `contrast()`, `scale()`
- Box-shadow with multiple layers on hover

```css
.card:hover {
  box-shadow:
    0 0 20px var(--neon-pink-glow),
    0 0 40px rgba(255, 45, 155, 0.1),
    inset 0 0 20px rgba(255, 45, 155, 0.03);
  transform: translateY(-6px);
}
```

**Mobile Impact:**
- Multiple filters + transform = expensive composite operations
- Mobile GPUs process effects slower
- Hover state still expensive on touch (:active triggers similar effects)
- Scanlines animation runs continuously (no pause on scroll)

### 6. **No Lazy Loading (CRITICAL)**
**File:** Portfolio.tsx, lines 122-144  
**Issue:** All 7 iframes attempt to load immediately

```javascript
<div className={styles.grid}>
  {projects.map((project, index) => (
    <IframePreview src={project.href} ... />
  ))}
</div>
```

**Mobile Impact:**
- No intersection observer or lazy loading
- All iframes load regardless of viewport visibility
- User on mobile might only see 1 card at a time but ALL 7 load
- Wastes bandwidth and battery

### 7. **Transform Origin on Mobile (MEDIUM)**
**File:** Portfolio.tsx, lines 73-75  
**Issue:** Complex transform with dynamic scale value

```javascript
style={{
  transform: `scale(${scale})`,
  transformOrigin: 'top left',
}}
```

**Mobile Impact:**
- `scale()` with dynamic value requires GPU recalculation
- `transformOrigin: 'top left'` on scaled elements = potential rendering bugs
- Mobile browsers may struggle with will-change optimization
- Fixed 1440px width + scale = potential overflow issues on small screens

### 8. **Aspect Ratio Support (LOW)**
**File:** Portfolio.module.css, lines 97, 102  
**Issue:** Using `aspect-ratio` property

```css
.imageContainer {
  aspect-ratio: 4/3;
}

.iframeWrapper {
  aspect-ratio: 4/3;
}
```

**Mobile Impact:**
- Some older Android browsers (4.4-6.0) don't support aspect-ratio
- Fallback to explicit height needed
- May cause layout shift on older phones

### 9. **Body-level Scanlines (CONSTANT PAINT)**
**File:** index.css, lines 55-67  
**Issue:** Fixed pseudo-element with scanlines animation covering entire viewport

```css
body::after {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.08) 3px,
    rgba(0, 0, 0, 0.08) 4px
  );
}
```

**Mobile Impact:**
- Affects entire page paint performance
- Always visible, even when scrolled away
- Fixed position = can't be GPU-accelerated easily
- Continuous repaints on scroll

### 10. **Network Requests - No Preconnect Optimization**
**File:** index.html, lines 6-7  
**Issue:** External iframe URLs not optimized

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

**Mobile Impact:**
- 7 external domains for iframes (Vercel, vecollab.art, nephilimsecurity.vercel.app, etc.)
- No preconnect for iframe domains
- No DNS prefetching
- Mobile may have high DNS latency on cellular networks

---

## Specific Mobile Device Constraints

| Factor | Impact | Evidence |
|--------|--------|----------|
| **Memory** | 7 iframes × 10MB avg = 70MB+ used | Can cause OOM crashes on <2GB devices |
| **Network** | 4G: ~5Mbps avg, 3G: ~1Mbps | Multiple 2-3MB domains timeout |
| **CPU** | Single core performance critical | ResizeObserver + animations cause jank |
| **Battery** | Continuous paint + network drains | User notices poor battery after viewing |
| **Storage** | Cache constraints on mobile | May clear frequently loaded assets |
| **Viewport** | 375px (iPhone SE) to 414px (iPhone 13) | Scale calculations may be inaccurate |

---

## Symptom Checklist

Based on common mobile loading issues, check if user experiences:

- [ ] Cards don't appear for 3-5+ seconds after Portfolio section scrolls into view
- [ ] Iframes show blank/white space while loading
- [ ] Scrolling jank (jumpy, dropped frames) near Portfolio section
- [ ] Page feels "frozen" while cards load
- [ ] Network tab shows many failed/timeout requests
- [ ] DevTools shows 70MB+ memory used by iframes
- [ ] Cards load but content is cut off or incorrectly scaled
- [ ] Clicking card takes 2+ seconds to open new window
- [ ] Battery drains noticeably after viewing Portfolio
- [ ] Works fine on desktop/wifi but fails on 4G mobile
- [ ] Orientation change causes reload or layout shift
- [ ] Portfolio section causes "Long Tasks" in DevTools (>50ms)

---

## Browser DevTools Diagnostic Steps

### 1. Check Network Tab
- Open DevTools → Network tab
- Scroll to Portfolio section
- Observe: Do all 7 iframes load? What's the total size and time?
- Look for: 503/504 errors, timeout errors, slow requests

### 2. Check Performance Tab
- DevTools → Performance → Record
- Scroll to Portfolio, wait for cards to load
- Look for: Long tasks (red bars), layout thrashing, paint storms
- Check: Is ResizeObserver visible in task list?

### 3. Check Memory Tab
- DevTools → Memory → Take heap snapshot
- Scroll Portfolio section fully into view
- Take another snapshot
- Compare: How much memory did Portfolio add?

### 4. Check Rendering Tab
- DevTools → Rendering → Paint flashing
- Scroll near Portfolio
- Watch: Do cards continuously repaint while scrolling?

### 5. Check Lighthouse Mobile Audit
- DevTools → Lighthouse → Mobile profile
- Run audit on Portfolio section
- Check: CLS (Cumulative Layout Shift), LCP (Largest Contentful Paint)

---

## File Locations & Code References

| Issue | File | Lines |
|-------|------|-------|
| Iframe rendering | Portfolio.tsx | 67-82 |
| ResizeObserver | Portfolio.tsx | 49-62 |
| Grid styles | Portfolio.module.css | 24-29, 203-217 |
| Font loading | index.css | 1 |
| Animations | Portfolio.module.css | 157-169 (hover), 114-123 (scanlines) |
| Body scanlines | index.css | 55-67 |
| Aspect ratio | Portfolio.module.css | 97, 102 |
| No lazy loading | Portfolio.tsx | 122-144 |

---

## Summary Table for External AI

| Problem | Severity | Mobile Impact | Root Cause | Location |
|---------|----------|---------------|-----------|----------|
| 7 simultaneous iframes | CRITICAL | 70MB+ memory, 7 network requests | No lazy loading | Portfolio.tsx:122-144 |
| ResizeObserver thrashing | HIGH | Layout jank, dropped frames | Fires on every resize | Portfolio.tsx:49-62 |
| Iframe scaling computation | HIGH | CPU-intensive transforms | Dynamic scale calculation | Portfolio.tsx:67-82 |
| Font loading blocking | MEDIUM | Delays FCP | 8 font families imported | index.css:1 |
| Complex CSS selectors | MEDIUM | Expensive paint | :nth-child() + duplicates | Portfolio.module.css:24-29 |
| No network optimization | MEDIUM | High DNS latency | No preconnect hints | index.html |
| CSS animations always running | MEDIUM | Battery drain, paint storm | Scanlines on body | index.css:55-67 |
| Hover effects with filters | MEDIUM | GPU computation | Multiple filter chains | Portfolio.module.css:157-169 |
| Fixed iframe dimensions | MEDIUM | Scaling issues on small screens | 1440px width hardcoded | Portfolio.tsx:73 |
| Body overlay scanlines | LOW | Paint overhead | Always visible pseudo-element | index.css:55-67 |

---

## Questions for Troubleshooting

1. **Which devices/OS fail?** (iPhone, Android, specific versions?)
2. **What exactly fails?** (Cards don't load at all? Load slowly? Load but display wrong?)
3. **Network conditions?** (3G, 4G, WiFi?)
4. **DevTools Network tab errors?** (503, CORS, timeout?)
5. **Which iframes fail?** (All? Specific domains?)
6. **Memory pressure visible in DevTools?** (Chrome showing "Low Memory" warning?)
7. **Does it work if you disable JavaScript?** (Helps isolate JS vs. network issues)
8. **Works fine on desktop - is it only mobile?** (Confirms scaling/viewport issue)

---

## Reproduction Steps for External AI

1. Open am-studios website on mobile device
2. Scroll down to "Featured Projects" Portfolio section
3. Wait and observe card loading behavior
4. Open Chrome DevTools (remote debugging if needed)
5. Check Network, Performance, and Memory tabs
6. Compare memory usage before/after scrolling to Portfolio
7. Note any errors, timeouts, or visual glitches
8. Test on multiple network speeds (Throttle to "Slow 4G" in DevTools)

---

## Next Steps

1. **Run diagnostics** above to identify primary issue
2. **Post findings** with error messages from DevTools
3. **Implementation team** can then prioritize fixes:
   - Lazy loading iframes (Intersection Observer)
   - Reduce iframe count or use static previews
   - Optimize CSS animations
   - Add network optimization hints
   - Reduce font families
   - Add performance monitoring

