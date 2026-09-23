/**
 * VoyageX — Travel Personality Quiz Engine
 * Interactive 5-question multi-step quiz diagnosing traveler archetype
 * and recommending tailored destinations.
 */

const QUIZ_QUESTIONS = [
  {
    id: 1,
    title: "What is your dream vacation scenery?",
    options: [
      { text: "Majestic snow peaks and alpine mountain passes", icon: "🏔️", type: "mountain" },
      { text: "Sun-drenched tropical shores and turquoise lagoons", icon: "🏖️", type: "beach" },
      { text: "Vibrant neon skylines and historic cobblestone boulevards", icon: "🏙️", type: "city" },
      { text: "Lush emerald backwaters and tranquil cloud forests", icon: "🌿", type: "nature" }
    ]
  },
  {
    id: 2,
    title: "What pace of travel resonates most with your soul?",
    options: [
      { text: "High-octane adrenaline, rafting, hiking, and thrills", icon: "⚡", type: "adventure" },
      { text: "Deep cultural immersion, ancient temples, and museums", icon: "🏛️", type: "culture" },
      { text: "Slow living, seaside cafes, wellness spas, and sunsets", icon: "✨", type: "relaxation" },
      { text: "Street food trails, Michelin spots, and culinary tours", icon: "🍜", type: "foodie" }
    ]
  },
  {
    id: 3,
    title: "What is your preferred accommodation vibe?",
    options: [
      { text: "Authentic local homestays or mountain camps", icon: "🏕️", type: "budget" },
      { text: "Charming boutique heritage hotels with character", icon: "🏨", type: "standard" },
      { text: "Ultra-luxury overwater villas and 5-star palace suites", icon: "💎", type: "luxury" },
      { text: "Sleek designer lofts in the city center", icon: "🛋️", type: "city" }
    ]
  },
  {
    id: 4,
    title: "What is your ideal travel budget philosophy?",
    options: [
      { text: "Smart budget-conscious & high-value backpacking", icon: "🎒", type: "budget" },
      { text: "Comfortable standard with occasional splurge meals", icon: "⚖️", type: "standard" },
      { text: "Premium luxury — comfort and experience first", icon: "💳", type: "luxury" }
    ]
  },
  {
    id: 5,
    title: "Who are your ideal travel companions for this voyage?",
    options: [
      { text: "Solo journey of self-discovery and freedom", icon: "🧭", type: "solo" },
      { text: "Romantic escape with my significant other", icon: "💑", type: "romantic" },
      { text: "Energetic expedition with close friends", icon: "👯", type: "friends" },
      { text: "Memorable getaway with my family", icon: "👨‍👩‍👧‍👦", type: "family" }
    ]
  }
];

const ARCHETYPES = {
  mountain: {
    title: "The Alpine Adventurer",
    badge: "🏔️",
    desc: "You thrive on crisp morning air, panoramic summits, rugged terrain, and the thrilling rush of the great outdoors. Comfort takes a backseat to wonder.",
    destinations: ["manali", "switzerland", "ladakh"]
  },
  beach: {
    title: "The Coastal Dreamer",
    badge: "🏖️",
    desc: "Your ideal state of mind is listening to ocean waves, walking across warm sands, and sipping fresh coconuts at sunset. Salt water heals everything for you.",
    destinations: ["bali", "maldives", "goa"]
  },
  city: {
    title: "The Cosmopolitan Nomad",
    badge: "🏙️",
    desc: "You are energized by electric city lights, towering skyscrapers, cutting-edge architecture, underground cafes, and world-class cultural institutions.",
    destinations: ["tokyo", "paris", "new-york"]
  },
  culture: {
    title: "The Heritage Connoisseur",
    badge: "🏛️",
    desc: "For you, traveling is a journey through history, centuries-old traditions, artisan craftsmanship, sacred temples, and unforgettable stories.",
    destinations: ["kyoto", "jaipur", "machu-picchu"]
  },
  nature: {
    title: "The Serenity Seeker",
    badge: "🌿",
    desc: "You travel to disconnect from the digital noise, breathe among ancient forests, cruise peaceful waterways, and rejuvenate your mind and soul.",
    destinations: ["kerala", "kashmir", "rishikesh"]
  }
};

let currentQuestionIdx = 0;
let userAnswers = [];

function initQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  currentQuestionIdx = 0;
  userAnswers = [];
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  const total = QUIZ_QUESTIONS.length;
  const q = QUIZ_QUESTIONS[currentQuestionIdx];
  const progressPct = ((currentQuestionIdx + 1) / total) * 100;

  container.innerHTML = `
    <div class="quiz-card-wrapper">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="section-tag accent" style="margin: 0;">Question ${currentQuestionIdx + 1} of ${total}</span>
        <span style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted);">${Math.round(progressPct)}% Completed</span>
      </div>

      <div class="quiz-progress-track">
        <div class="quiz-progress-bar" style="width: ${progressPct}%;"></div>
      </div>

      <h3 class="quiz-question-title">${q.title}</h3>

      <div class="quiz-options-list">
        ${q.options.map((opt, i) => `
          <button class="quiz-option-btn" onclick="selectQuizAnswer(${i})">
            <span class="quiz-option-icon">${opt.icon}</span>
            <span>${opt.text}</span>
          </button>
        `).join('')}
      </div>

      ${currentQuestionIdx > 0 ? `
        <button class="btn btn-sm btn-ghost" onclick="prevQuizQuestion()" style="margin-top: 8px;">
          ← Back to previous question
        </button>
      ` : ''}
    </div>
  `;
}

function selectQuizAnswer(optIdx) {
  const q = QUIZ_QUESTIONS[currentQuestionIdx];
  const chosen = q.options[optIdx];
  userAnswers[currentQuestionIdx] = chosen;

  if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
    currentQuestionIdx++;
    renderCurrentQuestion();
  } else {
    calculateQuizResults();
  }
}

function prevQuizQuestion() {
  if (currentQuestionIdx > 0) {
    currentQuestionIdx--;
    renderCurrentQuestion();
  }
}

function calculateQuizResults() {
  const container = document.getElementById('quiz-container');
  if (!container) return;

  // Count primary preference types
  const sceneryAnswer = userAnswers[0]?.type || 'mountain';
  const paceAnswer = userAnswers[1]?.type || 'adventure';

  let resolvedKey = 'mountain';
  if (sceneryAnswer === 'beach') resolvedKey = 'beach';
  else if (sceneryAnswer === 'city') resolvedKey = 'city';
  else if (sceneryAnswer === 'nature') resolvedKey = 'nature';
  else if (paceAnswer === 'culture') resolvedKey = 'culture';

  const archetype = ARCHETYPES[resolvedKey] || ARCHETYPES.mountain;

  // Retrieve destination objects
  const recDests = archetype.destinations.map(id => typeof getDestinationById === 'function' ? getDestinationById(id) : null).filter(Boolean);

  container.innerHTML = `
    <div class="quiz-card-wrapper quiz-result-card">
      <div class="archetype-badge">${archetype.badge}</div>
      <span class="section-tag">Your Travel Archetype</span>
      <h2 style="font-size: 2.2rem; margin: 12px 0;">${archetype.title}</h2>
      <p class="lead" style="max-width: 540px; margin: 0 auto 24px auto;">${archetype.desc}</p>

      <h4 style="margin-top: 32px; font-size: 1.15rem; color: var(--text-primary);">🎯 Hand-Picked Destinations For You:</h4>

      <div class="quiz-recs-grid">
        ${recDests.map(d => `
          <div class="quiz-rec-item">
            <img src="${d.image}" alt="${d.name}" />
            <div class="quiz-rec-info">
              <h5 style="margin: 0; font-size: 1rem; font-weight: 700;">${d.name}</h5>
              <p style="margin: 4px 0 8px 0; font-size: 0.8rem; color: var(--text-muted);">${d.country}</p>
              <div style="display: flex; gap: 6px; justify-content: center;">
                <button class="btn btn-sm btn-primary" onclick="viewDestinationDetail('${d.id}')" style="padding: 4px 10px; font-size: 0.78rem;">Explore</button>
                <a href="trip-planner.html?dest=${d.id}" class="btn btn-sm btn-outline" style="padding: 4px 10px; font-size: 0.78rem;">Plan Trip</a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; gap: 12px; justify-content: center; margin-top: 24px;">
        <button class="btn btn-outline" onclick="initQuiz()">🔄 Retake Quiz</button>
        <a href="destinations.html" class="btn btn-primary">Browse All Destinations →</a>
      </div>
    </div>
  `;

  // Scroll smoothly to results
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('quiz-container')) {
    initQuiz();
  }
});

// Window global assignments
if (typeof window !== 'undefined') {
  window.selectQuizAnswer = selectQuizAnswer;
  window.prevQuizQuestion = prevQuizQuestion;
  window.initQuiz = initQuiz;
}
