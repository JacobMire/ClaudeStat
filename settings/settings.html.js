/**
 * @fileoverview Settings UI template with premium styling.
 */

export function getSettingsHtml(version) {
  return `
    <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 16px; padding-bottom: 24px;">
      
      <div class="card" style="padding: 16px;">
        <h3 style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.04em;">Appearance</h3>
        
        <!-- Theme Selection -->
        <div style="margin-bottom: 16px;">
          <label for="select-theme" style="display: block; font-size: 13px; margin-bottom: 8px; color: var(--text-secondary);">Theme</label>
          <div style="position: relative;">
            <select id="select-theme" style="width: 100%; padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg-surface-elevated); color: var(--text-primary); font-family: inherit; font-size: 13px; appearance: none; cursor: pointer; box-shadow: var(--shadow-sm);">
              <option value="system">System Default</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
            <svg style="position: absolute; right: 12px; top: 12px; pointer-events: none; color: var(--text-tertiary);" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        <!-- Animation Toggle -->
        <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; font-size: 13px; color: var(--text-secondary);">
          Enable Animations
          <input type="checkbox" id="toggle-animations" style="accent-color: var(--accent); width: 16px; height: 16px; cursor: pointer;" aria-label="Toggle interface animations">
        </label>
      </div>

      <div class="card" style="padding: 16px;">
        <h3 style="font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.04em;">Data</h3>
        
        <!-- Organization ID -->
        <div style="margin-bottom: 16px;">
          <label for="input-org-id" style="display: block; font-size: 13px; margin-bottom: 8px; color: var(--text-secondary);">Organization ID Override</label>
          <input type="text" id="input-org-id" placeholder="Leave blank to auto-discover" style="width: 100%; padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg-surface-elevated); color: var(--text-primary); font-family: var(--font-family-mono); font-size: 12px; margin-bottom: 6px; box-shadow: var(--shadow-sm);">
          <p style="font-size: 12px; color: var(--text-tertiary); line-height: 1.4;">Leave blank for automatic discovery.</p>
        </div>

        <!-- Cache Management -->
        <button id="btn-clear-cache" style="width: 100%; padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--bg-surface-elevated); color: var(--error); cursor: pointer; font-weight: 600; font-size: 13px; transition: background 150ms ease;">Clear Cached Data</button>
      </div>
      
      <div style="flex-grow: 1;"></div>
      
      <!-- About / Footer -->
      <footer style="text-align: center; color: var(--text-tertiary); font-size: 11px; margin-top: 16px;">
        <div style="font-weight: 600; margin-bottom: 4px; color: var(--text-secondary);">Claude Usage Monitor</div>
        <div>Version ${version}</div>
      </footer>
    </div>
  `;
}
