# AGENTS.md - Digital Agency Design System (HTML)

## What This Project Is

Framework-agnostic HTML/CSS/JavaScript component library for the Digital Agency Design System (DADS). Components work with or without CSS reset libraries and are designed to be directly modified.

**Philosophy:** Simple, customizable, retrofittable, accessibility-first.

## Project Structure

```
src/
├── components/    # UI components (.css, .html, .stories.ts, .test.js, .mdx)
├── docs/          # Documentation (MDX)
├── helpers/       # TypeScript utilities
└── global.css     # Design tokens
tests/helpers/     # Test utilities
```

## Commands

```bash
npm run storybook       # Dev server at localhost:6006
npm test                # Run all Playwright VRT tests
npm run format          # Format with Biome

# Single test
npx playwright test src/components/button/button.test.js
npx playwright test -g "Normalize.css"

# Update snapshots
npx playwright test --update-snapshots
```

## How to Work in This Codebase

### Before Writing Code

- Look at existing similar components to learn patterns (the codebase is the source of truth for style)
- Run `npm run format` after changes

### Key Conventions

- **CSS**: BEM with `dads-` prefix, data attributes for modifiers (e.g., `[data-type="solid-fill"]`)
- **JS**: Custom Elements without Shadow DOM, clean up listeners in `disconnectedCallback`
- **Units**: `rem` with `calc(px / 16 * 1rem)` pattern, `px` for borders only
- **Accessibility**: Target WCAG 2.2 AA, support forced-colors and reduced-motion

### Testing

Tests are visual regression tests (VRT) that verify components render identically across reset CSS libraries (Normalize.css, Bootstrap Reboot, Tailwind Preflight, Eric Meyer's Reset CSS, kiso.css).

```javascript
import path from "node:path";
import { resetCssVrt } from "../../../tests/helpers/reset-css-vrt";
const { dirname } = import.meta;

resetCssVrt("component-name", path.join(dirname, "component-name.html"));
```

## Reference Documentation

For detailed guidelines, read these files when relevant:

- `src/docs/development-policy.mdx` - Full development policy (CSS rules, JS patterns, accessibility)
- `src/docs/introduction.mdx` - Project introduction
- `src/components/*/` - Component examples (look at similar components before creating new ones)
