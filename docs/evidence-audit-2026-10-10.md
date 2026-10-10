# Catalogue evidence audit, 2026-10-10

The catalogue's study cards mixed historical findings with unqualified claims
about the current tools. Several numbers also lost their statistical meaning
when shortened for a card. This audit reads the underlying records and makes
the findings traceable without implying a new package or demo release.

| Card | Previous wording | Correction |
| --- | --- | --- |
| Logdelta | Reason visible in 159/239 cases, 34 lines | The later excerpt report records 212/239 and 40.5 median lines; the rule was developed on these logs. |
| ToneMirror | About 2% error, "level with Praat" | The corrected measurement gives 1.94% YIN contour error on jointly voiced frames and 6.13% voicing error; no equivalence or pronunciation claim. |
| Planisphere | Positions "match ... to 0.04 arcmin" | 0.04 arcmin is robust scatter against an editorial reduction, not a maximum error; five stars differ by 1-19 arcmin. |
| Stutterscope | Four percentile lows "agree to 0.13%" | The median disagreement is 0.13%; the maximum is 3.7% on eight captures. |
| Errorbars | Top scores "are level" | The reported test fails to distinguish many pairs; that does not establish equivalence. The card identifies the unadjusted significance threshold. |
| Splitscope | 484 expected and 1,457 observed PBs | Use the actual probability question: mean forecast 14.3%, observed frequency 30.9% for at least one PB in 50 attempts. Counts of below-current-PB attempts answer a different question and overlap across forecast windows. |
| Horologium | Broad "oracle-tested" description | Identify the Chinese calendar comparison: zero modern date mismatches, 90 historical differences; this result does not cover all calendars. |
| Gnomon | "Accurate" and "scale-exact" | Identify the measured PDF artifacts and explicitly retain the unverified physical construction and outdoor limits. |

Other findings now keep important scope visible: the sampled registry rather
than all MCP servers; eligible recorded trace fields rather than all calls;
held-out international phone numbers with a plus sign; endpoint labels rather
than a claim that training was healthy throughout; and community wish-history
bias rather than official game odds. Fieldproof's description allows evidence
to be weak or ambiguous instead of promising that every field is verified.

All 17 evidence links identify full public commit hashes. The corresponding
source files were fetched from those revisions and compared byte for byte with
the inspected files. The [link manifest](evidence/evidence-links-2026-10-10.json)
records each URL, finding, source revision, file size, SHA-256 and HTTP status.
The linked repositories' `main` heads matched those revisions when checked.

This is an audit of the catalogue against retained evidence, not a fresh rerun
of all historical analyses. The linked studies describe their own methods,
dates, measurements and limitations. A future study update requires updating
both the finding and its revision link. The page explains that demos and
registry packages may have a different version.

The later Splitscope link refresh points to `0e2a6b8`, where its own study and
app assumptions now distinguish the binary PB event from overlapping threshold
counts. That source file was fetched again and matched byte for byte; the
manifest records its separate recheck time. The finding and visible catalogue
layout did not change. Catalogue validation, 32 data checks and the production
build passed after this link update. See the [source update index](source-updates-2026-10-10.md)
for the corresponding work across repositories.

## Production verification

A fresh archive of `3db59d2` passed `npm ci`, lint, strict types, formatting,
32 catalogue tests, the production build and 32 Chromium/Firefox workflows
on Node 26.7.0/npm 12.0.1. The browser checks exercise search, audience
filters, keyboard navigation, retry after network or malformed-data errors,
theme persistence and local operation. The old browser assertion expected
five study cards after the catalogue had grown to fifteen; it now uses the
actual visible entries instead of a fixed count.

All eight browser-suite screenshots and four additional production captures
were opened and inspected. The latter cover the other three audiences and
the ToneMirror card at 320 pixels, with external requests blocked. Each had
no page errors, CSP violations, horizontal overflow or WCAG 2.1 A/AA axe
findings. The [build and capture manifest](evidence/catalogue-verification-2026-10-10.json)
retains output hashes and the checks' scope.

- [Ancient-world cards](assets/evidence-ancient-desktop.png)
- [AI engineering cards](assets/evidence-engineering-desktop.png)
- [Developer tools in dark mode](assets/evidence-developers-desktop.png)
- [320-pixel ToneMirror card](assets/evidence-tone-mobile.png)

`npm run build` produces `dist/` with base `/officina/`. This source push does
not deploy that directory: GitHub Actions reports `enabled: false`, and no
hosted deployment or registry release was performed.
