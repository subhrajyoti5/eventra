/*
 * EVENTRA - homepage
 * Renders featured content, the event discovery grid, search, filters,
 * and the newsletter form.
 */
(function () {
  'use strict';

  const Eventra = (window.Eventra = window.Eventra || {});
  const utils = Eventra.utils;
  const ui = Eventra.ui;
  const state = {
    query: '',
    category: 'All Events',
    sort: 'soonest'
  };

  let grid = null;
  let resultsCount = null;
  let emptyState = null;
  let searchInput = null;
  let searchClear = null;
  let sortSelect = null;

  const categoryNames = ['All Events'].concat(Eventra.categories.map(function (category) {
    return category.name;
  }));

  function renderHero() {
    const heroEvent = Eventra.events.find(function (event) { return event.hero; }) ||
      Eventra.events.find(function (event) { return event.featured; }) ||
      Eventra.events[0];
    if (!heroEvent) return;

    const image = document.getElementById('hero-image');
    const link = document.getElementById('hero-event-link');
    const title = document.getElementById('hero-event-title');
    const meta = document.getElementById('hero-event-meta');

    if (image) {
      image.src = heroEvent.image;
      image.alt = heroEvent.imageAlt;
    }
    if (link) link.href = ui.eventUrl(heroEvent);
    if (title) title.textContent = heroEvent.title;
    if (meta) meta.textContent = utils.formatCardDate(heroEvent) + ' · ' + heroEvent.city;
  }

  function renderStats() {
    const cities = new Set(Eventra.events.map(function (event) { return event.city; }));
    const stats = {
      events: Eventra.events.length,
      categories: Eventra.categories.length,
      cities: cities.size
    };

    Object.keys(stats).forEach(function (key) {
      utils.qsa('[data-stat-' + key + ']').forEach(function (element) {
        element.textContent = stats[key];
      });
    });
  }

  function renderFeatured() {
    const container = document.getElementById('featured-list');
    if (!container) return;

    const featured = utils.sortByDate(
      Eventra.events.filter(function (event) { return event.featured; }),
      'asc'
    );

    container.innerHTML = featured.map(function (event, index) {
      return ui.renderFeaturedCard(event, { lead: index === 0, index: index });
    }).join('');

    ui.observeReveals(container);
  }

  function renderCategories() {
    const container = document.getElementById('category-index');
    if (!container) return;

    const counts = Eventra.events.reduce(function (accumulator, event) {
      accumulator[event.category] = (accumulator[event.category] || 0) + 1;
      return accumulator;
    }, {});

    container.innerHTML = Eventra.categories.map(function (category, index) {
      return ui.renderCategoryRow(category, index, counts[category.name] || 0);
    }).join('');

    ui.observeReveals(container);
  }

  function renderFilterChips() {
    const container = document.getElementById('filter-chips');
    if (!container) return;

    container.innerHTML = categoryNames.map(function (category) {
      return ui.renderFilterChip(category, category === state.category);
    }).join('');
  }

  function updateFilterChips() {
    utils.qsa('.filter-chip').forEach(function (chip) {
      const active = chip.getAttribute('data-category') === state.category;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function getFilteredEvents() {
    const queryTokens = utils.normalizeText(state.query).split(/\s+/).filter(Boolean);

    const filtered = Eventra.events.filter(function (event) {
      if (state.category !== 'All Events' && event.category !== state.category) return false;

      if (!queryTokens.length) return true;

      const haystack = utils.normalizeText([
        event.title,
        event.venue,
        event.address,
        event.city,
        event.category,
        event.excerpt,
        event.host
      ].join(' '));

      return queryTokens.every(function (token) {
        return haystack.indexOf(token) !== -1;
      });
    });

    if (state.sort === 'az') {
      return filtered.sort(function (a, b) {
        return a.title.localeCompare(b.title, 'en', { sensitivity: 'base' });
      });
    }

    return utils.sortByDate(filtered, state.sort === 'latest' ? 'desc' : 'asc');
  }

  function updateResultsLabel(total) {
    if (!resultsCount) return;
    const filtersActive = state.query.trim() !== '' || state.category !== 'All Events';
    let label = total + ' ' + utils.pluralize(total, 'experience');

    if (filtersActive) {
      label += ' found';
    } else {
      label += ' curated for the season';
    }

    resultsCount.textContent = label;
  }

  function updateFilterControls() {
    const filtersActive = state.query.trim() !== '' || state.category !== 'All Events';

    utils.qsa('[data-clear-filters]').forEach(function (button) {
      button.hidden = !filtersActive;
    });

    if (searchClear) {
      searchClear.hidden = state.query === '';
    }
  }

  function renderEvents() {
    if (!grid) return;

    const events = getFilteredEvents();
    grid.innerHTML = events.map(function (event, index) {
      return ui.renderEventCard(event, index);
    }).join('');

    grid.hidden = events.length === 0;
    if (emptyState) emptyState.hidden = events.length !== 0;

    updateResultsLabel(events.length);
    updateFilterControls();
    updateFilterChips();
    ui.observeReveals(grid);
  }

  function resetFilters() {
    state.query = '';
    state.category = 'All Events';
    if (searchInput) searchInput.value = '';
    renderEvents();
    if (searchInput) searchInput.focus({ preventScroll: true });
  }

  function initDiscovery() {
    grid = document.getElementById('events-grid');
    resultsCount = document.getElementById('results-count');
    emptyState = document.getElementById('events-empty');
    searchInput = document.getElementById('event-search');
    searchClear = document.getElementById('search-clear');
    sortSelect = document.getElementById('sort-events');
    const chips = document.getElementById('filter-chips');

    if (!grid) return;

    if (chips) {
      chips.addEventListener('click', function (event) {
        const chip = event.target.closest('[data-category]');
        if (!chip) return;
        state.category = chip.getAttribute('data-category');
        renderEvents();
      });
    }

    const categoryIndex = document.getElementById('category-index');
    if (categoryIndex) {
      categoryIndex.addEventListener('click', function (event) {
        const row = event.target.closest('[data-filter-category]');
        if (!row) return;
        state.category = row.getAttribute('data-filter-category');
        renderEvents();
        const discover = document.getElementById('discover');
        if (discover) {
          discover.scrollIntoView({
            behavior: utils.prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      });
    }

    if (searchInput) {
      const applySearch = utils.debounce(function () {
        state.query = searchInput.value.trim();
        renderEvents();
      }, 120);

      searchInput.addEventListener('input', applySearch);
      searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && searchInput.value) {
          searchInput.value = '';
          state.query = '';
          renderEvents();
        }
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', function () {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        state.query = '';
        renderEvents();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.sort = sortSelect.value;
        renderEvents();
      });
    }

    utils.qsa('[data-clear-filters]').forEach(function (button) {
      button.addEventListener('click', resetFilters);
    });

    renderFilterChips();
    renderEvents();
  }

  function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    const input = document.getElementById('newsletter-email');
    const status = document.getElementById('newsletter-status');

    input.addEventListener('input', function () {
      if (input.getAttribute('aria-invalid') === 'true') {
        input.removeAttribute('aria-invalid');
        status.textContent = '';
        status.classList.remove('is-error');
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const email = input.value.trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        input.setAttribute('aria-invalid', 'true');
        status.textContent = 'Please enter a valid email address.';
        status.classList.add('is-error');
        input.focus();
        return;
      }

      input.removeAttribute('aria-invalid');
      status.classList.remove('is-error');
      status.textContent = 'You’re on the list. This is a demo subscription, so no email will be sent.';
      form.reset();
    });
  }

  function init() {
    renderHero();
    renderStats();
    renderFeatured();
    renderCategories();
    initDiscovery();
    initNewsletter();
    ui.observeReveals();
    
    // Add Organization schema to homepage
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Eventra',
      url: window.location.origin,
      logo: window.location.origin + '/assets/favicon.svg',
      description: 'Eventra is a curated calendar of technology, design, music, business, and cultural experiences across India.',
      sameAs: [
        'https://www.instagram.com/subhrajyotisaho0/',
        'https://x.com/subhra8640',
        'https://www.linkedin.com/in/subhrajyoti-s-b047a227a/'
      ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(organizationSchema);
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
