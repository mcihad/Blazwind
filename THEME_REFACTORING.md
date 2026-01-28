# Theme Refactoring Guide: Moving to Atomic Architecture

> **Objective:** Refactor the Blazwind theming system to reduce CSS repetition and improve maintainability by adopting an Atomic (Utility-First) architecture, while preserving full compatibility with the Theme Designer engine.

---

## 1. The Problem: "CSS Repetition" vs "Theme Architecture"

### Current State
Our current architecture is **Component-Based**. We define specific classes for every element:

```css
/* component.css (Repeated hundreds of times) */
.bw-card {
    background-color: var(--bw-color-surface); /* Repetition */
    border-radius: var(--bw-radius-md);       /* Repetition */
    padding: var(--bw-spacing-4);             /* Repetition */
}

.bw-modal {
    background-color: var(--bw-color-surface); /* Repetition */
    border-radius: var(--bw-radius-md);       /* Repetition */
}
```

This leads to:
1.  **Bloated CSS:** The same `var(--bw-...)` references are compiled thousands of times.
2.  **Maintenance Overhead:** Changing "default radius" requires checking every component file.

### Target State (Atomic)
We want to move to **Utility-Based** classes that reference the theme variables **once**:

```css
/* utilities.css (Defined once) */
.bw-bg-surface { background-color: var(--bw-color-surface); }
.bw-radius-md  { border-radius: var(--bw-radius-md); }
.bw-p-4        { padding: var(--bw-spacing-4); }
```

usage in Razor:
```html
<div class="bw-card bw-bg-surface bw-radius-md bw-p-4">...</div>
```

---

## 2. Architecture for Online Theme Designer

**crucial:** The "Online Designer" functionality relies on **CSS Variables**, not on how classes are named.

*   **Designer View:** Updates `--bw-color-primary: #ff0000;`
*   **Old System:** `.bw-btn-primary` reads the variable → Button turns red.
*   **New System:** `.bw-bg-primary` reads the variable → Button turns red.

**Conclusion:** Refactoring to atomic classes **does NOT break** the designer capability. It makes the underlying engine more efficient.

---

## 3. Refactoring Roadmap

### Phase 1: Create `utilities.css`

Create a new file `src/Blazwind.Components/frontend/src/styles/utilities.css` and define atomic classes mapped to theme tokens.

#### Naming Convention
Formula: `.bw-{property}-{token suffix}`

| Category | CSS Property | Token Variable | Class Name |
| :--- | :--- | :--- | :--- |
| **Colors** | `color` | `--bw-color-{name}` | `.bw-text-{name}` |
| **Backgrounds** | `background-color` | `--bw-color-{name}` | `.bw-bg-{name}` |
| **Borders** | `border-color` | `--bw-color-{name}` | `.bw-border-{name}` |
| **Radius** | `border-radius` | `--bw-radius-{size}` | `.bw-radius-{size}` |
| **Shadow** | `box-shadow` | `--bw-shadow-{size}` | `.bw-shadow-{size}` |
| **Spacing** | `padding/margin` | `--bw-spacing-{size}` | `.bw-p-{size}`, `.bw-m-{size}` |

#### Example Implementation

```css
/* utilities.css */

/* Backgrounds */
.bw-bg-primary   { background-color: var(--bw-color-primary); }
.bw-bg-surface   { background-color: var(--bw-color-surface); }
.bw-bg-success   { background-color: var(--bw-color-success); }

/* Text Colors */
.bw-text-primary { color: var(--bw-color-primary); }
.bw-text-muted   { color: var(--bw-color-text-muted); }

/* Radius */
.bw-radius-sm    { border-radius: var(--bw-radius-sm); }
.bw-radius-md    { border-radius: var(--bw-radius-md); }
.bw-radius-full  { border-radius: var(--bw-radius-full); }

/* Shadows */
.bw-shadow-sm    { box-shadow: var(--bw-shadow-sm); }
.bw-shadow-lg    { box-shadow: var(--bw-shadow-lg); }
```

### Phase 2: Refactor Components

Iterate through existing components and replace repetitive CSS properties with Razor-level utility classes.

#### Example: Card Component

**Before (Razor):**
```razor
<div class="bw-card">
    @ChildContent
</div>
```

**Before (CSS - card.css):**
```css
.bw-card {
    background-color: var(--bw-color-surface); /* Delete */
    border: 1px solid var(--bw-color-border);  /* Delete */
    border-radius: var(--bw-radius-md);        /* Delete */
    box-shadow: var(--bw-shadow-sm);           /* Delete */
    padding: var(--bw-spacing-4);              /* Keep layout specific styles if needed */
}
```

**After (Razor):**
```razor
<div class="bw-card bw-bg-surface bw-border bw-border-default bw-radius-md bw-shadow-sm bw-p-4">
    @ChildContent
</div>
```

**After (CSS - card.css):**
```css
/* Only layout/behavioral styles remain */
.bw-card {
    display: block;
    position: relative;
}
```

---

## 4. Guidelines & Rules

### ✅ Do
1.  **Use `utilities.css` for Theme Tokens:** If a style uses `var(--bw-...)`, it belongs in a utility class.
2.  **Keep Layout in Component CSS:** Complex layout logic (Grid, Flex alignment, strictly specific widths/heights) can remain in component CSS if it doesn't map to a generic token.
3.  **Use `CombineClasses`:** When refactoring Razor files, ensure you merge the new atomic classes with any user-provided classes.

### ❌ Don't
1.  **Don't Hardcode Colors:** Never use `.bw-bg-red` (referencing hex). Always use `.bw-bg-danger` (referencing theme variable).
2.  **Don't Mix Approaches:** Don't use `bw-bg-primary` in one part of a component and `background-color: var(...)` in `style.css` for the same element. Be consistent.

---

## 5. Verification Checklist

- [ ] `utilities.css` created and imported in main `style.css`.
- [ ] Atomic classes map **strictly** to `blazwind.css` variables.
- [ ] Refactored component looks identical to the old version.
- [ ] Theme switching (Light/Dark/Ocean) still works instantly.
