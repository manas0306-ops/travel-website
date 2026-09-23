/**
 * VoyageX — Destination Discovery & Search/Filter Engine
 * Dynamic card rendering, multi-criteria filtering, sorting,
 * exploration modal, comparison drawer, and recently explored.
 */

// State
let activeFilters = {
  searchQuery: '',
  category: 'All',
  region: 'All',
  budgetRange: 'All',
  minRating: 0,
  sortBy: 'popularity'
};

let compareList = [];

document.addEventListener('DOMContentLoaded', () => {
  initSearchAndFilters();
  initDetailModal();
  initCompareSystem();
  renderDestinations();
  renderRecentlyExplored();

  // Check URL query parameters (e.g., ?category=Mountains or ?search=Bali)
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  const searchParam = urlParams.get('search');
  const exploreParam = urlParams.get('explore');

  if (catParam) {
    setCategoryFilter(catParam);
  }
  if (searchParam) {
    const searchInput = document.getElementById('dest-search-input');
    if (searchInput) {
      searchInput.value = searchParam;
      activeFilters.searchQuery = searchParam.toLowerCase().trim();
      renderDestinations();
    }
  }
  if (exploreParam) {
    setTimeout(() => viewDestinationDetail(exploreParam), 200);
  }
});

// --- FILTER & SEARCH INITIALIZATION ---
function initSearchAndFilters() {
  const searchInput = document.getElementById('dest-search-input');
  const clearSearchBtn = document.getElementById('search-clear-btn');
  const regionSelect = document.getElementById('filter-region');
  const budgetSelect = document.getElementById('filter-budget');
  const ratingSelect = document.getElementById('filter-rating');
  const sortSelect = document.getElementById('filter-sort');
  const categoryPills = document.querySelectorAll('.category-pill');

  // Search input debounced
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeFilters.searchQuery = e.target.value.toLowerCase().trim();
      if (clearSearchBtn) {
        if (e.target.value.length > 0) {
          clearSearchBtn.classList.add('visible');
        } else {
          clearSearchBtn.classList.remove('visible');
        }
      }
      renderDestinations();
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      activeFilters.searchQuery = '';
      clearSearchBtn.classList.remove('visible');
      renderDestinations();
      searchInput.focus();
    });
  }

  // Category pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.getAttribute('data-category');
      setCategoryFilter(cat);
    });
  });

  // Select Dropdowns
  if (regionSelect) {
    regionSelect.addEventListener('change', (e) => {
      activeFilters.region = e.target.value;
      renderDestinations();
    });
  }

  if (budgetSelect) {
    budgetSelect.addEventListener('change', (e) => {
      activeFilters.budgetRange = e.target.value;
      renderDestinations();
    });
  }

  if (ratingSelect) {
    ratingSelect.addEventListener('change', (e) => {
      activeFilters.minRating = parseFloat(e.target.value) || 0;
      renderDestinations();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeFilters.sortBy = e.target.value;
      renderDestinations();
    });
  }
}

function setCategoryFilter(category) {
  activeFilters.category = category;
  const categoryPills = document.querySelectorAll('.category-pill');
  categoryPills.forEach(p => {
    if (p.getAttribute('data-category') === category) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });
  renderDestinations();
}

function resetAllFilters() {
  activeFilters = {
    searchQuery: '',
    category: 'All',
    region: 'All',
    budgetRange: 'All',
    minRating: 0,
    sortBy: 'popularity'
  };

  const searchInput = document.getElementById('dest-search-input');
  if (searchInput) searchInput.value = '';

  const regionSelect = document.getElementById('filter-region');
  if (regionSelect) regionSelect.value = 'All';

  const budgetSelect = document.getElementById('filter-budget');
  if (budgetSelect) budgetSelect.value = 'All';

  const ratingSelect = document.getElementById('filter-rating');
  if (ratingSelect) ratingSelect.value = '0';

  const sortSelect = document.getElementById('filter-sort');
  if (sortSelect) sortSelect.value = 'popularity';

  setCategoryFilter('All');
}

// --- FILTER & SORT LOGIC ---
function getFilteredDestinations() {
  if (typeof DESTINATIONS === 'undefined') return [];

  return DESTINATIONS.filter(item => {
    // 1. Search Query
    if (activeFilters.searchQuery) {
      const q = activeFilters.searchQuery;
      const matchName = item.name.toLowerCase().includes(q);
      const matchCountry = item.country.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchAttractions = item.attractions.some(a => a.toLowerCase().includes(q));
      if (!matchName && !matchCountry && !matchDesc && !matchCategory && !matchAttractions) {
        return false;
      }
    }

    // 2. Category Filter
    if (activeFilters.category !== 'All') {
      if (item.category.toLowerCase() !== activeFilters.category.toLowerCase()) {
        return false;
      }
    }

    // 3. Region Filter
    if (activeFilters.region !== 'All') {
      if (item.region !== activeFilters.region) {
        return false;
      }
    }

    // 4. Rating Filter
    if (activeFilters.minRating > 0) {
      if (item.rating < activeFilters.minRating) {
        return false;
      }
    }

    // 5. Budget Range
    if (activeFilters.budgetRange === 'budget') {
      if (item.avgDailyCostINR > 4000) return false;
    } else if (activeFilters.budgetRange === 'mid') {
      if (item.avgDailyCostINR < 4000 || item.avgDailyCostINR > 10000) return false;
    } else if (activeFilters.budgetRange === 'luxury') {
      if (item.avgDailyCostINR < 10000) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (activeFilters.sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'price-asc':
        return a.avgDailyCostINR - b.avgDailyCostINR;
      case 'price-desc':
        return b.avgDailyCostINR - a.avgDailyCostINR;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'popularity':
      default:
        return b.reviews - a.reviews;
    }
  });
}

// --- RENDER DESTINATION CARDS ---
function renderDestinations() {
  const container = document.getElementById('destinations-list');
  const countBadge = document.getElementById('results-count');
  if (!container) return;

  const list = getFilteredDestinations();

  if (countBadge) {
    countBadge.textContent = `${list.length} ${list.length === 1 ? 'place' : 'places'} found`;
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="empty-state-icon">🧭</div>
        <h3>No destinations found</h3>
        <p>We couldn't find any destinations matching your current filters. Try changing keywords or resetting filters.</p>
        <button class="btn btn-primary" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(item => createDestinationCardHtml(item)).join('');
}

function createDestinationCardHtml(item) {
  const isFav = typeof isFavorite === 'function' ? isFavorite(item.id) : false;
  const isCompared = compareList.includes(item.id);

  return `
    <article class="destination-card" data-id="${item.id}">
      <div class="card-media">
        <img src="${item.image}" alt="${item.name}, ${item.country}" loading="lazy" />
        <div class="card-badges">
          <span class="badge badge-category">${item.category}</span>
          <span class="badge badge-region">${item.region}</span>
        </div>
        <button class="card-btn-fav ${isFav ? 'active' : ''}" 
                data-fav-id="${item.id}" 
                onclick="event.stopPropagation(); toggleFavorite('${item.id}')"
                aria-label="${isFav ? 'Remove from favorites' : 'Save to favorites'}">
          ${isFav ? '❤️' : '🤍'}
        </button>
        <div class="card-rating-float">
          <span class="star-icon">★</span> ${item.rating.toFixed(1)} (${item.reviews})
        </div>
      </div>

      <div class="card-body">
        <div class="card-header-info">
          <div>
            <h3 class="card-title">${item.name}</h3>
            <div class="card-country">📍 ${item.country}</div>
          </div>
        </div>

        <p class="card-description">${item.description}</p>

        <div class="card-meta-list">
          <div class="card-meta-item">
            <span>⏱️ <strong>${item.duration}</strong></span>
          </div>
          <div class="card-meta-item">
            <span>🗓️ <strong>${item.bestTime.split('(')[0]}</strong></span>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <div class="card-price-display">
          <span class="price-sub">Avg. Daily Cost</span>
          <span class="price-val">₹${item.avgDailyCostINR.toLocaleString()} <span style="font-size: 0.75rem; font-weight: 500; color: var(--text-muted);">($${item.avgDailyCostUSD})</span></span>
        </div>

        <div class="card-actions-row">
          <label class="btn-compare-check" title="Compare side-by-side">
            <input type="checkbox" onchange="toggleCompare('${item.id}')" ${isCompared ? 'checked' : ''} />
            <span>Compare</span>
          </label>
          <button class="btn btn-sm btn-primary" onclick="viewDestinationDetail('${item.id}')">Explore</button>
        </div>
      </div>
    </article>
  `;
}

// --- DESTINATION DETAIL MODAL ---
function initDetailModal() {
  const modalBackdrop = document.getElementById('destination-modal');
  const closeBtn = document.getElementById('modal-close-trigger');

  if (modalBackdrop && closeBtn) {
    closeBtn.addEventListener('click', closeDestinationModal);
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeDestinationModal();
    });
  }

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDestinationModal();
      closeCompareModal();
    }
  });
}

function viewDestinationDetail(id) {
  const dest = typeof getDestinationById === 'function' ? getDestinationById(id) : null;
  if (!dest) return;

  // Track in recently viewed
  if (typeof addRecentlyViewed === 'function') {
    addRecentlyViewed(id);
    renderRecentlyExplored();
  }

  const modal = document.getElementById('destination-modal');
  if (!modal) return;

  const isFav = typeof isFavorite === 'function' ? isFavorite(dest.id) : false;

  modal.innerHTML = `
    <div class="modal-dialog">
      <button class="modal-close-btn" onclick="closeDestinationModal()" aria-label="Close modal">✕</button>
      
      <div class="destination-modal-hero" style="background-image: url('${dest.image}');">
        <div class="modal-hero-title-group">
          <span class="badge badge-category" style="margin-bottom: 8px;">${dest.category} • ${dest.region}</span>
          <h2>${dest.name}</h2>
          <div class="modal-hero-subtitle">
            <span>📍 ${dest.country}</span>
            <span>★ ${dest.rating} (${dest.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <div class="modal-details-body">
        <!-- Quick stats chips -->
        <div class="detail-chips-row">
          <div class="detail-chip">
            <div class="detail-chip-label">Best Season</div>
            <div class="detail-chip-val">${dest.bestTime}</div>
          </div>
          <div class="detail-chip">
            <div class="detail-chip-label">Ideal Stay</div>
            <div class="detail-chip-val">${dest.duration}</div>
          </div>
          <div class="detail-chip">
            <div class="detail-chip-label">Daily Budget</div>
            <div class="detail-chip-val">₹${dest.avgDailyCostINR.toLocaleString()}</div>
          </div>
          <div class="detail-chip">
            <div class="detail-chip-label">Travel Style</div>
            <div class="detail-chip-val">${dest.budgetTier}</div>
          </div>
        </div>

        <!-- Weather Component (Live API-ready) -->
        <div class="weather-card">
          <div class="weather-info-left">
            <div class="weather-icon-large">${dest.weatherSample.icon}</div>
            <div>
              <div class="weather-temp">${dest.weatherSample.temp}</div>
              <div class="weather-status">${dest.weatherSample.condition} • Rain Chance: ${dest.weatherSample.rainChance}</div>
            </div>
          </div>
          <div class="weather-api-badge">Simulated Forecast (API Ready)</div>
        </div>

        <!-- Overview -->
        <div class="detail-section">
          <h4>📖 Overview</h4>
          <p class="lead" style="font-size: 1rem;">${dest.description}</p>
        </div>

        <!-- Key Attractions -->
        <div class="detail-section">
          <h4>🏛️ Top Attractions</h4>
          <div class="tag-cloud">
            ${dest.attractions.map(a => `<span class="tag-cloud-item">${a}</span>`).join('')}
          </div>
        </div>

        <!-- Must-Try Food -->
        <div class="detail-section">
          <h4>🍜 Culinary Must-Tries</h4>
          <div class="tag-cloud">
            ${dest.foodMustTry.map(f => `<span class="tag-cloud-item" style="background: var(--accent-light); color: var(--accent);">${f}</span>`).join('')}
          </div>
        </div>

        <!-- Activities -->
        <div class="detail-section">
          <h4>🏄 Adventure & Experiences</h4>
          <div class="tag-cloud">
            ${dest.activities.map(act => `<span class="tag-cloud-item" style="background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border);">${act}</span>`).join('')}
          </div>
        </div>
      </div>

      <div class="modal-actions-footer">
        <button class="btn btn-outline" onclick="toggleFavorite('${dest.id}'); this.innerHTML = isFavorite('${dest.id}') ? '❤️ Saved' : '🤍 Save Favorite';">
          ${isFav ? '❤️ Saved' : '🤍 Save Favorite'}
        </button>

        <a href="trip-planner.html?dest=${dest.id}" class="btn btn-primary">
          ✨ Plan a Trip to ${dest.name}
        </a>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDestinationModal() {
  const modal = document.getElementById('destination-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// --- DESTINATION COMPARISON SYSTEM ---
function initCompareSystem() {
  const bar = document.getElementById('compare-bar');
  const triggerBtn = document.getElementById('compare-trigger-btn');
  const clearBtn = document.getElementById('compare-clear-btn');

  if (triggerBtn) {
    triggerBtn.addEventListener('click', openCompareModal);
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      compareList = [];
      updateCompareBar();
      renderDestinations();
    });
  }
}

function toggleCompare(destId) {
  if (compareList.includes(destId)) {
    compareList = compareList.filter(id => id !== destId);
  } else {
    if (compareList.length >= 2) {
      showToast('You can compare up to 2 destinations at a time.', 'warning');
      renderDestinations();
      return;
    }
    compareList.push(destId);
  }

  updateCompareBar();
  renderDestinations();
}

function updateCompareBar() {
  const bar = document.getElementById('compare-bar');
  const chipsContainer = document.getElementById('compare-chips');
  if (!bar) return;

  if (compareList.length > 0) {
    bar.classList.add('active');
    if (chipsContainer) {
      chipsContainer.innerHTML = compareList.map(id => {
        const dest = getDestinationById(id);
        return `<span class="compare-chip-item">${dest.name} <button onclick="toggleCompare('${id}')" style="cursor: pointer;">✕</button></span>`;
      }).join('');
    }
  } else {
    bar.classList.remove('active');
  }
}

function openCompareModal() {
  if (compareList.length < 2) {
    showToast('Please select 2 destinations to compare.', 'info');
    return;
  }

  const d1 = getDestinationById(compareList[0]);
  const d2 = getDestinationById(compareList[1]);
  if (!d1 || !d2) return;

  const modal = document.getElementById('compare-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-dialog" style="max-width: 860px;">
      <button class="modal-close-btn" onclick="closeCompareModal()">✕</button>
      <div style="padding: 24px 28px 0 28px;">
        <h3>Destination Comparison</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Comparing side-by-side key metrics and highlights.</p>
      </div>

      <div class="compare-grid">
        <!-- Col 1 -->
        <div class="compare-col">
          <img src="${d1.image}" alt="${d1.name}" class="compare-img">
          <h4 style="font-size: 1.3rem;">${d1.name}</h4>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${d1.country} • ${d1.category}</span>

          <table class="compare-table">
            <tr><td class="label">Rating</td><td class="value">★ ${d1.rating} (${d1.reviews})</td></tr>
            <tr><td class="label">Daily Cost</td><td class="value" style="color: var(--primary);">₹${d1.avgDailyCostINR.toLocaleString()}</td></tr>
            <tr><td class="label">Ideal Stay</td><td class="value">${d1.duration}</td></tr>
            <tr><td class="label">Best Season</td><td class="value">${d1.bestTime}</td></tr>
            <tr><td class="label">Style</td><td class="value">${d1.budgetTier}</td></tr>
            <tr><td class="label">Weather</td><td class="value">${d1.weatherSample.temp}, ${d1.weatherSample.condition}</td></tr>
          </table>

          <div style="margin-top: 16px;">
            <a href="trip-planner.html?dest=${d1.id}" class="btn btn-sm btn-primary" style="width: 100%;">Plan Trip Here</a>
          </div>
        </div>

        <!-- Col 2 -->
        <div class="compare-col">
          <img src="${d2.image}" alt="${d2.name}" class="compare-img">
          <h4 style="font-size: 1.3rem;">${d2.name}</h4>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${d2.country} • ${d2.category}</span>

          <table class="compare-table">
            <tr><td class="label">Rating</td><td class="value">★ ${d2.rating} (${d2.reviews})</td></tr>
            <tr><td class="label">Daily Cost</td><td class="value" style="color: var(--primary);">₹${d2.avgDailyCostINR.toLocaleString()}</td></tr>
            <tr><td class="label">Ideal Stay</td><td class="value">${d2.duration}</td></tr>
            <tr><td class="label">Best Season</td><td class="value">${d2.bestTime}</td></tr>
            <tr><td class="label">Style</td><td class="value">${d2.budgetTier}</td></tr>
            <tr><td class="label">Weather</td><td class="value">${d2.weatherSample.temp}, ${d2.weatherSample.condition}</td></tr>
          </table>

          <div style="margin-top: 16px;">
            <a href="trip-planner.html?dest=${d2.id}" class="btn btn-sm btn-primary" style="width: 100%;">Plan Trip Here</a>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCompareModal() {
  const modal = document.getElementById('compare-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// --- RECENTLY EXPLORED ---
function renderRecentlyExplored() {
  const section = document.getElementById('recently-explored-section');
  const container = document.getElementById('recently-explored-grid');
  if (!section || !container) return;

  const recentIds = typeof getRecentlyViewed === 'function' ? getRecentlyViewed() : [];
  if (recentIds.length === 0) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  const recentDests = recentIds.map(id => getDestinationById(id)).filter(Boolean);

  container.innerHTML = recentDests.map(d => `
    <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; cursor: pointer; transition: transform var(--transition-fast);" onclick="viewDestinationDetail('${d.id}')">
      <img src="${d.image}" alt="${d.name}" style="width: 100%; height: 110px; object-fit: cover;">
      <div style="padding: 10px;">
        <h5 style="margin: 0; font-size: 0.95rem;">${d.name}</h5>
        <span style="font-size: 0.78rem; color: var(--text-muted);">${d.country} • ₹${d.avgDailyCostINR.toLocaleString()}/day</span>
      </div>
    </div>
  `).join('');
}

// Window global assignments
if (typeof window !== 'undefined') {
  window.viewDestinationDetail = viewDestinationDetail;
  window.closeDestinationModal = closeDestinationModal;
  window.toggleCompare = toggleCompare;
  window.openCompareModal = openCompareModal;
  window.closeCompareModal = closeCompareModal;
  window.resetAllFilters = resetAllFilters;
  window.createDestinationCardHtml = createDestinationCardHtml;
}
