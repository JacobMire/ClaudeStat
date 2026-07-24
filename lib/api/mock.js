/**
 * @fileoverview Mock data generation for Phase 2 testing.
 */

import { API_PATHS } from '../utils/constants.js';

export function getMockResponse(url) {
  if (url.includes('/usage')) {
    // Generate a pseudo-random but somewhat realistic response
    // based on Claude's internal usage endpoint patterns
    
    // Calculate a resets_at time 3 hours from now
    const resetsAt = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
    
    return {
      org_name: 'Mock Organization',
      utilization_pct: 65.4,
      resets_at: resetsAt,
      models: [
        {
          id: 'claude-3-opus-20240229',
          name: 'Claude 3 Opus',
          utilization_pct: 82.1,
          reset_at: resetsAt
        },
        {
          id: 'claude-3-sonnet-20240229',
          name: 'Claude 3 Sonnet',
          utilization_pct: 12.5,
          reset_at: resetsAt
        }
      ]
    };
  }

  if (url.includes(API_PATHS.ORGANIZATIONS)) {
    return [
      {
        uuid: 'org-1234-5678',
        name: 'Mock Organization',
        settings: {}
      },
      {
        uuid: 'org-abcd-efgh',
        name: 'Another Org',
        settings: {}
      }
    ];
  }

  if (url.includes('/usage')) {
    // Generate a pseudo-random but somewhat realistic response
    // based on Claude's internal usage endpoint patterns
    
    // Calculate a resets_at time 3 hours from now
    const resetsAt = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();
    
    return {
      org_name: 'Mock Organization',
      utilization_pct: 65.4,
      resets_at: resetsAt,
      models: [
        {
          id: 'claude-3-opus-20240229',
          name: 'Claude 3 Opus',
          utilization_pct: 82.1,
          reset_at: resetsAt
        },
        {
          id: 'claude-3-sonnet-20240229',
          name: 'Claude 3 Sonnet',
          utilization_pct: 12.5,
          reset_at: resetsAt
        }
      ]
    };
  }

  throw new Error(`Mock handler not found for URL: ${url}`);
}
