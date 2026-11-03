/*
 * EVENTRA - event details page
 * Loads an event from the shared dataset using ?id=, populates the page,
 * drives the countdown, and renders related experiences.
 */
(function () {
  'use strict';

  const Eventra = (window.Eventra = window.Eventra || {});
  const utils = Eventra.utils;
  const ui = Eventra.ui;
  let countdownTimer = null;

  function setText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  function setStatusBadge(label, closed) {
    const badge = document.getElementById('event-status');
    if (!badge) return;
    badge.textContent = label;
    badge.classList.toggle('is-closed', Boolean(closed));
  }

  function closeRegistration(message) {
    const pastLink = document.getElementById('event-past-link');
    const calendarButton = document.getElementById('calendar-button');
    const countdownBlock = document.getElementById('countdown-block');
    const endedNote = document.getElementById('countdown-ended');

    utils.qsa('.event-register-trigger').forEach(function (button) {
      button.disabled = true;
      button.removeAttribute('data-register');
      button.textContent = 'Registration closed';
    });
    if (pastLink) pastLink.hidden = false;
    if (calendarButton) calendarButton.hidden = true;
    if (countdownBlock) countdownBlock.hidden = true;
    if (endedNote) {
      endedNote.hidden = false;
      endedNote.textContent = message;
    }
  }

  function updateCountdown(event) {
    const status = utils.getEventStatus(event);

    if (status === 'past') {
      setStatusBadge('Event concluded', true);
      closeRegistration('This experience has concluded.');
      window.clearInterval(countdownTimer);
      return;
    }

    if (status === 'live') {
      setStatusBadge('Happening now', true);
      closeRegistration('This experience is underway.');
      window.clearInterval(countdownTimer);
      return;
    }

    const parts = utils.countdownParts(event.date);
    const values = {
      days: utils.pad(parts.days),
      hours: utils.pad(parts.hours),
      minutes: utils.pad(parts.minutes),
      seconds: utils.pad(parts.seconds)
    };

    Object.keys(values).forEach(function (unit) {
      const element = document.querySelector('[data-countdown="' + unit + '"]');
      if (element) element.textContent = values[unit];
    });
  }

  function startCountdown(event) {
    updateCountdown(event);
    if (utils.getEventStatus(event) !== 'upcoming') return;
    countdownTimer = window.setInterval(function () {
      updateCountdown(event);
    }, 1000);
  }

  function renderDescription(event) {
    const container = document.getElementById('event-description');
    if (!container) return;
    container.innerHTML = event.description.map(function (paragraph) {
      return '<p>' + utils.escapeHTML(paragraph) + '</p>';
    }).join('');
  }

  function renderList(id, items) {
    const container = document.getElementById(id);
    if (!container) return;
    container.innerHTML = items.map(function (item) {
      return '<li>' + utils.escapeHTML(item) + '</li>';
    }).join('');
  }

  function renderRelated(event) {
    const container = document.getElementById('related-grid');
    const section = document.getElementById('related-section');
    if (!container) return;

    const available = Eventra.events.filter(function (candidate) {
      return candidate.id !== event.id && utils.getEventStatus(candidate) !== 'past';
    });

    const sameCategory = available.filter(function (candidate) {
      return candidate.category === event.category;
    });
    const otherCategories = available.filter(function (candidate) {
      return candidate.category !== event.category;
    });

    const related = utils.sortByDate(sameCategory, 'asc')
      .concat(utils.sortByDate(otherCategories, 'asc'))
      .slice(0, 3);

    if (!related.length) {
      if (section) section.hidden = true;
      return;
    }

    container.innerHTML = related.map(function (candidate, index) {
      return ui.renderEventCard(candidate, index);
    }).join('');
    ui.observeReveals(container);
  }

  function updateMeta(event) {
    if (!event) return;
    
    document.title = event.title + ' | Eventra';

    // Update description meta tag
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', event.excerpt);

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', event.title + ' | Eventra');

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute('content', event.excerpt);

    // Update OG image
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && event.image) ogImage.setAttribute('content', event.image);

    const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
    if (ogImageAlt) ogImageAlt.setAttribute('content', event.title);

    // Update OG URL
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', window.location.href);

    // Update Twitter Card tags
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage && event.image) twitterImage.setAttribute('content', event.image);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', event.title + ' | Eventra');

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute('content', event.excerpt);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
  }

  function injectStructuredData(event) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: event.title,
      description: event.excerpt,
      startDate: event.date,
      endDate: event.endDate,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      image: [event.image],
      location: {
        '@type': 'Place',
        name: event.venue,
        address: {
          '@type': 'PostalAddress',
          streetAddress: event.address,
          addressLocality: event.city,
          addressCountry: 'IN'
        }
      },
      organizer: {
        '@type': 'Organization',
        name: event.host
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  function populate(event) {
    setText('event-breadcrumb-category', event.category);
    setText('event-breadcrumb-title', event.title);
    setText('event-category', event.category);
    setText('event-title', event.title);
    setText('event-excerpt', event.excerpt);
    setText('event-host', event.host);
    setText('event-date', utils.formatLongDate(event));
    setText('event-time', utils.formatTimeRange(event));
    setText('event-venue', event.venue);
    setText('event-city', event.city);
    setText('event-venue-name', event.venue);
    setText('event-address', event.address);
    setText('event-venue-city', event.city);
    setText('event-aside-date', utils.formatCardDate(event));
    setText('event-aside-time', utils.formatTimeRange(event));
    setText('event-aside-venue', event.venue + ', ' + event.city);
    setText('event-cover-caption', event.city + ' · ' + utils.formatCardDate(event));

    const cover = document.getElementById('event-cover');
    if (cover) {
      cover.src = event.image;
      cover.alt = event.imageAlt;
      cover.width = 1200;
      cover.height = 1500;
    }

    const mapsLink = document.getElementById('maps-link');
    if (mapsLink) {
      const query = encodeURIComponent(event.venue + ', ' + event.address + ', ' + event.city + ', India');
      mapsLink.href = 'https://www.google.com/maps/search/?api=1&query=' + query;
    }

    utils.qsa('.event-register-trigger').forEach(function (button) {
      button.setAttribute('data-register-event', event.id);
      button.setAttribute('data-register', '');
    });

    const calendarButton = document.getElementById('calendar-button');
    if (calendarButton) calendarButton.setAttribute('data-add-calendar', event.id);

    renderDescription(event);
    renderList('event-expect', event.expect);
    renderList('event-highlights', event.highlights);
    renderRelated(event);
    updateMeta(event);
    injectStructuredData(event);

    const view = document.getElementById('event-view');
    if (view) view.hidden = false;

    utils.qsa('#event-view .event-hero .reveal').forEach(function (element) {
      element.classList.add('is-visible');
    });

    startCountdown(event);
  }

  function showNotFound() {
    const view = document.getElementById('event-view');
    const notFound = document.getElementById('event-not-found');
    if (view) view.hidden = true;
    if (notFound) notFound.hidden = false;
    document.title = 'Experience not found | Eventra';
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', 'This experience could not be found in the Eventra calendar.');
    }
  }

  function init() {
    const id = utils.getQueryParam('id');
    const event = utils.getEventById(id);
    if (!event) {
      showNotFound();
      return;
    }
    populate(event);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
