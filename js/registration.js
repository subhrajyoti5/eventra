/*
 * EVENTRA — registration
 * ------------------------------------------------------------------
 * A frontend-only registration experience. Entries are validated and
 * stored in localStorage so they survive refreshes. No data leaves the
 * browser and no confirmation email is sent.
 */
(function () {
  'use strict';

  const Eventra = (window.Eventra = window.Eventra || {});
  const utils = Eventra.utils;
  const STORAGE_KEY = 'eventra:registrations:v1';
  const NOTE_LIMIT = 280;

  const ICONS = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><path d="m5 12.5 4.5 4.5L19 6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><path d="m7 9 5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  let modal = null;
  let dialog = null;
  let form = null;
  let successPanel = null;
  let asideImage = null;
  let asideTitle = null;
  let asideMeta = null;
  let asideVenue = null;
  let eventSelect = null;
  let alertBox = null;
  let lastFocused = null;
  let isOpen = false;

  const fieldErrors = {
    name: 'error-name',
    email: 'error-email',
    phone: 'error-phone',
    event: 'error-event',
    notes: 'error-notes'
  };

  function readRegistrations() {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeRegistrations(registrations) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(registrations));
      return true;
    } catch (error) {
      return false;
    }
  }

  function upcomingEvents() {
    return utils.sortByDate(
      Eventra.events.filter(function (event) { return utils.isRegistrationOpen(event); }),
      'asc'
    );
  }

  function eventOptionsMarkup() {
    return upcomingEvents().map(function (event) {
      return '<option value="' + utils.escapeHTML(event.id) + '">' +
        utils.escapeHTML(event.title) + ' — ' + utils.escapeHTML(event.city) +
        ' · ' + utils.escapeHTML(utils.formatCardDate(event)) +
        '</option>';
    }).join('');
  }

  function randomDigits(length) {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let index = 0; index < length; index += 1) {
      let value;
      if (window.crypto && window.crypto.getRandomValues) {
        value = window.crypto.getRandomValues(new Uint32Array(1))[0] % alphabet.length;
      } else {
        value = Math.floor(Math.random() * alphabet.length);
      }
      result += alphabet.charAt(value);
    }
    return result;
  }

  function createReference(registrations) {
    const existingIds = new Set(registrations.map(function (entry) { return entry.id; }));
    let reference = '';
    do {
      reference = 'EVR-' + randomDigits(6);
    } while (existingIds.has(reference));
    return reference;
  }

  function buildModal() {
    const options = eventOptionsMarkup();
    const markup =
      '<div class="modal" id="registration-modal" aria-hidden="true">' +
        '<div class="modal__backdrop" data-modal-close></div>' +
        '<div class="modal__dialog" role="dialog" aria-modal="true" aria-labelledby="registration-title" tabindex="-1">' +
          '<button type="button" class="modal__close icon-btn" data-modal-close aria-label="Close registration dialog">' + ICONS.close + '</button>' +
          '<div class="register-layout">' +
            '<aside class="register-aside" aria-label="Selected event summary">' +
              '<div class="register-aside__media"><img id="register-event-image" alt="" width="640" height="400" loading="lazy"></div>' +
              '<div class="register-aside__content">' +
                '<p class="eyebrow">You’re registering for</p>' +
                '<h3 id="register-event-title"></h3>' +
                '<p class="register-aside__meta" id="register-event-meta"></p>' +
                '<p class="register-aside__venue" id="register-event-venue"></p>' +
              '</div>' +
              '<p class="register-aside__note">A demonstration registration. Your details stay in this browser and no payment or email is involved.</p>' +
            '</aside>' +
            '<div class="register-main">' +
              '<form class="register-form" id="registration-form" novalidate>' +
                '<header class="form-header">' +
                  '<p class="eyebrow">Registration</p>' +
                  '<h2 id="registration-title">Reserve your place.</h2>' +
                  '<p>A few details and you’re in. Fields marked with an asterisk are required.</p>' +
                '</header>' +
                '<div class="form-alert" id="registration-alert" role="alert" hidden></div>' +
                '<div class="form-grid">' +
                  '<div class="field">' +
                    '<label for="reg-name">Full name <span class="required-mark" aria-hidden="true">*</span></label>' +
                    '<input class="field-input" id="reg-name" name="name" type="text" autocomplete="name" ' +
                      'placeholder="Aarav Sharma" required aria-describedby="error-name">' +
                    '<p class="field-error" id="error-name"></p>' +
                  '</div>' +
                  '<div class="field">' +
                    '<label for="reg-email">Email address <span class="required-mark" aria-hidden="true">*</span></label>' +
                    '<input class="field-input" id="reg-email" name="email" type="email" autocomplete="email" ' +
                      'placeholder="you@example.com" required aria-describedby="error-email">' +
                    '<p class="field-error" id="error-email"></p>' +
                  '</div>' +
                  '<div class="field">' +
                    '<label for="reg-phone">Phone number <span class="required-mark" aria-hidden="true">*</span></label>' +
                    '<div class="phone-field">' +
                      '<span class="phone-prefix" aria-hidden="true">+91</span>' +
                      '<input class="field-input" id="reg-phone" name="phone" type="tel" inputmode="numeric" ' +
                        'autocomplete="tel-national" placeholder="98765 43210" maxlength="14" required aria-describedby="error-phone">' +
                    '</div>' +
                    '<p class="field-error" id="error-phone"></p>' +
                  '</div>' +
                  '<div class="field">' +
                    '<label for="reg-event">Selected event <span class="required-mark" aria-hidden="true">*</span></label>' +
                    '<div class="select-wrap">' +
                      '<select class="field-input" id="reg-event" name="event" required aria-describedby="error-event">' +
                        '<option value="">Choose an experience</option>' + options +
                      '</select>' + ICONS.chevron +
                    '</div>' +
                    '<p class="field-error" id="error-event"></p>' +
                  '</div>' +
                  '<div class="field field--full">' +
                    '<div class="label-row">' +
                      '<label for="reg-notes">Special requirements <span class="label-hint">(optional)</span></label>' +
                      '<span class="char-counter" id="notes-counter">0 / ' + NOTE_LIMIT + '</span>' +
                    '</div>' +
                    '<textarea class="field-input" id="reg-notes" name="notes" rows="3" maxlength="' + NOTE_LIMIT + '" ' +
                      'aria-describedby="error-notes" ' +
                      'placeholder="Accessibility needs, dietary preferences, or anything we should know."></textarea>' +
                    '<p class="field-error" id="error-notes"></p>' +
                  '</div>' +
                '</div>' +
                '<button class="btn btn-primary btn-block" type="submit">Confirm registration</button>' +
                '<p class="form-note">By registering you agree to a demo experience. Details are stored only in your browser.</p>' +
              '</form>' +
              '<div class="register-success" id="register-success" tabindex="-1" aria-live="polite" hidden>' +
                '<span class="success-mark">' + ICONS.check + '</span>' +
                '<p class="eyebrow">Registration confirmed</p>' +
                '<h2 id="success-title">You’re in.</h2>' +
                '<p class="success-copy">Save your reference below. It is the only record of this registration outside your browser.</p>' +
                '<dl class="success-details">' +
                  '<div><dt>Attendee</dt><dd id="success-name"></dd></div>' +
                  '<div><dt>Experience</dt><dd id="success-event"></dd></div>' +
                  '<div><dt>Date</dt><dd id="success-date"></dd></div>' +
                  '<div><dt>Reference</dt><dd class="success-reference" id="success-reference"></dd></div>' +
                '</dl>' +
                '<div class="success-actions">' +
                  '<button type="button" class="btn btn-primary" data-modal-close>Done</button>' +
                  '<button type="button" class="btn btn-ghost" data-add-calendar id="success-calendar">Add to calendar</button>' +
                '</div>' +
                '<p class="form-note">Remember: this is a frontend demonstration — no confirmation email will arrive.</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.insertAdjacentHTML('beforeend', markup);
    modal = document.getElementById('registration-modal');
    dialog = modal.querySelector('.modal__dialog');
    form = document.getElementById('registration-form');
    successPanel = document.getElementById('register-success');
    asideImage = document.getElementById('register-event-image');
    asideTitle = document.getElementById('register-event-title');
    asideMeta = document.getElementById('register-event-meta');
    asideVenue = document.getElementById('register-event-venue');
    eventSelect = document.getElementById('reg-event');
    alertBox = document.getElementById('registration-alert');
    modal.inert = true;
    bindEvents();
  }

  function selectedEventFromForm() {
    return utils.getEventById(eventSelect.value);
  }

  function updateAside(event) {
    if (!event) {
      asideImage.removeAttribute('src');
      asideImage.alt = '';
      asideTitle.textContent = 'Choose an experience';
      asideMeta.textContent = 'Pick an event from the list to continue.';
      asideVenue.textContent = '';
      return;
    }

    asideImage.src = event.image;
    asideImage.alt = event.imageAlt;
    asideImage.width = 640;
    asideImage.height = 400;
    asideTitle.textContent = event.title;
    asideMeta.textContent = utils.formatCardDateTime(event);
    asideVenue.textContent = event.venue + ', ' + event.city;
  }

  function setFieldError(field, message) {
    const input = form.elements[field];
    const error = document.getElementById(fieldErrors[field]);
    if (!input || !error) return;

    error.textContent = message || '';
    if (message) {
      input.setAttribute('aria-invalid', 'true');
    } else {
      input.removeAttribute('aria-invalid');
    }
  }

  function clearAllErrors() {
    Object.keys(fieldErrors).forEach(function (field) {
      setFieldError(field, '');
    });
    hideAlert();
  }

  function showAlert(message) {
    alertBox.textContent = message;
    alertBox.hidden = false;
  }

  function hideAlert() {
    alertBox.textContent = '';
    alertBox.hidden = true;
  }

  function resetForm() {
    form.reset();
    clearAllErrors();
    const counter = document.getElementById('notes-counter');
    if (counter) counter.textContent = '0 / ' + NOTE_LIMIT;
    form.hidden = false;
    successPanel.hidden = true;
    dialog.setAttribute('aria-labelledby', 'registration-title');
  }

  function validateName(value) {
    const trimmed = value.trim().replace(/\s+/g, ' ');
    if (!trimmed) return 'Enter your full name.';
    if (trimmed.length < 2) return 'Your name needs at least two characters.';
    if (!/^[\p{L}][\p{L}\p{M} .'’-]{1,79}$/u.test(trimmed)) {
      return 'Use letters, spaces, apostrophes, periods, or hyphens only.';
    }
    return '';
  }

  function validateEmail(value) {
    const trimmed = value.trim();
    if (!trimmed) return 'Enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      return 'Enter a valid email address, such as you@example.com.';
    }
    return '';
  }

  function normalizePhone(value) {
    let digits = String(value).replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    return digits;
  }

  function validatePhone(value) {
    const digits = normalizePhone(value);
    if (!digits) return 'Enter your phone number.';
    if (!/^[6-9]\d{9}$/.test(digits)) {
      return 'Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.';
    }
    return '';
  }

  function validateEvent(value) {
    const event = utils.getEventById(value);
    if (!event) return 'Choose an event to register for.';
    if (!utils.isRegistrationOpen(event)) return 'Registration for this event has closed.';
    return '';
  }

  function validateField(field) {
    let message = '';
    if (field === 'name') message = validateName(form.elements.name.value);
    if (field === 'email') message = validateEmail(form.elements.email.value);
    if (field === 'phone') message = validatePhone(form.elements.phone.value);
    if (field === 'event') message = validateEvent(form.elements.event.value);
    setFieldError(field, message);
    return !message;
  }

  function validateForm() {
    const fields = ['name', 'email', 'phone', 'event'];
    let firstInvalid = null;

    fields.forEach(function (field) {
      const valid = validateField(field);
      if (!valid && !firstInvalid) firstInvalid = form.elements[field];
    });

    const notes = form.elements.notes.value;
    if (notes.length > NOTE_LIMIT) {
      setFieldError('notes', 'Please keep your note under ' + NOTE_LIMIT + ' characters.');
      if (!firstInvalid) firstInvalid = form.elements.notes;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function handleSubmit(event) {
    event.preventDefault();
    hideAlert();
    if (!validateForm()) return;

    const selected = selectedEventFromForm();
    if (!selected) return;

    const name = form.elements.name.value.trim().replace(/\s+/g, ' ');
    const email = form.elements.email.value.trim();
    const phone = normalizePhone(form.elements.phone.value);
    const notes = form.elements.notes.value.trim();
    const registrations = readRegistrations();

    const duplicate = registrations.some(function (entry) {
      return entry.eventId === selected.id &&
        String(entry.email || '').toLowerCase() === email.toLowerCase();
    });

    if (duplicate) {
      const message = 'This email is already registered for ' + selected.title + '.';
      setFieldError('email', message);
      showAlert(message);
      form.elements.email.focus();
      return;
    }

    const registration = {
      id: createReference(registrations),
      eventId: selected.id,
      name: name,
      email: email,
      phone: '+91 ' + phone.slice(0, 5) + ' ' + phone.slice(5),
      notes: notes,
      createdAt: new Date().toISOString()
    };

    if (!writeRegistrations(registrations.concat(registration))) {
      showAlert('Your browser blocked local storage, so this registration could not be saved. Please check your privacy settings and try again.');
      return;
    }

    showSuccess(registration, selected);
  }

  function showSuccess(registration, event) {
    document.getElementById('success-name').textContent = registration.name;
    document.getElementById('success-event').textContent = event.title;
    document.getElementById('success-date').textContent = utils.formatLongDate(event);
    document.getElementById('success-reference').textContent = registration.id;
    const firstName = registration.name.split(/\s+/)[0];
    document.querySelector('#success-title').textContent = 'You’re in, ' + firstName + '.';
    document.getElementById('success-calendar').setAttribute('data-add-calendar', event.id);

    form.hidden = true;
    successPanel.hidden = false;
    dialog.setAttribute('aria-labelledby', 'success-title');
    dialog.scrollTop = 0;
    successPanel.focus({ preventScroll: true });
    Eventra.ui.showToast('Registration confirmed');
  }

  function openModal(eventId) {
    if (!modal) return;
    if (document.body.classList.contains('is-modal-open')) return;

    // Refresh options so events that have started are no longer selectable.
    eventSelect.innerHTML = '<option value="">Choose an experience</option>' + eventOptionsMarkup();

    let target = null;
    if (eventId) {
      target = utils.getEventById(eventId);
      if (target && !utils.isRegistrationOpen(target)) {
        Eventra.ui.showToast('Registration has closed for this event.');
        return;
      }
    }
    if (!target) target = upcomingEvents()[0] || null;

    resetForm();
    if (target) {
      eventSelect.value = target.id;
      updateAside(target);
    } else {
      eventSelect.value = '';
      updateAside(null);
      showAlert('There are no upcoming events open for registration right now.');
    }

    if (Eventra.ui.closeMobileNav) Eventra.ui.closeMobileNav(false);
    lastFocused = document.activeElement;
    isOpen = true;
    modal.inert = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('is-open');
    document.body.classList.add('is-modal-open');
    window.setTimeout(function () {
      dialog.focus({ preventScroll: true });
    }, 20);
  }

  function closeModal() {
    if (!modal || !isOpen) return;
    isOpen = false;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
    document.body.classList.remove('is-modal-open');
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus({ preventScroll: true });
    }
    lastFocused = null;
  }

  function trapFocus(event) {
    if (!isOpen || event.key !== 'Tab') return;
    const focusable = utils.getFocusableElements(dialog);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function bindEvents() {
    form.addEventListener('submit', handleSubmit);

    ['name', 'email', 'phone'].forEach(function (field) {
      const input = form.elements[field];
      input.addEventListener('blur', function () {
        if (input.value.trim()) validateField(field);
      });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') validateField(field);
        if (field === 'email') hideAlert();
      });
    });

    eventSelect.addEventListener('change', function () {
      const selected = selectedEventFromForm();
      updateAside(selected);
      validateField('event');
      hideAlert();
    });

    const notes = form.elements.notes;
    const counter = document.getElementById('notes-counter');
    notes.addEventListener('input', function () {
      counter.textContent = notes.value.length + ' / ' + NOTE_LIMIT;
    });

    modal.addEventListener('click', function (event) {
      if (event.target.closest('[data-modal-close]')) {
        event.preventDefault();
        closeModal();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        closeModal();
        return;
      }
      trapFocus(event);
    });

    document.addEventListener('click', function (event) {
      const trigger = event.target.closest('[data-register]');
      if (!trigger) return;
      event.preventDefault();
      const eventId = trigger.getAttribute('data-register-event');
      openModal(eventId);
    });

    // Optional cross-tab safety: if storage changes elsewhere, future
    // duplicate checks will still read the latest registrations via readRegistrations().
    window.addEventListener('storage', function (event) {
      if (event.key === STORAGE_KEY) {
        // No visible state to refresh here; kept as a documented hook.
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildModal);
  } else {
    buildModal();
  }

  Eventra.registration = {
    open: openModal,
    close: closeModal,
    read: readRegistrations
  };
})();
