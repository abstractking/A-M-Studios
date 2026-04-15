# 🎯 A&M Studios Contact Form — Premium Input Field Enhancement Prompt

## CONTEXT

**Current State:**
The Contact form uses a cyberpunk terminal aesthetic with:
- Terminal window wrapper (`.terminalWindow`) with colored dots
- Prompt-style labels (`> name:`, `> email:`, `> msg:`)
- Basic text inputs with VT323 monospace font
- Minimal styling on inputs (transparent background, accent caret)

**Goal:**
Enhance the input field UX to create a premium, interactive experience that feels polished and responsive while maintaining the dark cyberpunk terminal identity.

---

## DESIGN REQUIREMENTS

### Visual Identity (Preserve):
- **Keep:** Terminal window aesthetic, prompt labels, VT323 font, dark cyberpunk colors
- **Keep:** Accent color (cyan/teal `#00F5D4`), neon pink, purple accents
- **Keep:** Current layout structure (prompt label + input in same line)

### Enhancement Goals:
1. **Better Focus States** — Clear visual feedback when user is typing
2. **Typing Indicators** — Subtle terminal-like animations when active
3. **Error States** — Clear validation feedback that fits the terminal theme
4. **Character Count** — Optional counter for message textarea
5. **Smooth Transitions** — Micro-animations that feel polished
6. **Accessibility** — Maintain ARIA labels and keyboard navigation

---

## DETAILED ENHANCEMENTS

### 1. INPUT FOCUS STATES

**Current:**
```css
.input:focus, .textarea:focus {
  color: var(--accent); /* Text turns cyan on focus */
}
```

**Enhanced:**
Add these improvements to `.input:focus` and `.textarea:focus`:

```css
.input:focus, .textarea:focus {
  color: var(--accent);
  background: rgba(0, 245, 212, 0.03); /* Subtle cyan tint */
  box-shadow: inset 0 0 15px rgba(0, 245, 212, 0.08); /* Inner glow */
  outline: none;
}
```

**Also add a glowing border effect on the entire `.inputGroup` when focused:**

```css
.inputGroup:focus-within {
  background: rgba(0, 245, 212, 0.02);
  border-bottom-color: rgba(0, 245, 212, 0.3); /* Brighter border */
  box-shadow: 0 1px 0 0 rgba(0, 245, 212, 0.2); /* Subtle glow under border */
}
```

---

### 2. TYPING CURSOR INDICATOR (Terminal Feel)

Add a blinking cursor effect next to the prompt label when input is focused.

**Implementation:**

Add this to the JSX (in `Contact.tsx`):

```tsx
// Add state for tracking which input is focused
const [focusedField, setFocusedField] = useState<string | null>(null);

// In each input, add:
onFocus={() => setFocusedField('name')} // or 'email', 'message'
onBlur={() => setFocusedField(null)}

// Update the prompt label to include cursor:
<span className={styles.promptLabel}>
  &gt; name:
  {focusedField === 'name' && <span className={styles.cursor}>_</span>}
</span>
```

**Add CSS for blinking cursor:**

```css
.cursor {
  display: inline-block;
  width: 8px;
  height: 2px;
  background: var(--accent);
  margin-left: 4px;
  animation: blink 1.2s infinite;
  box-shadow: 0 0 8px var(--accent-glow);
}

@keyframes blink {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}
```

---

### 3. ERROR / VALIDATION STATES

Add client-side validation with terminal-themed error messages.

**Implementation in `Contact.tsx`:**

```tsx
// Add validation state
const [errors, setErrors] = useState({
  name: '',
  email: '',
  message: ''
});

// Validation function
const validateForm = () => {
  const newErrors = { name: '', email: '', message: '' };
  
  if (!name.trim()) {
    newErrors.name = 'ERR: name required';
  }
  
  if (!email.trim()) {
    newErrors.email = 'ERR: email required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = 'ERR: invalid email format';
  }
  
  if (!message.trim()) {
    newErrors.message = 'ERR: message required';
  }
  
  setErrors(newErrors);
  return !newErrors.name && !newErrors.email && !newErrors.message;
};

// Call validateForm() before submitting
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return; // Stop if validation fails
  
  // ... rest of submit logic
};

// Add onBlur validation to each input
<input
  // ... existing props
  onBlur={() => {
    if (!name.trim()) {
      setErrors(prev => ({ ...prev, name: 'ERR: name required' }));
    } else {
      setErrors(prev => ({ ...prev, name: '' }));
    }
  }}
/>
```

**Add error display in JSX:**

```tsx
<div className={styles.inputGroup}>
  <span className={styles.promptLabel}>&gt; name:</span>
  <div className={styles.inputWrapper}>
    <input
      type="text"
      name="name"
      placeholder="your name"
      className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
      value={name}
      onChange={e => {
        setName(e.target.value);
        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
      }}
      onBlur={() => {
        if (!name.trim()) {
          setErrors(prev => ({ ...prev, name: 'ERR: name required' }));
        }
      }}
      required
      disabled={loading || success}
    />
    {errors.name && (
      <motion.span 
        className={styles.errorText}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
      >
        {errors.name}
      </motion.span>
    )}
  </div>
</div>
```

**Add error CSS:**

```css
.inputWrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.inputError {
  color: #ff6b6b !important; /* Red error color */
  border-bottom: 1px solid rgba(255, 107, 107, 0.3);
}

.inputGroup:has(.inputError) {
  border-bottom-color: rgba(255, 107, 107, 0.2);
  background: rgba(255, 107, 107, 0.02);
}

.errorText {
  font-family: var(--vt323);
  font-size: 0.9rem;
  color: #ff6b6b;
  letter-spacing: 0.05em;
  padding-left: 0.75rem;
  text-shadow: 0 0 8px rgba(255, 107, 107, 0.5);
}
```

---

### 4. CHARACTER COUNT FOR TEXTAREA

Add a terminal-style character counter for the message field.

**Implementation:**

```tsx
// In Contact.tsx, add this below the textarea:
{!success && !loading && (
  <motion.div 
    className={styles.charCount}
    initial={{ opacity: 0 }}
    animate={{ opacity: focusedField === 'message' ? 1 : 0.3 }}
  >
    <span>chars: {message.length}</span>
  </motion.div>
)}
```

**Add CSS:**

```css
.charCount {
  font-family: var(--vt323);
  font-size: 0.85rem;
  color: rgba(160, 80, 255, 0.4);
  letter-spacing: 0.05em;
  padding: 0.25rem 0.75rem;
  text-align: right;
  transition: all 0.3s ease;
}

.inputGroup:focus-within .charCount {
  color: var(--accent);
  text-shadow: 0 0 6px var(--accent-glow);
}
```

---

### 5. AUTOFILL DETECTION STYLING

Style browser autofill to match the terminal theme (prevents yellow background).

**Add to CSS:**

```css
.input:-webkit-autofill,
.input:-webkit-autofill:hover,
.input:-webkit-autofill:focus,
.textarea:-webkit-autofill,
.textarea:-webkit-autofill:hover,
.textarea:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--foreground);
  -webkit-box-shadow: 0 0 0px 1000px rgba(10, 0, 18, 0.9) inset;
  transition: background-color 5000s ease-in-out 0s;
  caret-color: var(--accent);
}

.input:-webkit-autofill::first-line,
.textarea:-webkit-autofill::first-line {
  font-family: var(--vt323);
  font-size: 1.1rem;
  letter-spacing: 0.05em;
}
```

---

### 6. SMOOTH PLACEHOLDER ANIMATION

Make placeholder text fade out smoothly when user starts typing.

**Add to CSS:**

```css
.input:not(:placeholder-shown),
.textarea:not(:placeholder-shown) {
  /* Styles when input has value */
}

.input::placeholder,
.textarea::placeholder {
  color: rgba(160, 80, 255, 0.3);
  font-family: var(--vt323);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.input:focus::placeholder,
.textarea:focus::placeholder {
  opacity: 0.5;
  transform: translateX(4px);
}
```

---

### 7. ENHANCED DISABLED STATE

When form is submitting or succeeded, make disabled state clearer.

**Add to CSS:**

```css
.input:disabled,
.textarea:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  color: rgba(240, 232, 255, 0.3);
}

.inputGroup:has(input:disabled) {
  opacity: 0.5;
  pointer-events: none;
}

.promptLabel {
  transition: all 0.3s ease;
}

.inputGroup:has(input:disabled) .promptLabel {
  color: rgba(0, 245, 212, 0.3);
  text-shadow: none;
}
```

---

### 8. SUBMIT BUTTON ENHANCEMENTS

Improve button states with loading animation.

**Add loading spinner to button:**

```tsx
<motion.button
  type="submit"
  className={`${styles.submitButton} ${success ? styles.successButton : ''}`}
  disabled={loading || success}
  whileHover={!loading && !success ? { scale: 1.03 } : {}}
  whileTap={!loading && !success ? { scale: 0.97 } : {}}
>
  {loading && <span className={styles.spinner}></span>}
  {buttonLabel}
</motion.button>
```

**Add spinner CSS:**

```css
.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid rgba(0, 245, 212, 0.2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.submitButton:hover:not(:disabled) {
  background: rgba(0, 245, 212, 0.1);
  box-shadow: 0 0 30px var(--accent-glow), 0 0 60px rgba(0, 245, 212, 0.15);
  transform: translateY(-2px);
}

.submitButton:active:not(:disabled) {
  transform: translateY(0);
}
```

---

### 9. SUCCESS STATE ANIMATION

When form is successfully submitted, add a terminal-style success animation.

**Implementation:**

```tsx
{success && (
  <motion.div
    className={styles.successMsg}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <div className={styles.successLine}>
      <span className={styles.successPrompt}>&gt; transmission_status:</span>
      <span className={styles.successValue}>SUCCESS</span>
    </div>
    <div className={styles.successLine}>
      <span className={styles.successPrompt}>&gt; response_time:</span>
      <span className={styles.successValue}>&lt; 24hrs</span>
    </div>
  </motion.div>
)}
```

**Add CSS:**

```css
.successMsg {
  text-align: left;
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(0, 245, 212, 0.05);
  border: 1px solid rgba(0, 245, 212, 0.2);
  border-left: 3px solid var(--accent);
}

.successLine {
  font-family: var(--vt323);
  font-size: 1rem;
  letter-spacing: 0.05em;
  margin: 0.25rem 0;
  display: flex;
  gap: 0.5rem;
}

.successPrompt {
  color: rgba(160, 80, 255, 0.6);
}

.successValue {
  color: var(--accent);
  text-shadow: 0 0 8px var(--accent-glow);
  font-weight: bold;
}
```

---

## ACCESSIBILITY ENHANCEMENTS

### 1. ARIA Labels
```tsx
<input
  type="text"
  name="name"
  placeholder="your name"
  className={styles.input}
  value={name}
  onChange={e => setName(e.target.value)}
  required
  disabled={loading || success}
  aria-label="Your name"
  aria-invalid={!!errors.name}
  aria-describedby={errors.name ? "name-error" : undefined}
/>

{errors.name && (
  <span id="name-error" className={styles.errorText} role="alert">
    {errors.name}
  </span>
)}
```

### 2. Keyboard Navigation
Ensure Tab order flows naturally:
1. Name input
2. Email input
3. Message textarea
4. Submit button

---

## MOBILE ENHANCEMENTS

**Add these mobile-specific improvements:**

```css
@media (max-width: 480px) {
  .input, .textarea {
    font-size: 16px; /* Prevents iOS zoom on focus */
  }
  
  .promptLabel {
    min-width: 2.5rem; /* Slightly narrower on small screens */
    font-size: 1rem;
  }
  
  .inputGroup {
    padding: 1rem 0;
  }
  
  .charCount {
    font-size: 0.75rem;
  }
  
  /* Make tap targets larger on mobile */
  .input, .textarea {
    padding: 0.5rem 0.75rem;
    min-height: 44px; /* iOS minimum tap target */
  }
}
```

---

## ANIMATION PERFORMANCE

Use Framer Motion wisely for smooth 60fps animations:

```tsx
// Wrap animated elements in AnimatePresence
<AnimatePresence mode="wait">
  {errors.name && (
    <motion.span
      key="name-error"
      className={styles.errorText}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      {errors.name}
    </motion.span>
  )}
</AnimatePresence>
```

---

## COMPLETE ENHANCEMENT CHECKLIST

- [ ] Enhanced focus states with subtle glow
- [ ] Blinking cursor indicator when typing
- [ ] Client-side validation with terminal-style errors
- [ ] Character counter for message textarea
- [ ] Autofill styling that matches theme
- [ ] Smooth placeholder animations
- [ ] Clear disabled states
- [ ] Loading spinner on submit button
- [ ] Terminal-style success message
- [ ] ARIA labels for accessibility
- [ ] Mobile-optimized tap targets (44px minimum)
- [ ] Prevent iOS zoom with font-size: 16px
- [ ] Keyboard navigation support
- [ ] Error announcements for screen readers

---

## EXPECTED RESULT

After implementing these enhancements, the form will:

1. **Feel Responsive** — Every interaction has clear visual feedback
2. **Look Premium** — Subtle animations and glows create polish
3. **Stay On-Brand** — Maintains cyberpunk terminal aesthetic throughout
4. **Be Accessible** — Works with keyboard, screen readers, and mobile
5. **Guide Users** — Clear error states prevent submission mistakes
6. **Build Trust** — Professional polish increases conversion rates

---

## TESTING SCRIPT

Test these scenarios after implementation:

1. **Focus States:** Tab through form — each input should show clear focus
2. **Typing:** Start typing in each field — cursor should blink, background should glow
3. **Validation:** Submit empty form — errors should appear with animations
4. **Correction:** Fix an error — error message should fade out smoothly
5. **Character Count:** Type in message field — counter should update
6. **Submission:** Submit valid form — button shows loading, then success state
7. **Mobile:** Test on 375px width — all targets are tappable, no zoom on focus
8. **Keyboard:** Navigate entire form with Tab + Enter only
9. **Screen Reader:** Test with VoiceOver/NVDA — errors are announced

---

**END OF ENHANCEMENT PROMPT**

Use this as a reference when implementing the Contact form improvements. All enhancements should preserve the existing cyberpunk terminal aesthetic while adding premium interactive polish.
