// State Management Layer - AeroCarbon

// Scientifically derived emission factors (EPA / Defra / IPCC standards)
export const EMISSION_FACTORS = {
  // Vehicle emissions in kg CO2 per mile
  transport: {
    suv: 0.44,       // Gasoline SUV/Truck
    sedan: 0.32,     // Gasoline Sedan
    hybrid: 0.17,    // Hybrid vehicle
    electric: 0.07,  // EV charged on standard grid mix
    transit: 0.11,   // Public transit average
    none: 0.0
  },
  // Flights in kg CO2 per flight
  flights: {
    short: 220,  // Short-haul (< 3 hours / ~500 miles)
    long: 850    // Medium/Long-haul (> 3 hours / ~2000+ miles)
  },
  // Grid electricity in kg CO2 per kWh
  electricity: 0.39,
  // Heating fuels in kg CO2 per month average
  heating: {
    gas: 120,    // Natural gas heating
    oil: 210,    // Heating oil
    electric: 0, // Handled by electricity calculations
    biomass: 30, // Wood/pellets
    solar: 0     // Solar thermal / Heat pump / None
  },
  // Annual food footprint in kg CO2 per diet type
  food: {
    heavyMeat: 2800,
    mediumMeat: 2100,
    lowMeat: 1500,
    vegetarian: 1100,
    vegan: 750
  },
  // Annual waste footprint in kg CO2 per person
  waste: {
    base: 380,
    recyclingReductions: {
      paper: 35,
      plastic: 30,
      glass: 25,
      metal: 45
    }
  }
};

// Available Daily Habits and their Carbon Offset in kg CO2
export const HABITS = [
  { id: 'publicTransit', name: 'Commuted sustainably', desc: 'Walked, cycled, or took public transit instead of driving.', impact: 4.8, icon: 'bike' },
  { id: 'plantMeal', name: 'Eat a plant-based meal', desc: 'Replaced meat with plant alternatives for a main meal.', impact: 1.6, icon: 'leaf' },
  { id: 'unplugStandby', name: 'Unplugged standby electronics', desc: 'Turned off power strips and chargers when not in use.', impact: 0.5, icon: 'power' },
  { id: 'coldWash', name: 'Cold water laundry wash', desc: 'Washed a load of laundry using cold water instead of hot.', impact: 0.8, icon: 'droplet' },
  { id: 'lightControl', name: 'Mindful lighting usage', desc: 'Turned off unnecessary lights and optimized daylight.', impact: 0.4, icon: 'sun' },
  { id: 'zeroWaste', name: 'Zero single-use plastics', desc: 'Used reusable bottles, bags, and avoided packaged goods.', impact: 0.6, icon: 'trash' },
  { id: 'lineDry', name: 'Natural line-drying clothes', desc: 'Air-dried clothes instead of running the electric dryer.', impact: 1.4, icon: 'wind' }
];

// Default Calculator Inputs
const DEFAULT_INPUTS = {
  // Transport
  vehicleType: 'sedan',
  weeklyDistance: 120, // miles
  shortFlights: 2,     // per year
  longFlights: 1,      // per year
  // Energy
  monthlyElectricity: 450, // kWh
  cleanEnergyPct: 0,      // % solar/wind provider
  heatingFuel: 'gas',
  // Food
  dietType: 'mediumMeat',
  // Waste
  householdSize: 2,
  recyclePaper: true,
  recyclePlastic: true,
  recycleGlass: false,
  recycleMetal: false
};

// Initial state load
let state = {
  calculatorInputs: loadFromLocalStorage('aerocarbon_inputs', DEFAULT_INPUTS),
  historyLogs: loadFromLocalStorage('aerocarbon_history', [
    // Pre-populate with one initial entry for demonstration
    { date: '2026-05-19', total: 6.2, breakdown: { transport: 2.8, energy: 2.1, food: 1.1, waste: 0.2 } }
  ]),
  completedHabits: loadFromLocalStorage('aerocarbon_habits', {}), // Format: {'YYYY-MM-DD': ['habitId1', 'habitId2']}
  offsetSimulator: {
    treesPlanted: 0,   // ~22 kg CO2 offset per tree per year
    offsetCredits: 0   // in kg CO2
  }
};

// Subscriptions
const subscribers = new Set();

// LocalStorage Helper functions
function loadFromLocalStorage(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.error('Error reading localStorage for key:', key, e);
    return defaultValue;
  }
}

function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error writing localStorage for key:', key, e);
  }
}

// Calculate carbon footprint based on inputs
export function calculateFootprint(inputs) {
  // 1. TRANSPORT CALCULATION (Annualized)
  const transportFactor = EMISSION_FACTORS.transport[inputs.vehicleType] || 0;
  const annualDriveEmissions = inputs.weeklyDistance * 52 * transportFactor;
  const flightEmissions = (inputs.shortFlights * EMISSION_FACTORS.flights.short) + 
                          (inputs.longFlights * EMISSION_FACTORS.flights.long);
  const transportTotal = annualDriveEmissions + flightEmissions;

  // 2. ENERGY CALCULATION (Annualized)
  const cleanElectricityRatio = (100 - inputs.cleanEnergyPct) / 100;
  const annualElectricityEmissions = (inputs.monthlyElectricity * 12) * EMISSION_FACTORS.electricity * cleanElectricityRatio;
  
  const heatingMonthlyFactor = EMISSION_FACTORS.heating[inputs.heatingFuel] || 0;
  const annualHeatingEmissions = heatingMonthlyFactor * 12;
  const energyTotal = annualElectricityEmissions + annualHeatingEmissions;

  // 3. FOOD CALCULATION (Annualized)
  const foodTotal = EMISSION_FACTORS.food[inputs.dietType] || EMISSION_FACTORS.food.mediumMeat;

  // 4. WASTE CALCULATION (Annualized)
  let baseWaste = EMISSION_FACTORS.waste.base;
  if (inputs.recyclePaper) baseWaste -= EMISSION_FACTORS.waste.recyclingReductions.paper;
  if (inputs.recyclePlastic) baseWaste -= EMISSION_FACTORS.waste.recyclingReductions.plastic;
  if (inputs.recycleGlass) baseWaste -= EMISSION_FACTORS.waste.recyclingReductions.glass;
  if (inputs.recycleMetal) baseWaste -= EMISSION_FACTORS.waste.recyclingReductions.metal;
  
  // Total waste emissions scaled per capita in household (standard utility distribution)
  const wasteTotal = Math.max(80, baseWaste * inputs.householdSize);

  // Return breakdown and totals in metric tons (tCO2e)
  return {
    breakdown: {
      transport: parseFloat((transportTotal / 1000).toFixed(2)),
      energy: parseFloat((energyTotal / 1000).toFixed(2)),
      food: parseFloat((foodTotal / 1000).toFixed(2)),
      waste: parseFloat((wasteTotal / 1000).toFixed(2))
    },
    total: parseFloat(((transportTotal + energyTotal + foodTotal + wasteTotal) / 1000).toFixed(2))
  };
}

// Get the active calculations
export function getActiveFootprint() {
  return calculateFootprint(state.calculatorInputs);
}

// Compute rank based on current total carbon footprint
export function getRank(totalTons) {
  if (totalTons < 2.0) return 'Net Zero Champion';
  if (totalTons < 4.0) return 'Green Guardian';
  if (totalTons < 8.0) return 'Climate Steward';
  if (totalTons < 14.0) return 'Eco Novice';
  return 'Carbon Heavyweight';
}

// Compute current active streak
export function getActiveStreak() {
  const dates = Object.keys(state.completedHabits).filter(date => state.completedHabits[date].length > 0);
  if (dates.length === 0) return 0;

  // Sort dates descending
  dates.sort((a, b) => new Date(b) - new Date(a));

  const getLocalDateString = (offset = 0) => {
    const d = new Date();
    d.setDate(d.getDate() - offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayStr = getLocalDateString(0);
  const yesterdayStr = getLocalDateString(1);

  // If latest logged date is not today or yesterday, streak is broken
  const latestLoggedDate = dates[0];
  if (latestLoggedDate !== todayStr && latestLoggedDate !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let checkOffset = latestLoggedDate === todayStr ? 0 : 1;

  while (true) {
    const checkDateStr = getLocalDateString(checkOffset);
    if (state.completedHabits[checkDateStr] && state.completedHabits[checkDateStr].length > 0) {
      streak++;
      checkOffset++;
    } else {
      break;
    }
  }

  return streak;
}

// State Operations
export const store = {
  getState() {
    return {
      ...state,
      activeFootprint: getActiveFootprint(),
      streak: getActiveStreak(),
      rank: getRank(getActiveFootprint().total)
    };
  },

  updateCalculator(inputs) {
    state.calculatorInputs = { ...state.calculatorInputs, ...inputs };
    saveToLocalStorage('aerocarbon_inputs', state.calculatorInputs);
    this.notify();
  },

  saveCalculation() {
    const current = getActiveFootprint();
    const todayStr = new Date().toISOString().split('T')[0];

    // Filter out duplicate entries for today to keep log clean
    state.historyLogs = state.historyLogs.filter(log => log.date !== todayStr);
    
    state.historyLogs.push({
      date: todayStr,
      total: current.total,
      breakdown: { ...current.breakdown }
    });

    // Keep history limited to the last 12 entries
    if (state.historyLogs.length > 12) {
      state.historyLogs.shift();
    }

    saveToLocalStorage('aerocarbon_history', state.historyLogs);
    this.notify();
  },

  toggleHabit(habitId, dateStr) {
    if (!state.completedHabits[dateStr]) {
      state.completedHabits[dateStr] = [];
    }

    const index = state.completedHabits[dateStr].indexOf(habitId);
    if (index === -1) {
      state.completedHabits[dateStr].push(habitId);
    } else {
      state.completedHabits[dateStr].splice(index, 1);
    }

    // Clean up empty date records
    if (state.completedHabits[dateStr].length === 0) {
      delete state.completedHabits[dateStr];
    }

    saveToLocalStorage('aerocarbon_habits', state.completedHabits);
    this.notify();
  },

  updateOffsetSimulation(updates) {
    state.offsetSimulator = { ...state.offsetSimulator, ...updates };
    this.notify();
  },

  subscribe(callback) {
    subscribers.add(callback);
    // Trigger immediately to initialize
    callback(this.getState());
    return () => subscribers.delete(callback);
  },

  notify() {
    const current = this.getState();
    subscribers.forEach(cb => cb(current));
  }
};
