# Troubleshooting Guide

## Common Issues

### 1. "Authentication Required" or 401/403 Errors
**Symptom:** The popup shows a login prompt or a red authentication error.
**Cause:** The browser extension does not have an active session with \`claude.ai\`.
**Fix:** 
1. Open a new tab and navigate to \`https://claude.ai\`.
2. Log in with your account.
3. Once the Claude interface loads, open the extension popup again.

### 2. "Offline Mode" or Network Errors
**Symptom:** The extension fails to load new data and displays a network error icon.
**Cause:** 
- You are not connected to the internet.
- A strict ad-blocker or firewall is preventing the Service Worker from reaching \`claude.ai\`.
**Fix:**
- Check your internet connection.
- If you use uBlock Origin or similar network blockers, ensure they are not blocking \`https://claude.ai/api/*\` for background extensions.

### 3. Usage stuck at an old percentage
**Symptom:** The popup opens instantly, but the data is from an hour ago.
**Cause:** 
- The cache TTL (Time To Live) is usually 5 minutes. If it's been less than 5 minutes, it serves from cache to prevent API rate limiting.
**Fix:**
- Click the **Refresh** icon in the top right of the popup toolbar to force a hard fetch.
- Alternatively, go to Settings -> **Clear Cached Data**.

### 4. Auto-Discovery Failed
**Symptom:** The extension shows 0% usage or fails to find an organization.
**Cause:** Anthropic may have changed their undocumented \`/api/organizations\` endpoint.
**Fix:**
1. Log into \`claude.ai\`.
2. Open Chrome Developer Tools (F12) -> Network tab.
3. Filter by \`Fetch/XHR\` and look for a request to \`usage\`.
4. The URL will look like \`/api/organizations/{UUID}/usage\`. Copy that \`{UUID}\`.
5. Open the Extension Settings and paste the UUID into the **Organization ID Override** input field.

### 5. High CPU usage while popup is open
**Symptom:** Laptops fans spin up when the popup is left open.
**Cause:** The SVG animations and JS counter loops might consume resources on older hardware.
**Fix:**
- Open Extension Settings -> Uncheck **Enable Animations**. This applies the \`.reduced-motion\` class and bypasses all \`requestAnimationFrame\` loops and CSS transitions.
