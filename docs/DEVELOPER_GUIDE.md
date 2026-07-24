# Developer Guide

Welcome to the Claude Usage Monitor source code! This project is intentionally built with **Zero Dependencies**. There is no Webpack, Vite, Babel, TypeScript compiler, or \`node_modules\` folder required.

## Core Philosophy
1. **ES Modules Only:** All JS files are standard ES Modules. When importing, you **must** include the \`.js\` extension (e.g., \`import { logger } from '../utils/logger.js';\`) because the browser evaluates them natively.
2. **Vanilla DOM:** We do not use React, Vue, or Svelte. Rendering is handled via template literals in \`renderer.js\`. This keeps the popup payload under 30KB and ensures instant boot times.
3. **Strict Separation of Concerns:** 
   - \`/popup\`: Only handles DOM, events, and CSS.
   - \`/service-worker\`: Only handles \`fetch()\` and network timeouts.
   - \`/lib\`: Contains shared logic, storage abstractions, and the crucial \`usageRepository.js\` which coordinates everything.

## Adding a New Feature

### 1. Adding a new Settings option
1. Open \`settings/settings.html.js\` and add the HTML input element.
2. Open \`lib/utils/constants.js\` and add the new default value to \`DEFAULT_SETTINGS\`.
3. Open \`settings/settings.js\`, wire up the \`addEventListener\`, and call \`updateSettings({ newKey: value })\`.

### 2. Modifying the API Payload
If Anthropic changes the structure of their usage endpoint:
1. You **only** need to modify \`lib/api/normalizer.js\`.
2. The entire UI consumes the canonical \`UsageData\` interface defined in \`lib/models/usage.js\`. As long as \`normalizer.js\` maps the raw JSON back into that shape, the UI will not break.

## Error Handling
Never use \`console.error\` directly in production logic. Instead:
1. Import \`ErrorFactory\` from \`lib/utils/errors.js\`.
2. Throw typed errors: \`throw ErrorFactory.network('Request failed');\`
3. Let the global boundary in \`popup.js\` or \`messageHandler.js\` catch and route the error to the UI.

## CSS Guidelines
- Do not hardcode hex colors. Always use the \`var(--...)\` design tokens defined in \`popup.css\`.
- All sizing should adhere to an 8px grid system (4, 8, 12, 16, 24, 32).
- Ensure any new animations respect \`@media (prefers-reduced-motion: reduce)\` and the \`body.reduced-motion\` override class.
