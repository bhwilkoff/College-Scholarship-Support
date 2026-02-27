/**
 * app.js — ScholarPath
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
  `;

  dom.modalBackdrop.hidden = false;
  dom.modal.hidden = false;
  dom.modalBackdrop.removeAttribute('aria-hidden');
  dom.modal.removeAttribute('aria-hidden');

  // Trap focus in modal
  setTimeout(() => dom.modalClose.focus(), 50);

  document.body.style.overflow = 'hidden';
}

function closeModal() {
  dom.modal.hidden = true;
  dom.modalBackdrop.hidden = true;
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
