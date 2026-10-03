# Changelog

All notable changes to this project are documented in this file.

## Unreleased

### Added

- Search by project, description, audience, or package registry, combined
  with audience filters and a live result count. Search stays in the page.
- Clear filters, an empty-results action, and a skip link for keyboard users.
- Catalogue validation at build and load time, with a retry for failed loads.
- Unit and Chromium/Firefox regression tests, including mobile layouts,
  keyboard focus, content escaping, local filtering, and accessibility.
- A card links to its package once the tool is on a registry (PyPI, crates.io
  or npm), next to the demo and source links: an optional `package` entry in
  `public/projects.json`.

### Changed

- The page's fonts are served by the page itself. They came from Google Fonts,
  the one request the page made to another origin; the same font files (every
  subset, as Google serves them to a current browser) are now in
  `src/fonts/`, with their SIL Open Font License texts. Nothing looks
  different: screenshots before and after match. The page now loads with
  every other host blocked.

### Security

- The built page carries a Content-Security-Policy. Scripts, styles, fonts and
  workers load from the page's own origin only, and `connect-src 'self'` has
  the browser refuse to send what you give the page to any other host, even
  for a script injected through a bug in how the page renders a file. Inline
  event handlers and `eval` are not allowed. Every control was exercised
  in Chromium and Firefox with a listener for policy violations: none.

### Accessibility

- Checked with axe-core (WCAG 2.1 A and AA, and its best-practice rules) in light and dark,
  at desktop and phone widths: no findings now. The faint text (2.97:1) and,
  in the dark theme, the
  crimson of links and group names (3.4:1) are now above 4.5:1, and the group
  names are `h2` headings between the page's `h1` and the cards' `h3`.

## [0.1.0] - 2026-09-24

Initial release.

### Added

- A single static page indexing the published (and upcoming) open-source
  tools, grouped by audience: Ancient world, AI engineering, Developer
  tools, Games.
- `public/projects.json` as the single source of truth for entries - name,
  description, group, repo URL, live-demo URL, thumbnail, and status
  (`published` or `soon`). Adding a project is one JSON entry and one image.
- Light and dark themes (system preference, with a manual toggle persisted
  in `localStorage`).
- `scripts/make_thumb.py`: cover-fit crop and WebP compression for card
  thumbnails, used for both fresh screenshots and cropped hero images from
  sibling repos.
