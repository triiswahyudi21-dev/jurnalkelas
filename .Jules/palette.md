# Palette Journal

## 2026-03-01 - Keyboard Accessibility & Semantic Association for Form Fields
**Learning:** In a single-page school admin dashboard, using `hidden` on critical interactive file inputs (like avatar uploads) completely breaks keyboard navigation and screen reader support. Replacing it with Tailwind's `sr-only` coupled with a `focus-within` trigger ensures keyboard users can access the upload interface. Additionally, explicitly associating `label` elements with their inputs using `for` and `id` is crucial for screen readers to convey context correctly.
**Action:** Replace `hidden` with `sr-only` on file inputs, add `focus-within:` and `group-focus-within:` classes to reveal hidden focus overlays, associate labels with form controls, and add `aria-label` to icon-only buttons.
