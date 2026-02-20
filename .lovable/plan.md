

## Whitehawk FC - Layout Improvements

### What's changing

**1. "Next Match" Hero Slide (Slide 2)**
The second slide in the hero carousel will become a dedicated "Next Match" banner showing the upcoming fixture details prominently -- opponent name, date, kick-off time, venue, and competition. This will be built from the fixtures data so it stays in sync. For now it uses the hardcoded fixture data; once you get a Football Web Pages API key and enable Cloud, it will pull live data automatically.

**2. Fixtures Before Results**
The fixtures/results widget will be reordered so upcoming matches appear at the top, followed by past results below. Currently they're mixed chronologically.

**3. Content Management (for later)**
Right now, without Lovable Cloud enabled, content like news posts and photos has to be updated by asking me. Whenever you're ready to enable Cloud, I can build you a simple admin panel where you upload photos, write news posts, and everything updates automatically. The Football Web Pages API integration (for fully automatic fixture/result updates) also needs Cloud to securely store your API key.

---

### Technical Details

**HeroSection.tsx changes:**
- Replace the static second slide with a dynamic "Next Fixture" slide that reads from the fixtures data array
- Display: opponent name as the big title, date and kick-off time as subtitle, venue in description, "Buy Tickets" CTA
- The slide will automatically show whichever fixture has `isNext: true`

**FixturesWidget.tsx changes:**
- Split fixtures into two groups: upcoming (no result) and past (has result)
- Render upcoming fixtures first, then past results, within the same card
- Reorder so the nearest upcoming match is at the top

**No new dependencies or files needed** -- just modifications to two existing components.

