// Action Tracker Component - AeroCarbon
import { HABITS, store } from './state.js';
import { showToast } from './dashboard.js';

export function renderActionTracker(container, state) {
  const { completedHabits, streak } = state;
  const todayStr = new Date().toISOString().split('T')[0];
  const checkedToday = completedHabits[todayStr] || [];

  // Compute daily carbon offset savings
  const totalSavedToday = checkedToday.reduce((sum, habitId) => {
    const habit = HABITS.find(h => h.id === habitId);
    return sum + (habit ? habit.impact : 0);
  }, 0);

  const dailyGoal = 8.0; // kg CO2 daily offset goal
  const progressPct = Math.min((totalSavedToday / dailyGoal) * 100, 100);
  
  // Annualized savings estimate (if they repeat these daily habits)
  const annualSavingEquivalent = (totalSavedToday * 365) / 1000; // in metric tons

  container.innerHTML = `
    <div class="grid-1-2">
      
      <!-- Left Column: Checklist of habits -->
      <article class="glass-card" aria-label="Sustainable Habit Checklist">
        <div class="card-title">
          <span>✅</span> Daily Sustainability Tracker
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.5rem;">
          Log daily habits. Complete items to reduce your real-world footprint and increase your streak.
        </p>

        <div class="habit-list" role="group" aria-label="Green Habits Checklist">
          ${HABITS.map(habit => {
            const isChecked = checkedToday.includes(habit.id);
            return `
              <div class="habit-card ${isChecked ? 'checked' : ''}" id="habit-container-${habit.id}">
                <div class="habit-info-group">
                  <label class="checkbox-container" style="margin-bottom:0;">
                    <input type="checkbox" 
                           id="checkbox-${habit.id}" 
                           ${isChecked ? 'checked' : ''} 
                           aria-describedby="desc-${habit.id}"
                           aria-label="Mark: ${habit.name}">
                    <span class="checkmark"></span>
                  </label>
                  
                  <div class="habit-details">
                    <span class="habit-name ${isChecked ? 'habit-checked-name' : ''}">${habit.name}</span>
                    <span class="habit-impact" id="desc-${habit.id}">
                      ${habit.desc} • <span style="font-weight:700;">-${habit.impact} kg CO₂</span>
                    </span>
                  </div>
                </div>
                
                <span style="font-size:1.5rem;" aria-hidden="true">
                  ${habit.icon === 'bike' ? '🚲' : 
                    habit.icon === 'leaf' ? '🥗' : 
                    habit.icon === 'power' ? '🔌' : 
                    habit.icon === 'droplet' ? '💧' : 
                    habit.icon === 'sun' ? '💡' : 
                    habit.icon === 'trash' ? '♻️' : '🌬️'}
                </span>
              </div>
            `;
          }).join('')}
        </div>
      </article>

      <!-- Right Column: Goal metrics & rewards status -->
      <div style="position: sticky; top: 2rem; align-self: start; display:flex; flex-direction:column; gap:1.5rem;">
        
        <article class="glass-card" style="border-color: var(--border-glass-glow);" aria-label="Daily Goal Progress">
          <div class="card-title">
            <span>🎯</span> Daily Offset Progress
          </div>

          <!-- Goal Progress Tracker -->
          <div style="margin:1.5rem 0;">
            <div style="display:flex; justify-content:space-between; font-size:0.9rem; font-weight:600; margin-bottom:0.5rem;">
              <span>Daily Target Saved</span>
              <span style="color:var(--color-emerald);">${totalSavedToday.toFixed(1)} / ${dailyGoal} kg CO₂</span>
            </div>
            
            <div style="height:12px; background:rgba(255,255,255,0.05); border-radius:6px; overflow:hidden; position:relative;">
              <div style="width:${progressPct}%; height:100%; background: linear-gradient(90deg, var(--color-mint) 0%, var(--color-emerald) 100%); transition: width 0.4s ease-out; border-radius:6px;"></div>
            </div>
            
            ${progressPct >= 100 ? `
              <div style="margin-top:1rem; padding:0.50rem; background:rgba(16,185,129,0.08); border:1px solid var(--border-glass-glow); border-radius:var(--radius-md); text-align:center; font-size:0.8rem; font-weight:600; color:var(--color-mint);">
                🎉 Eco-Hero Goal Reached for Today!
              </div>
            ` : ''}
          </div>

          <div style="display:flex; flex-direction:column; gap:1rem; border-top:1px solid rgba(255,255,255,0.06); padding-top:1.5rem;">
            <div class="stat-item">
              <span class="stat-label">🔥 Completed Streak</span>
              <span class="stat-value" style="color:var(--color-amber);">${streak} Days Active</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">🍃 Annual Projection</span>
              <span class="stat-value" style="color:var(--color-emerald); font-weight:700;">-${annualSavingEquivalent.toFixed(2)} t CO₂e / Year</span>
            </div>
          </div>
          
          <p style="font-size:0.75rem; color:var(--text-dim); line-height:1.4; text-align:center; margin-top:0.5rem;">
            If you maintain these checked actions consistently for 365 days, you will offset the above tonnage!
          </p>
        </article>

        <!-- Gamification Badge -->
        <article class="glass-card" style="background: radial-gradient(circle at top right, rgba(245,158,11,0.04), transparent 60%);">
          <div style="display:flex; align-items:center; gap:1rem;">
            <div style="font-size:2.5rem;" aria-hidden="true">🔥</div>
            <div>
              <h4 style="font-family:var(--font-heading); font-size:1.1rem; font-weight:700;">Streaks & Motivation</h4>
              <p style="font-size:0.8rem; color:var(--text-muted); line-height:1.4; margin-top:0.25rem;">
                Logging at least one green action each day builds your streak. Don't let your eco-sphere drop!
              </p>
            </div>
          </div>
        </article>

      </div>
    </div>
  `;

  // Attach checkbox toggle listeners
  HABITS.forEach(habit => {
    const chk = container.querySelector(`#checkbox-${habit.id}`);
    const card = container.querySelector(`#habit-container-${habit.id}`);
    
    if (chk) {
      chk.addEventListener('change', () => {
        const isChecked = chk.checked;
        store.toggleHabit(habit.id, todayStr);
        
        if (isChecked) {
          card.classList.add('checked');
          // Update details line-through
          card.querySelector('.habit-name').classList.add('habit-checked-name');
          showToast(`Marked completed: "${habit.name}" (-${habit.impact} kg CO2)`);
        } else {
          card.classList.remove('checked');
          card.querySelector('.habit-name').classList.remove('habit-checked-name');
          showToast(`Unchecked action: "${habit.name}"`);
        }
      });
    }
  });
}
