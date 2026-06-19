// Calculator Component - AeroCarbon
import { EMISSION_FACTORS, calculateFootprint, store } from './state.js';
import { showToast } from './dashboard.js';

export function renderCalculator(container, state) {
  const inputs = state.calculatorInputs;
  
  // Real-time calculation for display
  const currentFootprint = calculateFootprint(inputs);

  // Layout with 2 columns: Left for input sliders, Right for live feedback card
  container.innerHTML = `
    <div class="grid-1-2">
      
      <!-- Left Column: Interactive Form Sections -->
      <div style="display:flex; flex-direction:column; gap:2rem;">
        
        <!-- Sector 1: Transportation & Flights -->
        <fieldset class="glass-card calc-step" aria-labelledby="legend-transport">
          <legend id="legend-transport" class="card-title" style="float:left; width:100%; border:none; padding:0;">
            <span>🚗</span> Transportation & Air Travel
          </legend>
          
          <div class="form-group">
            <label class="form-label" for="calc-vehicle-type">Primary Commute Vehicle</label>
            <select id="calc-vehicle-type" class="select-input">
              <option value="none" ${inputs.vehicleType === 'none' ? 'selected' : ''}>No Car / Walk & Cycle Only</option>
              <option value="electric" ${inputs.vehicleType === 'electric' ? 'selected' : ''}>Electric Vehicle (EV)</option>
              <option value="hybrid" ${inputs.vehicleType === 'hybrid' ? 'selected' : ''}>Hybrid / Plug-in Hybrid</option>
              <option value="sedan" ${inputs.vehicleType === 'sedan' ? 'selected' : ''}>Gasoline Sedan / Compact</option>
              <option value="suv" ${inputs.vehicleType === 'suv' ? 'selected' : ''}>Gasoline SUV / Truck / Large</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="calc-weekly-distance">
              <span>Weekly Commuting Distance</span>
              <span class="value-bubble" id="val-weekly-distance">${inputs.weeklyDistance} miles</span>
            </label>
            <input type="range" id="calc-weekly-distance" class="range-input" min="0" max="400" step="5" value="${inputs.weeklyDistance}">
            <span style="font-size:0.75rem; color:var(--text-dim); display:flex; justify-content:space-between;">
              <span>0 mi</span><span>200 mi</span><span>400 mi</span>
            </span>
          </div>

          <div class="form-group">
            <label class="form-label" for="calc-short-flights">
              <span>Short-Haul Flights (< 3 hrs / Domestic)</span>
              <span class="value-bubble" id="val-short-flights">${inputs.shortFlights} / year</span>
            </label>
            <input type="range" id="calc-short-flights" class="range-input" min="0" max="15" step="1" value="${inputs.shortFlights}">
            <span style="font-size:0.75rem; color:var(--text-dim); display:flex; justify-content:space-between;">
              <span>0 flights</span><span>15 flights</span>
            </span>
          </div>

          <div class="form-group">
            <label class="form-label" for="calc-long-flights">
              <span>Long-Haul Flights (> 3 hrs / International)</span>
              <span class="value-bubble" id="val-long-flights">${inputs.longFlights} / year</span>
            </label>
            <input type="range" id="calc-long-flights" class="range-input" min="0" max="10" step="1" value="${inputs.longFlights}">
            <span style="font-size:0.75rem; color:var(--text-dim); display:flex; justify-content:space-between;">
              <span>0 flights</span><span>10 flights</span>
            </span>
          </div>
        </fieldset>

        <!-- Sector 2: Home Utilities -->
        <fieldset class="glass-card calc-step" aria-labelledby="legend-utilities">
          <legend id="legend-utilities" class="card-title" style="float:left; width:100%; border:none; padding:0;">
            <span>⚡</span> Household Utilities
          </legend>

          <div class="form-group">
            <label class="form-label" for="calc-monthly-electricity">
              <span>Monthly Electricity Consumption</span>
              <span class="value-bubble" id="val-monthly-electricity">${inputs.monthlyElectricity} kWh</span>
            </label>
            <input type="range" id="calc-monthly-electricity" class="range-input" min="0" max="1500" step="20" value="${inputs.monthlyElectricity}">
            <span style="font-size:0.75rem; color:var(--text-dim); display:flex; justify-content:space-between;">
              <span>0 kWh</span><span>750 kWh</span><span>1500 kWh</span>
            </span>
          </div>

          <div class="form-group">
            <label class="form-label" for="calc-clean-energy-pct">
              <span>Renewable Energy Share (Solar/Wind)</span>
              <span class="value-bubble" id="val-clean-energy-pct">${inputs.cleanEnergyPct}%</span>
            </label>
            <input type="range" id="calc-clean-energy-pct" class="range-input" min="0" max="100" step="5" value="${inputs.cleanEnergyPct}">
            <span style="font-size:0.75rem; color:var(--text-dim); display:flex; justify-content:space-between;">
              <span>0% (Standard Grid)</span><span>100% (Clean Power)</span>
            </span>
          </div>

          <div class="form-group">
            <label class="form-label" for="calc-heating-fuel">Primary Heating Source</label>
            <select id="calc-heating-fuel" class="select-input">
              <option value="solar" ${inputs.heatingFuel === 'solar' ? 'selected' : ''}>Solar Thermal / Geothermal / Electric Heat Pump</option>
              <option value="gas" ${inputs.heatingFuel === 'gas' ? 'selected' : ''}>Natural Gas Boiler</option>
              <option value="oil" ${inputs.heatingFuel === 'oil' ? 'selected' : ''}>Heating Oil</option>
              <option value="biomass" ${inputs.heatingFuel === 'biomass' ? 'selected' : ''}>Biomass / Wood Stove</option>
            </select>
          </div>
        </fieldset>

        <!-- Sector 3: Diet & Food Choices -->
        <fieldset class="glass-card calc-step" aria-labelledby="legend-diet">
          <legend id="legend-diet" class="card-title" style="float:left; width:100%; border:none; padding:0;">
            <span>🥗</span> Diet & Food Footprint
          </legend>

          <div class="form-group">
            <label class="form-label" for="calc-diet-type">Primary Dietary Habits</label>
            <select id="calc-diet-type" class="select-input">
              <option value="heavyMeat" ${inputs.dietType === 'heavyMeat' ? 'selected' : ''}>Frequent Meat Consumer (Steak, Pork, Poultry daily)</option>
              <option value="mediumMeat" ${inputs.dietType === 'mediumMeat' ? 'selected' : ''}>Moderate Meat Consumer (Occasional beef/fish, poultry)</option>
              <option value="lowMeat" ${inputs.dietType === 'lowMeat' ? 'selected' : ''}>Low Meat / Flexitarian (Primarily plant-based, minimal meat)</option>
              <option value="vegetarian" ${inputs.dietType === 'vegetarian' ? 'selected' : ''}>Vegetarian (No meat/fish, consumes dairy and eggs)</option>
              <option value="vegan" ${inputs.dietType === 'vegan' ? 'selected' : ''}>Plant-Based / Vegan (Zero animal products)</option>
            </select>
          </div>
        </fieldset>

        <!-- Sector 4: Waste & Recycling -->
        <fieldset class="glass-card calc-step" aria-labelledby="legend-waste">
          <legend id="legend-waste" class="card-title" style="float:left; width:100%; border:none; padding:0;">
            <span>🗑️</span> Waste & Recycling
          </legend>

          <div class="form-group">
            <label class="form-label" for="calc-household-size">
              <span>Household Size</span>
              <span class="value-bubble" id="val-household-size">${inputs.householdSize} Person(s)</span>
            </label>
            <input type="range" id="calc-household-size" class="range-input" min="1" max="8" step="1" value="${inputs.householdSize}">
            <span style="font-size:0.75rem; color:var(--text-dim); display:flex; justify-content:space-between;">
              <span>1 Person</span><span>8 People</span>
            </span>
          </div>

          <div class="form-group">
            <span class="form-label">Active Recycling Programs (Check all that apply)</span>
            <div style="display:flex; flex-direction:column; gap:0.5rem; margin-top:0.5rem;">
              <label class="checkbox-container" style="font-size:0.95rem; line-height:1.2;">
                Recycle Paper / Cardboard
                <input type="checkbox" id="calc-recycle-paper" ${inputs.recyclePaper ? 'checked' : ''}>
                <span class="checkmark" style="top:6px; transform:none;"></span>
              </label>
              <label class="checkbox-container" style="font-size:0.95rem; line-height:1.2;">
                Recycle Plastic Bottles & Tubs
                <input type="checkbox" id="calc-recycle-plastic" ${inputs.recyclePlastic ? 'checked' : ''}>
                <span class="checkmark" style="top:6px; transform:none;"></span>
              </label>
              <label class="checkbox-container" style="font-size:0.95rem; line-height:1.2;">
                Recycle Glass Containers
                <input type="checkbox" id="calc-recycle-glass" ${inputs.recycleGlass ? 'checked' : ''}>
                <span class="checkmark" style="top:6px; transform:none;"></span>
              </label>
              <label class="checkbox-container" style="font-size:0.95rem; line-height:1.2;">
                Recycle Aluminum & Steel Cans
                <input type="checkbox" id="calc-recycle-metal" ${inputs.recycleMetal ? 'checked' : ''}>
                <span class="checkmark" style="top:6px; transform:none;"></span>
              </label>
            </div>
          </div>
        </fieldset>

      </div>

      <!-- Right Column: Floating Real-time Feedback Card -->
      <div style="position: sticky; top: 2rem; align-self: start; display:flex; flex-direction:column; gap:1.5rem;">
        
        <article class="glass-card" style="border-color: var(--border-glass-glow); background: rgba(16, 185, 129, 0.04);" aria-label="Real-time Calculation Results">
          <div class="card-title" style="color:var(--color-emerald)">
            <span>💚</span> Live Carbon Summary
          </div>
          
          <div style="text-align:center; padding:1.5rem 0;">
            <div style="font-size:3.5rem; font-weight:800; font-family:var(--font-heading); color:var(--color-emerald); line-height:1;">
              <span id="live-total-display">${currentFootprint.total.toFixed(2)}</span>
            </div>
            <div style="font-size:0.9rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:1px; margin-top:0.5rem;">
              Metric Tons CO₂e / Year
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:1rem; margin:1.5rem 0; border-top:1px solid rgba(255,255,255,0.06); padding-top:1.5rem;">
            
            <!-- Category Breakdowns -->
            <div class="stat-item">
              <span class="stat-label">🚙 Transportation</span>
              <span class="stat-value" id="live-transport-val">${currentFootprint.breakdown.transport.toFixed(2)} t</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">⚡ Utilities / Energy</span>
              <span class="stat-value" id="live-energy-val">${currentFootprint.breakdown.energy.toFixed(2)} t</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">🥗 Diet & Dining</span>
              <span class="stat-value" id="live-food-val">${currentFootprint.breakdown.food.toFixed(2)} t</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">🗑️ Waste & Recycling</span>
              <span class="stat-value" id="live-waste-val">${currentFootprint.breakdown.waste.toFixed(2)} t</span>
            </div>
          </div>

          <button class="btn-primary" id="calc-save-btn" style="margin-top:0.5rem;">
            <span>💾</span> Save Calculation Log
          </button>
        </article>

        <article class="glass-card" style="padding:1.25rem;">
          <h4 style="font-family:var(--font-heading); font-size:0.95rem; font-weight:600; margin-bottom:0.5rem;">Did You Know?</h4>
          <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4;">
            The globally recommended individual limit to limit global warming below 1.5°C is **2.0 metric tons CO₂e per year**. The average North American citizen produces over **16.0 metric tons per year**. Small shifts make a huge impact!
          </p>
        </article>
      </div>

    </div>
  `;

  // Attach dynamic listener helper
  const setupInputListener = (elementId, callback, displayId = null, formatFn = null) => {
    const el = container.querySelector(`#${elementId}`);
    if (el) {
      el.addEventListener('input', (e) => {
        let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        
        // Parse numerical parameters
        if (e.target.type === 'range') {
          value = parseFloat(value);
        }

        // Live text display indicator update
        if (displayId) {
          const displayEl = container.querySelector(`#${displayId}`);
          if (displayEl) {
            displayEl.textContent = formatFn ? formatFn(value) : value;
          }
        }

        // Execute callback
        callback(value);

        // Fetch re-calculated statistics and refresh values in side-panel
        const updatedState = store.getState().calculatorInputs;
        const newCalc = calculateFootprint(updatedState);
        
        const totalDisp = container.querySelector('#live-total-display');
        const transDisp = container.querySelector('#live-transport-val');
        const energyDisp = container.querySelector('#live-energy-val');
        const foodDisp = container.querySelector('#live-food-val');
        const wasteDisp = container.querySelector('#live-waste-val');

        if (totalDisp) totalDisp.textContent = newCalc.total.toFixed(2);
        if (transDisp) transDisp.textContent = `${newCalc.breakdown.transport.toFixed(2)} t`;
        if (energyDisp) energyDisp.textContent = `${newCalc.breakdown.energy.toFixed(2)} t`;
        if (foodDisp) foodDisp.textContent = `${newCalc.breakdown.food.toFixed(2)} t`;
        if (wasteDisp) wasteDisp.textContent = `${newCalc.breakdown.waste.toFixed(2)} t`;
      });
    }
  };

  // Bind forms with state updates
  setupInputListener('calc-vehicle-type', (val) => store.updateCalculator({ vehicleType: val }));
  setupInputListener('calc-weekly-distance', (val) => store.updateCalculator({ weeklyDistance: val }), 'val-weekly-distance', (v) => `${v} miles`);
  setupInputListener('calc-short-flights', (val) => store.updateCalculator({ shortFlights: val }), 'val-short-flights', (v) => `${v} / year`);
  setupInputListener('calc-long-flights', (val) => store.updateCalculator({ longFlights: val }), 'val-long-flights', (v) => `${v} / year`);

  setupInputListener('calc-monthly-electricity', (val) => store.updateCalculator({ monthlyElectricity: val }), 'val-monthly-electricity', (v) => `${v} kWh`);
  setupInputListener('calc-clean-energy-pct', (val) => store.updateCalculator({ cleanEnergyPct: val }), 'val-clean-energy-pct', (v) => `${v}%`);
  setupInputListener('calc-heating-fuel', (val) => store.updateCalculator({ heatingFuel: val }));

  setupInputListener('calc-diet-type', (val) => store.updateCalculator({ dietType: val }));

  setupInputListener('calc-household-size', (val) => store.updateCalculator({ householdSize: val }), 'val-household-size', (v) => `${v} Person(s)`);
  setupInputListener('calc-recycle-paper', (val) => store.updateCalculator({ recyclePaper: val }));
  setupInputListener('calc-recycle-plastic', (val) => store.updateCalculator({ recyclePlastic: val }));
  setupInputListener('calc-recycle-glass', (val) => store.updateCalculator({ recycleGlass: val }));
  setupInputListener('calc-recycle-metal', (val) => store.updateCalculator({ recycleMetal: val }));

  // Bind Save Log button
  const saveLogBtn = container.querySelector('#calc-save-btn');
  if (saveLogBtn) {
    saveLogBtn.addEventListener('click', () => {
      store.saveCalculation();
      showToast('Calculation successfully stored in your progress logs!');
    });
  }
}
