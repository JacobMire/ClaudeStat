# Testing Guide

Because this extension uses zero build tools, testing is performed differently than a standard Node.js project.

## 1. Manual E2E Testing (Browser)
The primary method of testing is loading the unpacked extension into Chrome.
1. Go to \`chrome://extensions\`.
2. Click **Load Unpacked**.
3. Inspect the popup UI.

To debug the Service Worker:
1. In \`chrome://extensions\`, click the **"service worker"** link on the extension card.
2. This opens a dedicated DevTools window for the background script.
3. You can view \`logger.info\` statements here.

## 2. Simulated Network Testing (Mock Mode)
You don't want to spam the actual Claude.ai endpoint while testing UI layouts or normalizer logic.

To enable Mock Mode:
1. Open \`lib/utils/constants.js\`.
2. Change \`export const MOCK_MODE = false;\` to \`true\`.
3. Reload the extension in \`chrome://extensions\`.
4. The extension will now intercept all fetches to \`https://claude.ai/api/*\` and serve the static JSON payload generated in \`lib/api/mock.js\`.

## 3. Headless Data Layer Testing (Node.js)
If you need to rapidly iterate on the \`usageRepository.js\` logic or the \`normalizer.js\` mapping without opening a browser, you can run the isolated test harness.

1. Ensure you have Node.js v18+ installed.
2. Run \`node tests/test-data-layer.js\` from the root directory.
3. This script polyfills the \`chrome.storage.local\` and \`fetch\` globals, tests caching, stale data invalidation, and mock API normalization, and exits with code \`0\` if successful.
