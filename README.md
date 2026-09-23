# 🧭 VoyageX — Smart Travel Discovery & Trip Planning Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Leaflet](https://img.shields.io/badge/Maps-Leaflet.js-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Storage](https://img.shields.io/badge/Storage-localStorage-orange)](#-storage-architecture)

> A production-grade, portfolio-ready travel tech web platform designed to streamline destination discovery, generate dynamic day-by-day itineraries, estimate transparent travel budgets, and provide smart preparation checklists.

---

## 🌟 Overview

**VoyageX** is a modern frontend travel platform engineered with a focus on product thinking, elegant UI/UX design, accessible semantic markup, and client-side web technologies. It bridges inspiration and execution by providing travelers with an interactive discovery engine, real-time budget forecasting, and custom itinerary planning with zero account friction.

---

## 🚀 Key Features

### 1. 🔍 Dynamic Destination Discovery
- **Comprehensive Dataset**: 18+ handpicked premier destinations covering both **India** (*Manali, Goa, Jaipur, Kashmir, Kerala, Rishikesh, Ladakh, Udaipur*) and **International** destinations (*Paris, Bali, Tokyo, Dubai, Switzerland, Santorini, New York, Maldives, Kyoto, Machu Picchu*).
- **Instant Search & Multi-Criteria Filtering**: Filter by category (*Mountains, Beach, Culture, Adventure, Luxury, Nature, City, Budget*), region (*India, International*), budget tier, and minimum ratings.
- **Dynamic Sorting**: Sort by popularity, highest rating, daily expense (low-to-high / high-to-low), and alphabetical order.
- **Detailed Experience Modal**: High-res imagery, ideal stay duration, best season, top attractions, culinary highlights, adventure activities, and simulated weather forecasts.

### 2. ⚡ Smart Day-by-Day Itinerary Builder
- **Algorithmic Schedule Generation**: Select destination, travelers (1–20), duration (1–14 days), travel style (*Budget, Standard, Luxury*), and interest tags (*Food, Adventure, Culture, Photography, Nature, Relaxation*).
- **Structured Timelines**: Day-by-day morning, afternoon, and evening recommendations with realistic pacing.
- **Action Controls**: "Regenerate Itinerary", "Save Trip to Storage", "Print / Export PDF", and "Copy Shareable Summary".

### 3. 💰 Transparent Budget Forecasting Calculator
- **Itemized Live Breakdown**: Real-time calculations of accommodation, dining, local transit, and activity admission fees.
- **Dynamic Multipliers**: Automatically adapts cost calculations based on travel style and number of rooms needed.
- **Dual Currency Support**: Formatted simultaneously in Indian Rupees (₹) and US Dollars ($).

### 4. ⚖️ Side-by-Side Destination Comparison
- Compare any two destinations simultaneously across daily budget, user ratings, recommended duration, optimal travel season, travel style, and regional climate.

### 5. 🧳 Smart Packing Checklist
- Filterable checklist categories: *Beach, Mountains, City, Adventure, Winter, and International*.
- Check-off items with animated strikethrough and persistent state saved directly to `localStorage`.
- Real-time percentage progress bar indicating packing readiness.

### 6. 🧭 Interactive Travel Personality Quiz
- 5-question multi-step quiz diagnosing traveler archetypes (*The Alpine Adventurer, The Coastal Dreamer, The Cosmopolitan Nomad, The Heritage Connoisseur, The Serenity Seeker*).
- Recommends 3 tailored destinations with direct 1-click links into the trip planner.

### 7. 🗺️ Global Interactive Map Explorer
- Open-source **Leaflet.js + OpenStreetMap** integration with zero API key dependencies.
- Interactive coordinates and pins with rich preview popups linking to destination details.

### 8. ❤️ Persistent Favorites & Recently Explored
- 1-click heart toggle on destination cards and modal views.
- Navbar badge counter and slide-over favorites drawer with remove, view, and "Clear All" functionality.
- Tracks recently viewed destinations across user browsing sessions.

### 9. 🌙 Accessible Dark Mode
- Seamless theme toggle persisted in `localStorage` with automatic system `prefers-color-scheme` detection.
- Meticulously tested color contrast ensuring high readability across all cards, modals, and forms.

### 10. ✉️ Validated Contact & Support Concierge
- Client-side form validation with real-time feedback and simulated async submission states.
- Direct concierge details and interactive FAQ accordion.

---

## 🎨 Design System & Aesthetics

- **Primary Brand Color**: Deep Travel Teal / Cyan (`#0284c7`, `#0ea5e9`)
- **Accent Secondary**: Warm Sunset Coral (`#f97316`, `#ea580c`)
- **Typography**: [Outfit](https://fonts.google.com/specimen/Outfit) (Display headings) and [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) (Body & UI)
- **Glassmorphism**: Backdrop blur (`backdrop-filter: blur(14px)`) on sticky header and modal backdrops
- **Micro-Interactions**: Hover card elevates (`translateY(-6px)`), smooth image scaling, responsive drawer transitions, and accessible focus rings

---

## 📂 Project Architecture

```
travel-website/
├── index.html                 # Homepage: Hero, live search, trending grid, quiz, map, testimonials
├── destinations.html          # Destination discovery: Search, multi-criteria filters, grid, modal view, compare drawer
├── trip-planner.html          # Smart Trip Planner: Itinerary builder, budget calculator, packing checklist
├── why-travel.html            # Editorial storytelling: Why travel, science of exploration, before/after perspective
├── contact.html               # Contact hub: Validated form, concierge details, FAQ accordion
├── style.css                  # Root stylesheet entry importing modular CSS files
├── css/
│   ├── style.css              # Design tokens, typography resets, header/navbar, footer, toast, buttons, utilities
│   ├── components.css         # Cards, skeletons, filter toolbar, itinerary timeline, budget breakdown, quiz, map
│   ├── dark-mode.css          # Semantic dark mode overrides for background, surfaces, borders, and text
│   └── responsive.css         # Breakpoint rules for mobile navigation drawer, tablets, and touch layouts
├── js/
│   ├── destinations-data.js   # Centralized dataset of 18 destinations with rich metadata and coordinates
│   ├── app.js                 # Global utilities: Sticky header, theme toggle, favorites core, mobile drawer, toasts
│   ├── destinations.js        # Search & filter engine, sorting, card rendering, explore modal, destination comparison
│   ├── planner.js             # Smart itinerary generator, live budget breakdown calculator, packing checklist
│   ├── quiz.js                # Travel personality quiz engine with dynamic archetype calculation
│   ├── contact.js             # Contact form validation, simulated async states, FAQ accordion
│   └── map.js                 # Interactive Leaflet map explorer and fallback renderer
└── README.md                  # Comprehensive platform documentation and local setup instructions
```

---

## 💻 Tech Stack

- **Markup**: Semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`)
- **Styling**: Modern CSS3 (Custom Properties / CSS Variables, Flexbox, CSS Grid, Glassmorphism, Animations)
- **Scripting**: Modern Vanilla JavaScript (ES6+ Modules, DOM Manipulation, Arrays/Objects, LocalStorage, Event Delegation)
- **Maps**: [Leaflet.js](https://leafletjs.com/) with [OpenStreetMap](https://www.openstreetmap.org/) (Open-source, no paid API keys required)
- **Icons & Imagery**: Curated high-resolution Unsplash CDN assets with responsive optimization and emoji icons

---

## 🛠️ Local Setup & Running Instructions

This project is built using native web technologies and requires no bundlers, compilation, or heavy npm installations.

### Option 1: Direct Browser
1. Clone or download this repository:
   ```bash
   git clone https://github.com/manas0306-ops/travel-website.git
   cd travel-website
   ```
2. Double-click `index.html` to open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Recommended)
Running through a local web server ensures full support for local caching, fonts, and map tiles:

- **Using Python 3**:
  ```bash
  python -m http.server 8000
  ```
  Open `http://localhost:8000` in your browser.

- **Using Node.js (`npx serve`)**:
  ```bash
  npx serve .
  ```

- **Using VS Code Live Server**:
  Right-click `index.html` and select **"Open with Live Server"**.

---

## 🔮 API-Ready Architecture for Future Enhancements

VoyageX was architected from the ground up to allow seamless backend integration:

| Component | Current Implementation | API-Ready Path |
|---|---|---|
| **Weather Widget** | Realistic climate sample object per destination | Drop-in ready for [OpenWeatherMap API](https://openweathermap.org/api) in `js/destinations.js` |
| **Interactive Map** | Free OpenStreetMap tiles via Leaflet.js | Ready for [Mapbox GL](https://www.mapbox.com/) or Google Maps JavaScript API |
| **Destination Data** | Centralized in `js/destinations-data.js` | Replace array with `fetch('/api/destinations')` endpoint |
| **Trip Storage** | Client-side `localStorage` | Seamless migration to Firebase / Supabase or REST API auth |
| **Contact Form** | Client-side validation with async simulation | Replace `setTimeout` with `fetch('/api/contact', { method: 'POST' })` |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Manas**
- GitHub: [@manas0306-ops](https://github.com/manas0306-ops)
- Project Repository: [travel-website](https://github.com/manas0306-ops/travel-website)
