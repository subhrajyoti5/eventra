/*
 * EVENTRA — event dataset
 * ------------------------------------------------------------------
 * All dates are stored as ISO 8601 strings with an explicit IST offset
 * (+05:30). Display formatting is handled in js/utils.js so this file can
 * remain a pure data source.
 */
(function () {
  'use strict';

  const Eventra = (window.Eventra = window.Eventra || {});

  Eventra.categories = [
    { name: 'Technology', blurb: 'Software, systems, and the people building them' },
    { name: 'Music', blurb: 'Live sets, listening rooms, and late nights' },
    { name: 'Business', blurb: 'Founders, operators, and honest numbers' },
    { name: 'Design', blurb: 'Craft, process, and the work behind the work' },
    { name: 'Education', blurb: 'Learning, unlearning, and new classrooms' },
    { name: 'Sports', blurb: 'Movement, endurance, and shared mornings' },
    { name: 'Art & Culture', blurb: 'Exhibitions, screenings, and open studios' },
    { name: 'Networking', blurb: 'Small rooms and useful introductions' }
  ];

  Eventra.events = [
    {
      id: 'frontier-tech-summit',
      title: 'Frontier Tech Summit',
      category: 'Technology',
      featured: true,
      date: '2026-12-12T09:30:00+05:30',
      endDate: '2026-12-12T18:30:00+05:30',
      venue: 'The Leela Palace Convention Centre',
      address: '23, Old Airport Road, Kodihalli',
      city: 'Bengaluru',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80',
      imageAlt: 'Attendees seated beneath a wide stage screen at a technology conference',
      excerpt: 'A full day with the builders shaping AI, climate tech, and the next wave of Indian products.',
      description: [
        'Frontier Tech Summit brings together researchers, founders, and product teams for a day of clear-eyed conversation about what is actually being built — and what it will take to last.',
        'Expect three stages of talks and demos, practical office hours with senior operators, and enough unplanned time between sessions to meet the people doing the work. No pitch theatre, no buzzword bingo.'
      ],
      expect: [
        'Keynotes from founders building in AI, climate, and fintech',
        'Live product demos with room for tough questions',
        'Small-group office hours with senior operators',
        'A closing rooftop mixer as the sun goes down'
      ],
      highlights: ['12 talks across 3 stages', 'Hands-on demo floor', 'Founder office hours', 'Rooftop closing mixer'],
      host: 'Eventra Collective'
    },
    {
      id: 'after-hours-festival',
      title: 'After Hours Festival',
      category: 'Music',
      featured: true,
      hero: true,
      date: '2027-01-17T16:00:00+05:30',
      endDate: '2027-01-17T23:30:00+05:30',
      venue: 'Mahim Bay Grounds',
      address: 'Mahim Causeway, Dharavi',
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1600&q=80',
      imageAlt: 'Crowd silhouetted against warm stage lights at an outdoor music festival',
      excerpt: 'An open-air evening of independent music, food, and good company by the sea.',
      description: [
        'After Hours is a one-night festival built around the artists shaping independent Indian music right now. Three stages, no overlapping headliners, and a courtyard full of food worth queuing for.',
        'The gates open late afternoon, the first act starts at golden hour, and the last set runs until the city quietens down. Come for a favourite artist, leave with a few new ones.'
      ],
      expect: [
        'Nine independent acts across three open-air stages',
        'A food courtyard from twelve Mumbai kitchens',
        'A record fair featuring limited pressings',
        'A quiet garden for conversations between sets'
      ],
      highlights: ['9 live acts', '3 stages', '12 food stalls', 'Record fair'],
      host: 'After Hours Sound'
    },
    {
      id: 'design-notes-2027',
      title: 'Design Notes 2027',
      category: 'Design',
      featured: true,
      date: '2027-02-06T10:00:00+05:30',
      endDate: '2027-02-06T19:00:00+05:30',
      venue: 'Kiran Nadar Museum of Art',
      address: '145, DLF South Court, Saket',
      city: 'New Delhi',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
      imageAlt: 'Overhead view of paint, brushes, and design materials on a worktable',
      excerpt: 'A one-day studio for people who make things — talks, critiques, and honest conversations about craft.',
      description: [
        'Design Notes is a different kind of design conference. Fewer slides, more work on the table. The day is built around studio critiques, candid project histories, and conversations that continue in the margins.',
        'Bring a notebook, a question, or a piece of work you are stuck on. The afternoon workshop stream is deliberately small so everyone leaves with something useful to take back to their practice.'
      ],
      expect: [
        'Talks from independent designers and studio leads',
        'Open critique tables for work in progress',
        'A print and type room curated by designers',
        'An evening reception in the museum courtyard'
      ],
      highlights: ['6 studio talks', 'Open critique tables', 'Print & type room', 'Courtyard reception'],
      host: 'Design Notes Studio'
    },
    {
      id: 'founders-table',
      title: "Founders' Table",
      category: 'Business',
      date: '2026-12-05T19:00:00+05:30',
      endDate: '2026-12-05T22:30:00+05:30',
      venue: 'Barometer, Koregaon Park',
      address: '12, North Main Road, Koregaon Park',
      city: 'Pune',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80',
      imageAlt: 'A warmly lit restaurant table set for an intimate dinner',
      excerpt: 'An intimate dinner for early-stage founders and the people who back them.',
      description: [
        "Founders' Table is a dinner, not a pitch night. Twenty seats, one long table, and a short list of prompts designed to get past the highlight reel.",
        'Instead of swapping decks, the room shares what is actually hard this quarter: hiring, pricing, co-founder dynamics, and the decisions that keep you up at night. Everything is off the record.'
      ],
      expect: [
        'A seated dinner for twenty founders and operators',
        'Facilitated table conversations, no pitches',
        'Quiet introductions to useful people',
        'Coffee and follow-ups after dessert'
      ],
      highlights: ['20 seats only', 'Off-the-record format', 'Facilitated conversation', 'Curated guest list'],
      host: 'Eventra Business Circle'
    },
    {
      id: 'atelier-open-studio',
      title: 'Atelier: Open Studio Weekend',
      category: 'Art & Culture',
      date: '2027-01-09T11:00:00+05:30',
      endDate: '2027-01-10T18:00:00+05:30',
      venue: 'The Pink Courtyard',
      address: '18, Gangapole, Amer Road',
      city: 'Jaipur',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&w=1600&q=80',
      imageAlt: 'Visitors walking through a bright contemporary art gallery',
      excerpt: 'Two slow days inside working artist studios, with printmaking, clay, and conversations.',
      description: [
        'For one weekend, a cluster of working studios in the old city opens its doors. Meet the artists, watch unfinished work take shape, and try your hands at a process or two.',
        'The pace is deliberately unhurried. There are two formal workshops each day, but the best part is often the courtyard: tea, a table of materials, and a conversation with whoever happens to be around.'
      ],
      expect: [
        'Open studios across five working practices',
        'Beginner-friendly printmaking and clay workshops',
        'A small market of artist editions',
        'Slow lunches in the courtyard, included'
      ],
      highlights: ['5 open studios', '2 workshops daily', 'Artist editions market', 'Lunch included'],
      host: 'Atelier Jaipur'
    },
    {
      id: 'morning-miles-club',
      title: 'Morning Miles Club',
      category: 'Sports',
      date: '2026-12-20T06:30:00+05:30',
      endDate: '2026-12-20T09:00:00+05:30',
      venue: 'KBR National Park',
      address: 'Chintal Basti, Jubilee Hills',
      city: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1600&q=80',
      imageAlt: 'A runner moving along a tree-lined path in the early morning',
      excerpt: "A relaxed 8K run through the city's quietest green corridor, followed by breakfast.",
      description: [
        'Morning Miles is a no-pressure run club for people who want company more than competition. We meet before the city wakes up and take the long, leafy route through KBR National Park.',
        'There are three pace groups, a walking group, and a strict rule: nobody gets left behind. We finish with filter coffee and breakfast at the park gate.'
      ],
      expect: [
        'A marshalled 8K route inside the park',
        'Three pace groups plus a walking group',
        'A bag drop and water station midway',
        'Breakfast and coffee after the run'
      ],
      highlights: ['8K route', 'Pace groups', 'Breakfast included', 'Beginner friendly'],
      host: 'Morning Miles Hyderabad'
    },
    {
      id: 'the-future-of-learning',
      title: 'The Future of Learning',
      category: 'Education',
      date: '2027-02-20T09:30:00+05:30',
      endDate: '2027-02-20T17:00:00+05:30',
      venue: 'Indian Institute of Science',
      address: 'CV Raman Road, Malleshwaram',
      city: 'Bengaluru',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80',
      imageAlt: 'Students and a teacher in conversation in a bright classroom',
      excerpt: 'Educators, researchers, and students on what comes after the classroom.',
      description: [
        'This one-day symposium asks uncomfortable, practical questions about learning: what should be taught, what should be unlearned, and who gets to decide?',
        'The programme mixes evidence-led talks with working sessions. Teachers, researchers, school leaders, and students share the same room — and the same problem statements — throughout the day.'
      ],
      expect: [
        'Research-led talks on how people actually learn',
        'Working sessions for teachers and students together',
        'A showcase of classroom experiments from across India',
        'A closing open forum with the speakers'
      ],
      highlights: ['8 sessions', 'Shared working tables', 'Classroom showcase', 'Open closing forum'],
      host: 'Eventra Learning Circle'
    },
    {
      id: 'film-in-the-park',
      title: 'Film in the Park',
      category: 'Art & Culture',
      date: '2027-01-24T17:30:00+05:30',
      endDate: '2027-01-24T21:30:00+05:30',
      venue: 'Victoria Memorial Lawn',
      address: 'Victoria Memorial Hall, 1, Queens Way',
      city: 'Kolkata',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
      imageAlt: 'Rows of seats facing a glowing cinema screen in a dark theatre',
      excerpt: 'A twilight screening under the open sky, with a short film showcase before the feature.',
      description: [
        'We are turning the Victoria Memorial lawn into a cinema for one evening. Bring a blanket, arrive early, and watch the light change over the city before the screen comes alive.',
        'The evening opens with three short films from Kolkata-based directors, followed by a restored classic under the stars. Subtitles are on; phones are politely asked to stay away.'
      ],
      expect: [
        'Three short films introduced by their directors',
        'A restored feature screening in the open air',
        'Food stalls from local favourites',
        'A post-screening conversation with the programmers'
      ],
      highlights: ['3 short films', 'Open-air screening', 'Director introductions', 'Local food stalls'],
      host: 'Park Cinema Collective'
    },
    {
      id: 'coffee-and-conversations',
      title: 'Coffee & Conversations',
      category: 'Networking',
      date: '2026-12-06T10:00:00+05:30',
      endDate: '2026-12-06T12:30:00+05:30',
      venue: 'Subko Bakehouse',
      address: '16, Chapel Road, Bandra West',
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80',
      imageAlt: 'A cup of coffee on a table beside an open notebook',
      excerpt: 'A small, unstructured meetup for designers, writers, and curious freelancers.',
      description: [
        'No name tags, no agenda, no thirty-second introductions. Coffee & Conversations is exactly what it sounds like: a table of interesting people and a couple of hours to talk.',
        'We keep the group small so there is one table, not five. Come alone or bring a friend — both are normal here.'
      ],
      expect: [
        'A relaxed morning coffee in a small group',
        'Conversation prompts if you need them',
        'A mix of designers, writers, and independent workers',
        'An optional walk to the sea afterwards'
      ],
      highlights: ['Small group', 'No pitches', 'Coffee included', 'Bandra walk'],
      host: 'Eventra Community'
    },
    {
      id: 'indie-sessions',
      title: 'Indie Sessions: Live at the Courtyard',
      category: 'Music',
      date: '2027-03-06T19:00:00+05:30',
      endDate: '2027-03-06T22:30:00+05:30',
      venue: 'The Courtyard, Altinho',
      address: 'Rua de Ourem, Altinho, Panaji',
      city: 'Goa',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1600&q=80',
      imageAlt: 'A musician performing with a guitar under warm stage lighting',
      excerpt: 'Three independent acts, one courtyard, and a night of unhurried live music.',
      description: [
        'Indie Sessions is a seated listening show in a quiet Goan courtyard. Three acts, stripped-back sets, and a sound system tuned for conversation rather than volume.',
        'The evening is small by design: 120 seats around the stage, a bar in the corner, and no reason to rush home afterwards.'
      ],
      expect: [
        'Three stripped-back live sets',
        'A seated courtyard listening room',
        'A bar by the stage, open until close',
        'Time after the show to meet the artists'
      ],
      highlights: ['3 live sets', '120 seats', 'Intimate courtyard', 'Artist meet & greet'],
      host: 'Session Records'
    },
    {
      id: 'product-craft-lab',
      title: 'Product Craft Lab',
      category: 'Design',
      date: '2027-03-20T09:30:00+05:30',
      endDate: '2027-03-20T18:00:00+05:30',
      venue: 'IIT Madras Research Park',
      address: '1, Kanagam Road, Taramani',
      city: 'Chennai',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80',
      imageAlt: 'A team sketching and discussing ideas around a workshop table',
      excerpt: 'A hands-on day for product designers — from messy problem to a tested prototype.',
      description: [
        'Product Craft Lab is a working day, not a lecture series. Small teams take one real problem from a partner organisation and move through research, framing, sketching, and a quick prototype.',
        'There will be short inputs from practitioners along the way, but most of the day is spent making. You leave with a tested prototype, a clearer process, and a few new collaborators.'
      ],
      expect: [
        'One real brief, worked end to end',
        'Short inputs on research, framing, and prototyping',
        'Peer critique at three checkpoints',
        'A closing showcase with the partner team'
      ],
      highlights: ['Hands-on lab', 'Real product brief', 'Peer critique', 'Prototype showcase'],
      host: 'Craft Collective'
    },
    {
      id: 'startup-sprint-demo-day',
      title: 'Startup Sprint: Demo Day',
      category: 'Business',
      date: '2027-04-10T15:00:00+05:30',
      endDate: '2027-04-10T20:00:00+05:30',
      venue: 'T-Hub',
      address: '2.0, Raidurgam, Knowledge City',
      city: 'Hyderabad',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1600&q=80',
      imageAlt: 'Colleagues working together in a bright open-plan studio',
      excerpt: "Watch twelve early-stage teams pitch what they've built in eight weeks.",
      description: [
        'Twelve teams. Eight weeks. One afternoon to show what survived contact with real users. Demo Day is the public close of the Startup Sprint programme, open to founders, operators, and the merely curious.',
        'Each team gets six minutes on stage and ten minutes at their table. There is no winner and no trophy — just honest feedback, useful introductions, and a room full of people building things.'
      ],
      expect: [
        'Twelve six-minute demos from early-stage teams',
        'Open tables for questions and product testing',
        'Office hours with invited operators',
        'A rooftop mixer to close the evening'
      ],
      highlights: ['12 demos', 'Open product tables', 'Operator office hours', 'Rooftop mixer'],
      host: 'Sprint Labs'
    }
  ];
})();
