# Palette's Journal - SMPN 3 BESUKI - Jurnal & Laporan Wali Kelas

## 2026-10-24 - File Upload Keyboard Accessibility
**Learning:** Standard hidden file input fields (`class="hidden"`) prevent screen-reader access and keyboard navigation. Using Tailwind CSS's `sr-only` class makes the file input visually hidden but fully focusable by screen readers and keyboard users. When using `sr-only`, wrapping parent elements or labels must use `focus-within` styling to reveal visual prompts to keyboard users.
**Action:** Replace `hidden` with `sr-only` on interactive file inputs and add `focus-within:ring-4 focus-within:ring-amber-300` plus `group-focus-within:opacity-100` on enclosing avatar elements to ensure complete keyboard navigability.
