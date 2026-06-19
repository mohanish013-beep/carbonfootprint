// Insights & Simulator Component - AeroCarbon
import { store } from './state.js';

export function renderInsights(container, state) {
  const { activeFootprint, offsetSimulator } = state;
  const grossFootprint = activeFootprint.total; // tCO2e per year
  
  // Calculate simulator offsets in metric tons
  const treeOffsetAnnual = (offsetSimulator.treesPlanted * 22) / 1000; // 22 kg per tree per year
  const creditOffsetAnnual = offsetSimulator.offsetCredits / 1000; // converting kg to metric tons
  const totalOffsetAnnual = treeOffsetAnnual + creditOffsetAnnual;
  const netFootprint = Math.max(0, grossFootprint - totalOffsetAnnual);

  container.innerHTML = `
    <div class="grid-1-2">
      
      <!-- Left Column: Healthy & Sustainable Lifestyle Guidelines -->
      <div style="display:flex; flex-direction:column; gap:1.5rem;">
        
        <h2 style="font-family:var(--font-heading); font-size:1.4rem; font-weight:700; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
          <span>🌱</span> Healthy & Green Guidelines
        </h2>

        <!-- Guideline Card 1: Active Commuting -->
        <section class="glass-card" style="padding:1.5rem;" aria-labelledby="guide-commute-title">
          <h3 id="guide-commute-title" style="font-family:var(--font-heading); font-size:1.1rem; font-weight:600; color:var(--color-blue); display:flex; align-items:center; gap:0.5rem;">
            🚲 Active Commuting & Heart Health
          </h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.75rem; line-height:1.5;">
            Replacing short driving trips (under 3 miles) with brisk walking or cycling is one of the most effective dual-benefit actions you can take.
          </p>
          <div style="margin-top:0.75rem; padding:0.75rem; background:rgba(59, 130, 246, 0.05); border-left:3px solid var(--color-blue); border-radius:0 var(--radius-sm) var(--radius-sm) 0; font-size:0.8rem;">
            <strong>Climate:</strong> Saves 400g CO₂ per mile. <br>
            <strong>Health:</strong> Meeting 150 minutes/week of active commuting reduces cardiovascular risk by up to 30%.
          </div>
        </section>

        <!-- Guideline Card 2: Plant-Forward Diet -->
        <section class="glass-card" style="padding:1.5rem;" aria-labelledby="guide-diet-title">
          <h3 id="guide-diet-title" style="font-family:var(--font-heading); font-size:1.1rem; font-weight:600; color:var(--color-emerald); display:flex; align-items:center; gap:0.5rem;">
            🥗 Plant-Forward Diets & Longevity
          </h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.75rem; line-height:1.5;">
            Reducing red meat intake in favor of legumes, nuts, seeds, and leafy greens drastically lowers agricultural carbon emissions, deforestation pressure, and water depletion.
          </p>
          <div style="margin-top:0.75rem; padding:0.75rem; background:rgba(16, 185, 129, 0.05); border-left:3px solid var(--color-emerald); border-radius:0 var(--radius-sm) var(--radius-sm) 0; font-size:0.8rem;">
            <strong>Climate:</strong> Shifting to vegetarian/vegan cuts your dietary footprint by 50% to 70%. <br>
            <strong>Health:</strong> Clinically associated with lower cholesterol levels, lowered type-2 diabetes risk, and enhanced lifespan indices.
          </div>
        </section>

        <!-- Guideline Card 3: Energy Efficiency -->
        <section class="glass-card" style="padding:1.5rem;" aria-labelledby="guide-energy-title">
          <h3 id="guide-energy-title" style="font-family:var(--font-heading); font-size:1.1rem; font-weight:600; color:var(--color-amber); display:flex; align-items:center; gap:0.5rem;">
            💡 Smart Utilities & Indoor Quality
          </h3>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:0.75rem; line-height:1.5;">
            Washing laundry on cold cycles, utilizing natural lines for drying, and setting smart thermostat targets decreases local grids pressure and minimizes electrical consumption.
          </p>
          <div style="margin-top:0.75rem; padding:0.75rem; background:rgba(245, 158, 11, 0.05); border-left:3px solid var(--color-amber); border-radius:0 var(--radius-sm) var(--radius-sm) 0; font-size:0.8rem;">
            <strong>Climate:</strong> Cold washing laundry saves ~0.8kg CO₂ per load. <br>
            <strong>Cost:</strong> Lowers domestic electricity utility billing immediately by up to 15%.
          </div>
        </section>

      </div>

      <!-- Right Column: Carbon Offset Simulator -->
      <div style="position: sticky; top: 2rem; align-self: start; display:flex; flex-direction:column; gap:1.5rem;">
        
        <article class="glass-card" style="border-color: var(--border-glass-glow);" aria-label="Interactive Offset Simulator">
          <div class="card-title">
            <span>🌲</span> Carbon Neutrality Simulator
          </div>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.5rem;">
            Simulate the effects of proactive carbon neutralization. Balance your gross footprint to Net Zero!
          </p>

          <!-- Input Sliders -->
          <div style="display:flex; flex-direction:column; gap:1.25rem; margin-bottom:1.5rem;">
            <div class="form-group">
              <label class="form-label" for="sim-trees">
                <span>Annual Trees Planted</span>
                <span class="value-bubble" id="val-sim-trees">${offsetSimulator.treesPlanted} Trees</span>
              </label>
              <input type="range" id="sim-trees" class="range-input" min="0" max="150" step="1" value="${offsetSimulator.treesPlanted}">
              <span style="font-size:0.75rem; color:var(--text-dim); text-align:right;">
                Offsets ~${(offsetSimulator.treesPlanted * 22).toLocaleString()} kg CO₂/year
              </span>
            </div>

            <div class="form-group">
              <label class="form-label" for="sim-credits">
                <span>Verified Offsets Purchased</span>
                <span class="value-bubble" id="val-sim-credits">${offsetSimulator.offsetCredits} kg CO₂</span>
              </label>
              <input type="range" id="sim-credits" class="range-input" min="0" max="5000" step="50" value="${offsetSimulator.offsetCredits}">
              <span style="font-size:0.75rem; color:var(--text-dim); text-align:right;">
                Offsets ~${(offsetSimulator.offsetCredits / 1000).toFixed(2)} t CO₂e/year
              </span>
            </div>
          </div>

          <!-- Live Result Math -->
          <div class="simulator-widget" role="status">
            <div class="stat-item">
              <span class="stat-label">Gross Emissions</span>
              <span class="stat-value">${grossFootprint.toFixed(2)} tCO₂e</span>
            </div>
            <div class="stat-item">
              <span class="stat-label" style="color:var(--color-mint);">Simulated Offset</span>
              <span class="stat-value" style="color:var(--color-mint);">- ${totalOffsetAnnual.toFixed(2)} tCO₂e</span>
            </div>
            
            <div class="offset-result">
              <span style="font-family:var(--font-heading); font-size:0.95rem; font-weight:600;">Net Footprint</span>
              <span class="offset-net" style="color: ${netFootprint === 0 ? 'var(--color-emerald)' : 'var(--text-primary)'}">
                ${netFootprint.toFixed(2)} tCO₂e
              </span>
            </div>

            ${netFootprint === 0 ? `
              <div style="margin-top:1.25rem; padding:0.75rem; background:rgba(16,185,129,0.08); border:1px solid var(--border-glass-glow); border-radius:var(--radius-md); text-align:center; font-family:var(--font-heading); font-size:0.85rem; font-weight:700; color:var(--color-emerald);">
                🏆 NET ZERO IMPACT ACHIEVED! 🎉
              </div>
            ` : ''}
          </div>
        </article>

        <article class="glass-card" style="padding:1.25rem;">
          <h4 style="font-family:var(--font-heading); font-size:0.95rem; font-weight:600; margin-bottom:0.5rem;">How Tree Offsets Work</h4>
          <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4;">
            A mature tree absorbs roughly **22 kg of carbon dioxide** per year. Planting **45 trees** offsets approximately **1 metric ton of CO₂** annually. Note that tree growth requires decades to lock this carbon fully!
          </p>
        </article>
      </div>

    </div>
  `;

  // Attach simulator slider handlers
  const updateSimulationValues = () => {
    const trees = parseInt(container.querySelector('#sim-trees').value);
    const credits = parseInt(container.querySelector('#sim-credits').value);
    
    // Update live text labels
    container.querySelector('#val-sim-trees').textContent = `${trees} Trees`;
    container.querySelector('#val-sim-credits').textContent = `${credits} kg CO₂`;

    // Save to global state (which triggers callbacks to re-render)
    store.updateOffsetSimulation({ treesPlanted: trees, offsetCredits: credits });
  };

  const treesSlider = container.querySelector('#sim-trees');
  const creditsSlider = container.querySelector('#sim-credits');

  if (treesSlider && creditsSlider) {
    treesSlider.addEventListener('input', updateSimulationValues);
    creditsSlider.addEventListener('input', updateSimulationValues);
  }
}
