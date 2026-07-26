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

export function renderUsage(data, networkError = null, isUpdate = false, analytics = null) {
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

  let html = `
    <!-- Session Limit Card (5-Hour) -->
    <div class="card ${anim1}">
      <div class="card-header">
        <div class="card-title">Session Limit (5-Hour)</div>
        ${badgeHtml}
      </div>
      
      <div class="hero-val" style="color: ${isFiveHigh ? 'var(--error)' : 'var(--text-primary)'}">
        <span class="count-up" data-target="${fivePct}">0%</span>
      </div>
      <div class="hero-sub">
        Resets in <strong class="model-timer" data-reset="${data.fiveHourResetAt || ''}" style="color: var(--text-primary);">${fiveHourStr}</strong>
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
      
      <div class="hero-val" style="color: ${isWeeklyHigh ? 'var(--error)' : 'var(--text-primary)'}">
        <span class="count-up" data-target="${weeklyPct}">0%</span>
      </div>
      <div class="hero-sub">
        Resets in <strong class="model-timer" data-reset="${data.weeklyResetAt || ''}" style="color: var(--text-primary);">${weeklyStr}</strong>
      </div>
      
      <div class="track track-weekly">
        <div class="track-fill ${isWeeklyHigh ? 'warning' : ''}" style="width: 0%; --target-width: ${weeklyPct}%; ${isUpdate ? `width: ${weeklyPct}%;` : `animation: fillWidth 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;`}"></div>
      </div>
    </div>
  `;

  // Analytics & Projections Card
  if (analytics && analytics.hasEnoughData) {
    const exhaustionStr = analytics.fiveHourExhaustionMs 
      ? `~ <strong>${formatDuration(analytics.fiveHourExhaustionMs)}</strong>`
      : 'Pacing well';
      
    html += `
    <div class="card ${anim2}" style="margin-top: 16px; background: var(--bg-surface-elevated);">
      <div class="card-header">
        <div class="card-title">Analytics & Projections</div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 13px;">
        <div style="color: var(--text-secondary);">Burn Rate:</div>
        <div style="color: var(--text-primary); font-weight: 500;">${analytics.burnRatePctPerHour.toFixed(1)}% / hr</div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 8px;">
        <div style="color: var(--text-secondary);">Session Impact:</div>
        <div style="color: var(--text-primary); font-weight: 500;">+${analytics.sessionImpactPct.toFixed(1)}% used</div>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-top: 8px;">
        <div style="color: var(--text-secondary);">Time until 100%:</div>
        <div style="color: ${analytics.fiveHourExhaustionMs ? 'var(--error)' : 'var(--success)'}; font-weight: 500;">${exhaustionStr}</div>
      </div>
    </div>
    `;
  }

  container.innerHTML = html;
}
