# Message Flow

The extension relies on `chrome.runtime.sendMessage` because Manifest V3 popups are ephemeral and cross-origin fetches for credentials often work better in the Service Worker context.

## Fetching Usage Data

1. User opens the popup.
2. `popup.js` attempts to load cached data via `cache.js`.
3. Concurrently, `popup.js` sends `{ action: 'FETCH_USAGE' }` to the Service Worker.
4. `messageHandler.js` in the Service Worker receives the message.
5. It calls `usageRepository.fetchAndNormalizeUsage()`.
6. The repository checks settings, auto-discovers org ID if needed, fetches the API, normalizes the data, and updates the cache.
7. The normalized data is returned via `sendResponse` back to `popup.js`.
8. `popup.js` renders the fresh data.
