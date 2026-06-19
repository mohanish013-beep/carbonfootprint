// Dashboard Component - AeroCarbon
import { HABITS, calculateFootprint, store } from './state.js';

// Show toast alert
export function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'alert');
  
  const icon = type === 'success' ? '🌱' : '⚠️';
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  
  container.appendChild(toast);

  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s reverse';
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 2800);
}

// Generate the Interactive Eco-Sphere SVG
function getEcoSphereSVG(totalTons) {
  let gradientId, globeGradientStart, globeGradientEnd;
  let leavesPaths = '';
  let cloudPaths = '';
  let statusText = '';
  let statusDesc = '';

  if (totalTons < 4.0) {
    // Green/Teal Thriving Planet
    gradientId = 'greenGlobe';
    globeGradientStart = '#10B981';
    globeGradientEnd = '#059669';
    statusText = 'Lush & Thriving';
    statusDesc = 'Your footprint is within safe global limits. Keep protecting our atmosphere!';
    
    // Multiple thriving leaves and sparkles
    leavesPaths = `
      <!-- Leaves -->
      <path d="M70,75 C60,65 65,45 80,50 C80,65 75,75 70,75 Z" fill="#6EE7B7" transform="rotate(-15 70 75)" />
      <path d="M130,70 C140,60 145,45 130,45 C120,55 125,70 130,70 Z" fill="#34D399" transform="rotate(20 130 70)" />
      <path d="M85,120 C75,125 60,115 70,100 C80,105 85,115 85,120 Z" fill="#059669" />
      <path d="M115,125 C125,120 135,135 120,140 C110,135 110,125 115,125 Z" fill="#10B981" />
      <!-- Bird/Sparkle 1 -->
      <path d="M50,45 Q55,40 60,45 Q55,50 50,45" fill="#38BDF8" />
      <path d="M150,55 Q155,50 160,55 Q155,60 150,55" fill="#38BDF8" />
    `;
    // Pure clean white clouds
    cloudPaths = `
      <path d="M 40,80 A 12,12 0 0,1 60,70 A 15,15 0 0,1 85,75 A 12,12 0 0,1 85,90 Z" fill="rgba(255, 255, 255, 0.45)" />
      <path d="M 120,100 A 10,10 0 0,1 135,90 A 12,12 0 0,1 155,95 A 10,10 0 0,1 150,110 Z" fill="rgba(255, 255, 255, 0.35)" />
    `;
  } else if (totalTons < 9.0) {
    // Emerald/Amber Transitioning Planet
    gradientId = 'transitionGlobe';
    globeGradientStart = '#3B82F6';
    globeGradientEnd = '#10B981';
    statusText = 'Balanced Ecosystem';
    statusDesc = 'Your lifestyle has moderate impact. Reducing small actions can tip you to Green.';
    
    // Limited leaves
    leavesPaths = `
      <path d="M75,70 C68,62 70,50 82,53 C82,62 78,70 75,70 Z" fill="#34D399" transform="rotate(-10 75 70)" />
      <path d="M125,80 C132,73 138,62 127,62 C120,70 122,80 125,80 Z" fill="#10B981" transform="rotate(15 125 80)" />
    `;
    // Normal white clouds
    cloudPaths = `
      <path d="M 35,90 A 12,12 0 0,1 55,80 A 15,15 0 0,1 80,85 A 12,12 0 0,1 80,100 Z" fill="rgba(255, 255, 255, 0.3)" />
      <path d="M 130,95 A 10,10 0 0,1 145,85 A 12,12 0 0,1 165,90 A 10,10 0 0,1 160,105 Z" fill="rgba(255, 255, 255, 0.2)" />
    `;
  } else {
    // Red/Grey Distressed Planet
    gradientId = 'dustyGlobe';
    globeGradientStart = '#F59E0B';
    globeGradientEnd = '#EF4444';
    statusText = 'Distressed Sphere';
    statusDesc = 'High carbon emissions detected. Take direct reduction actions now.';

    // Zero leaves, replace with carbon particle circles & hazy clouds
    leavesPaths = `
      <!-- Carbon Particles / Smog -->
      <circle cx="65" cy="55" r="4" fill="#9CA3AF" opacity="0.6" />
      <circle cx="135" cy="50" r="5" fill="#4B5563" opacity="0.8" />
      <circle cx="150" cy="130" r="3" fill="#6B7280" opacity="0.5" />
      <circle cx="50" cy="115" r="4.5" fill="#374151" opacity="0.7" />
    `;
    // Hazy grey clouds
    cloudPaths = `
      <path d="M 30,85 A 14,14 0 0,1 55,75 A 18,18 0 0,1 85,82 A 14,14 0 0,1 80,105 Z" fill="rgba(107, 114, 128, 0.6)" />
      <path d="M 115,100 A 12,12 0 0,1 135,90 A 15,15 0 0,1 160,95 A 12,12 0 0,1 155,115 Z" fill="rgba(75, 85, 99, 0.5)" />
    `;
  }

  return {
    svg: `
      <svg class="eco-sphere-svg" viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <radialGradient id="${gradientId}" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stop-color="${globeGradientStart}" />
            <stop offset="70%" stop-color="${globeGradientEnd}" />
            <stop offset="100%" stop-color="#0F172A" />
          </radialGradient>
          <filter id="shadow">
            <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="${globeGradientStart}" flood-opacity="0.15" />
          </filter>
        </defs>
        
        <!-- Outer Glow Ring -->
        <circle cx="100" cy="100" r="75" fill="none" stroke="${globeGradientStart}" stroke-width="1.5" opacity="0.15" />
        
        <!-- Main Planet Globe -->
        <circle cx="100" cy="100" r="65" fill="url(#${gradientId})" filter="url(#shadow)" />
        
        <!-- Grid/Latitude Lines (3D depth) -->
        <path d="M35,100 Q100,60 165,100" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
        <path d="M35,100 Q100,140 165,100" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
        <path d="M100,35 Q60,100 100,165" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
        <path d="M100,35 Q140,100 100,165" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />

        ${leavesPaths}
        ${cloudPaths}
      </svg>
    `,
    statusText,
    statusDesc
  };
}

// Generate the SVG Area Trend Chart
function renderHistoryChartSVG(logs) {
  if (!logs || logs.length === 0) {
    return `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-dim);">No historical logs yet. Save a calculation to plot.</div>`;
  }

  // Ensure sorting by date ascending
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const width = 500;
  const height = 180;
  const paddingLeft = 35;
  const paddingRight = 15;
  const paddingTop = 15;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Determine scale limits
  const maxVal = Math.max(...sortedLogs.map(l => l.total), 12.0); // Baseline max scale of 12t CO2
  const minVal = 0;

  // Compute coordinate mapping functions
  const getX = (index) => {
    if (sortedLogs.length <= 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (sortedLogs.length - 1)) * chartWidth;
  };

  const getY = (val) => {
    const ratio = (val - minVal) / (maxVal - minVal);
    return paddingTop + chartHeight - ratio * chartHeight;
  };

  // Generate SVG Elements
  let gridLines = '';
  // Horizontal grid lines (4 markers)
  for (let i = 0; i <= 4; i++) {
    const yVal = minVal + (i / 4) * (maxVal - minVal);
    const yPos = getY(yVal);
    gridLines += `
      <line x1="${paddingLeft}" y1="${yPos}" x2="${width - paddingRight}" y2="${yPos}" class="chart-grid" />
      <text x="${paddingLeft - 8}" y="${yPos + 4}" fill="var(--text-dim)" font-size="9" text-anchor="end">${yVal.toFixed(1)}</text>
    `;
  }

  // Draw data line & filled area path
  let points = '';
  let lineD = '';
  let areaD = '';

  if (sortedLogs.length > 0) {
    lineD = `M ${getX(0)} ${getY(sortedLogs[0].total)}`;
    areaD = `M ${getX(0)} ${getY(0)} L ${getX(0)} ${getY(sortedLogs[0].total)}`;

    sortedLogs.forEach((log, idx) => {
      const x = getX(idx);
      const y = getY(log.total);

      if (idx > 0) {
        lineD += ` L ${x} ${y}`;
        areaD += ` L ${x} ${y}`;
      }

      points += `
        <circle cx="${x}" cy="${y}" class="chart-point" data-value="${log.total}" data-date="${log.date}">
          <title>${log.date}: ${log.total} tCO2e</title>
        </circle>
      `;

      // Label X-Axis
      const dateObj = new Date(log.date);
      const label = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      // Reduce label count if too many logs to prevent overlaps
      if (sortedLogs.length <= 6 || idx % Math.ceil(sortedLogs.length / 6) === 0) {
        gridLines += `
          <text x="${x}" y="${height - 5}" fill="var(--text-dim)" font-size="9" text-anchor="middle">${label}</text>
        `;
      }
    });

    areaD += ` L ${getX(sortedLogs.length - 1)} ${getY(0)} Z`;
  }

  return `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
      <defs>
        <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-emerald)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--color-emerald)" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      
      ${gridLines}
      ${lineD ? `<path d="${areaD}" class="chart-area" />` : ''}
      ${lineD ? `<path d="${lineD}" class="chart-line" />` : ''}
      ${points}
    </svg>
  `;
}

// Render Dashboard
export function renderDashboard(container, state) {
  const { calculatorInputs, historyLogs, completedHabits, activeFootprint, streak, rank } = state;
  const totalTons = activeFootprint.total;

  // Render Sphere
  const sphere = getEcoSphereSVG(totalTons);

  // Math for Circular Gauge
  const limitValue = 15.0; // tCO2e average limit
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  // Cap gauge percentage at 100%
  const pct = Math.min(totalTons / limitValue, 1.0);
  const strokeDashoffset = circumference - pct * circumference;
  
  // Decide stroke color for Gauge based on value
  let gaugeColor = 'var(--color-emerald)';
  if (totalTons >= 7.0 && totalTons < 12.0) gaugeColor = 'var(--color-amber)';
  if (totalTons >= 12.0) gaugeColor = 'var(--color-rose)';

  // Find highest sector emission
  const sectors = activeFootprint.breakdown;
  const highestSector = Object.keys(sectors).reduce((a, b) => sectors[a] > sectors[b] ? a : b);
  const highestSectorValue = sectors[highestSector];
  
  const sectorLabels = {
    transport: 'Transport & Flights',
    energy: 'Home Energy & Heating',
    food: 'Diet & Food Sourcing',
    waste: 'Household Waste & Recycling'
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const checkedToday = completedHabits[todayStr] || [];

  // Compose Dashboard UI
  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:2rem;">
      
      <!-- Awareness Warning Banner -->
      ${totalTons > 8.0 ? `
        <div class="awareness-banner" role="alert">
          <svg class="awareness-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <div class="awareness-content">
            <h3>Climate Warning: Higher Carbon Impact</h3>
            <p>Your annual footprint of <strong>${totalTons.toFixed(1)} tons</strong> exceeds target sustainability standards. Your biggest impact area is <strong>${sectorLabels[highestSector]}</strong> (${highestSectorValue.toFixed(1)} tons). Check the Action Tracker to lower your footprint.</p>
          </div>
        </div>
      ` : `
        <div class="awareness-banner" style="background: linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(59,130,246,0.05) 100%); border-color: rgba(16,185,129,0.2);" role="status">
          <svg class="awareness-icon" style="color:var(--color-emerald);" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div class="awareness-content">
            <h3 style="color:var(--color-emerald);">Healthy Ecological Balance</h3>
            <p>You are keeping emissions under control! Check daily actions to further neutralize remaining footprint towards complete Net Zero.</p>
          </div>
        </div>
      `}

      <div class="grid-1-2">
        <!-- Card 1: Interactive Eco-Sphere -->
        <article class="glass-card sphere-card" aria-label="Eco Sphere Visual Status">
          <div class="card-title">
            <span style="color:var(--color-emerald)">⬤</span> Eco-Sphere Representation
          </div>
          <div class="sphere-container">
            ${sphere.svg}
            <h2 class="sphere-status-title" style="color: ${totalTons < 4.0 ? 'var(--color-emerald)' : totalTons < 9.0 ? 'var(--color-blue)' : 'var(--color-rose)'};">
              ${sphere.statusText}
            </h2>
            <p class="sphere-status-desc">${sphere.statusDesc}</p>
          </div>
        </article>

        <!-- Card 2: Numeric Gauge & Info Grid -->
        <article class="glass-card" aria-label="Footprint Breakdown">
          <div class="card-title">
            <span>📊</span> Your Annual Footprint Status
          </div>
          
          <div style="display:flex; flex-wrap:wrap; gap:2rem; align-items:center; justify-content:space-around; margin:1.5rem 0;">
            <!-- Circular Gauge -->
            <div class="gauge-container">
              <svg class="gauge-svg" viewBox="0 0 160 160">
                <circle class="gauge-bg" cx="80" cy="80" r="${radius}" />
                <circle class="gauge-fill" cx="80" cy="80" r="${radius}" 
                  stroke="${gaugeColor}"
                  stroke-dasharray="${circumference}" 
                  stroke-dashoffset="${strokeDashoffset}" />
              </svg>
              <div class="gauge-text">
                <span class="gauge-value" id="gauge-val-display" style="color: ${gaugeColor};">${totalTons.toFixed(1)}</span>
                <span class="gauge-unit">tCO₂e / Yr</span>
                <span class="gauge-limit">Limit: ${limitValue}t</span>
              </div>
            </div>
            
            <!-- Quick stats list -->
            <div style="flex-grow: 1; min-width: 200px;">
              <div class="stat-item">
                <span class="stat-label">🌍 Status Rank</span>
                <span class="stat-value" style="color: var(--color-mint);">${rank}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">🔥 Habits Streak</span>
                <span class="stat-value" style="color: var(--color-amber);">${streak} Days 🔥</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">🏠 Household Size</span>
                <span class="stat-value">${calculatorInputs.householdSize} Person(s)</span>
              </div>
            </div>
          </div>

          <!-- Sector Breakdown Horizontal Progress -->
          <div style="margin-top:2rem;">
            <h4 style="font-family:var(--font-heading); font-size:0.9rem; font-weight:600; margin-bottom:0.75rem;">Category Emissions Distribution</h4>
            <div style="display:flex; height:12px; border-radius:6px; overflow:hidden; background:rgba(255,255,255,0.05); margin-bottom:1rem;">
              <div style="width:${(sectors.transport / totalTons * 100) || 0}%; background-color:#3B82F6;" title="Transport: ${sectors.transport} tons"></div>
              <div style="width:${(sectors.energy / totalTons * 100) || 0}%; background-color:#F59E0B;" title="Energy: ${sectors.energy} tons"></div>
              <div style="width:${(sectors.food / totalTons * 100) || 0}%; background-color:#10B981;" title="Food: ${sectors.food} tons"></div>
              <div style="width:${(sectors.waste / totalTons * 100) || 0}%; background-color:#EF4444;" title="Waste: ${sectors.waste} tons"></div>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; font-size:0.8rem; color:var(--text-muted);">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#3B82F6;"></span>
                <span>Transport: <strong>${sectors.transport.toFixed(1)}t</strong></span>
              </div>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#F59E0B;"></span>
                <span>Energy: <strong>${sectors.energy.toFixed(1)}t</strong></span>
              </div>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10B981;"></span>
                <span>Food: <strong>${sectors.food.toFixed(1)}t</strong></span>
              </div>
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#EF4444;"></span>
                <span>Waste: <strong>${sectors.waste.toFixed(1)}t</strong></span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <div class="grid-2">
        <!-- Card 3: Quick Log Habits -->
        <article class="glass-card" aria-label="Quick Actions Logging">
          <div class="card-title">
            <span>⚡</span> Quick Eco-Log
          </div>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem;">
            Click to record today's sustainable behaviors. Action values instantly update global savings.
          </p>
          <div class="quick-log-grid">
            ${HABITS.slice(0, 4).map(habit => {
              const isChecked = checkedToday.includes(habit.id);
              return `
                <button class="quick-log-btn" 
                        id="quick-log-${habit.id}"
                        style="border-color: ${isChecked ? 'var(--border-glass-glow)' : 'var(--border-glass)'}; background: ${isChecked ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)'};"
                        aria-pressed="${isChecked}"
                        aria-label="Toggle habit: ${habit.name}">
                  <span style="font-size: 1.5rem;">
                    ${habit.icon === 'bike' ? '🚲' : habit.icon === 'leaf' ? '🥗' : habit.icon === 'power' ? '🔌' : '💧'}
                  </span>
                  <span>${habit.name}</span>
                  <span class="co2-saved">${isChecked ? '✓ Logged' : `-${habit.impact} kg CO₂`}</span>
                </button>
              `;
            }).join('')}
          </div>
        </article>

        <!-- Card 4: Historical Logs Area Chart -->
        <article class="glass-card" aria-label="Carbon Log History">
          <div class="card-title">
            <span>📈</span> Footprint Evolution
          </div>
          <div class="chart-container">
            ${renderHistoryChartSVG(historyLogs)}
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem;">
            <span style="font-size:0.8rem; color:var(--text-dim);">Historical updates logs (${historyLogs.length} saved)</span>
            <button class="btn-primary" id="save-current-calc-btn" style="width:auto; padding:0.45rem 1rem; font-size:0.8rem; box-shadow:none;">
              Log Current Calculation
            </button>
          </div>
        </article>
      </div>

    </div>
  `;

  // Attach Event Handlers to Quick-Logs
  HABITS.slice(0, 4).forEach(habit => {
    const btn = container.querySelector(`#quick-log-${habit.id}`);
    if (btn) {
      btn.addEventListener('click', () => {
        const dateStr = new Date().toISOString().split('T')[0];
        const currentlyChecked = store.getState().completedHabits[dateStr] || [];
        const wasChecked = currentlyChecked.includes(habit.id);
        
        store.toggleHabit(habit.id, dateStr);
        
        if (!wasChecked) {
          showToast(`Successfully logged: "${habit.name}" (-${habit.impact} kg CO2)`);
        } else {
          showToast(`Removed logged action: "${habit.name}"`);
        }
      });
    }
  });

  // Attach Event Handler to Save Calculation button
  const saveBtn = container.querySelector('#save-current-calc-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      store.saveCalculation();
      showToast('Current carbon footprint logged successfully in historical data.');
    });
  }
}
