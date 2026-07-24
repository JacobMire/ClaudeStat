# Claude Usage Monitor 📈

A premium, privacy-first, zero-dependency Chrome Extension for monitoring Claude.ai token utilization and model limits. Built strictly to Manifest V3 standards.

## Features

- **Live Usage Tracking:** Accurately track your global Claude.ai utilization percentage.
- **Model Breakdown:** View granular usage and reset times for individual models (Opus, Sonnet, Haiku).
- **Auto-Discovery:** Automatically detects your active Organization ID directly from your session. No configuration required.
- **Privacy-First:** Communicates directly with \`claude.ai\`. No telemetry, no third-party servers, no injected scripts. Your session cookies never leave your browser.
- **Premium UI:** Hardware-accelerated animations, Apple/Linear-inspired glassmorphism, responsive SVG data visualizations, and robust Dark/Light mode support.
- **Offline & Cached Modes:** Intelligently caches your usage. If Claude is unreachable, you still get instant access to your last known data.

## Installation

1. Clone or download this repository.
2. Open Chrome or Brave and navigate to \`chrome://extensions\`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the \`claude-dash\` directory.
5. Click the extension icon in your toolbar to view your usage. (You must be logged into claude.ai).

## Project Architecture

This extension is built for long-term maintainability without the overhead of build tools (Webpack/Vite) or npm dependencies. It relies entirely on native ES Modules, CSS Custom Properties, and vanilla DOM APIs.

Read the detailed [Architecture Documentation](./docs/ARCHITECTURE.md) to understand the strict separation of concerns between the UI Presentation layer and the Service Worker Network layer.

## Documentation Index

- [Developer Guide](./docs/DEVELOPER_GUIDE.md): Getting started with the codebase.
- [Testing Guide](./docs/TESTING_GUIDE.md): How to test the data layer and UI.
- [Troubleshooting](./docs/TROUBLESHOOTING.md): Common issues and fixes.
- [Message Flow](./docs/MESSAGE_FLOW.md): How the Popup and Service Worker communicate.
- [Storage Schema](./docs/STORAGE_SCHEMA.md): Documentation of \`chrome.storage.local\` usage.
- [API Normalization](./docs/API_NORMALIZATION.md): How undocumented Anthropic payloads are stabilized.

## Security

This extension requires the \`host_permissions\` scope for \`https://claude.ai/api/*\`. It uses standard \`credentials: 'include'\` in the \`fetch\` API to piggyback on your existing browser session. It does not extract, read, or store your auth tokens.

## License
MIT
