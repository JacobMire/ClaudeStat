# Architecture

The ClaudeStat extension is built as a Manifest V3 compliant Chrome extension. It strictly separates concerns into clearly defined modules.

## Key Principles
1. **Zero Build Tools:** The project uses plain ES Modules supported natively by modern browsers. No Webpack, Vite, or npm dependencies.
2. **Strict Manifest V3 Compliance:** Uses a background Service Worker for all network operations. The popup acts only as a presentation layer.
3. **No Background Polling:** The Service Worker only wakes up when the user clicks the toolbar icon to open the popup.

## Module Layers
1. **Presentation (Popup & Settings):** Pure HTML/CSS/JS that handles DOM manipulation, animations, and user interactions.
2. **Repository (`usageRepository.js`):** The orchestration layer. It handles caching strategies, triggers network requests, and coordinates data flow.
3. **API (`api/*.js`):** Handles HTTP communication with `claude.ai`. 
4. **Storage (`storage/*.js`):** Wrappers around `chrome.storage.local`.
5. **Utils:** Pure functions for time formatting, logging, and error mapping.
