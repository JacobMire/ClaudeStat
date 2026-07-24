# API Normalization

Because `claude.ai/api/organizations/{orgId}/usage` is an undocumented, internal endpoint, its structure is subject to change without notice.

## The Normalizer Pattern

To insulate the UI from these changes, `lib/api/normalizer.js` intercepts all raw API responses.

1. **Defensive Extraction:** It does not assume fixed JSON paths. It uses recursive searches (e.g., `_findDeep`) to locate keys like `utilization_pct` or `resets_at` anywhere in the payload.
2. **Canonical Mapping:** It maps these raw, unpredictable values into a strictly typed `UsageData` object defined in `lib/models/usage.js`.
3. **UI Contract:** The Presentation layer (`popup.js`, `renderer.js`) **only** consumes the canonical `UsageData` object. It never touches raw API properties.

If Anthropic changes their API shape, we only need to update `normalizer.js`. The rest of the application remains untouched.
