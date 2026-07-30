# Palette Journal - UX & Accessibility Learnings

## 2026-03-31 - Keyboard Accessibility for File Uploads and Icon-Only Buttons
**Learning:** Using `class="hidden"` on file input elements breaks standard keyboard navigation since elements are hidden from the DOM tab order. Utilizing Tailwind's `sr-only` keeps the input in the document flow, making it accessible to screen readers and tab navigation. Furthermore, icon-only buttons need explicit `aria-label` tags and focus-visible outlines for screen-reader users and visual keyboard cues.
**Action:** Always replace `hidden` with `sr-only` on interactive file inputs, use parent containers with `focus-within:ring` and group labels with `group-focus-within` for seamless keyboard-friendly custom visual designs, and ensure all icon-only buttons have descriptive `aria-label` attributes.
