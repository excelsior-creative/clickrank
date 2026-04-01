```markdown
# Design System Documentation: The Editorial Authority

## 1. Overview & Creative North Star

### Creative North Star: "The Digital Curator"
This design system moves away from the cluttered, ad-heavy aesthetic of traditional review sites. Instead, it adopts the persona of a **Digital Curator**: a high-end, data-driven editorial platform that values precision over volume. The "Digital Curator" doesn't just list specs; it presents them as an authoritative intelligence report.

To achieve this, the system breaks the "template" look through:
*   **Intentional Asymmetry:** Using unbalanced columns (e.g., a wide 8-column review body paired with a 3-column "floating" data sidebar) to create an editorial feel.
*   **Overlapping Intelligence:** Data visualizations and "score chips" occasionally overlap container boundaries to suggest a layered, multi-dimensional depth.
*   **High-Contrast Typography:** Utilizing massive `display-lg` headlines against precise `label-sm` technical metadata to establish immediate hierarchy.

## 2. Colors & Surface Philosophy

The palette is rooted in deep, authoritative Navys (`#0B0E23`) and high-performance Teals (`#07B08B`). We treat color as a carrier of information, not just decoration.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning content. Boundaries must be defined solely through background color shifts. Use `surface-container-low` for large section backgrounds and `surface-container-lowest` for the main body to create organic separation.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, premium materials. 
*   **Level 0 (Base):** `surface` (#fbf8ff)
*   **Level 1 (Sectioning):** `surface-container-low` (#f4f2ff) – Use for "The Verdict" or "Pros/Cons" sections.
*   **Level 2 (Active Components):** `surface-container-highest` (#dfe0fe) – Use for interactive data cards or search inputs.

### The "Glass & Gradient" Rule
To avoid a "flat" SaaS appearance:
*   **Glassmorphism:** Use semi-transparent `surface` colors with a `backdrop-blur` of 12px–20px for floating navigation bars or "Compare" drawers. 
*   **Signature Textures:** Apply a subtle linear gradient from `primary` (#006b54) to `primary_container` (#07b08b) at a 135-degree angle for primary CTAs. This creates a "machined" metallic sheen that feels professional and intentional.

## 3. Typography

The typography strategy pairs **Manrope** (Display/Headlines) for a modern, geometric authority with **Inter** (Body/Labels) for maximum legibility in data-heavy contexts.

*   **Display & Headline (Manrope):** These are your "Statement" tiers. Use `display-lg` for product names in reviews. The geometric nature of Manrope suggests technical precision.
*   **Title & Body (Inter):** Inter’s high x-height ensures that long-form reviews remain readable even at `body-md` (#0.875rem). 
*   **Label (Inter):** Use `label-md` and `label-sm` for data points (e.g., "CPU Clock Speed"). Always use `on-surface-variant` (#3c4a44) for labels to create a clear visual distinction from the primary data value.

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than traditional drop shadows or lines.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a "lifted" effect through color contrast alone.
*   **Ambient Shadows:** For high-priority floating elements (like a "Buy Now" sticky bar), use a shadow with a blur of 40px and 6% opacity, tinted with `on-surface` (#171a2f). This mimics a soft, natural light source.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility in input fields, use `outline-variant` (#bbcac2) at **20% opacity**. Never use 100% opaque borders.
*   **Integrated Glass:** When using glass components, ensure the `surface-tint` (#006b54) is applied at 2% opacity to the background of the glass to maintain brand cohesion within the blur.

## 5. Components

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `xl` (0.75rem) roundedness, no border. White text.
*   **Secondary:** `surface-container-highest` background with `on-secondary-container` text.
*   **Tertiary:** No background. Text-only with `primary` color. Use for low-emphasis actions like "Read More."

### Cards & Review Lists
*   **Rule:** Forbid divider lines.
*   **Implementation:** Use `10` (2.5rem) or `12` (3rem) spacing from the scale to separate list items. Use a subtle `surface-container-low` background on hover to define the interactive area.

### Chips (Data Tags)
*   **Rating Chips:** Use `primary` background for scores 8.0+. Use `tertiary` for mid-range. 
*   **Style:** `full` (9999px) roundedness, `label-md` typography, and high-contrast text.

### Inputs & Search
*   **Style:** `surface-container-high` background, `md` (0.375rem) roundedness. 
*   **Focus State:** A 2px "Ghost Border" using `primary` at 40% opacity.

### Specialized Component: The "Data Grid"
For product comparisons, use a grid where the first column is fixed. Instead of vertical lines, use alternating row colors (`surface` and `surface-container-lowest`) to guide the eye horizontally.

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a structural element. A `24` (6rem) gap between major editorial sections is encouraged.
*   **DO** use `primary_fixed_dim` for subtle highlights in technical charts.
*   **DO** ensure all data visualizations (graphs/meters) utilize the `primary` and `secondary` color tokens for consistency.

### Don't
*   **DON'T** use pure black (#000000) for text. Use `on-surface` (#171a2f) to maintain a premium, ink-on-paper feel.
*   **DON'T** use standard 1px borders to separate "Pros" and "Cons." Use two distinct surface-color containers side-by-side.
*   **DON'T** use sharp corners. Stick to the `md` to `xl` roundedness scale to keep the interface feeling modern and approachable.