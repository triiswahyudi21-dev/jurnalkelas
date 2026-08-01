## 2026-08-01 - Keyboard Focus Indicator for Hidden Inputs
**Learning:** Purely hiding an input file using CSS `hidden` or `display: none` completely removes it from the keyboard tab sequence. Replacing it with Tailwind's `sr-only` keeps it in the document flow and accessible to screen readers and keyboard navigation, but requires using the `focus-within:` utility on parents to make container focus states visible to the user.
**Action:** Replace `hidden` with `sr-only` for file inputs and use `focus-within:` classes to apply visual rings and transitions to adjacent containers or overlay text when focused.

## 2026-08-01 - Explicit Semantic Form Control Associations
**Learning:** Using implicit labels or headers instead of explicit label-to-input associations results in poor screen reader experience and lack of focus-shifting when clicking the label.
**Action:** Always link form controls with explicit label associations using matched `for` and `id` attributes.
