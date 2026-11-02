/*
 * EVENTRA — shared interface behaviour and markup builders
 */
(function () {
  'use strict';

  const Eventra = (window.Eventra = window.Eventra || {});
  const utils = Eventra.utils;
  const MOBILE_QUERY = window.matchMedia('(min-width: 1024px)');

  const icons = {
    arrow: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrowUpRight: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><path d="M7 17 17 7M8 7h9v9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5" stroke-linecap="round"/></svg>',
    calendar: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke-linecap="round"/></svg>'
  };

  function eventUrl(event) {
    return 'event.html?id=' + encodeURIComponent(event.id);
  }

  function renderEventCard(event, index) {
    const delay = Math.min(index || 0, 8) * 55;
    return (
      '<article class="event-card reveal" style="--reveal-delay:' + delay + 'ms">' +
        '<a class="event-card__link" href="' + utils.escapeHTML(eventUrl(event)) + '" ' +
          'aria-label="View details for ' + utils.escapeHTML(event.title) + '">' +
          '<div class="event-card__media">' +
            '<img src="' + utils.escapeHTML(event.image) + '" alt="' + utils.escapeHTML(event.imageAlt) + '" ' +
              'width="800" height="600" loading="lazy" decoding="async">' +
            '<span class="tag">' + utils.escapeHTML(event.category) + '</span>' +
          '</div>' +
          '<div class="event-card__body">' +
            '<p class="event-card__date">' + utils.escapeHTML(utils.formatCardDateTime(event)) + '</p>' +
            '<h3 class="event-card__title">' + utils.escapeHTML(event.title) + '</h3>' +
            '<p class="event-card__location">' + utils.escapeHTML(event.venue) + '<span aria-hidden="true">·</span>' + utils.escapeHTML(event.city) + '</p>' +
            '<p class="event-card__excerpt">' + utils.escapeHTML(event.excerpt) + '</p>' +
            '<span class="text-link">View details ' + icons.arrow + '</span>' +
          '</div>' +
        '</a>' +
      '</article>'
    );
  }

  function renderFeaturedCard(event, options) {
    const settings = Object.assign({ lead: false, index: 0 }, options || {});
    const number = String(settings.index + 1).padStart(2, '0');
    return (
      '<article class="feature-card ' + (settings.lead ? 'feature-card--lead' : 'feature-card--compact') + ' reveal" ' +
        'style="--reveal-delay:' + settings.index * 80 + 'ms">' +
        '<a class="feature-card__link" href="' + utils.escapeHTML(eventUrl(event)) + '" ' +
          'aria-label="View details for ' + utils.escapeHTML(event.title) + '">' +
          '<div class="feature-card__media">' +
            '<img src="' + utils.escapeHTML(event.image) + '" alt="' + utils.escapeHTML(event.imageAlt) + '" ' +
              'width="1200" height="900" loading="lazy" decoding="async">' +
            '<span class="tag">' + utils.escapeHTML(event.category) + '</span>' +
            '<span class="feature-card__number" aria-hidden="true">' + number + '</span>' +
          '</div>' +
          '<div class="feature-card__body">' +
            '<p class="feature-card__meta"><span>' + utils.escapeHTML(utils.formatCardDate(event)) + '</span><span>' + utils.escapeHTML(utils.formatTime(event.date)) + '</span></p>' +
            '<h3 class="feature-card__title">' + utils.escapeHTML(event.title) + '</h3>' +
            '<p class="feature-card__venue">' + utils.escapeHTML(event.venue) + ' · ' + utils.escapeHTML(event.city) + '</p>' +
            '<p class="feature-card__excerpt">' + utils.escapeHTML(event.excerpt) + '</p>' +
            '<span class="text-link">View details ' + icons.arrow + '</span>' +
          '</div>' +
        '</a>' +
      '</article>'
    );
  }

  function renderCategoryRow(category, index, count) {
    return (
      '<button type="button" class="category-row reveal" data-filter-category="' + utils.escapeHTML(category.name) + '" ' +
        'style="--reveal-delay:' + Math.min(index, 8) * 50 + 'ms" ' +
        'aria-label="Show ' + utils.escapeHTML(category.name) + ' events">' +
        '<span class="category-row__index" aria-hidden="true">' + String(index + 1).padStart(2, '0') + '</span>' +
        '<span class="category-row__info">' +
          '<span class="category-row__name">' + utils.escapeHTML(category.name) + '</span>' +
          '<span class="category-row__blurb">' + utils.escapeHTML(category.blurb) + '</span>' +
        '</span>' +
        '<span class="category-row__count">' + count + ' ' + utils.pluralize(count, 'experience') + '</span>' +
        '<span class="category-row__arrow" aria-hidden="true">' + icons.arrowUpRight + '</span>' +
      '</button>'
    );
  }

  function renderFilterChip(name, active) {
    return (
      '<button type="button" class="filter-chip' + (active ? ' is-active' : '') + '" ' +
        'data-category="' + utils.escapeHTML(name) + '" aria-pressed="' + (active ? 'true' : 'false') + '">' +
        utils.escapeHTML(name) +
      '</button>'
    );
  }

  /* ---------------------------------------------------------------
   * Header, mobile navigation, and search shortcut
   * ------------------------------------------------------------- */
  function initHeader() {
    const header = document.getElementById('site-header');
    const toggle = document.querySelector('.nav-toggle');
    const panel = document.getElementById('mobile-nav');

    if (header) {
      const updateHeader = function () {
        header.classList.toggle('is-scrolled', window.scrollY > 10);
      };
      window.addEventListener('scroll', updateHeader, { passive: true });
      updateHeader();
    }

    function closeMobileNav(restoreFocus) {
      if (!toggle || !panel) return;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      panel.inert = true;
      document.body.classList.remove('is-nav-open');
      if (restoreFocus) toggle.focus();
    }

    function openMobileNav() {
      if (!toggle || !panel) return;
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      panel.inert = false;
      document.body.classList.add('is-nav-open');
      const firstLink = panel.querySelector('a, button');
      if (firstLink) window.setTimeout(function () { firstLink.focus(); }, 60);
    }

    if (toggle && panel) {
      panel.inert = true;
      panel.setAttribute('aria-hidden', 'true');
      toggle.addEventListener('click', function () {
        if (toggle.getAttribute('aria-expanded') === 'true') {
          closeMobileNav(true);
        } else {
          openMobileNav();
        }
      });

      panel.addEventListener('click', function (event) {
        if (event.target.closest('a, [data-register]')) closeMobileNav(false);
      });

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
          closeMobileNav(true);
        }
      });

      MOBILE_QUERY.addEventListener('change', function (event) {
        if (event.matches) closeMobileNav(false);
      });
    }

    /* Search shortcut — focus the discovery search field on this page,
       or return to the homepage search when on an event page. */
    utils.qsa('[data-search-jump]').forEach(function (button) {
      button.addEventListener('click', function () {
        const input = document.getElementById('event-search');
        if (!input) {
          window.location.href = 'index.html#discover';
          return;
        }
        closeMobileNav(false);
        const discover = document.getElementById('discover');
        if (discover) {
          discover.scrollIntoView({
            behavior: utils.prefersReducedMotion() ? 'auto' : 'smooth',
            block: 'start'
          });
        }
        window.setTimeout(function () {
          input.focus({ preventScroll: true });
        }, utils.prefersReducedMotion() ? 0 : 480);
      });
    });

    /* Scroll spy for the primary navigation. */
    const navLinks = utils.qsa('[data-nav]');
    const sectionIds = navLinks.map(function (link) { return link.getAttribute('data-nav'); });
    const sections = sectionIds
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    if (sections.length && 'IntersectionObserver' in window) {
      const spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            const isActive = link.getAttribute('data-nav') === entry.target.id;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        });
      }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });

      sections.forEach(function (section) { spy.observe(section); });
    }

    Eventra.ui.closeMobileNav = closeMobileNav;
  }

  /* ---------------------------------------------------------------
   * Reveal-on-scroll
   * ------------------------------------------------------------- */
  let revealObserver = null;

  function ensureRevealObserver() {
    if (revealObserver || !('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
  }

  function observeReveals(scope) {
    const targets = utils.qsa('.reveal:not([data-reveal-bound])', scope || document);
    if (!targets.length) return;

    if (utils.prefersReducedMotion() || !('IntersectionObserver' in window)) {
      targets.forEach(function (element) {
        element.setAttribute('data-reveal-bound', 'true');
        element.classList.add('is-visible');
      });
      return;
    }

    ensureRevealObserver();
    targets.forEach(function (element) {
      element.setAttribute('data-reveal-bound', 'true');
      revealObserver.observe(element);
    });
  }

  /* ---------------------------------------------------------------
   * Image fallback, toast, calendar downloads
   * ------------------------------------------------------------- */
  const fallbackImage = new URL('assets/images/fallback.svg', document.baseURI).href;

  document.addEventListener('error', function (event) {
    const image = event.target;
    if (!image || image.tagName !== 'IMG' || image.dataset.fallbackApplied === 'true') return;
    image.dataset.fallbackApplied = 'true';
    image.removeAttribute('srcset');
    image.src = fallbackImage;
  }, true);

  function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('role', 'status');
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    window.setTimeout(function () {
      toast.classList.add('is-leaving');
      window.setTimeout(function () { toast.remove(); }, 250);
    }, 2800);
  }

  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('[data-add-calendar]');
    if (trigger) {
      const eventId = trigger.getAttribute('data-add-calendar') || trigger.getAttribute('data-event-id');
      const found = utils.getEventById(eventId);
      if (found) {
        event.preventDefault();
        utils.downloadCalendar(found);
        showToast('Calendar file downloaded');
      }
      return;
    }

    const copyTrigger = event.target.closest('[data-copy-link]');
    if (copyTrigger) {
      event.preventDefault();
      utils.copyText(window.location.href).then(function (copied) {
        showToast(copied ? 'Link copied to clipboard' : 'Could not copy the link');
      });
    }
  });

  function initFooter() {
    utils.qsa('[data-year]').forEach(function (element) {
      element.textContent = new Date().getFullYear();
    });
  }

  Eventra.ui = {
    icons: icons,
    eventUrl: eventUrl,
    renderEventCard: renderEventCard,
    renderFeaturedCard: renderFeaturedCard,
    renderCategoryRow: renderCategoryRow,
    renderFilterChip: renderFilterChip,
    observeReveals: observeReveals,
    showToast: showToast,
    closeMobileNav: function () {}
  };

  initHeader();
  initFooter();
  observeReveals();
})();
