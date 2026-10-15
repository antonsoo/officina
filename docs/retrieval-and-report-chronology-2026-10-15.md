# Retrieval privacy and test-report chronology

Two reproduced corrections are public in the source repositories. The linked
studies retain transport captures, installed artifacts and before/after behavior.
No registry release, version tag or manual hosted deployment was performed.

| Project | Reproduced problem | Corrected behavior | Public source and evidence |
| --- | --- | --- | --- |
| Veil | Anthropic inline retrieval blocks sent recognized email addresses in source labels, titles and text to the provider. | Mask supported text before SDK serialization, retain citation coordinates and restore the exact answer. | [Source f8a7892](https://github.com/antonsoo/veil/commit/f8a7892217c8296160273a83b7b779b962214cd8), [study](https://github.com/antonsoo/veil/blob/f8a7892217c8296160273a83b7b779b962214cd8/studies/search-results/README.md) |
| Flakemap | Moving sequence metadata beside a report discarded its recorded timestamp; contradictory chronology became a false new-flake gate. | Retain report timestamps beside sequence-only metadata, expose their disagreement and leave chronology unknown. | [Source 3b0eecd](https://github.com/antonsoo/flakemap/commit/3b0eecd7cfd0846f6b24af569b99c5ff86bca426), [study](https://github.com/antonsoo/flakemap/blob/3b0eecd7cfd0846f6b24af569b99c5ff86bca426/studies/report-sequences/README.md) |

Veil's 36 actual SDK transport workflows cover list, tuple and generator arrays,
both supported placements, sync/async clients and three response modes. All four
recognized synthetic contacts leaked in every original request; none remain raw
after masking. Installed Anthropic 1.11.0 and the declared 0.40.0 floor reproduce
the corrected requests. The older SDK has no typed citation snapshots; the study
records that limit and four explicit replay skips. Citations remain in provider
coordinates, including masked source labels, rather than receiving an implicit
attribution rewrite. A clean archive build, installed wheel and full suite retain
the library and CLI checks.

Flakemap's 18 real CLI workflows cover JUnit/TRX and three metadata placements,
with contradictory, consistent and explicitly overridden timestamps. Four wrong
gate decisions become zero. Contradictory evidence now returns exit 2 and retains
all 27 passes and three failures; consistent histories stay quiet, and explicit
sidecar timestamps keep their existing precedence. Installed Python 3.10/3.14
artifacts produce identical reports. Thirty-two browser workflows open reports
offline in Chromium/Firefox at desktop and 375 px, inspect the retained failures
and verify the warning and gate labels.

The [public-byte receipt](evidence/retrieval-and-report-chronology-2026-10-15.json)
checks clean source trees, equality with remote `main` and 20 pinned source,
study, result and screenshot files (814,986 bytes). These are source publication
checks; they do not establish package publication, CI completion or a hosted update.
