# Find expert-merge and native schema evidence

The hosted catalogue returned no matches for `MoE expert`, `scaled B bias`,
`enum/type` or `SVGverseAI`. The existing tools now implement those concrete
workflows, so two catalogue entries need current descriptions and evidence.

Mergeglass links to its pinned native Qwen3 MoE study: 44 saved precision/fault
cases and 37,920 independent expert-weight checks, including an omitted expert
and incorrectly interleaved factors. Its description keeps BF16, ordinary
LoRA/DoRA, Conv1D, embedding, saved-head and partial-observation discovery terms.
MCPlint links to four actual enum/type contradictions in three SVGverseAI tools.
Optional empty calls stay valid; these observations do not establish a runtime
or privacy failure. Its dependency, token and instruction discovery terms stay
searchable, and the native filesystem comparison remains the live demo.

`results/before.json` records 16 actual hosted searches across Chromium and
Firefox at 1280/375 px: all four queries returned zero cards. The same searches
against the new build return exactly the intended card, work offline after
load, request no replacement catalogue, and have no page errors or horizontal
overflow. All card action links pass hit tests. The eight captured local
screenshots were opened for visual inspection. The existing 32 browser cases,
including keyboard navigation, both themes and accessibility checks, also pass.

[The linked source receipt](results/linked-source.json) downloads both immutable
study READMEs and compares their bytes to the exact Git objects. Catalogue
links do not imply the linked npm package or an older demo contains every
source change. Mergeglass still installs from source and has no hosted model
service or PyPI release.

```sh
npm ci
npm run build
npm run preview -- --host 127.0.0.1 --port 4195 --strictPort
# In a second shell:
node scripts/replay-native-workflow-search.mjs \
  http://127.0.0.1:4195/officina/ /tmp/expert-search after \
  studies/expert-and-schema-discovery/queries.json
```

Only two catalogue records change. No application logic, packages, registry
links, demo destinations or other project entries change. The local build,
source publication, hosted static bytes and live browser replay are separate
checks; publication receipts are retained after deployment.

## Published catalogue

Source `732dc92` and Pages `7066f0b` publish the revised records. The Pages
update changes only `projects.json`, using a normal push and preserving the
existing branch files. [The source receipt](results/publication.json) verifies
all seven source changes. [Canonical hosted byte checks](results/public-bytes.json)
verify all 41 build files plus stable root/index responses.

[The live search receipt](results/public.json) repeats all 16 searches against
the hosted page: exactly the intended card, offline filtering, no replacement
catalogue requests, no page errors and no horizontal overflow. All eight public
screenshots were opened and inspected; retained examples show
[desktop expert discovery](../../docs/assets/expert-discovery-desktop.png) and
[mobile schema discovery](../../docs/assets/schema-discovery-mobile.png).

[Actual keyboard link navigation](results/public-links.json) follows each new
evidence link with Enter in both browsers and widths. All eight responses are
HTTP 200 and show the intended pinned study heading. Reproduce that interaction
with `node studies/expert-and-schema-discovery/follow-links.mjs`.
