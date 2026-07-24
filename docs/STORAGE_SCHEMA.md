# Storage Schema

The extension uses `chrome.storage.local` to persist data.

## Cache (`usage_cache`)
Stores the most recently fetched and normalized usage data.

```typescript
{
  "orgId": string,
  "orgName": string,
  "utilizationPct": number, // 0-100
  "resetAt": string, // ISO 8601
  "models": Array<{ modelId: string, displayName: string, utilizationPct: number, resetAt: string }>,
  "fetchedAt": number, // Epoch MS
  "schemaVersion": number
}
```

## Settings (`settings`)
Stores user preferences.

```typescript
{
  "orgId": string | null, // null triggers auto-discovery
  "theme": "dark" | "light" | "system",
  "animationsEnabled": boolean,
  "schemaVersion": number
}
```
