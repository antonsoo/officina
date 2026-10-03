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

Project names must be unique. Links must use HTTPS without credentials;
thumbnail paths must stay under `thumbs/`. Optional fields are `spaceUrl`
and `package` (`registry`: `PyPI`, `npm`, or `crates.io`; `url`: the package
page). Run `npm run check:catalogue` to validate entries and image files.

## Development

Use Node.js 24 or later.

```bash
npm ci
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npx playwright install chromium firefox
npm run test:browser
```

The browser suite starts its own production preview. It covers keyboard
navigation, failed-load recovery, content escaping, local filtering, and
accessibility at desktop and phone widths in both themes.

## License

[MIT](LICENSE)

## Community and private reports

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md). Anton Soloviev
maintains this project and handles conduct reports at
[anton@praviel.com](mailto:anton@praviel.com).

Use the bug or improvement forms for public issues. For a suspected security
vulnerability or a conduct concern, email the maintainer privately with the
repository name and relevant details. Do not post credentials, personal data,
private logs, or confidential documents in a public issue.
