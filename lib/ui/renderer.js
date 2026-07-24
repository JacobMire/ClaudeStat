/**
 * @fileoverview Orchestrates premium DOM rendering.
 */

import { getSkeletonHtml } from './skeleton.js';
import { getErrorHtml } from './errors.js';
import { formatDuration, getMsRemaining } from '../utils/time.js';

export function setContentState(state) {
  const ids = ['view-skeleton', 'view-error', 'view-usage'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === `view-${state}`) {
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  });
}

export function renderSkeleton() {
  const el = document.getElementById('view-skeleton');
  if (el) el.innerHTML = getSkeletonHtml();
}

export function renderError(error, cachedData) {
  const errContainer = document.getElementById('view-error');
  if (!errContainer) return;
  
  if (cachedData) {
    errContainer.innerHTML = ''; 
    renderUsage(cachedData, error); 
    setContentState('usage');
  } else {
    errContainer.innerHTML = getErrorHtml(error, false);
    setContentState('error');
  }
}

export function renderUsage(data, networkError = null, isUpdate = false) {
  const container = document.getElementById('view-usage');
  if (!container) return;
  
  let badgeHtml = '';
  if (networkError) {
    badgeHtml = `<span class="badge badge-stale" style="background: var(--bg-surface-hover); color: var(--text-secondary);">Offline</span>`;
  } else if (data.isStale) {
    badgeHtml = `<span class="badge badge-stale">Cached</span>`;
  }

  // 5-Hour Limit Calculations
  const fiveHourMs = getMsRemaining(data.fiveHourResetAt);
  const fiveHourStr = formatDuration(fiveHourMs);
  const fivePct = Math.round(data.fiveHourPct);
  const isFiveHigh = fivePct >= 90;

  // Weekly Limit Calculations
  const weeklyMs = getMsRemaining(data.weeklyResetAt);
  const weeklyStr = formatDuration(weeklyMs);
  const weeklyPct = Math.round(data.weeklyPct);
  const isWeeklyHigh = weeklyPct >= 90;

  const anim1 = isUpdate ? '' : 'animate-enter';
  const anim2 = isUpdate ? '' : 'animate-enter animate-enter-delay-1';

  const html = `
    <!-- Session Limit Card (5-Hour) -->
    <div class="card ${anim1}">
      <div class="card-header">
        <div class="card-title">Session Limit (5-Hour)</div>
        ${badgeHtml}
      </div>
      
      <div class="hero-val ${isFiveHigh ? 'warning' : ''}">
        <span class="count-up" data-target="${fivePct}">0%</span>
      </div>
      <div class="hero-sub">
        Resets in <strong class="model-timer" data-reset="${data.fiveHourResetAt || ''}">${fiveHourStr}</strong>
      </div>
      
      <div class="track">
        <div class="track-fill ${isFiveHigh ? 'warning' : ''}" style="width: 0%; --target-width: ${fivePct}%; ${isUpdate ? `width: ${fivePct}%;` : `animation: fillWidth 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;`}"></div>
      </div>
    </div>

    <!-- Weekly Limit Card (7-Day) -->
    <div class="card ${anim2}" style="margin-top: 16px;">
      <div class="card-header">
        <div class="card-title">Weekly Limit (7-Day)</div>
      </div>
      
      <div class="hero-val ${isWeeklyHigh ? 'warning' : ''}">
        <span class="count-up" data-target="${weeklyPct}">0%</span>
      </div>
      <div class="hero-sub">
        Resets in <strong class="model-timer" data-reset="${data.weeklyResetAt || ''}">${weeklyStr}</strong>
      </div>
      
      <div class="track track-weekly">
        <div class="track-fill ${isWeeklyHigh ? 'warning' : ''}" style="width: 0%; --target-width: ${weeklyPct}%; ${isUpdate ? `width: ${weeklyPct}%;` : `animation: fillWidth 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;`}"></div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}
