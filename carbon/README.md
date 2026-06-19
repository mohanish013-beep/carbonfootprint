# AeroCarbon — Interactive Carbon Footprint Tracker

AeroCarbon is a premium, high-performance, single-page web application designed to help individuals understand, track, and reduce their carbon footprint. The application features a dark glassmorphic interface, a reactive calculator, a gamified habit tracker, and an interactive offset simulator.

---

## 🌍 Chosen Vertical: Climate Tech & Personal Sustainability

 personal carbon emissions represent a critical component of global greenhouse gas mitigation. Personal actions (commuting, dieting, energy consumption, waste recycling) form the core of household carbon outputs. 
AeroCarbon targets **personal footprint awareness and behavior modification** by aligning climate actions directly with cost-saving and health-improvement indicators.

---

## 🧠 Approach and Logic

Due to the lack of pre-installed compilation utilities (Node.js/npm) on the local host environment, we built this application using a **high-performance, zero-dependency Vanilla SPA (Single Page Application)** model:
1. **No-Build Architecture**: Leverages native HTML5, modern CSS3 variables, and browser-native **ES6 JavaScript Modules (`type="module"`)**.
2. **Reactive State Pattern**: Built on a centralized pub/sub system (`src/state.js`) that handles mutations and dispatches change events. 
3. **Smart Focus-Guard UI**: When sliders are dragged, the system updates text overlays and computes live mathematical updates locally. The global state subscriber skips full DOM rewrites when inputs are active, preventing cursor-drag or keyboard-focus interruptions.
4. **Data Persistence**: Automatically reads and caches user records, calculator entries, and checked routines to the browser's `localStorage`.

---

## ⚙️ How the Solution Works

The application splits into four core viewports managed by the module router (`src/main.js`):

### 1. The Dashboard (`src/dashboard.js`)
*   **The Interactive Eco-Sphere**: A visual, SVG-drawn planet that reacts in real-time to emissions:
    *   *Low footprint (<4t CO₂e)*: Lush, emerald-green planet populated with multiple leaves, clear skies, and floating birds.
    *   *Moderate footprint (4t - 9t CO₂e)*: A balanced blue-green transition planet with moderate plant life.
    *   *High footprint (>9t CO₂e)*: A distressed red-orange planet covered by thick grey smog clouds and dust particles.
*   **Emissions Breakdown Bar**: Dynamically visualizes the ratio of emissions across transportation, utilities, food, and waste.
*   **Historical Trend Area Chart**: Renders a vector chart plotting logs over time.
*   **Quick-Log Widget**: Allows checking off common daily routines directly from the home tab.

### 2. The Granular Calculator (`src/calculator.js`)
*   Provides range inputs and selectors across four core sectors:
    *   *Transportation*: Commute distances, fuel types (EV, Hybrid, Sedan, SUV), and air flights count.
    *   *Utilities*: Electricity volumes, grid green-mix percentages, and heating fuel types.
    *   *Food*: Dietary tiers (heavy meat eater, vegetarian, vegan, etc.).
    *   *Waste*: Household population counts and specific material recycling filters.
*   Recalculates totals instantly on every slider move, displaying changes in a sticky live metrics panel.

### 3. The Habit Tracker (`src/actions.js`)
*   A daily checklist of green habits (e.g., line-drying clothes, eating plant-based, using public transit).
*   Logs carbon offsets in kilograms (kg CO₂) instead of annual tons to represent short-term impacts.
*   Displays daily progress bars towards a target limit (8.0 kg CO₂), calculates consecutive active streaks, and projects annualized savings equivalents.

### 4. The Offset & Tree Simulator (`src/insights.js`)
*   Pairs climate guidelines with direct health metrics (e.g., active transit improves cardiovascular health).
*   **Carbon Neutrality Slider**: Simulates the effects of planting trees or buying offsets against the user's footprint, flashing a "Net Zero Achieved" banner once emissions drop to 0.00 tons.

---

## 🔍 Key Scientific Assumptions

All carbon coefficient multipliers are drawn from standard scientific benchmarks (EPA, Greenhouse Gas Protocol, and Defra emission libraries):

| Category | parameter / Input | Annual Carbon Equivalent | Detail |
| :--- | :--- | :--- | :--- |
| **Transport** | SUV / Gas Truck | `0.44 kg CO₂ per mile` | Standard large gasoline light-truck average |
| **Transport** | Sedan / Compact | `0.32 kg CO₂ per mile` | Average midsize passenger vehicle output |
| **Transport** | Hybrid / PHEV | `0.17 kg CO₂ per mile` | Dual combustion-electric fuel efficiency |
| **Transport** | Electric Vehicle | `0.07 kg CO₂ per mile` | Calculated using average power grid charging emissions |
| **Transport** | Short-Haul Flight | `220 kg CO₂ per flight` | Segment length under 3 hours (~500 miles) |
| **Transport** | Long-Haul Flight | `850 kg CO₂ per flight` | Segment length over 3 hours (~2,000 miles) |
| **Utilities** | Grid Electricity | `0.39 kg CO₂ per kWh` | Standard national coal/gas/clean fuel electricity grid mix |
| **Utilities** | Gas Heating Boiler | `120 kg CO₂ per month` | Average home natural gas utility use |
| **Utilities** | Oil Heating Boiler | `210 kg CO₂ per month` | Standard home fuel-oil utility use |
| **Food** | Heavy Meat Diet | `2,800 kg CO₂ per year` | Steak, beef, or poultry consumed daily |
| **Food** | Vegan Diet | `750 kg CO₂ per year` | Purely plant-based diet profile |
| **Waste** | Waste baseline | `380 kg CO₂ per person` | Average personal municipal solid waste yield |
| **Waste** | Active Recycling | `-135 kg CO₂ maximum` | Combined reduction for recycling paper, plastics, glass, and metals |
| **Simulator** | Trees Planted | `-22 kg CO₂ per year` | Average annual carbon absorption of a mature tree |

---

## 🚀 How to Run & Deploy

### Run Locally
The app runs natively in browsers but requires a web server to resolve ES6 module imports under CORS. Since the native PowerShell server is already active on your machine, navigate to:
**[http://localhost:8080/](http://localhost:8080/)**

### Deploy to Vercel
Because there is no build/compilation step, you can deploy this static directory directly to Vercel:
1. Drag the files into a new GitHub repository.
2. Link the repository to your [Vercel Dashboard](https://vercel.com). It will deploy instantly.
