/**
 * app.js — Scholarshipping
 *
 * Search, filter, sort, and display scholarship cards.
 * Data lives in js/data.js (SCHOLARSHIPS array).
 */

// ============================================================
// State
// ============================================================

const state = {
  query: '',
  filters: {
    types: [],        // array of selected type strings
    years: [],        // array of selected year strings
    likelihoods: [],  // array of selected likelihood strings
    renewable: false,
    noEssay: false,
    amountMin: 0,
    amountMax: Infinity,
    gpaMax: 4.0,      // only show scholarships requiring ≤ this GPA
  },
  sort: 'amount-desc',
  view: 'grid',       // 'grid' | 'list'
  openId: null,       // id of currently open modal
};

// ============================================================
// DOM refs
// ============================================================

const dom = {};

function cacheDom() {
  dom.searchInput   = document.getElementById('search-input');
  dom.sortSelect    = document.getElementById('sort-select');
  dom.clearBtn      = document.getElementById('clear-filters');
  dom.emptyClearBtn = document.getElementById('empty-clear');
  dom.grid          = document.getElementById('scholarship-grid');
  dom.emptyState    = document.getElementById('empty-state');
  dom.resultSummary = document.getElementById('results-summary');
  dom.countNumber   = document.getElementById('count-number');
  dom.viewGrid      = document.getElementById('view-grid');
  dom.viewList      = document.getElementById('view-list');
  dom.modal         = document.getElementById('scholarship-modal');
  dom.modalBackdrop = document.getElementById('modal-backdrop');
  dom.modalClose    = document.getElementById('modal-close');
  dom.modalContent  = document.getElementById('modal-content');
  dom.filterGpa     = document.getElementById('filter-gpa');
  dom.gpaOutput     = document.getElementById('gpa-output');
  dom.filterRenewable = document.getElementById('filter-renewable');
  dom.filterNoEssay = document.getElementById('filter-no-essay');
  dom.amountMin     = document.getElementById('amount-min');
  dom.amountMax     = document.getElementById('amount-max');
}

// ============================================================
// Filtering & Sorting
// ============================================================

function matchesSearch(s, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    s.name.toLowerCase().includes(q) ||
    s.organization.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    (s.tags || []).some(t => t.toLowerCase().includes(q)) ||
    s.state.toLowerCase().includes(q) ||
    s.type.toLowerCase().includes(q)
  );
}

function matchesFilters(s, filters) {
  if (filters.types.length && !filters.types.includes(s.type)) return false;
  if (filters.years.length && !filters.years.includes(s.year_eligible)) return false;
  if (filters.likelihoods.length && !filters.likelihoods.includes(s.likelihood)) return false;
  if (filters.renewable && !s.renewable) return false;
  if (filters.noEssay && s.essay_required) return false;
  if (s.amount < filters.amountMin) return false;
  if (filters.amountMax !== Infinity && s.amount > filters.amountMax) return false;
  // GPA filter: only show scholarships whose required GPA is ≤ the slider value
  // (slider at 4.0 = show all; slider at 3.0 = only show scholarships requiring ≤ 3.0 GPA)
  if (filters.gpaMax < 4.0 && s.gpa_required > filters.gpaMax) return false;
  return true;
}

const LIKELIHOOD_ORDER = { high: 0, medium: 1, low: 2 };
const MONTH_ORDER = {
  January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
  Rolling: 13,
};

function sortScholarships(list, sortKey) {
  const copy = [...list];
  switch (sortKey) {
    case 'amount-desc':
      return copy.sort((a, b) => b.amount - a.amount);
    case 'amount-asc':
      return copy.sort((a, b) => a.amount - b.amount);
    case 'deadline':
      return copy.sort((a, b) =>
        (MONTH_ORDER[a.deadline_month] || 99) - (MONTH_ORDER[b.deadline_month] || 99)
      );
    case 'likelihood':
      return copy.sort((a, b) =>
        (LIKELIHOOD_ORDER[a.likelihood] ?? 99) - (LIKELIHOOD_ORDER[b.likelihood] ?? 99)
      );
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return copy;
  }
}

function getFiltered() {
  const { query, filters, sort } = state;
  const filtered = SCHOLARSHIPS.filter(s => matchesSearch(s, query) && matchesFilters(s, filters));
  return sortScholarships(filtered, sort);
}

// ============================================================
// Rendering — Cards
// ============================================================

function formatAmount(amount) {
  if (amount >= 50000) return 'Full Tuition';
  if (amount >= 1000) return '$' + (amount / 1000).toFixed(amount % 1000 === 0 ? 0 : 1) + 'k';
  return '$' + amount.toLocaleString();
}

function formatAmountFull(amount) {
  if (amount >= 50000) return 'Full Tuition';
  return '$' + amount.toLocaleString();
}

function typeBadgeClass(type) {
  const map = {
    'merit':            'badge-merit',
    'need-based':       'badge-need-based',
    'identity':         'badge-identity',
    'field-of-study':   'badge-field-of-study',
    'community-service':'badge-community-service',
    'stem':             'badge-stem',
    'arts':             'badge-arts',
    'essay':            'badge-essay',
    'regional':         'badge-regional',
    'athletic':         'badge-athletic',
  };
  return map[type] || 'badge-merit';
}

function typeLabel(type) {
  const map = {
    'merit':             'Merit',
    'need-based':        'Need-Based',
    'identity':          'Identity',
    'field-of-study':    'Field of Study',
    'community-service': 'Community Service',
    'stem':              'STEM',
    'arts':              'Arts',
    'essay':             'Essay',
    'regional':          'Regional',
    'athletic':          'Athletic',
  };
  return map[type] || type;
}

function likelihoodLabel(l) {
  if (l === 'high')   return 'Higher odds';
  if (l === 'medium') return 'Moderate odds';
  if (l === 'low')    return 'Very competitive';
  return l;
}

function renderCard(s) {
  const card = document.createElement('article');
  card.className = 'scholarship-card';
  card.setAttribute('role', 'listitem');
  card.setAttribute('tabindex', '0');
  card.setAttribute('aria-label', `${s.name} — ${formatAmount(s.amount)}`);
  card.dataset.id = s.id;
  card.dataset.likelihood = s.likelihood;

  const tags = (s.tags || []).slice(0, 3)
    .map(t => `<span class="tag">${escHtml(t)}</span>`)
    .join('');

  const renewableChip = s.renewable
    ? `<span class="meta-chip" title="Renewable award"><span class="chip-icon" aria-hidden="true">♻️</span> Renewable</span>`
    : '';
  const essayChip = !s.essay_required
    ? `<span class="meta-chip" title="No essay required"><span class="chip-icon" aria-hidden="true">✏️</span> No essay</span>`
    : '';

  card.innerHTML = `
    <div class="card-header">
      <span class="card-type-badge ${typeBadgeClass(s.type)}">${escHtml(typeLabel(s.type))}</span>
      <span class="card-likelihood">
        <span class="likelihood-dot ${escHtml(s.likelihood)}" aria-hidden="true"></span>
        <span class="likelihood-value ${escHtml(s.likelihood)} visually-hidden">${escHtml(likelihoodLabel(s.likelihood))}</span>
      </span>
    </div>
    <div class="card-amount">
      ${escHtml(formatAmount(s.amount))}
      ${s.renewable ? '<span class="amount-note">/yr</span>' : ''}
    </div>
    <h3 class="card-name">${escHtml(s.name)}</h3>
    <p class="card-org">${escHtml(s.organization)}</p>
    <div class="card-tags">${tags}</div>
    <div class="card-meta">
      <span class="meta-chip"><span class="chip-icon" aria-hidden="true">📅</span> ${escHtml(s.deadline_month)}</span>
      <span class="meta-chip"><span class="chip-icon" aria-hidden="true">🎓</span> ${escHtml(s.year_eligible)}</span>
      ${renewableChip}
      ${essayChip}
    </div>
  `;

  card.addEventListener('click', () => openModal(s.id));
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(s.id);
    }
  });

  return card;
}

function renderResults() {
  const results = getFiltered();
  const total = SCHOLARSHIPS.length;

  // Update count chip
  dom.countNumber.textContent = results.length.toLocaleString();

  // Update summary text
  if (results.length === total) {
    dom.resultSummary.innerHTML = `Showing all <strong>${total.toLocaleString()}</strong> scholarships`;
  } else {
    dom.resultSummary.innerHTML = `Showing <strong>${results.length.toLocaleString()}</strong> of ${total.toLocaleString()} scholarships`;
  }

  // Clear grid
  dom.grid.innerHTML = '';

  if (results.length === 0) {
    dom.emptyState.hidden = false;
    dom.grid.hidden = true;
    return;
  }

  dom.emptyState.hidden = true;
  dom.grid.hidden = false;

  const frag = document.createDocumentFragment();
  results.forEach(s => frag.appendChild(renderCard(s)));
  dom.grid.appendChild(frag);
}

// ============================================================
// M2 — AI Prompt Template Generator
// ============================================================

const REFLECTION_QUESTIONS = {
  'merit': [
    'Describe one specific achievement you\'re most proud of. What obstacles did you have to push through to get there?',
    'Tell me about a time you led something or took initiative when no one asked you to. What happened, and what did you learn about yourself?',
    'If you receive this scholarship, what becomes possible that isn\'t possible right now?',
  ],
  'need-based': [
    'How has financial pressure shaped your approach to school, work, or your plans for the future? Be concrete — give me a real example.',
    'What do you want someone who has never had to worry about money to understand about your situation and what you\'ve had to figure out on your own?',
    'What will this scholarship make possible that isn\'t possible without it? Be as specific as you can.',
  ],
  'identity': [
    'How has your background, identity, or lived experience shaped the way you see the world or approach problems? Give me a specific example, not a general statement.',
    'What does your community need that you are in a unique position to provide — and why you, specifically?',
    'Why does this particular scholarship resonate with who you are? What is it actually recognizing about you?',
  ],
  'stem': [
    'What specific problem or question in your field keeps you up at night? Where did that curiosity first come from?',
    'Walk me through a project, experiment, or research experience — even one that failed. What did it reveal about how you think?',
    'Who benefits from the work you want to do, and how will you make sure your work actually reaches them?',
  ],
  'field-of-study': [
    'What was the moment — a class, a book, a conversation, an experience — that made you certain this is the field for you?',
    'What question in your field do most people overlook, but you think is really important? Why does it matter to you?',
    'How does the specific school or program you\'re targeting connect to exactly where you want to go?',
  ],
  'community-service': [
    'What community need did you identify, and what did you actually do about it? Be specific about your role — what did YOU do, not what the group did?',
    'What did doing this service work teach you about yourself — your limits, your strengths, or something you didn\'t expect to find out?',
    'What\'s still unfinished? If you had more time or resources, what would you do next?',
  ],
  'arts': [
    'What are you trying to say or create that you haven\'t fully figured out how to express yet? What\'s getting in the way?',
    'Who has influenced your work most, and where has your artistic voice started to diverge from theirs?',
    'How does your creative practice connect to the world outside the studio, stage, or page?',
  ],
  'essay': [
    'What is the single most important thing you want the reader to know about you after finishing this essay?',
    'What story from your life shows — rather than just tells — who you are? Why that story, and not another?',
    'What would be missing from this application if your essay didn\'t exist?',
  ],
  'regional': [
    'What ties you to this place — your state, town, or region — and how has it shaped who you\'ve become?',
    'What does your community need more of, and how do you plan to contribute to that, either now or after college?',
    'What would bring you back to this place after college, or what will you carry forward from it no matter where you go?',
  ],
  'athletic': [
    'What has competitive sport taught you about handling setbacks, failure, or something not going the way you planned?',
    'Describe a moment in your athletic career that demanded more from you mentally or emotionally than physically.',
    'How does being an athlete connect to your goals and who you\'re becoming beyond sports?',
  ],
};

const DEFAULT_QUESTIONS = [
  'What motivates you most deeply, and where did that drive first come from?',
  'What challenge have you faced that required you to grow in a way you didn\'t expect?',
  'What do you want your future to look like, and why does this scholarship matter to getting there?',
];

function buildAiPrompt(s, name, school, major, activities) {
  const questions = REFLECTION_QUESTIONS[s.type] || DEFAULT_QUESTIONS;
  const amountStr = formatAmountFull(s.amount) + (s.renewable ? '/year (renewable)' : ' (one-time)');
  const nameStr       = name.trim()       || 'the applicant';
  const schoolStr     = school.trim()     || '(school not yet specified)';
  const majorStr      = major.trim()      || '(major not yet specified)';
  const activitiesStr = activities.trim() || '(not yet filled in)';
  const qLines = questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');

  return `You are coaching me through applying for a scholarship. You have one strict rule: you must NEVER write any part of my application for me. Your job is to help me find my own words by asking the right questions and pushing me to be specific.

━━━ SCHOLARSHIP I'M APPLYING FOR ━━━
Name: ${s.name}
Organization: ${s.organization}
Award: ${amountStr}
What it looks for: ${s.description}

━━━ ABOUT ME ━━━
My name: ${nameStr}
School I'm targeting: ${schoolStr}
Intended major / field: ${majorStr}
My key activities and achievements:
${activitiesStr}

━━━ PHASE 1 — REFLECTION (start here) ━━━
Ask me the following questions ONE AT A TIME.
Wait for my full answer before moving on.
Do not comment on my answers yet — just listen and receive.

${qLines}

━━━ PHASE 2 — SHAPING (only after Phase 1 is complete) ━━━
Once I have answered all ${questions.length} questions, help me:
- Find the most authentic, specific thread running through my answers
- Call out anywhere I'm being vague or generic, and ask me to go deeper
- Help me structure my thinking into a clear narrative arc
- Suggest what to lead with and why

Final reminder: Guide me. Never write for me. Every sentence must be in my voice.`;
}

function renderPromptSection(s) {
  return `
    <div class="prompt-section modal-section">
      <p class="modal-section-title">Prepare with AI</p>
      <p class="prompt-intro">Fill in a few details about yourself, then generate a structured AI prompt. It won't write your application — it will ask you the hard questions first, so you do.</p>
      <div class="prompt-form" role="group" aria-label="Your information for the AI prompt">
        <div class="prompt-field">
          <label class="prompt-label" for="prompt-name">Your name</label>
          <input class="prompt-input" id="prompt-name" type="text" placeholder="e.g. Jordan Rivera" autocomplete="given-name">
        </div>
        <div class="prompt-field">
          <label class="prompt-label" for="prompt-school">School you're targeting</label>
          <input class="prompt-input" id="prompt-school" type="text" placeholder="e.g. University of Michigan">
        </div>
        <div class="prompt-field">
          <label class="prompt-label" for="prompt-major">Intended major or field of study</label>
          <input class="prompt-input" id="prompt-major" type="text" placeholder="e.g. Computer Science, Nursing, Film">
        </div>
        <div class="prompt-field">
          <label class="prompt-label" for="prompt-activities">Key activities and achievements</label>
          <textarea class="prompt-input prompt-activities" id="prompt-activities" rows="3" placeholder="e.g. Debate team captain, 200+ hours tutoring middle schoolers in math, built a weather app used by 500+ students…"></textarea>
        </div>
      </div>
      <button class="btn-build-prompt" id="btn-build-prompt" type="button">Build my AI prompt →</button>
      <div class="prompt-output" id="prompt-output" hidden>
        <p class="prompt-output-label">Copy this prompt and paste it into Claude, ChatGPT, or any AI assistant:</p>
        <textarea class="prompt-result" id="prompt-result" readonly aria-label="Generated AI prompt — copy and paste into your AI tool"></textarea>
        <div class="prompt-copy-row">
          <button class="btn-copy" id="btn-copy-prompt" type="button">Copy to clipboard</button>
          <span class="copy-confirm" id="copy-confirm" aria-live="polite" hidden>✓ Copied!</span>
        </div>
      </div>
    </div>
  `;
}

function onModalContentClick(e) {
  if (e.target.closest('#btn-build-prompt')) {
    const s = SCHOLARSHIPS.find(x => x.id === state.openId);
    if (!s) return;
    const name       = document.getElementById('prompt-name').value;
    const school     = document.getElementById('prompt-school').value;
    const major      = document.getElementById('prompt-major').value;
    const activities = document.getElementById('prompt-activities').value;
    const prompt = buildAiPrompt(s, name, school, major, activities);
    const resultEl = document.getElementById('prompt-result');
    const outputEl = document.getElementById('prompt-output');
    resultEl.value = prompt;
    outputEl.hidden = false;
    // Scroll the result into view smoothly
    outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    resultEl.focus();
    return;
  }

  if (e.target.closest('#btn-copy-prompt')) {
    const resultEl  = document.getElementById('prompt-result');
    const confirmEl = document.getElementById('copy-confirm');
    const showConfirm = () => {
      confirmEl.hidden = false;
      setTimeout(() => { confirmEl.hidden = true; }, 3000);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(resultEl.value).then(showConfirm).catch(() => {
        resultEl.select();
        document.execCommand('copy');
        showConfirm();
      });
    } else {
      resultEl.select();
      document.execCommand('copy');
      showConfirm();
    }
  }
}

// ============================================================
// Rendering — Modal
// ============================================================

function openModal(id) {
  const s = SCHOLARSHIPS.find(x => x.id === id);
  if (!s) return;

  state.openId = id;

  const facts = [
    { label: 'Amount',    value: formatAmountFull(s.amount) + (s.renewable ? '/yr' : '') },
    { label: 'Deadline',  value: s.deadline_month },
    { label: 'Eligible',  value: s.year_eligible },
    { label: 'GPA Req.',  value: s.gpa_required > 0 ? s.gpa_required.toFixed(1) + '+' : 'None' },
    { label: 'Renewable', value: s.renewable ? 'Yes' : 'One-time' },
    { label: 'Essay',     value: s.essay_required ? 'Required' : 'Not required' },
    { label: 'Location',  value: s.state },
    { label: 'Odds',      value: likelihoodLabel(s.likelihood) },
  ];

  const factsHtml = facts.map(f => `
    <div class="modal-fact">
      <span class="fact-label">${escHtml(f.label)}</span>
      <span class="fact-value">${escHtml(f.value)}</span>
    </div>
  `).join('');

  const tagsHtml = (s.tags || [])
    .map(t => `<span class="modal-tag">${escHtml(t)}</span>`)
    .join('');

  dom.modalContent.innerHTML = `
    <div class="modal-header">
      <div class="modal-type-badge">
        <span class="card-type-badge ${typeBadgeClass(s.type)}">${escHtml(typeLabel(s.type))}</span>
      </div>
      <div class="modal-amount">${escHtml(formatAmountFull(s.amount))}${s.renewable ? '<span class="amount-note" style="font-size:1.25rem;font-weight:500">/yr</span>' : ''}</div>
      <h2 id="modal-title" class="modal-name">${escHtml(s.name)}</h2>
      <p class="modal-org">${escHtml(s.organization)}</p>
    </div>

    <div class="modal-section">
      <p class="modal-section-title">About this scholarship</p>
      <p class="modal-description">${escHtml(s.description)}</p>
    </div>

    <div class="modal-section">
      <p class="modal-section-title">Key details</p>
      <div class="modal-facts">${factsHtml}</div>
    </div>

    ${tagsHtml ? `
    <div class="modal-section">
      <p class="modal-section-title">Tags</p>
      <div class="modal-tags-wrap">${tagsHtml}</div>
    </div>` : ''}

    <div class="modal-cta">
      <a href="${escAttr(s.url)}" target="_blank" rel="noopener noreferrer" class="btn-apply">
        Apply for this scholarship →
      </a>
    </div>

    ${renderPromptSection(s)}
  `;

  dom.modalBackdrop.classList.add('modal-open');
  dom.modal.classList.add('modal-open');
  dom.modalBackdrop.removeAttribute('aria-hidden');
  dom.modal.removeAttribute('aria-hidden');

  // Trap focus in modal
  setTimeout(() => dom.modalClose.focus(), 50);

  document.body.style.overflow = 'hidden';
}

function closeModal() {
  dom.modal.classList.remove('modal-open');
  dom.modalBackdrop.classList.remove('modal-open');
  dom.modal.setAttribute('aria-hidden', 'true');
  dom.modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  // Return focus to the card that was clicked
  if (state.openId !== null) {
    const card = dom.grid.querySelector(`[data-id="${state.openId}"]`);
    if (card) card.focus();
  }
  state.openId = null;
}

// ============================================================
// Event Handlers
// ============================================================

function onSearch(e) {
  state.query = e.target.value.trim();
  renderResults();
}

function onSortChange(e) {
  state.sort = e.target.value;
  renderResults();
}

function onTypeFilter(e) {
  const checks = document.querySelectorAll('#filter-type input:checked');
  state.filters.types = Array.from(checks).map(c => c.value);
  renderResults();
}

function onYearFilter() {
  const checks = document.querySelectorAll('#filter-year input:checked');
  state.filters.years = Array.from(checks).map(c => c.value);
  renderResults();
}

function onLikelihoodFilter() {
  const checks = document.querySelectorAll('#filter-likelihood input:checked');
  state.filters.likelihoods = Array.from(checks).map(c => c.value);
  renderResults();
}

function onRenewableToggle(e) {
  state.filters.renewable = e.target.checked;
  renderResults();
}

function onNoEssayToggle(e) {
  state.filters.noEssay = e.target.checked;
  renderResults();
}

function onAmountMin(e) {
  const v = parseFloat(e.target.value);
  state.filters.amountMin = isNaN(v) ? 0 : v;
  renderResults();
}

function onAmountMax(e) {
  const v = parseFloat(e.target.value);
  state.filters.amountMax = isNaN(v) || e.target.value === '' ? Infinity : v;
  renderResults();
}

function onGpaSlider(e) {
  const v = parseFloat(e.target.value);
  state.filters.gpaMax = v;
  dom.gpaOutput.textContent = v >= 4.0 ? 'Any' : v.toFixed(1) + '+';
  renderResults();
}

function clearAllFilters() {
  // Reset state
  state.query = '';
  state.filters = {
    types: [], years: [], likelihoods: [],
    renewable: false, noEssay: false,
    amountMin: 0, amountMax: Infinity, gpaMax: 4.0,
  };
  state.sort = 'amount-desc';

  // Reset DOM
  dom.searchInput.value = '';
  dom.sortSelect.value = 'amount-desc';
  document.querySelectorAll('.filters-panel input[type="checkbox"]').forEach(c => { c.checked = false; });
  dom.filterGpa.value = 4;
  dom.gpaOutput.textContent = 'Any';
  dom.amountMin.value = '';
  dom.amountMax.value = '';

  renderResults();
}

function setView(view) {
  state.view = view;
  if (view === 'grid') {
    dom.grid.classList.remove('list-view');
    dom.viewGrid.classList.add('active');
    dom.viewGrid.setAttribute('aria-pressed', 'true');
    dom.viewList.classList.remove('active');
    dom.viewList.setAttribute('aria-pressed', 'false');
  } else {
    dom.grid.classList.add('list-view');
    dom.viewList.classList.add('active');
    dom.viewList.setAttribute('aria-pressed', 'true');
    dom.viewGrid.classList.remove('active');
    dom.viewGrid.setAttribute('aria-pressed', 'false');
  }
}

// ============================================================
// Utilities
// ============================================================

function escHtml(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escAttr(str) {
  // Only allow http/https URLs to prevent javascript: injection
  if (typeof str !== 'string') return '#';
  const trimmed = str.trim();
  if (!trimmed.startsWith('https://') && !trimmed.startsWith('http://')) return '#';
  return escHtml(trimmed);
}

// Focus trap for modal
function onModalKeydown(e) {
  if (e.key === 'Escape') { closeModal(); return; }
  if (e.key !== 'Tab') return;

  const focusable = dom.modal.querySelectorAll(
    'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length === 0) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

// ============================================================
// Initialization
// ============================================================

function init() {
  cacheDom();

  // Attach event listeners
  dom.searchInput.addEventListener('input', onSearch);
  dom.sortSelect.addEventListener('change', onSortChange);
  dom.clearBtn.addEventListener('click', clearAllFilters);
  dom.emptyClearBtn.addEventListener('click', clearAllFilters);

  document.getElementById('filter-type').addEventListener('change', onTypeFilter);
  document.getElementById('filter-year').addEventListener('change', onYearFilter);
  document.getElementById('filter-likelihood').addEventListener('change', onLikelihoodFilter);
  dom.filterRenewable.addEventListener('change', onRenewableToggle);
  dom.filterNoEssay.addEventListener('change', onNoEssayToggle);
  dom.amountMin.addEventListener('input', onAmountMin);
  dom.amountMax.addEventListener('input', onAmountMax);
  dom.filterGpa.addEventListener('input', onGpaSlider);

  dom.viewGrid.addEventListener('click', () => setView('grid'));
  dom.viewList.addEventListener('click', () => setView('list'));

  dom.modalClose.addEventListener('click', closeModal);
  dom.modalBackdrop.addEventListener('click', closeModal);
  dom.modalContent.addEventListener('click', onModalContentClick);
  document.addEventListener('keydown', e => {
    if (!dom.modal.hidden) onModalKeydown(e);
  });

  // Initial render
  renderResults();
}

// ============================================================
// Boot
// ============================================================

document.addEventListener('DOMContentLoaded', init);
