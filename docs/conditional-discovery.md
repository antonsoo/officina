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
