# Grāma: discover a sound experiment and a reading error

The existing catalogue now exposes two operated questions:

| Workshop | Learner action | Evidence |
| --- | --- | --- |
| Same counts. Concealed sound. | Freeze two modern tunings, identify X, reopen the revealed record and save the full study | Nāṭyaśāstra instruction, printed Grosset p.28, actual PCM and imported-claim labels |
| The octave closes. The wrong note moves. | Misplace the counts, hear Dha move, then attach them to preceding intervals and hear Pa move | Named counts on p.29 and the Pa-lowering instruction on p.28 |

[Open the listening search](https://antonsoo.github.io/officina/?q=concealed%20listening#all-projects) ·
[Open the count-placement search](https://antonsoo.github.io/officina/?q=octave%20closes#all-projects).
Both rows pin [the source and operated audit](https://github.com/antonsoo/grama/blob/cdf94cece9811024263f6afadedf99d66a24886c/docs/listening-audit.md)
to an immutable commit. Their previews are actual instrument screenshots.
The catalogue keeps its existing question menu and all 38 projects.

## What was actually checked

- [Four public journeys](grama-discovery-2026-11-04/public.json): Chromium and
  Firefox at 1440/375px search four source/question terms, restore a shared
  search, follow the actual pinned review, enter the listening exercise by
  keyboard, complete A/B/X and compare native PCM. A and B must be distinct;
  X must match its assigned lane exactly.
- Each journey downloads and reopens native JSON, verifies the imported-claim
  label, hashes the actual printed p.28, saves a script-free study and opens it
  from disk with eleven decoded source pages and both attempt sounds. It then
  discovers the second workshop, operates both count placements, downloads its
  CSV and opens the instruction in the reader.
- [All 122 canonical hosted files](grama-discovery-2026-11-04/hosted-files.json)
  match the current `dist/`, including the directory index before and after.
  This checks actual canonical responses without query cache busting; extra
  historical hashed files remain outside that inventory.
- A fresh public checkout with locked dependencies passed Node 24.22.1 lint,
  45 checks and the build; the updated catalogue build byte-matches the local
  Node 26.7.0 build. `npm run build` writes `dist/`.
- The [desktop](grama-discovery-2026-11-04/desktop.png) and
  [phone](grama-discovery-2026-11-04/phone.png) screenshots were visually reviewed.

The cold public journey uncovered a genuine Grāma startup defect: the setup
button accepted a click before its handler existed, so freezing captured an
identical default pair. Both rooms now wait to enable their native controls
until their handlers are installed. The final four journeys exercise that cold
entry directly; the distinct-sound assertion checks that the intended setup
actually happened.

A separate cold study save hit the old harness's thirty-second download limit.
Its cause was not established. The driver now allows up to 180 seconds, observes
save progress and fails promptly on an explicit application error. That matches
the instrument's existing support for active source transfers lasting over a
hundred seconds. The final report retains actual save durations/progress;
these are observed runs, not a public-bandwidth benchmark.

The catalogue verification does not establish a hearing threshold or historical
performance. [Grāma’s separate public instrument audit](https://github.com/antonsoo/grama/blob/cdf94cece9811024263f6afadedf99d66a24886c/docs/listening-publication.md)
records the sixteen hosted instrument configurations, offline boundary and
independent source/model checks. Repository CI is a separate claim.

## Publication identity

The catalogue data was published from `bbdc85e8bcde52a08a818dcf3c41762eb1a51ffb`;
Pages commit `a118a0c3b767888aa27ea6c9b7ad65a0899bed08` updates its two review pins
and retains older hashed assets. Later changes to the verification driver and
this record do not change production files. Hosted-byte verification is the
publication evidence; no workflow or Pages build-API success is inferred.

## Reproduce

Check out Grāma beside Officina and build both repositories. The journey driver
reads its sibling’s source manifest, production inventory and pinned review.
If its checkout is shallow, fetch the review commit first:

```sh
git -C ../grama fetch origin cdf94cece9811024263f6afadedf99d66a24886c
npm ci
npm run lint
npm test
npm run build
npm run verify:pages -- https://antonsoo.github.io/officina/ dist --out /tmp/officina-hosted.json --wait 240
npm run test:grama -- https://antonsoo.github.io/officina/ /tmp/grama-discovery public
```

For a local rehearsal, serve both builds and use the catalogue preview URL with
`local` as the final argument. That mode redirects lesson requests to the local
Grāma build and blocks service workers; it makes no public or offline claim.
