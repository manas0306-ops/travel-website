/**
 * VoyageX — Smart Trip Planner, Dynamic Itinerary Builder,
 * Budget Calculator & Smart Packing Checklist.
 */

// Planner State
let plannerState = {
  destinationId: 'manali',
  travelers: 2,
  days: 4,
  style: 'Standard',
  interests: ['Food', 'Nature', 'Photography']
};

document.addEventListener('DOMContentLoaded', () => {
  initPlannerInputs();
  initPackingChecklist();
  loadSavedTrips();

  // Check URL params (e.g., ?dest=bali)
  const urlParams = new URLSearchParams(window.location.search);
  const destParam = urlParams.get('dest');
  if (destParam && typeof getDestinationById === 'function') {
    const found = getDestinationById(destParam);
    if (found) {
      plannerState.destinationId = destParam;
      const select = document.getElementById('planner-destination');
      if (select) select.value = destParam;
    }
  }

  generateItinerary();
  updateBudgetCalculator();
});

// --- PLANNER INPUTS INITIALIZATION ---
function initPlannerInputs() {
  const destSelect = document.getElementById('planner-destination');
  const travelersInput = document.getElementById('planner-travelers');
  const daysInput = document.getElementById('planner-days');
  const styleOptions = document.querySelectorAll('.style-option');
  const interestChips = document.querySelectorAll('.interest-tag-chip');
  const regenBtn = document.getElementById('btn-regen-itinerary');
  const saveTripBtn = document.getElementById('btn-save-trip');
  const printBtn = document.getElementById('btn-print-itinerary');
  const copyBtn = document.getElementById('btn-copy-itinerary');

  // Populate destination select dropdown
  if (destSelect && typeof DESTINATIONS !== 'undefined') {
    destSelect.innerHTML = DESTINATIONS.map(d => `
      <option value="${d.id}" ${d.id === plannerState.destinationId ? 'selected' : ''}>
        ${d.name} (${d.country})
      </option>
    `).join('');

    destSelect.addEventListener('change', (e) => {
      plannerState.destinationId = e.target.value;
      generateItinerary();
      updateBudgetCalculator();
      updatePackingCategoryFromDest(e.target.value);
    });
  }

  // Travelers
  if (travelersInput) {
    travelersInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 20) val = 20;
      plannerState.travelers = val;
      updateBudgetCalculator();
    });
  }

  // Days
  if (daysInput) {
    daysInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 14) val = 14;
      plannerState.days = val;
      generateItinerary();
      updateBudgetCalculator();
    });
  }

  // Style radio options
  styleOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      styleOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      plannerState.style = opt.getAttribute('data-style');
      generateItinerary();
      updateBudgetCalculator();
    });
  });

  // Interests multi-select
  interestChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const interest = chip.getAttribute('data-interest');
      if (plannerState.interests.includes(interest)) {
        if (plannerState.interests.length > 1) {
          plannerState.interests = plannerState.interests.filter(i => i !== interest);
          chip.classList.remove('selected');
        } else {
          showToast('Select at least one interest.', 'warning');
        }
      } else {
        plannerState.interests.push(interest);
        chip.classList.add('selected');
      }
      generateItinerary();
    });
  });

  // Action buttons
  if (regenBtn) regenBtn.addEventListener('click', () => {
    generateItinerary();
    showToast('Itinerary refreshed with fresh activity routes!', 'info');
  });

  if (saveTripBtn) saveTripBtn.addEventListener('click', saveCurrentTrip);
  if (printBtn) printBtn.addEventListener('click', () => window.print());
  if (copyBtn) copyBtn.addEventListener('click', copyItinerarySummary);
}

// --- DYNAMIC ITINERARY BUILDER LOGIC ---
function generateItinerary() {
  const container = document.getElementById('itinerary-results');
  if (!container) return;

  const dest = typeof getDestinationById === 'function' ? getDestinationById(plannerState.destinationId) : null;
  if (!dest) return;

  const daysCount = plannerState.days;
  const daysHtml = [];

  // Theme templates based on day number and interests
  const themes = [
    { title: "Arrival & Orientation Walk", icon: "🛬" },
    { title: "Signature Landmarks & Heritage", icon: "🏛️" },
    { title: "Epic Adventure & Scenic Panoramas", icon: "⚡" },
    { title: "Gastronomic & Culture Discovery", icon: "🍜" },
    { title: "Nature Immersion & Sunset Serenity", icon: "🌿" },
    { title: "Hidden Gems & Artisan Quarters", icon: "🎨" },
    { title: "Relaxation & Memorable Farewell", icon: "✨" }
  ];

  for (let d = 1; d <= daysCount; d++) {
    const themeIdx = (d - 1) % themes.length;
    const theme = themes[themeIdx];

    // Pick dynamic attraction & activity
    const attraction1 = dest.attractions[(d - 1) % dest.attractions.length] || dest.highlights[0];
    const attraction2 = dest.attractions[d % dest.attractions.length] || dest.highlights[1];
    const activity = dest.activities[(d - 1) % dest.activities.length] || "Scenic photography stroll";
    const food = dest.foodMustTry[(d - 1) % dest.foodMustTry.length] || "Local signature delicacy";

    daysHtml.push(`
      <div class="itinerary-day-card">
        <div class="itinerary-day-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="day-badge">Day ${d}</span>
            <h4 class="day-theme-title">${theme.icon} ${theme.title}</h4>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">${dest.name}</span>
        </div>

        <div class="itinerary-timeline">
          <!-- Morning -->
          <div class="timeline-slot">
            <span class="slot-time-badge">09:00 AM</span>
            <div class="slot-desc">
              <strong>Explore ${attraction1}:</strong> Begin the morning early to beat crowds, marvel at architecture, and capture morning light photos.
            </div>
          </div>

          <!-- Afternoon -->
          <div class="timeline-slot">
            <span class="slot-time-badge">01:30 PM</span>
            <div class="slot-desc">
              <strong>Culinary Break & Activity:</strong> Relish authentic <em>${food}</em> at a recommended local eatery, followed by <strong>${activity}</strong>.
            </div>
          </div>

          <!-- Evening -->
          <div class="timeline-slot">
            <span class="slot-time-badge">06:00 PM</span>
            <div class="slot-desc">
              <strong>Sunset at ${attraction2}:</strong> Unwind with scenic sunset views, browse nearby local artisan markets, and enjoy a relaxed dinner.
            </div>
          </div>
        </div>
      </div>
    `);
  }

  container.innerHTML = daysHtml.join('');
}

// --- BUDGET CALCULATOR ---
function updateBudgetCalculator() {
  const dest = typeof getDestinationById === 'function' ? getDestinationById(plannerState.destinationId) : null;
  if (!dest) return;

  const travelers = plannerState.travelers;
  const days = plannerState.days;
  const baseCost = dest.avgDailyCostINR;

  // Style multipliers
  let styleMultiplier = 1.0;
  if (plannerState.style === 'Budget') styleMultiplier = 0.7;
  if (plannerState.style === 'Luxury') styleMultiplier = 1.9;

  // Cost items breakdown
  // Accommodation: calculated per room (assume 2 people per room)
  const rooms = Math.ceil(travelers / 2);
  const stayCost = Math.round(baseCost * 0.45 * styleMultiplier * days * rooms);
  const foodCost = Math.round(baseCost * 0.25 * styleMultiplier * days * travelers);
  const transportCost = Math.round(baseCost * 0.15 * styleMultiplier * days * travelers);
  const activityCost = Math.round(baseCost * 0.15 * styleMultiplier * days * travelers);

  const totalCostINR = stayCost + foodCost + transportCost + activityCost;
  const totalCostUSD = Math.round(totalCostINR / 83);

  // Update DOM elements with values
  const totalDisplay = document.getElementById('budget-total-display');
  const stayDisplay = document.getElementById('budget-stay-val');
  const foodDisplay = document.getElementById('budget-food-val');
  const transitDisplay = document.getElementById('budget-transit-val');
  const activityDisplay = document.getElementById('budget-activity-val');

  if (totalDisplay) totalDisplay.innerHTML = `₹${totalCostINR.toLocaleString()} <span style="font-size: 1.1rem; font-weight: 500; opacity: 0.85;">(~$${totalCostUSD})</span>`;
  if (stayDisplay) stayDisplay.textContent = `₹${stayCost.toLocaleString()}`;
  if (foodDisplay) foodDisplay.textContent = `₹${foodCost.toLocaleString()}`;
  if (transitDisplay) transitDisplay.textContent = `₹${transportCost.toLocaleString()}`;
  if (activityDisplay) activityDisplay.textContent = `₹${activityCost.toLocaleString()}`;
}

// --- SAVE TRIP SYSTEM ---
const SAVED_TRIPS_KEY = 'voyagex_saved_trips';

function saveCurrentTrip() {
  const dest = getDestinationById(plannerState.destinationId);
  if (!dest) return;

  const trip = {
    id: 'trip_' + Date.now(),
    dateCreated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    destId: dest.id,
    destName: dest.name,
    destCountry: dest.country,
    destImg: dest.image,
    days: plannerState.days,
    travelers: plannerState.travelers,
    style: plannerState.style,
    interests: plannerState.interests
  };

  try {
    const raw = localStorage.getItem(SAVED_TRIPS_KEY);
    const trips = raw ? JSON.parse(raw) : [];
    trips.unshift(trip);
    localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips.slice(0, 10)));
    showToast(`Trip to ${dest.name} saved successfully!`, 'success');
    loadSavedTrips();
  } catch (e) {
    showToast('Failed to save trip to localStorage', 'error');
  }
}

function loadSavedTrips() {
  const container = document.getElementById('saved-trips-list');
  if (!container) return;

  try {
    const raw = localStorage.getItem(SAVED_TRIPS_KEY);
    const trips = raw ? JSON.parse(raw) : [];

    if (trips.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px; color: var(--text-muted); font-size: 0.9rem;">
          No saved trips yet. Build an itinerary above and click "Save Trip" to store your plans here.
        </div>
      `;
      return;
    }

    container.innerHTML = trips.map(t => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: 10px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${t.destImg}" alt="${t.destName}" style="width: 52px; height: 52px; object-fit: cover; border-radius: var(--radius-sm);">
          <div>
            <h5 style="margin: 0; font-size: 1rem;">${t.destName}, ${t.destCountry}</h5>
            <span style="font-size: 0.8rem; color: var(--text-muted);">${t.days} Days • ${t.travelers} Travelers • ${t.style} Style</span>
          </div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-sm btn-primary" onclick="loadTripIntoPlanner('${t.id}')">Load</button>
          <button class="btn btn-sm btn-ghost" onclick="deleteSavedTrip('${t.id}')" style="color: var(--danger);">✕</button>
        </div>
      </div>
    `).join('');
  } catch (e) {}
}

function loadTripIntoPlanner(tripId) {
  const raw = localStorage.getItem(SAVED_TRIPS_KEY);
  if (!raw) return;
  const trips = JSON.parse(raw);
  const trip = trips.find(t => t.id === tripId);
  if (!trip) return;

  plannerState.destinationId = trip.destId;
  plannerState.days = trip.days;
  plannerState.travelers = trip.travelers;
  plannerState.style = trip.style;
  plannerState.interests = trip.interests;

  // Sync controls
  const destSelect = document.getElementById('planner-destination');
  const travelersInput = document.getElementById('planner-travelers');
  const daysInput = document.getElementById('planner-days');
  if (destSelect) destSelect.value = trip.destId;
  if (travelersInput) travelersInput.value = trip.travelers;
  if (daysInput) daysInput.value = trip.days;

  document.querySelectorAll('.style-option').forEach(opt => {
    if (opt.getAttribute('data-style') === trip.style) opt.classList.add('selected');
    else opt.classList.remove('selected');
  });

  generateItinerary();
  updateBudgetCalculator();
  showToast(`Loaded saved itinerary for ${trip.destName}`, 'success');
  window.scrollTo({ top: 300, behavior: 'smooth' });
}

function deleteSavedTrip(tripId) {
  const raw = localStorage.getItem(SAVED_TRIPS_KEY);
  if (!raw) return;
  let trips = JSON.parse(raw);
  trips = trips.filter(t => t.id !== tripId);
  localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips));
  loadSavedTrips();
  showToast('Trip removed from saved plans', 'info');
}

function copyItinerarySummary() {
  const dest = getDestinationById(plannerState.destinationId);
  if (!dest) return;

  const text = `✈️ My VoyageX Itinerary for ${dest.name} (${dest.country}):\n` +
               `• Duration: ${plannerState.days} Days\n` +
               `• Travelers: ${plannerState.travelers} people\n` +
               `• Style: ${plannerState.style}\n` +
               `• Key Highlights: ${dest.highlights.join(', ')}\n` +
               `Generated with VoyageX Travel Platform.`;

  navigator.clipboard.writeText(text).then(() => {
    showToast('Itinerary summary copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Failed to copy to clipboard', 'warning');
  });
}

// --- SMART PACKING CHECKLIST SYSTEM ---
const PACKING_ITEMS = {
  Beach: [
    "High-SPF Reef Safe Sunscreen", "UV Protection Sunglasses", "Quick-dry Swimwear",
    "Beach Towel & Sarong", "Waterproof Phone Pouch", "Flip-flops & Water Shoes",
    "Sun Hat / Visor", "Aloe Vera After-sun Gel", "Insulated Water Bottle"
  ],
  Mountains: [
    "Thermal Base Layers", "Windproof & Fleece Jacket", "Sturdy Trekking Boots",
    "Woolen Socks & Beanie", "Lip Balm & Heavy Moisturizer", "Rain Poncho",
    "Trekking Poles", "Portable Power Bank (Cold drains battery)", "Mini First Aid Kit"
  ],
  City: [
    "Comfortable Walking Sneakers", "Compact Day Backpack", "Universal Power Adapter",
    "Metro Card / Transit Passes", "Smart Casual Outfits", "Foldable Umbrella",
    "Crossbody Anti-theft Bag", "Noise-canceling Earbuds"
  ],
  Adventure: [
    "Hydration Pack / CamelBak", "Action Camera & Mounts", "Multi-tool / Swiss Knife",
    "Quick-dry Cargo Pants", "Emergency Whistle & Flashlight", "Electrolyte Tablets",
    "Blister Prevention Pads", "Carabiners & Straps"
  ],
  Winter: [
    "Heavy Down Parka", "Insulated Thermal Gloves", "Waterproof Snow Boots",
    "Hand Warmers (Heat Packs)", "Merino Wool Socks", "Fleece Scarf",
    "Thermal Inner-wear (Tops + Bottoms)", "Thermos Flask"
  ],
  International: [
    "Original Passport + 2 Hard Copies", "Visa Documents & Travel Insurance", "International Forex Card / Cash",
    "Universal Travel Adapter", "Prescription Medications & Note", "Luggage Tag & TSA Locks",
    "Printed Flight & Hotel Bookings", "Emergency Contact Card"
  ]
};

const CHECKLIST_STORAGE_KEY = 'voyagex_packing_state';

function initPackingChecklist() {
  const categoryTabs = document.querySelectorAll('.packing-category-tab');
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-pack-cat');
      renderChecklist(cat);
    });
  });

  const resetBtn = document.getElementById('btn-reset-checklist');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem(CHECKLIST_STORAGE_KEY);
      const activeTab = document.querySelector('.packing-category-tab.active');
      const cat = activeTab ? activeTab.getAttribute('data-pack-cat') : 'Beach';
      renderChecklist(cat);
      showToast('Packing checklist reset', 'info');
    });
  }

  // Initial render with Beach or based on active tab
  renderChecklist('Beach');
}

function updatePackingCategoryFromDest(destId) {
  const dest = getDestinationById(destId);
  if (!dest) return;

  let targetCat = 'City';
  if (dest.category === 'Beach') targetCat = 'Beach';
  else if (dest.category === 'Mountains') targetCat = 'Mountains';
  else if (dest.category === 'Adventure') targetCat = 'Adventure';
  else if (dest.region === 'International') targetCat = 'International';

  const tab = document.querySelector(`.packing-category-tab[data-pack-cat="${targetCat}"]`);
  if (tab) tab.click();
}

function renderChecklist(category) {
  const container = document.getElementById('packing-items-grid');
  const progressFill = document.getElementById('packing-progress-fill');
  const progressText = document.getElementById('packing-progress-text');
  if (!container) return;

  const items = PACKING_ITEMS[category] || PACKING_ITEMS.Beach;
  const savedState = getPackingState();

  let checkedCount = 0;

  container.innerHTML = items.map((item, idx) => {
    const isChecked = savedState[`${category}_${idx}`] === true;
    if (isChecked) checkedCount++;

    return `
      <label class="check-item ${isChecked ? 'completed' : ''}" data-item-key="${category}_${idx}">
        <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="togglePackItem('${category}', ${idx}, this.checked)">
        <span>${item}</span>
      </label>
    `;
  }).join('');

  // Update progress bar
  const pct = Math.round((checkedCount / items.length) * 100);
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.textContent = `${checkedCount} of ${items.length} items packed (${pct}%)`;
}

function togglePackItem(category, idx, checked) {
  const state = getPackingState();
  state[`${category}_${idx}`] = checked;
  localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(state));

  const label = document.querySelector(`[data-item-key="${category}_${idx}"]`);
  if (label) {
    if (checked) label.classList.add('completed');
    else label.classList.remove('completed');
  }

  // Recalculate progress
  const items = PACKING_ITEMS[category] || [];
  let checkedCount = 0;
  items.forEach((_, i) => {
    if (state[`${category}_${i}`]) checkedCount++;
  });

  const pct = Math.round((checkedCount / items.length) * 100);
  const progressFill = document.getElementById('packing-progress-fill');
  const progressText = document.getElementById('packing-progress-text');
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.textContent = `${checkedCount} of ${items.length} items packed (${pct}%)`;

  if (pct === 100) {
    showToast('🎉 All packed! You are ready for takeoff.', 'success');
  }
}

function getPackingState() {
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

// Window global assignments
if (typeof window !== 'undefined') {
  window.loadTripIntoPlanner = loadTripIntoPlanner;
  window.deleteSavedTrip = deleteSavedTrip;
  window.togglePackItem = togglePackItem;
  window.generateItinerary = generateItinerary;
  window.updateBudgetCalculator = updateBudgetCalculator;
}
