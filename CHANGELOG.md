# Changelog

All notable changes to this project are documented in this file.

## Unreleased

### Added

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
