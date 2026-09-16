# arditore.github.io

Personal site — [arditore.github.io](https://arditore.github.io)

Static, bilingual (English and French), and built so that visiting it sends nothing
anywhere. No analytics, no cookies, no third-party requests of any kind: fonts are
self-hosted, technology logos are inlined SVG rather than remote badges, and the only
JavaScript on the page is roughly 600 bytes inline to set the theme before first paint.

The light and dark themes are the same place at different hours — polar day and polar
night. Below the waterline, the page goes underwater.

## Run it

Requires Node 22.12 or newer.

```bash
npm ci
npm run dev        # development server
npm run build      # static output in dist/
npm run preview    # serve the production build
npm run verify     # types, unit tests, and build invariants
```

## Add a project

Two Markdown files, no code:

```
src/content/projects/en/<slug>.md
src/content/projects/fr/<slug>.md
```

Frontmatter is validated by a Zod schema in `src/content.config.ts` — an incomplete one
fails the build rather than publishing an empty page. If a translation is missing, the
English version is served with a notice instead of a 404.

## Add an article

```
src/content/blog/en/<slug>.md
src/content/blog/fr/<slug>.md
```

The Blog link appears in the navigation on its own, per language, once a published
article exists. Both RSS feeds (`/rss.xml`, `/fr/rss.xml`) are already live.

## What the tests enforce

`npm run verify` fails the build if any of these regress:

- a third-party request appears in the output
- inline JavaScript exceeds 1 KB on any page
- an English page has no French counterpart, or `hreflang` links stop being reciprocal
- a page has no title, description, skip link, or has more than one `<h1>`
- the CV publishes any address other than `arditore@tuta.io`, or a phone number
- the CV stops showing the peer-to-peer terms

## Deployment

Pushing to `main` builds and deploys through GitHub Actions. The workflow runs type
checks, unit tests, the build, then the invariant tests before anything is uploaded —
a privacy or JavaScript-budget regression blocks the deploy instead of shipping. Actions
are pinned to commit SHAs rather than moving tags.

## Licence

Fonts are SIL OFL 1.1; see `public/fonts/` and `NOTICE`.
