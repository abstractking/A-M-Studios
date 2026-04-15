# 🚨 PROCESS SECTION MOBILE EMERGENCY FIX

## Critical Bug Report

**Issue:** On mobile, the Process section steps (01, 02, 03) are showing as **blank boxes** — no text visible.

**Affected Elements:**
- Step titles ("Converse", "Design", "Launch")
- Step descriptions (the paragraph text)
- Possibly the numbers (01, 02, 03)

**Root Cause:** CSS is hiding or making text invisible on mobile breakpoints.

---

## EMERGENCY FIX (Apply Immediately)

### Step 1: Check `Process.module.css` for these issues

Open `src/components/Process.module.css` and look for mobile breakpoints (`@media`).

**Common culprits:**

#### Issue A: Text color set to transparent/invisible

```css
/* BAD - Check if this exists in mobile breakpoint: */
@media (max-width: 768px) {
  .title, .desc, .number {
    color: transparent; /* ← This would hide text! */
    /* OR */
    opacity: 0; /* ← This too! */
  }
}
```

**FIX:** Remove or change to visible color:
```css
@media (max-width: 768px) {
  .title {
    color: var(--foreground); /* White/light text */
    opacity: 1;
  }
  
  .desc {
    color: var(--foreground-muted); /* Slightly muted */
    opacity: 1;
  }
  
  .number {
    color: var(--accent); /* Cyan neon */
    opacity: 1;
  }
}
```

---

#### Issue B: Font size set to 0

```css
/* BAD - Check if this exists: */
@media (max-width: 768px) {
  .title, .desc {
    font-size: 0; /* ← Would make text invisible! */
  }
}
```

**FIX:**
```css
@media (max-width: 768px) {
  .title {
    font-size: 1.5rem; /* Readable size */
  }
  
  .desc {
    font-size: 1rem; /* Readable size */
  }
  
  .number {
    font-size: 2rem; /* Visible but not overflowing */
  }
}
```

---

#### Issue C: Display none or visibility hidden

```css
/* BAD - Check if this exists: */
@media (max-width: 768px) {
  .title, .desc, .number {
    display: none; /* ← Would hide completely! */
    /* OR */
    visibility: hidden; /* ← Also hides! */
  }
}
```

**FIX:** Remove these rules or set to:
```css
@media (max-width: 768px) {
  .title, .desc, .number {
    display: block; /* Or whatever they should be */
    visibility: visible;
  }
}
```

---

#### Issue D: Overflow hidden clipping content

```css
/* BAD - Check if this exists: */
.step {
  overflow: hidden;
  max-height: 0; /* ← Would clip all content! */
  /* OR */
  height: 0; /* ← Also clips! */
}
```

**FIX:**
```css
.step {
  overflow: visible; /* Allow content to show */
  /* Remove max-height/height restrictions */
  height: auto;
  min-height: auto;
}

/* On mobile, ONLY hide overflow if needed for neon numbers */
@media (max-width: 768px) {
  .step {
    overflow-x: hidden; /* Only hide horizontal overflow */
    overflow-y: visible; /* Allow vertical content */
  }
}
```

---

#### Issue E: Z-index layering problem

```css
/* BAD - Check if content is behind background: */
.step {
  position: relative;
  z-index: 0;
}

.step::before, .step::after {
  z-index: 10; /* ← If this is higher, decorations cover text! */
}
```

**FIX:**
```css
.step {
  position: relative;
  z-index: 1;
}

.step::before, .step::after {
  z-index: -1; /* Behind content */
  /* OR */
  z-index: 0; /* At same level but pointer-events: none */
  pointer-events: none;
}

.title, .desc, .number {
  position: relative;
  z-index: 2; /* Ensure text is on top */
}
```

---

## COMPLETE MOBILE FIX FOR PROCESS.MODULE.CSS

Replace or update your mobile breakpoints with this complete, working version:

```css
/* ═══════════════════════════════════════════════════════════
   PROCESS SECTION — COMPLETE MOBILE FIX
   ═══════════════════════════════════════════════════════════ */

/* Desktop styles (keep existing) */
.process {
  padding: 8rem 0 10rem;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem;
  margin-top: 4rem;
}

.step {
  text-align: center;
  position: relative;
  padding: 3rem 2rem;
  background: rgba(10, 0, 18, 0.4);
  border: 1px solid rgba(160, 80, 255, 0.2);
  border-radius: 4px;
  /* CRITICAL: Don't hide overflow on desktop either */
  overflow: visible;
}

.number {
  font-family: var(--barlow);
  font-size: 3.5rem;
  font-weight: 900;
  color: var(--accent);
  text-shadow: 0 0 20px var(--accent-glow);
  line-height: 1;
  margin-bottom: 1.5rem;
  display: block;
  position: relative;
  z-index: 2; /* Ensure number is visible */
}

.title {
  font-family: var(--barlow);
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--foreground);
  margin-bottom: 1rem;
  position: relative;
  z-index: 2; /* Ensure title is visible */
}

.desc {
  font-family: var(--dmsans);
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--foreground-muted);
  position: relative;
  z-index: 2; /* Ensure description is visible */
}

/* Desktop connectors (horizontal lines) */
.step::after {
  content: '';
  position: absolute;
  top: 50%;
  right: -2rem;
  width: 4rem;
  height: 1px;
  background: linear-gradient(
    to right,
    var(--accent) 0%,
    transparent 100%
  );
  opacity: 0.4;
  z-index: 0; /* Behind content */
  pointer-events: none;
}

.step:last-child::after {
  display: none;
}

/* ═══════════════════════════════════════════════════════════
   TABLET BREAKPOINT (968px) — Single Column + Vertical Lines
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 968px) {
  .grid {
    grid-template-columns: 1fr; /* Single column */
    gap: 3rem;
    max-width: 600px;
    margin: 0 auto;
  }
  
  /* Remove horizontal connectors */
  .step::after {
    display: none;
  }
  
  /* Add vertical connectors between steps */
  .step:not(:last-child)::before {
    content: '';
    position: absolute;
    bottom: -1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 3rem;
    background: linear-gradient(
      to bottom,
      var(--accent) 0%,
      rgba(0, 245, 212, 0.3) 50%,
      transparent 100%
    );
    opacity: 0.6;
    pointer-events: none;
    z-index: 0; /* Behind content */
  }
  
  .step {
    text-align: center;
    position: relative;
  }
}

/* ═══════════════════════════════════════════════════════════
   MOBILE BREAKPOINT (768px) — CRITICAL TEXT VISIBILITY FIX
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
  .process {
    padding: 4rem 0 6rem; /* Reduce section padding */
    overflow-x: hidden; /* Prevent horizontal scroll */
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .step {
    padding: 2rem 1.5rem;
    overflow: visible; /* CRITICAL: Don't hide content! */
    /* Ensure background and border are visible */
    background: rgba(10, 0, 18, 0.6);
    border: 1px solid rgba(160, 80, 255, 0.3);
  }
  
  /* CRITICAL: Ensure number is visible and sized correctly */
  .number {
    font-size: 2.5rem; /* Reduce from 3.5rem */
    line-height: 1;
    margin-bottom: 1rem;
    display: block; /* CRITICAL: Don't hide! */
    visibility: visible; /* CRITICAL: Make visible! */
    opacity: 1; /* CRITICAL: Full opacity! */
    color: var(--accent); /* CRITICAL: Ensure color is set! */
    text-shadow: 0 0 20px var(--accent-glow);
    position: relative;
    z-index: 2;
  }
  
  /* CRITICAL: Ensure title is visible */
  .title {
    font-size: 1.5rem; /* Readable size */
    margin: 1rem 0;
    display: block; /* CRITICAL: Don't hide! */
    visibility: visible; /* CRITICAL: Make visible! */
    opacity: 1; /* CRITICAL: Full opacity! */
    color: var(--foreground); /* CRITICAL: Ensure color is set! */
    position: relative;
    z-index: 2;
  }
  
  /* CRITICAL: Ensure description is visible */
  .desc {
    font-size: 1rem;
    line-height: 1.6;
    display: block; /* CRITICAL: Don't hide! */
    visibility: visible; /* CRITICAL: Make visible! */
    opacity: 1; /* CRITICAL: Full opacity! */
    color: var(--foreground-muted); /* CRITICAL: Ensure color is set! */
    position: relative;
    z-index: 2;
  }
}

/* ═══════════════════════════════════════════════════════════
   SMALL MOBILE BREAKPOINT (480px) — Further Adjustments
   ═══════════════════════════════════════════════════════════ */

@media (max-width: 480px) {
  .process {
    padding: 3rem 0 4rem;
  }
  
  .grid {
    gap: 2.5rem;
  }
  
  .number {
    font-size: 2rem; /* Further reduce on small screens */
  }
  
  .title {
    font-size: 1.25rem;
  }
  
  .desc {
    font-size: 0.95rem;
  }
  
  .step {
    padding: 1.5rem 1rem;
  }
  
  .step:not(:last-child)::before {
    bottom: -1.25rem;
    height: 2.5rem;
  }
}
```

---

## DEBUGGING CHECKLIST

If text is still not visible after applying the fix above, check these in order:

### 1. Inspect Element on Mobile (Chrome DevTools)

- [ ] Open the live site on mobile or in DevTools mobile mode
- [ ] Right-click on the blank step box → Inspect
- [ ] Look at the `.title`, `.desc`, `.number` elements
- [ ] Check computed styles for:
  - `color` — should NOT be transparent or same as background
  - `font-size` — should NOT be 0
  - `display` — should NOT be none
  - `visibility` — should NOT be hidden
  - `opacity` — should NOT be 0
  - `overflow` — parent should NOT clip content

### 2. Check for JavaScript Hiding Content

- [ ] Look in `Process.tsx` for any conditional rendering on mobile
- [ ] Check if Framer Motion animations have issues:

```tsx
// BAD - If this exists, it might hide content:
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 0 }} // ← Should be 1!
>
```

### 3. Check Global Mobile Styles

- [ ] Look in `index.css` or `App.css` for global mobile rules
- [ ] Check if there's a rule like:

```css
@media (max-width: 768px) {
  * {
    color: transparent; /* ← Would hide ALL text! */
  }
}
```

### 4. Check Font Loading

- [ ] Ensure fonts are loading on mobile
- [ ] Check browser console for font loading errors
- [ ] Test with a fallback font:

```css
.title {
  font-family: var(--barlow), Arial, sans-serif; /* Fallback */
}
```

---

## QUICK TEST

After applying the fix, test with this Chrome DevTools command:

1. Open DevTools (F12)
2. Go to mobile view (Toggle device toolbar)
3. In Console, run:

```javascript
// Check if text exists in DOM
document.querySelectorAll('.step .title').forEach(el => {
  console.log('Title text:', el.textContent);
  console.log('Computed color:', getComputedStyle(el).color);
  console.log('Computed font-size:', getComputedStyle(el).fontSize);
  console.log('Computed display:', getComputedStyle(el).display);
  console.log('Computed visibility:', getComputedStyle(el).visibility);
  console.log('Computed opacity:', getComputedStyle(el).opacity);
  console.log('---');
});
```

This will tell you exactly what's wrong.

---

## EXPECTED RESULT AFTER FIX

Mobile view should show:

```
┌────────────────────┐
│        02          │ ← Number visible (2rem, cyan)
│     Design         │ ← Title visible (1.25rem, white)
│                    │
│  We bring your     │ ← Description visible
│  vision to life... │   (0.95rem, muted white)
└────────────────────┘
         │             ← Vertical connector line
         ▼
┌────────────────────┐
│        03          │
│      Launch        │
│                    │
│  After review...   │
└────────────────────┘
```

All text should be clearly visible with proper sizing and colors.

---

## STILL BROKEN?

If the fix above doesn't work, the issue might be:

1. **CSS file not being imported** — Check `Process.tsx` imports the module CSS
2. **CSS not rebuilding** — Clear build cache and restart dev server
3. **Wrong CSS file being edited** — Ensure you're editing the correct `Process.module.css`
4. **Vercel cache** — Redeploy to Vercel to clear CDN cache

---

## EMERGENCY INLINE FIX (If CSS Won't Work)

As a last resort, add inline styles directly in `Process.tsx`:

```tsx
<div className={styles.step}>
  <span 
    className={styles.number}
    style={{ 
      color: '#00F5D4', 
      fontSize: '2rem', 
      display: 'block',
      opacity: 1,
      visibility: 'visible'
    }}
  >
    {step.number}
  </span>
  <h3 
    className={styles.title}
    style={{ 
      color: '#F0E8FF', 
      fontSize: '1.25rem',
      display: 'block',
      opacity: 1,
      visibility: 'visible'
    }}
  >
    {step.title}
  </h3>
  <p 
    className={styles.desc}
    style={{ 
      color: 'rgba(240, 232, 255, 0.7)',
      fontSize: '0.95rem',
      display: 'block',
      opacity: 1,
      visibility: 'visible'
    }}
  >
    {step.desc}
  </p>
</div>
```

This should force text to show even if CSS is broken.

---

**Apply this fix immediately and test on mobile!**
