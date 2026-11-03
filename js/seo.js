/**
 * SEO and Open Graph tag management
 * Updates meta tags dynamically for event pages
 */

export function updateEventMeta(event) {
  if (!event) return;

  // Update page title
  document.title = `${event.title} | Eventra`;

  // Update or create meta tags
  const metaTags = {
    description: event.excerpt || event.description,
    keywords: `${event.title}, ${event.category}, event, experience`,
    'og:title': `${event.title} | Eventra`,
    'og:description': event.excerpt || event.description,
    'og:image': event.image,
    'og:image:alt': event.title,
    'og:url': `${window.location.origin}/event.html?id=${event.id}`,
    'twitter:title': `${event.title} | Eventra`,
    'twitter:description': event.excerpt || event.description,
    'twitter:image': event.image,
  };

  Object.entries(metaTags).forEach(([name, content]) => {
    if (!content) return;

    let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    
    if (!tag) {
      tag = document.createElement('meta');
      const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
      if (isProperty) {
        tag.setAttribute('property', name);
      } else {
        tag.setAttribute('name', name);
      }
      document.head.appendChild(tag);
    }
    
    tag.setAttribute('content', content);
  });

  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = `${window.location.origin}/event.html?id=${event.id}`;
}

export function updateSiteMeta(title, description, image, url) {
  document.title = title;

  const metaTags = {
    description,
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
  };

  Object.entries(metaTags).forEach(([name, content]) => {
    if (!content) return;

    let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    
    if (!tag) {
      tag = document.createElement('meta');
      const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
      if (isProperty) {
        tag.setAttribute('property', name);
      } else {
        tag.setAttribute('name', name);
      }
      document.head.appendChild(tag);
    }
    
    tag.setAttribute('content', content);
  });
}

export function addStructuredData(data) {
  let script = document.querySelector('script[type="application/ld+json"]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function createEventSchema(event) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    image: event.image,
    startDate: event.date,
    endDate: event.date,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venue,
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.city,
        addressCountry: 'IN',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: event.host,
      url: window.location.origin,
    },
  };
}

export function createOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Eventra',
    url: window.location.origin,
    logo: `${window.location.origin}/assets/favicon.svg`,
    description: 'Eventra is a curated calendar of experiences worth showing up for.',
    sameAs: [
      'https://www.instagram.com/subhrajyotisaho0/',
      'https://x.com/subhra8640',
      'https://www.linkedin.com/in/subhrajyoti-s-b047a227a/',
    ],
  };
}
