# Contributing

This is a personal index page, but issues and PRs are welcome.

## Adding a project

1. Add one entry to `public/projects.json`: `name`, `description`, `group`
   (one of `Ancient world`, `AI engineering`, `Developer tools`, `Games`),
   `repoUrl`, `demoUrl` (or `null` for CLI-only tools), `thumbnail`
   (a path under `public/thumbs/`), and `status` (`published` or `soon` -
   `soon` entries are fetched but not rendered).
2. Add a 1200x750 thumbnail to `public/thumbs/`. For a live web demo,
   capture it fresh:
   ```bash
   node /path/to/shot.mjs <url> /tmp/shot.png --width 1200 --height 750 --scale 1 --wait 800
   python3 scripts/make_thumb.py /tmp/shot.png public/thumbs/<name>.webp
   ```
   For a CLI-only project, crop the repo's own `docs/assets` hero image the
   same way (`make_thumb.py` cover-crops to 1200x750 and compresses to
   WebP under ~200 KB; pass `--top` if the source image is a tall
   full-page shot and the interesting part is near the top).

## Development

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

## License

[MIT](LICENSE)
