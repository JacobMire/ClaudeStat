import { fetchAndNormalizeUsage } from '../lib/repository/usageRepository.js';
import { getUsageCache } from '../lib/storage/cache.js';

// Polyfill global browser environment
global.chrome = {
  storage: {
    local: {
      data: {},
      async get(key) { return { [key]: this.data[key] }; },
      async set(obj) { Object.assign(this.data, obj); },
      async remove(key) { delete this.data[key]; }
    }
  }
};
global.fetch = async (url) => {
  throw new Error('Should have been intercepted by MOCK_MODE');
};
global.AbortController = class AbortController {
  abort() {}
  signal = {};
};

async function runTests() {
  console.log('--- Starting Data Layer Tests ---');
  
  // 1. Initial Fetch
  const data = await fetchAndNormalizeUsage();
  console.log('Normalized Data from MOCK API:');
  console.log(data);

  if (data.utilizationPct !== 65.4) throw new Error('Normalization failed on pct');
  if (data.orgId !== 'org-1234-5678') throw new Error('Auto-discovery failed on orgId');

  // 2. Cache read
  const cache = await getUsageCache();
  console.log('Cache status:', cache ? 'Hit' : 'Miss');
  if (!cache) throw new Error('Cache was not populated');
  if (cache.isStale) throw new Error('New cache should not be stale');

  // 3. Stale logic test
  // Manipulate the cache to make it old
  global.chrome.storage.local.data['usage_cache'].fetchedAt = Date.now() - (600000); // 10 minutes ago
  
  const staleCache = await getUsageCache();
  if (!staleCache.isStale) throw new Error('Cache should be marked as stale');
  
  console.log('--- All tests passed! ---');
}

runTests().catch(e => {
  console.error(e);
  process.exit(1);
});
