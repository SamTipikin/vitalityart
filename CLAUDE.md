# CLAUDE.md — Vitality Art Rebuild

This file is the project spec. Read it fully before starting work. It tells you what we're building, why we're making the choices we're making, and what good looks like.

---

## 1. Project Brief

We're rebuilding **vitalityart.es** — the portfolio site for Spanish-based painter **Vitaly Leshukov**. The current site runs on Webflow. We're moving off Webflow to escape the monthly cost (≈€16–28/mo) and to give the artist a fresh, better-than-original design.

**The goals, in priority order:**

1. **Free hosting forever.** Static site on Vercel (or Cloudflare Pages). $0/month.
2. **Visually stronger than the current site.** Editorial, gallery-grade, art-first. Fresh design — not a port of the Webflow build.
3. **Self-serve for the client.** They should be able to add new paintings and exhibitions without touching code.
4. **Fast.** It's an art site. Big images. Must feel instant on every device.

**What carries over from the old site:** brand fonts, brand color palette, the artist's story, the painting catalog, the exhibitions list, the contact details.

**What does NOT carry over:** layout, animation choices, gallery structure, hero treatment — none of it. Treat the old site as a content reference only, not a design reference. We were explicitly hired to do better than what's there.

Reference URL (content only): https://www.vitalityart.es/

---

## 2. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 5+** | Static-first, content-heavy site. Builds to plain HTML, ships ~zero JS by default, image optimization built in. Right tool for this job. |
| Styling | **Tailwind CSS** | Fast iteration, paired with brand tokens below. |
| Animation | **Motion** (motion.dev, formerly Framer Motion) for component-level; CSS for page-level | Use sparingly. The art is the show. |
| CMS | **Sanity (free tier)** | Hotspot/focal point image cropping is essential for an art site. Polished editor UX. 3 users, 10k docs, 5GB assets, 100GB bandwidth — we'll use ~1%. |
| Forms | **Web3Forms** | Free, unlimited, no backend. Just `<form action>`. |
| Hosting | **Vercel** (hobby tier) | Astro deploys in one click. SSL automatic. If client expects high traffic spikes, switch to Cloudflare Pages (unlimited bandwidth). |
| Domain | Client owns it | Just point DNS at Vercel. |

**Do not deviate from this stack without checking in.** These choices are deliberate and informed by the constraints. If you find yourself wanting to add Next.js, a state library, a custom image CDN, etc. — stop and reconsider.

---

## 3. Brand Tokens

These are extracted directly from the live site's CSS. Use these exact values.

### Fonts

Both fonts are **free on Fontshare** (https://www.fontshare.com).

| Role | Family | Source | Weights to load |
|---|---|---|---|
| Display (large headings, artist name) | **Tanker** | Fontshare | Regular (only weight available) |
| Body / UI | **General Sans** | Fontshare | 400, 500, 600 (variable also fine) |

Fontshare CDN snippet (drop in `<head>`):

```html
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link href="https://api.fontshare.com/v2/css?f[]=tanker@400&f[]=general-sans@400,500,600&display=swap" rel="stylesheet">
```

In Tailwind config:

```js
fontFamily: {
  display: ['Tanker', 'sans-serif'],
  sans: ['"General Sans"', 'system-ui', 'sans-serif'],
}
```

Tanker is geometric, condensed, bold. Use it sparingly and large — artist name, section labels, hero pull-quotes. Don't set body copy in it.

### Colors

```js
// tailwind.config — extend.colors
colors: {
  bone: '#FAFAFA',       // primary background — warm off-white
  ink:  '#1B2330',       // primary foreground — deep navy, near-black
  paper: '#FFFFFF',      // pure white, for elevated surfaces / cards
  pitch: '#000000',      // pure black, for rare emphasis only
}
```

The whole palette. That's the entire system. Two-tone editorial. The paintings provide every other color on the page — that's deliberate.

**Do not introduce new brand colors.** If you need state colors (form errors, hover states), derive them from `ink` with opacity (e.g., `ink/10`, `ink/60`) rather than introducing greys. The discipline of a tight palette is the look.

### Spacing & Type Scale

Not extracted — design fresh. Suggested starting points:

- Generous whitespace. Gallery sites breathe.
- Display sizes: 96px / 128px / 160px (mobile down to 56–72px). Tanker holds up huge.
- Body: 16–18px General Sans 400. Line height 1.5–1.6.
- Tracking: tight on display (`-0.02em`), normal on body.

Iterate in real components, don't pre-define an exhaustive scale.

---

## 4. Design Direction

This is the section that matters most. **Read the `frontend-design` skill at `/mnt/skills/public/frontend-design/SKILL.md` before doing any UI work.** It has the patterns and constraints for non-generic design output.

### Mood

Editorial, gallery-grade, museum-publication. The reference points are not other "artist portfolio websites" — those are a race to the bottom of templates. Look at:

- **Gagosian, Pace, Hauser & Wirth** — gallery sites. Quiet UI, generous space, art carries the page.
- **Apartamento, Apollo, frieze** — art magazines. Editorial typography, layered grids, real type hierarchy.
- **It's Nice That, Are.na** — for how content lists can feel curated rather than cataloged.

### Anti-patterns — do not do these

- ❌ Centered hero with a "Hi, I'm an artist 👋" tone. Vitaly's story is dramatic (he came back from a coma to paint) — earn it with restraint, not exclamation marks.
- ❌ Generic dark-mode-first portfolio. We're light/off-white. The navy is supporting, not dominant.
- ❌ Parallax for the sake of parallax. Scroll effects only where they reveal content meaningfully.
- ❌ Card grids with rounded corners and drop shadows. This is gallery work, not a SaaS dashboard.
- ❌ Stock "let's create together" CTAs. The contact section is for collecting commissions and acquisitions — write it that way.
- ❌ Gradient buttons. Gradient anything, really.
- ❌ Animated cursors that follow you around. We saw it on the old site. Skip.
- ❌ "AI-looking" hero — big bold serif/sans on a centered axis with a one-line tagline. Get more interesting with the layout.

### What good looks like

- Asymmetric, editorial layouts. Magazine-style grids. Art that breaks out of containers.
- Type doing real work — large, deliberate, sometimes overlapping the imagery.
- The bio/origin story treated like a feature article, not a bio paragraph.
- Gallery views that let people actually see the work — full-bleed options, not just thumbnail grids.
- The exhibition list treated as a meaningful timeline, not a CSV dump. There's a real career here (Taipei, Dubai, Bordeaux, Lausanne, Tokyo).
- Hover/interaction states that feel intentional and quiet. No bounces, no "wiggles."

### Iterate visually before committing

For each major section (hero, gallery, exhibitions, contact), build 2–3 variants in isolation as `.astro` files in `/src/playground/` before picking one. Show them with placeholder content first, then real content, then refine. Don't try to design the whole site in one pass.

---

## 5. Content Model (Sanity Schemas)

Two collections. Keep them tight — adding fields later is cheap, removing them is annoying.

### `painting`

```ts
{
  name: 'painting',
  title: 'Painting',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: required },
    { name: 'slug', type: 'slug', source: 'title' },
    { name: 'series', type: 'reference', to: [{ type: 'series' }] },  // optional 3rd collection if needed
    { name: 'year', type: 'number' },
    { name: 'dimensions', type: 'object', fields: [
      { name: 'width', type: 'number' },   // cm
      { name: 'height', type: 'number' },  // cm
    ]},
    { name: 'price', type: 'number' },     // USD; null = price on request
    { name: 'currency', type: 'string', initialValue: 'USD' },
    { name: 'sold', type: 'boolean', initialValue: false },
    { name: 'image', type: 'image', options: { hotspot: true }, validation: required },
    { name: 'description', type: 'text', rows: 4 },
    { name: 'order', type: 'number' },     // for manual sort on home/gallery
  ]
}
```

### `exhibition`

```ts
{
  name: 'exhibition',
  title: 'Exhibition',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: required },
    { name: 'date', type: 'date', validation: required },
    { name: 'type', type: 'string', options: { list: ['solo', 'group', 'fair', 'auction'] } },
    { name: 'venue', type: 'string' },
    { name: 'city', type: 'string' },
    { name: 'country', type: 'string' },
    { name: 'link', type: 'url' },
  ]
}
```

### Optional 3rd: `series`

Old site has these series tags: `birth`, `naked-beauty`, `life-in`, `life-in-water`, `goldfish`, `dreams`. If we want filterable galleries by series, make it a separate collection so the artist can add/edit them freely.

### Site settings (singleton)

For artist bio, contact details, social links — single document, edited once.

```ts
{ name: 'siteSettings', type: 'document', fields: [
    { name: 'bio', type: 'array', of: [{ type: 'block' }] },  // portable text
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string' },
    { name: 'address', type: 'text' },
    { name: 'instagram', type: 'url' },
    { name: 'facebook', type: 'url' },
    { name: 'tiktok', type: 'url' },
]}
```

---

## 6. Site Structure

### Pages

| Path | Purpose | Data source |
|---|---|---|
| `/` | Hero + origin story + featured paintings + exhibitions teaser + contact | Sanity (paintings where `featured`, exhibitions, settings) |
| `/gallery` | Full catalog, filterable by series | Sanity (all paintings) |
| `/gallery/[slug]` | Individual painting page (optional — only if we want SEO per piece) | Sanity (painting by slug) |
| `/exhibitions` | Full exhibitions archive (optional — could also live as a section on `/`) | Sanity |

Start with `/` and `/gallery`. Decide whether to add the others based on how the design wants to breathe.

### Navigation

Old site has: Origins / Gallery / Events / Get in touch. Keep that mental model — but you're free to design the nav itself however reads best.

---

## 7. Build Phases

Do these in order. Don't skip ahead.

### Phase 1 — Scaffold (½ day)

- `npm create astro@latest` → minimal template, TypeScript on
- Add Tailwind, configure brand tokens from §3
- Add Fontshare links, verify Tanker + General Sans render
- Drop in a basic layout shell (header, footer placeholder)
- Set up Git, push to GitHub, connect Vercel, verify `main` auto-deploys
- Add `.env.example` for Sanity + Web3Forms keys

**Done when:** a "Hello, Vitaly" page renders in brand fonts and colors, live on a Vercel preview URL.

### Phase 2 — Sanity setup (½ day)

- `npm create sanity@latest` in a `/studio` folder (monorepo, or separate repo — your call)
- Build schemas from §5
- Deploy Studio to `studio.vitalityart.es` (Sanity hosts it free) or Vercel subdomain
- Wire Astro to Sanity client (`@sanity/client` + `@sanity/image-url`)
- Verify a test painting renders on the homepage from Sanity data

**Done when:** you can add a painting in Sanity Studio and see it appear on the live preview within 30 seconds.

### Phase 3 — Data import (1–2 hours)

- Scrape the existing 55 paintings from vitalityart.es (titles, dimensions, prices, sold status, series, image URLs at full resolution)
- Scrape exhibitions list (date, title, location)
- Write a one-off Node script to push everything into Sanity via the API
- Manually verify in Studio that everything imported clean

There's a script you can adapt — start by curling the homepage and `/gallery`, parsing with `cheerio`. Image URLs are on `cdn.prod.website-files.com` and downloadable directly. **Don't hotlink — download to local, then upload to Sanity.**

**Done when:** Studio shows ~55 paintings and ~25 exhibitions, all images loaded.

### Phase 4 — Design + build (3–5 days)

This is the main event. Read §4 again before starting.

Suggested order:
1. Hero / origin story section — sets the tone for everything
2. Featured paintings on home
3. Full gallery page
4. Exhibitions section/page
5. Contact form
6. Mobile pass on everything (don't leave mobile to the end as a chore — design it in parallel)
7. Motion polish — page transitions, image reveals, hover states. Quiet. No bouncing.

**Use the playground pattern:** before committing a section, build 2–3 variants in `/src/playground/` and pick the strongest.

### Phase 5 — Form + final polish + handover (½ day)

- Web3Forms account → get access key → drop into env
- Form posts to Web3Forms; emails route to `viacatalana@gmail.com` (CONFIRM with Sam before going live)
- Lighthouse pass: aim for 95+ on all four metrics. Compress any images >300KB.
- Sitemap.xml + robots.txt
- Open Graph tags + per-page meta
- Favicon (export from one of the painting motifs — koi or iris, ask Sam)
- Loom walkthrough of Sanity Studio for the artist
- README in repo: how to add a painting, how to update bio, where the keys live
- Point client's domain DNS at Vercel (A records + verify)

**Done when:** the artist has logged in, added a test painting, seen it appear, and signed off.

---

## 8. Constraints, Gotchas, and Notes

### Performance

- Astro `<Image>` for every painting, `loading="lazy"` below the fold, `priority` on hero.
- Use Sanity's `@sanity/image-url` builder with `width`, `quality` params — don't ship 4MB JPEGs.
- The footer of the old site has a video — if we keep something similar, lazy-load and never autoplay with sound.

### Forms

- Web3Forms access key goes in `.env`, never commit it.
- Add a honeypot field. Spam will find this form within a week of going live.
- Test form delivery to `viacatalana@gmail.com` before launch.

### Sanity

- Free tier is 100GB bandwidth/month. We'll use under 1GB. Not a real concern.
- API token: read-only token in `.env` for the live site; separate write token only on local for the import script.
- Sanity Studio access: invite the artist (and Sam) as editors.

### DNS / Domain

- Client owns `vitalityart.es`. Get registrar access from Sam.
- Vercel: add domain in project settings, follow their A/CNAME instructions.
- SSL is automatic (Let's Encrypt via Vercel).
- Set up `www` → apex redirect (Vercel does this in one click).

### SEO

- The old site has decent ranking for "Vitaly Leshukov" and Spanish art-related queries. Don't break URL structure if we can help it.
- 301 redirects from old paths if we change any — Astro middleware or Vercel `redirects` in `vercel.json`.
- `hreflang` if we ever add ES localization (probably out of scope for v1).

### Accessibility

- Real alt text on every painting (title + medium + dimensions is a fine fallback).
- Color contrast: `ink` on `bone` is 14:1 — way above AA.
- Focus states: don't strip them, design them.
- Reduce motion: respect `prefers-reduced-motion` for all animations.

### What NOT to add

- Analytics beyond Vercel's built-in. No GA4 unless the client asks.
- Newsletter signup. Not in scope.
- E-commerce / Stripe / cart. Buying is a conversation, not a checkout. Contact form only.
- Blog. Not in scope.
- Multi-language. Not in scope for v1.

---

## 9. File Structure

```
/
├── CLAUDE.md                ← this file
├── README.md                ← human-facing setup notes
├── astro.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.example
├── public/
│   └── fonts/               ← (only if self-hosting; otherwise Fontshare CDN)
├── src/
│   ├── layouts/
│   │   └── Base.astro
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── PaintingCard.astro
│   │   ├── PaintingGrid.astro
│   │   ├── ExhibitionList.astro
│   │   ├── ContactForm.astro
│   │   └── ...
│   ├── pages/
│   │   ├── index.astro
│   │   ├── gallery.astro
│   │   └── gallery/[slug].astro
│   ├── playground/          ← variant explorations, not shipped
│   ├── lib/
│   │   ├── sanity.ts        ← client setup
│   │   └── queries.ts       ← GROQ queries
│   └── styles/
│       └── global.css
└── studio/                  ← Sanity Studio (or separate repo)
    ├── sanity.config.ts
    └── schemas/
        ├── painting.ts
        ├── exhibition.ts
        └── siteSettings.ts
```

---

## 10. Handover Checklist

Before considering the project done:

- [ ] Vercel deploy is on the client's domain with SSL
- [ ] Sanity Studio is deployed and the artist has logged in successfully
- [ ] All 55 paintings imported with correct metadata
- [ ] All exhibitions imported
- [ ] Contact form delivers to `viacatalana@gmail.com`
- [ ] Lighthouse: 95+ Performance, 100 Accessibility, 100 Best Practices, 95+ SEO
- [ ] Loom walkthrough recorded and sent to artist
- [ ] README explains: add painting, edit bio, swap email, where env vars live
- [ ] Old Webflow site can be safely cancelled (after a 1-week overlap to be safe)
- [ ] Git repo handed over with admin access

---

## 11. Open Questions to Resolve Early

These weren't decided in the planning chat. Flag and resolve in your first pass:

1. **Studio deployment target** — Sanity's free hosted studio (`*.sanity.studio`) or self-host on `studio.vitalityart.es`? Self-hosting is nicer branding, hosted is one less thing to maintain.
2. **Sold paintings** — keep displaying them with "SOLD" overlay, or hide entirely from the gallery? Old site shows them. Gut: keep visible, it's social proof.
3. **Per-painting pages** — worth the SEO and shareable URLs, or overkill for v1? Lean: build them, they're cheap once the data model exists.
4. **Series taxonomy** — separate Sanity collection (more flexible) or hardcoded enum (simpler)? If the artist will add new series, go collection.
5. **Spanish translation** — out of scope for v1, but ask if it's coming. If yes, design the routes accordingly now.

---

*Last updated by Claude (planning chat) — start of project.*
