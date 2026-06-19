// Main Application Router & Entry - AeroCarbon
import { store } from './state.js';
import { renderDashboard } from './dashboard.js';
import { renderCalculator } from './calculator.js';
import { renderActionTracker } from './actions.js';
import { renderInsights } from './insights.js';

let activeTab = 'dashboard';

const pageTitles = {
  dashboard: {
    heading: 'Dashboard',
    subheading: 'Your climate status at a glance.'
  },
  calculator: {
    heading: 'Carbon Calculator',
    subheading: 'Granular assessment forms for custom annual footprint calculations.'
  },
  actions: {
    heading: 'Action Tracker',
    subheading: 'Achieve daily carbon offset challenges and maintain habits streaks.'
  },
  insights: {
    heading: 'Insights & Simulator',
    subheading: 'Sustainable lifestyle guidance and trees planting offset simulation.'
  }
};

// Route and render content
function routeTab(tabId) {
  activeTab = tabId;
  
  // Update header text
  const heading = document.getElementById('page-heading');
  const subheading = document.getElementById('page-subheading');
  if (heading && subheading) {
    heading.textContent = pageTitles[tabId].heading;
    subheading.textContent = pageTitles[tabId].subheading;
  }

  // Update active class on nav links
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (link.id === `nav-${tabId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Force direct redraw on content mount
  const state = store.getState();
  const container = document.getElementById('app-content');
  if (container) {
    if (activeTab === 'dashboard') {
      renderDashboard(container, state);
    } else if (activeTab === 'calculator') {
      renderCalculator(container, state);
    } else if (activeTab === 'actions') {
      renderActionTracker(container, state);
    } else if (activeTab === 'insights') {
      renderInsights(container, state);
    }
  }
}

// Global UI subscriber
store.subscribe((state) => {
  // Update user badge elements in the sidebar
  const rankDisplay = document.getElementById('user-rank');
  const avatarDisplay = document.getElementById('user-avatar');
  if (rankDisplay) {
    rankDisplay.textContent = state.rank;
  }
  if (avatarDisplay) {
    // Generate initials based on current status
    const initials = state.rank.split(' ').map(n => n[0]).join('');
    avatarDisplay.textContent = initials;
  }

  // SMART FOCUS-GUARD: Avoid full DOM redraw if the user is typing/dragging values
  const activeTag = document.activeElement ? document.activeElement.tagName : '';
  const isInputActive = activeTag === 'INPUT' || activeTag === 'SELECT';
  
  if (isInputActive) {
    // Skip full tab template redraw to preserve cursor drag context and input focus.
    // The individual component event listeners are already handling local value label updates.
    return;
  }

  // Otherwise, redraw the current active tab template safely (e.g. on external quick-logs clicks)
  const container = document.getElementById('app-content');
  if (container) {
    if (activeTab === 'dashboard') {
      renderDashboard(container, state);
    } else if (activeTab === 'calculator') {
      renderCalculator(container, state);
    } else if (activeTab === 'actions') {
      renderActionTracker(container, state);
    } else if (activeTab === 'insights') {
      renderInsights(container, state);
    }
  }
});

// Attach Navigation Click Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const tabs = ['dashboard', 'calculator', 'actions', 'insights'];
  
  tabs.forEach(tab => {
    const navBtn = document.getElementById(`nav-${tab}`);
    if (navBtn) {
      navBtn.addEventListener('click', () => {
        routeTab(tab);
      });
    }
  });

  // Run initial route setup
  routeTab('dashboard');
});
