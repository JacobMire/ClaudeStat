/**
 * @fileoverview Returns HTML string for the loading skeleton state.
 */

export function getSkeletonHtml() {
  const shimmerStyle = `background: linear-gradient(90deg, var(--bg-surface-hover) 25%, var(--border-subtle) 50%, var(--bg-surface-hover) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite linear;`;
  
  return `
    <div class="card animate-enter">
      <div class="card-header">
        <div style="width: 80px; height: 14px; border-radius: var(--radius-sm); ${shimmerStyle}"></div>
        <div style="width: 40px; height: 14px; border-radius: var(--radius-sm); ${shimmerStyle}"></div>
      </div>
      <div style="width: 120px; height: 42px; border-radius: var(--radius-md); margin-bottom: 8px; ${shimmerStyle}"></div>
      <div style="width: 160px; height: 14px; border-radius: var(--radius-sm); ${shimmerStyle}"></div>
      <div class="track" style="margin-top: 24px; ${shimmerStyle}"></div>
    </div>

    <div class="card animate-enter animate-enter-delay-1">
      <div class="card-header" style="margin-bottom: 16px;">
        <div style="width: 100px; height: 14px; border-radius: var(--radius-sm); ${shimmerStyle}"></div>
      </div>
      <div class="model-list">
        ${[1, 2].map(() => `
          <div class="model-item">
            <div class="model-info">
              <div style="width: 32px; height: 32px; border-radius: 50%; ${shimmerStyle}"></div>
              <div>
                <div style="width: 100px; height: 14px; border-radius: var(--radius-sm); margin-bottom: 6px; ${shimmerStyle}"></div>
                <div style="width: 60px; height: 12px; border-radius: var(--radius-sm); ${shimmerStyle}"></div>
              </div>
            </div>
            <div style="width: 30px; height: 14px; border-radius: var(--radius-sm); ${shimmerStyle}"></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
