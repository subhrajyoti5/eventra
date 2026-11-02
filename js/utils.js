/*
 * EVENTRA — shared utilities
 * Pure helpers for dates, escaping, querying, and small browser tasks.
 */
(function () {
  'use strict';

  const Eventra = (window.Eventra = window.Eventra || {});
  const IST = 'Asia/Kolkata';

  const dateShort = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: IST
  });

  const dateLong = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: IST
  });

  const weekdayLong = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    timeZone: IST
  });

  const dayNumeric = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    timeZone: IST
  });

  const monthLong = new Intl.DateTimeFormat('en-GB', {
    month: 'long',
    timeZone: IST
  });

  const monthShort = new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    timeZone: IST
  });

  const yearNumeric = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    timeZone: IST
  });

  const timeShort = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: IST
  });

  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (character) {
      return htmlEscapes[character];
    });
  }

  function debounce(callback, wait) {
    let timer = null;
    return function debounced() {
      const context = this;
      const args = arguments;
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        callback.apply(context, args);
      }, wait);
    };
  }

  function normalizeText(value) {
    return String(value == null ? '' : value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function toDate(value) {
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function dateKey(value) {
    const date = toDate(value);
    if (!date) return '';
    return [yearNumeric.format(date), monthShort.format(date), dayNumeric.format(date)].join('-');
  }

  function isMultiDay(event) {
    return Boolean(event.endDate && dateKey(event.date) !== dateKey(event.endDate));
  }

  function formatCardDate(event) {
    const start = toDate(event.date);
    const end = toDate(event.endDate);

    if (!start) return '';
    if (!end || !isMultiDay(event)) return dateShort.format(start);

    const parts = {
      startDay: dayNumeric.format(start),
      endDay: dayNumeric.format(end),
      startMonth: monthShort.format(start),
      endMonth: monthShort.format(end),
      startYear: yearNumeric.format(start),
      endYear: yearNumeric.format(end)
    };

    if (parts.startYear !== parts.endYear) {
      return parts.startDay + ' ' + parts.startMonth + ' ' + parts.startYear + ' – ' +
        parts.endDay + ' ' + parts.endMonth + ' ' + parts.endYear;
    }

    if (parts.startMonth !== parts.endMonth) {
      return parts.startDay + ' ' + parts.startMonth + ' – ' + parts.endDay + ' ' + parts.endMonth + ' ' + parts.endYear;
    }

    return parts.startDay + ' – ' + parts.endDay + ' ' + parts.endMonth + ' ' + parts.endYear;
  }

  function formatLongDate(event) {
    const start = toDate(event.date);
    const end = toDate(event.endDate);

    if (!start) return '';
    if (!end || !isMultiDay(event)) return dateLong.format(start);

    const startYear = yearNumeric.format(start);
    const endYear = yearNumeric.format(end);
    const startMonth = monthLong.format(start);
    const endMonth = monthLong.format(end);
    const startPart = weekdayLong.format(start) + ', ' + dayNumeric.format(start);

    if (startYear !== endYear) {
      return startPart + ' ' + startMonth + ' ' + startYear + ' – ' +
        weekdayLong.format(end) + ', ' + dayNumeric.format(end) + ' ' + endMonth + ' ' + endYear;
    }

    if (startMonth !== endMonth) {
      return startPart + ' ' + startMonth + ' – ' +
        weekdayLong.format(end) + ', ' + dayNumeric.format(end) + ' ' + endMonth + ' ' + endYear;
    }

    return startPart + ' – ' + weekdayLong.format(end) + ', ' +
      dayNumeric.format(end) + ' ' + endMonth + ' ' + endYear;
  }

  function formatTime(value) {
    const date = toDate(value);
    return date ? timeShort.format(date) : '';
  }

  function formatTimeRange(event) {
    const start = formatTime(event.date);
    const end = event.endDate ? formatTime(event.endDate) : '';
    return end ? start + ' – ' + end + ' IST' : start + ' IST';
  }

  function formatCardDateTime(event) {
    return formatCardDate(event) + ' · ' + formatTime(event.date);
  }

  function getEventStatus(event) {
    const now = Date.now();
    const start = toDate(event.date);
    const end = toDate(event.endDate || event.date);

    if (!start) return 'upcoming';
    if (end && now > end.getTime()) return 'past';
    if (now >= start.getTime()) return 'live';
    return 'upcoming';
  }

  function isRegistrationOpen(event) {
    const start = toDate(event.date);
    return Boolean(start) && Date.now() < start.getTime();
  }

  function getEventById(id) {
    if (!id) return null;
    return Eventra.events.find(function (event) {
      return event.id === id;
    }) || null;
  }

  function sortByDate(events, direction) {
    const multiplier = direction === 'desc' ? -1 : 1;
    return events.slice().sort(function (a, b) {
      return (new Date(a.date) - new Date(b.date)) * multiplier;
    });
  }

  function pluralize(count, singular, plural) {
    return count === 1 ? singular : (plural || singular + 's');
  }

  function countdownParts(targetDate) {
    const target = toDate(targetDate);
    const totalSeconds = target ? Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000)) : 0;
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
      ended: totalSeconds <= 0
    };
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function getFocusableElements(container) {
    return qsa(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), ' +
      'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      container
    ).filter(function (element) {
      return element.offsetParent !== null;
    });
  }

  function icsText(value) {
    return String(value == null ? '' : value)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r?\n/g, '\\n');
  }

  function toICSDate(value) {
    return new Date(value).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }

  function downloadCalendar(event) {
    const start = event.date;
    const end = event.endDate || new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString();
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EVENTRA//Experiences//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:' + event.id + '@eventra.demo',
      'DTSTAMP:' + toICSDate(new Date()),
      'DTSTART:' + toICSDate(start),
      'DTEND:' + toICSDate(end),
      'SUMMARY:' + icsText(event.title),
      'DESCRIPTION:' + icsText(event.excerpt),
      'LOCATION:' + icsText(event.venue + ', ' + event.address + ', ' + event.city),
      'END:VEVENT',
      'END:VCALENDAR'
    ];

    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = event.id + '.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (error) {
      // Fall through to the legacy copy path.
    }

    try {
      const field = document.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      return copied;
    } catch (error) {
      return false;
    }
  }

  Eventra.utils = {
    qs: qs,
    qsa: qsa,
    escapeHTML: escapeHTML,
    debounce: debounce,
    normalizeText: normalizeText,
    formatCardDate: formatCardDate,
    formatLongDate: formatLongDate,
    formatTime: formatTime,
    formatTimeRange: formatTimeRange,
    formatCardDateTime: formatCardDateTime,
    isMultiDay: isMultiDay,
    getEventStatus: getEventStatus,
    isRegistrationOpen: isRegistrationOpen,
    getEventById: getEventById,
    sortByDate: sortByDate,
    pluralize: pluralize,
    countdownParts: countdownParts,
    pad: pad,
    getQueryParam: getQueryParam,
    prefersReducedMotion: prefersReducedMotion,
    getFocusableElements: getFocusableElements,
    downloadCalendar: downloadCalendar,
    copyText: copyText
  };
})();
