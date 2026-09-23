/**
 * VoyageX — Interactive Map Explorer
 * Open-source Leaflet.js + OpenStreetMap engine rendering interactive destination pins.
 * Fully API-ready with zero paid keys required.
 */

document.addEventListener('DOMContentLoaded', () => {
  initVoyageXMap();
});

function initVoyageXMap() {
  const mapElement = document.getElementById('voyagex-map');
  if (!mapElement) return;

  // Check if Leaflet L is available
  if (typeof L === 'undefined') {
    renderFallbackMap(mapElement);
    return;
  }

  try {
    // Initialize map centered globally
    const map = L.map('voyagex-map', {
      center: [24.0, 45.0],
      zoom: 3,
      minZoom: 2,
      maxZoom: 14,
      scrollWheelZoom: false
    });

    // Add OpenStreetMap tile layer (Free, open-source)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(map);

    // Custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="background: var(--primary); color: #fff; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid #fff;">
          <span style="transform: rotate(45deg); font-size: 14px;">📍</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    // Populate markers from DESTINATIONS dataset
    if (typeof DESTINATIONS !== 'undefined') {
      DESTINATIONS.forEach(dest => {
        if (dest.lat && dest.lng) {
          const marker = L.marker([dest.lat, dest.lng], { icon: customIcon }).addTo(map);

          const popupContent = `
            <div class="map-popup-card">
              <img src="${dest.image}" alt="${dest.name}" class="map-popup-img" />
              <div class="map-popup-body">
                <div class="map-popup-title">${dest.name}, ${dest.country}</div>
                <div class="map-popup-meta">★ ${dest.rating} • ${dest.category} • ₹${dest.avgDailyCostINR.toLocaleString()}/day</div>
                <button class="btn btn-sm btn-primary" onclick="viewDestinationDetail('${dest.id}')" style="width: 100%; font-size: 0.8rem; padding: 6px 10px;">
                  Explore ${dest.name}
                </button>
              </div>
            </div>
          `;

          marker.bindPopup(popupContent, { maxWidth: 260, minWidth: 220 });
        }
      });
    }
  } catch (err) {
    console.error('Error initializing map:', err);
    renderFallbackMap(mapElement);
  }
}

function renderFallbackMap(container) {
  if (!container || typeof DESTINATIONS === 'undefined') return;

  container.innerHTML = `
    <div style="padding: 30px; text-align: center; background: var(--bg-secondary);">
      <h4 style="margin-bottom: 8px;">Explore Destinations Worldwide</h4>
      <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">Click any destination card below to explore full details and itineraries.</p>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px;">
        ${DESTINATIONS.slice(0, 8).map(d => `
          <div style="background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px; cursor: pointer; text-align: left;" onclick="viewDestinationDetail('${d.id}')">
            <div style="font-weight: 700;">📍 ${d.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${d.country} • ₹${d.avgDailyCostINR.toLocaleString()}/day</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
