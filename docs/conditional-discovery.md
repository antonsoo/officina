# Find the disputed “if” through its source words

Horos now has a third searchable workshop in the existing catalogue. Its preview
is an actual operated conditional desk, not another image of the class-membership
exercise. The existing five-question menu stays available above the index.

| Search handles | Opens | Learner operation |
| --- | --- | --- |
| `Philo`, `Diodorus`, `συνημμένον`, `synemmenon` | The conditional room | Keep the current clauses true, pin the table, exclude daytime silence and compare the two tests |
| `συνάρτησις`, `συναρτησιν`, `synartesis`, `pugnet` | The same source-backed room | Read the connection passage, select `μάχηται`, compare its teaching Latin and locate the full Greek page |

Accent folding uses the existing local search. Typing does not rewrite the URL;
**Copy search link** explicitly creates a restorable search. The workshop has its
own summary, image, activity link and full-commit review link.

The lesson keeps Philo's reported truth criterion separate from the modern
finite compatibility predicate. A manual exclusion adds an assumption; it does
not prove ancient connection or compute Diodorus's temporal/modal standard.

## Operated handoff

```sh
npm ci
npm run test:browser
npm run preview -- --host 127.0.0.1 --port 4195 --strictPort
```

In another terminal:

```sh
npm run test:conditionals -- http://127.0.0.1:4195/officina/ test-results/conditional-local
```

The continuous driver starts in the actual catalogue, tries eight source-word
handles, explicitly shares and reopens a Greek search, follows the immutable
review with the keyboard and compares its public raw bytes to the pinned Git
blob. It then enters the public lesson, changes the admitted cases while holding
the present fixed, reads Greek and teaching Latin, locates the source and makes
a native HTML download. It opens that file without HTTP requests, checks source
and font identities, downloads the embedded editable JSON and verifies both
snapshots and the learner's explanation.

The local browser suite has 56 checks across Chromium and Firefox, including
phone search/sharing and all five menu choices. Lint, types, source formatting,
45 unit checks, catalogue validation and the production build also passed.
These checks do not establish that this new catalogue entry is hosted.

[The local handoff receipt](conditional-discovery/local.json) records all four
journeys. The catalogue was local; the lesson and immutable review were public.
There was no request redirection. [Desktop discovery](conditional-discovery/chromium-1440.png)
and [phone discovery](conditional-discovery/chromium-375.png) show the actual row.

## Independent clean build

[The clean receipt](conditional-discovery/clean-build.json) records a fresh
archive of `87e5578`, a separate install and all documented checks
under Node 24.22.1. All 104 built files (8,061,648 bytes) match the
reviewed build, including the new source-word data and actual workshop preview.
This inventory is not an initial page-transfer measurement.

## Public catalogue and menu

The clean build was published on `gh-pages` at deployment commit
`fcada162284e89cae8149483acc3e4dec16258b8`, preserving the previous
deployment history. [Canonical bytes before](conditional-discovery/hosted-before.json)
and [after](conditional-discovery/hosted-after.json) compare all **104 files**
with the clean build. The source menu implementation and the new discovery row
are both included.

[Four public source-word journeys](conditional-discovery/public.json) repeat
the continuous handoff from the canonical catalogue in Chromium and Firefox
at 1440px and 375px. Both saved snapshots, the explanation, four embedded binary
assets and the native editable download survive opening the reading as a file.

[Twenty public menu handoffs](conditional-discovery/questions-public.json)
operate all five choices in both browsers and widths. The completed receipt
explicitly records `state: passed` and `expectedJourneys: 20`; partial runs are
not presented as success. Each immutable review matches its public raw Git blob.

| Selection | Public operation |
| --- | --- |
| Architecture | Double the temple columns; read the equation and source record |
| Logic | Pin a world, choose stone and expose the false conclusion with true premises |
| Music | Match interval order; confirm all eight pitches agree, advance the native audio clock and open the source |
| Geometry | Select twelve sides and submit a changed root estimate; inspect the bound status |
| Software | Load the native GenAI sample and filter for chat spans |

An [earlier incomplete run](conditional-discovery/questions-first-attempt.json)
stopped after twelve handoffs when Firefox's desktop audio clock did not advance
within thirty seconds. Direct playback immediately reproduced normally; the
complete diagnostic rerun passed all twenty routes. The transient cause was not
established, and no speculative change was made to Harmoniai. Audio-clock
advancement establishes native browser playback, not human listening.

The [public desktop menu](conditional-discovery/public-menu-1440.png) and
[phone menu](conditional-discovery/public-menu-375.png) are actual canonical-site
captures. Both were visually inspected.

The [remote source-workflow record](conditional-discovery/remote-checks.json)
records an empty Actions run listing; it does not establish CI execution or a
job-step count. The latest Pages-build API returned 404. Hosted byte comparison
and operated browser behavior are separate, successful evidence. No registry release or comprehensive accessibility
certification is claimed.
