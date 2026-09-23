/**
 * VoyageX — Core Application Script
 * Global Navbar, Mobile Drawer, Theme Toggle, Favorites System,
 * Toast Notifications, and Recently Viewed Tracking.
 */

// --- INITIALIZE APPLICATION STATE ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initMobileNav();
  initFavoritesUI();
  updateFavBadge();
  highlightActiveNav();
  initNewsletterForms();
});

// --- THEME (DARK / LIGHT MODE) ---
function initTheme() {
  const savedTheme = localStorage.getItem('voyagex_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  setTheme(activeTheme, false);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next, true);
    });
  });
}

function setTheme(theme, notify = true) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('voyagex_theme', theme);

  const themeIcons = document.querySelectorAll('.theme-toggle-icon');
  themeIcons.forEach(icon => {
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  });

  if (notify) {
    showToast(theme === 'dark' ? 'Switched to Dark Mode' : 'Switched to Light Mode', 'info');
  }
}

// --- HEADER SCROLL BLUR ---
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// --- ACTIVE NAV LINK HIGHLIGHTER ---
function highlightActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// --- MOBILE NAVIGATION DRAWER ---
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-nav-backdrop');
  const closeBtn = document.querySelector('.mobile-nav-close');

  if (!hamburger || !drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  // Close when clicking nav links
  drawer.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// --- TOAST NOTIFICATIONS ---
function showToast(message, type = 'info', duration = 3200) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    favorite: '❤️',
    info: 'ℹ'
  };

  toast.innerHTML = `
    <span style="font-weight: 700; font-size: 1.1rem;">${iconMap[type] || '•'}</span>
    <span style="flex: 1; font-size: 0.92rem; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOutRight 0.3s forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, duration);
}

// --- FAVORITES SYSTEM (LOCAL STORAGE) ---
const FAVORITES_KEY = 'voyagex_favorites';

function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function isFavorite(destId) {
  return getFavorites().includes(destId);
}

function toggleFavorite(destId) {
  let favs = getFavorites();
  const exists = favs.includes(destId);
  const dest = typeof getDestinationById === 'function' ? getDestinationById(destId) : null;
  const destName = dest ? dest.name : 'Destination';

  if (exists) {
    favs = favs.filter(id => id !== destId);
    showToast(`Removed ${destName} from favorites`, 'info');
  } else {
    favs.push(destId);
    showToast(`Saved ${destName} to favorites!`, 'favorite');
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  updateFavBadge();
  updateHeartButtons(destId, !exists);
  renderFavoritesList();
  return !exists;
}

function updateFavBadge() {
  const favs = getFavorites();
  const badges = document.querySelectorAll('.fav-badge-count');
  badges.forEach(b => {
    b.textContent = favs.length;
    b.style.display = favs.length > 0 ? 'inline-block' : 'none';
  });
}

function updateHeartButtons(destId, active) {
  const btns = document.querySelectorAll(`[data-fav-id="${destId}"]`);
  btns.forEach(btn => {
    if (active) {
      btn.classList.add('active');
      btn.innerHTML = '❤️';
      btn.setAttribute('aria-label', 'Remove from favorites');
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '🤍';
      btn.setAttribute('aria-label', 'Save to favorites');
    }
  });
}

// Favorites Drawer / Modal UI
function initFavoritesUI() {
  const favTriggers = document.querySelectorAll('.open-favorites-btn');
  const drawerBackdrop = document.querySelector('.favorites-drawer-backdrop');
  const closeDrawerBtn = document.querySelector('.close-favorites-btn');
  const clearAllBtn = document.querySelector('.clear-favorites-btn');

  if (favTriggers) {
    favTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        openFavoritesDrawer();
      });
    });
  }

  if (closeDrawerBtn && drawerBackdrop) {
    closeDrawerBtn.addEventListener('click', closeFavoritesDrawer);
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeFavoritesDrawer();
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (getFavorites().length === 0) return;
      if (confirm('Are you sure you want to remove all saved destinations?')) {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([]));
        updateFavBadge();
        document.querySelectorAll('.card-btn-fav').forEach(b => {
          b.classList.remove('active');
          b.innerHTML = '🤍';
        });
        renderFavoritesList();
        showToast('All favorites cleared', 'info');
      }
    });
  }
}

function openFavoritesDrawer() {
  const drawer = document.querySelector('.favorites-drawer-backdrop');
  if (!drawer) return;
  renderFavoritesList();
  drawer.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeFavoritesDrawer() {
  const drawer = document.querySelector('.favorites-drawer-backdrop');
  if (!drawer) return;
  drawer.classList.remove('active');
  document.body.style.overflow = '';
}

function renderFavoritesList() {
  const container = document.querySelector('.favorites-list-container');
  if (!container) return;

  const favIds = getFavorites();
  if (favIds.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 48px 16px; color: var(--text-muted);">
        <div style="font-size: 3rem; margin-bottom: 12px;">💔</div>
        <h4 style="color: var(--text-primary); margin-bottom: 8px;">No Saved Destinations</h4>
        <p style="font-size: 0.9rem;">Click the heart icon on any destination card to save it here for later.</p>
        <a href="destinations.html" class="btn btn-primary btn-sm" style="margin-top: 18px;" onclick="closeFavoritesDrawer()">Explore Places</a>
      </div>
    `;
    return;
  }

  let html = '<div style="display: flex; flex-direction: column; gap: 14px;">';
  favIds.forEach(id => {
    const dest = typeof getDestinationById === 'function' ? getDestinationById(id) : null;
    if (!dest) return;

    html += `
      <div style="display: flex; align-items: center; gap: 12px; padding: 10px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-md);">
        <img src="${dest.image}" alt="${dest.name}" style="width: 64px; height: 64px; object-fit: cover; border-radius: var(--radius-sm);">
        <div style="flex: 1; min-width: 0;">
          <h5 style="margin: 0; font-size: 0.98rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${dest.name}</h5>
          <p style="margin: 2px 0 0 0; font-size: 0.8rem; color: var(--text-muted);">${dest.country} • ${dest.category}</p>
          <div style="font-size: 0.82rem; font-weight: 700; color: var(--primary);">₹${dest.avgDailyCostINR.toLocaleString()}/day</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <button class="btn btn-sm btn-primary" onclick="if (typeof viewDestinationDetail === 'function') { viewDestinationDetail('${dest.id}'); closeFavoritesDrawer(); } else { window.location.href = 'destinations.html?explore=${dest.id}'; }" style="padding: 4px 10px; font-size: 0.78rem;">View</button>
          <button class="btn btn-sm btn-ghost" onclick="toggleFavorite('${dest.id}')" style="padding: 4px 10px; font-size: 0.78rem; color: var(--danger);">Remove</button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
}

// --- RECENTLY VIEWED TRACKING ---
const RECENT_KEY = 'voyagex_recent';

function addRecentlyViewed(destId) {
  try {
    let recent = getRecentlyViewed();
    recent = recent.filter(id => id !== destId);
    recent.unshift(destId);
    if (recent.length > 6) recent = recent.slice(0, 6);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  } catch (e) {}
}

function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// --- NEWSLETTER FORM ---
function initNewsletterForms() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        showToast(`Thank you! ${input.value} is subscribed to travel perks.`, 'success');
        input.value = '';
      }
    });
  });
}

// Window global assignments
if (typeof window !== 'undefined') {
  window.showToast = showToast;
  window.toggleFavorite = toggleFavorite;
  window.isFavorite = isFavorite;
  window.getFavorites = getFavorites;
  window.openFavoritesDrawer = openFavoritesDrawer;
  window.closeFavoritesDrawer = closeFavoritesDrawer;
  window.addRecentlyViewed = addRecentlyViewed;
  window.getRecentlyViewed = getRecentlyViewed;
}
