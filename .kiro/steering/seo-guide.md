# SEO Guide for Eventra

## Overview
This document outlines all SEO improvements made to the Eventra website to enhance search engine visibility and social media sharing.

## 1. Meta Tags Added

### Homepage (`index.html`)
- **Title**: "Eventra | Discover experiences. Create memories."
- **Description**: Comprehensive description of the platform
- **Keywords**: events, experiences, calendar, technology, design, music, business, culture, India
- **Robots**: index, follow (allows search engines to index)
- **Language**: English
- **Author**: Eventra

### Event Detail Page (`event.html`)
- **Title**: "Experience | Eventra" (dynamically updated per event)
- **Description**: Event-specific excerpt (dynamically updated)
- **Keywords**: Dynamically generated based on event title and category
- **Robots**: index, follow

## 2. Open Graph (OG) Tags

### Homepage OG Tags
```html
<meta property="og:title" content="Eventra | Discover experiences. Create memories.">
<meta property="og:description" content="A curated calendar of experiences worth showing up for...">
<meta property="og:type" content="website">
<meta property="og:image" content="[hero image URL]">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Crowd silhouetted against warm stage lights...">
<meta property="og:url" content="[page URL]">
```

### Event Pages OG Tags
- **og:image**: Event cover image (1200x630px recommended)
- **og:image:alt**: Event title for accessibility
- **og:url**: Dynamic URL including event ID
- All tags are **dynamically updated** via JavaScript when an event loads

## 3. Twitter Card Tags

### Twitter Card Settings
- **Card Type**: summary_large_image (displays large image preview)
- **Creator**: @subhra8640
- **Dynamic Updates**: Title, description, and image update per event

Example:
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Event Title | Eventra">
<meta name="twitter:description" content="Event excerpt...">
<meta name="twitter:image" content="[event image URL]">
<meta name="twitter:creator" content="@subhra8640">
```

## 4. Structured Data (Schema.org)

### Homepage
- **Organization Schema**: Provides search engines with company information
  - Name, URL, logo
  - Description
  - Social media links (Instagram, Twitter, LinkedIn)

### Event Pages
- **Event Schema**: Helps search engines understand event details
  - Event name, description, image
  - Start/end dates
  - Location (venue, city, address, country)
  - Organizer information
  - Event status (scheduled, live, etc.)

Example Event Schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Event Title",
  "description": "Event description",
  "image": ["event-image-url"],
  "startDate": "2027-01-17",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
    "@type": "Place",
    "name": "Venue Name",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Address",
      "addressLocality": "City",
      "addressCountry": "IN"
    }
  }
}
```

## 5. Canonical URLs

- **Homepage**: Links to itself
- **Event Pages**: Dynamically set to include the event ID in the query parameter
  - Format: `event.html?id=[event-id]`
  - Prevents duplicate content issues

## 6. Dynamic Meta Tag Updates

### JavaScript Implementation
Located in: `js/event-details.js`

The system automatically updates these tags when an event loads:
- Page title
- Meta description
- All OG tags (title, description, image, URL)
- All Twitter Card tags
- Canonical URL
- Structured data (Schema.org)

### How It Works
1. Event data is fetched based on URL parameters
2. `updateMeta()` function updates all relevant meta tags
3. `injectStructuredData()` adds Event schema as JSON-LD
4. Social platforms can now properly parse shared links

## 7. Image Guidelines

### Open Graph Images
- **Recommended Size**: 1200 x 630 pixels
- **Format**: JPG or PNG
- **File Size**: Keep under 500KB for fast loading
- **Content**: High-quality, visually appealing image representing the content

### Twitter Card Images
- Same dimensions as OG images (1200x630)
- Can be the same image as OG image
- Displays when shared on Twitter/X

## 8. Testing SEO

### Tools to Use
1. **Google Search Console**: Submit sitemap, monitor indexing
   - URL: https://search.google.com/search-console
2. **Meta Tags Inspector**: Verify OG and Twitter tags
   - Chrome extension: "Meta Tags Inspector"
3. **Structured Data Testing Tool**
   - URL: https://search.google.com/test/rich-results
4. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator

### Manual Testing
1. Share a link on Twitter/X - verify image and description display
2. Share on Facebook - verify title, description, and OG image
3. Share on LinkedIn - verify professional appearance
4. Use browser developer tools to inspect meta tags

## 9. SEO Best Practices Implemented

✅ Semantic HTML structure
✅ Proper heading hierarchy (h1, h2, h3)
✅ Alt text on all images
✅ Descriptive page titles (under 60 characters)
✅ Meta descriptions (under 160 characters)
✅ Mobile-responsive design
✅ Fast page load times
✅ Structured data markup
✅ Social media meta tags
✅ Canonical URLs
✅ Internal linking structure
✅ Skip-to-content link for accessibility

## 10. Future Improvements

- [ ] Create XML sitemap (`sitemap.xml`)
- [ ] Add robots.txt for crawl directives
- [ ] Implement breadcrumb schema on event pages
- [ ] Add FAQ schema for common questions
- [ ] Set up Google Analytics 4 for traffic tracking
- [ ] Create blog with keyword-rich content
- [ ] Implement JSON-LD for aggregate ratings
- [ ] Add hreflang tags for multi-language support (if applicable)

## 11. Files Modified

- `index.html` - Added comprehensive meta tags
- `event.html` - Added OG meta tags (dynamically populated)
- `js/event-details.js` - Updated meta tag management + OG image support
- `js/app.js` - Added Organization schema
- `js/seo.js` - Created SEO utility functions (for future use)

## 12. Maintenance

Review and update:
- **Quarterly**: Check Search Console for indexing issues
- **Monthly**: Review analytics for top-performing pages
- **Per Event**: Ensure new events have high-quality images and descriptions
- **Annually**: Update schema markup if platform changes significantly

---

**Last Updated**: November 3, 2026
**Status**: Fully Implemented
