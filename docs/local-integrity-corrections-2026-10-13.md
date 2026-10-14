# Local integrity corrections, 2026-10-13

Four current-checkout defects were reproduced and corrected. The owner
authorized pushes. Errorbars `b2375ec`, Veil `a67a5b6`, TraceLens `11cf372`
and Contextscope `7782eb5`
were verified against their remote `main` branches at those commits; six pinned public evidence files in each
of the first two repositories, eight in TraceLens and ten in Contextscope were fetched back and
byte-compared with the tested checkouts. The
[source receipt](evidence/integrity-source-2026-10-13.json) records URLs, sizes
and SHA-256 hashes. No registry release, tag or manual deployment is part of
this work. The catalogue's evidence links remain unchanged. Veil's subsequent
[tool-input serialization repair](veil-tool-input-trees-2026-10-14.md) has its
own later source receipt; the original pinned snapshots below remain historical.

| Repository | Reproduction | Corrected behavior | Pushed code / evidence commits |
| --- | --- | --- | --- |
| Errorbars | A native 20-question COPA capture scored 60%; retaining only its 12 correct records scored 100% beside an unchanged 20-sample results declaration. Explicit-name imports could also overwrite the declaration. | Matching results counts are checked per selected filter; model aliases do not bypass them. Count mismatch rejects before analysis/export, and matching sidecars remain protected. | `3305216` / `b2375ec` |
| Veil | Real SDK request captures contained raw synthetic contacts in refusal fields/parts, legacy function arguments and custom-tool inputs. Complete replies left those fields unrestored. | Application history masks those text fields before transport. Complete output restores them; unchanged returned history replays the exact provider spelling. | `db481cc` / `a67a5b6` |
| TraceLens | Partitioning an unchanged six-span native Strands capture between resource aliases silently retained only the agent root, losing both model calls and their usage. Other competing field spellings also selected one value. | Competing non-null trace declarations reject before normalization, including JSONL batches. Ambiguous log scalars remain raw with warnings and unavailable normalized values. Rejected browser replacements preserve the prior comparison download exactly. | `0afda99` / `11cf372` |
| Contextscope | Two SDK histories with different refusal-only assistant turns became the same three source segments and predicted full reuse of 2,625 modeled tokens. Empty turns also hid role and participant changes. | Refusal text and empty-message identities remain source units before prefix/thread/cache analysis. Changed histories stop at the edited turn; unchanged histories remain reusable in the model and original messages remain downloadable. | `2b43fee` / `7782eb5` |

In the workspace, the full records are at
`errorbars/studies/lm-eval-cohorts/README.md`,
`veil/studies/chat-text-fields/README.md`,
`tracelens/studies/field-aliases/README.md` and
`contextscope/studies/message-boundaries/README.md`. Each study has input/source hashes,
before/after observations, installed-artifact captures and a verification
receipt. Their READMEs include reproduction commands and explicit limitations.

Errorbars' 20 actual CLI workflows pass from installed wheels on Python
3.14.7 / NumPy 2.5.3 and Python 3.10.21 / NumPy 1.24.0. A fresh archive passed
710 Python tests, lint/typecheck, package builds, 691 web unit checks,
52 browser checks and 30 installed standalone-report checks.

Veil's 54 actual SDK/mock-transport workflows pass on Python 3.14.7 / OpenAI
3.23.0 and Python 3.10.21 / OpenAI 1.66.0. The baseline sent raw synthetic
contacts in 24 request bodies; the corrected captures contain none. Each
installed environment also passed 24 field-specific regressions. A fresh
archive including spaCy passed 666 Python tests with no skips, lint/format/
type checks, package/web builds and 16 browser scenarios. The 34 runtime
files byte-match the clean source, wheel, three installations and browser
manifest. The API transport and replies are controlled; no live inference
or production-server behavior is claimed.

TraceLens retains 28 CLI workflows: eight unmodified native census exports
and 20 explicitly derived controls. Baseline disagreed with the corrected
contract in 18 cases; the corrected source and installed CLI on Node 20.20.2
and Node 26.7.0 disagree in none. A fresh archive passed lint/typecheck,
425 unit checks, both builds, 32 CLI checks and 132 Chromium/Firefox browser
checks. The packed archive's 32 files match the clean build and installation.
Its separate offline study rejects both damaged candidate replacements at
1440 and 375 pixels in both engines, retains exact comparison downloads,
and recovers the native six-span trace. Served assets match the tested build;
all eight before/after screenshots were inspected.

TraceLens's first broad browser run had one Firefox page crash in an existing
rapid-switch test. The study retains that log and the baseline's seven
non-reproducing checks. Test commit `9d77d59` now queues a real parser reply
before cancellation and delivers it afterward, rather than posting new work
to a terminated worker. Eight repeated checks and the fresh full run passed.
No Firefox engine-crash correction is claimed.

Contextscope retains 16 actual CLI/library workflows: twelve synthetic
two-request histories captured through OpenAI SDK 3.23.0 over mocked transport,
plus four existing SDK fixtures whose report bytes are unchanged. Baseline
disagreed with source-retention expectations in twelve cases; corrected source
and the installed package on Node 20.20.2 and Node 26.7.0 disagree in none.
A fresh archive passed lint/typecheck, 556 unit checks, both builds and all
98 browser checks. All 97 packed files match the clean build and installation.
The browser study covers six histories in each engine at 1440 and 375 pixels,
with raw-source downloads, full JSON exports and locally opened offline HTML.
Served asset bytes match the tested build and all eight screenshots were
inspected. The visual replay explicitly warms code and Latin font faces before
disconnecting; the failed initial assertion for a lazy font request is retained.

Errorbars' count check cannot authenticate files or detect simultaneous edits
to samples and declarations. Missing native counts stay unchecked. Veil's
change does not make its detectors exhaustive or add custom/legacy streaming
output restoration. Both retain complete response and outgoing-history scope
in their studies.
TraceLens's guard covers recognized alternate trace fields; literal duplicate
JSON keys still follow `JSON.parse` behavior, and imported data is not
authenticated. Null companions remain supported. The viewer's refusal policy
is deliberately stricter than selecting the last alternate declaration.
Contextscope's new token estimates have not been checked against live API usage;
its correction does not establish server acceptance or measured cache behavior.
The defensive empty-array controls are labelled separately from provider output
claims. Null/array boundaries carry zero text tokens; empty string Chat messages
keep the existing framing adjustment.

The existing build commands are `cd errorbars/web && npm run build` and
`cd veil/web && npm run build`, each producing its own `web/dist/`. These
builds were checked locally and were not deployed. Tracking issues
`officina-59dg`, `officina-9l06`, `officina-28xr` and `officina-9oc2` are closed with the retained evidence;
the local issue export has been refreshed.
TraceLens's builds are `npm run build:web` to `dist/` and
`npm run build:cli` to `dist-cli/`; no npm publication or hosted deployment is
part of this verification.
Contextscope's builds are `npm run build:core` to `dist/` and
`npm run build:web` to `web/dist/`; no npm release or hosted deployment is
part of this work.

An additional **local** correction is committed in Breakwatch: code `a0b9105`
and evidence `eadced2`. A synthetic application with no year and an ending
declaring 2026 previously became a 26-year control interval with no warning.
The parser now retains the explicit ending and source while its unsupported
application/duration stays unknown. Yearless February-to-March intervals also
remain unknown unless an observed leap day settles the calendar shape; a new
yearless log header cannot inherit an earlier session's year.

`breakwatch/studies/calendar-boundaries/README.md` retains the 17-workflow
before/after CLI replay and independent civil-clock oracle. Fresh archived
source passes those workflows on Node 24.21.0 and Node 26.7.0, format/lint/type
checks, 97 unit checks, the production build, full browser workflows in both
engines, 38 additional audit scenarios and 24 accessibility scans with no
violations. All 15 runtime source files and four served assets match the clean
archive/build. Six timestamp controls per engine at desktop/phone widths retain
exact JSON and original-evidence downloads; all eight screenshots were inspected.
The initial rapid-download timeout is retained; exports in the verification
replay are paced, and no product download fix is claimed.

Breakwatch has **no configured remote**. Its receipt appears under
`localCorrections`, with local file hashes and no public-byte comparison.
It has not been pushed or deployed, and its inputs remain explicitly synthetic:
no live-game or WoW Forever compatibility is asserted. Issue `officina-2ulx`
is closed with that local evidence. This boundary differs from the four pushed
main branches above.
