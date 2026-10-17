# MangoHud continuity correction

Stutterscope's whole-capture clock check could hide a missing block within a
long capture, or let long and short disagreements cancel. It then used the
unsupported frame pairs for pacing, rolling stutter context, trace connections
and episode grouping. Source fix `f151bf23c5139c60f106a805eb9ee9c413093ad5`
checks each logged interval with the existing conservative disagreement rule.

The controlled 26-frame example previously combined two separated slow-frame
episodes into one and measured a 2.4 ms pacing difference across the gap. It now
retains two episodes and measures 0 ms over the 24 supported adjacent pairs.
The report preserves frame durations, marks clock coverage unverified, and
retains physical CSV line witnesses. Neither missing frame counts nor missing
durations are inferred from the logging clock.

| Evidence | Result |
| --- | --- |
| Unchanged public Witchfire capture | 117,569 frames; every summary metric, analysis record and all 248 episodes unchanged |
| Controlled removal of 300 public records | One known boundary retained instead of silently joined |
| Nine separate ten-record removals | Nine known boundaries retained; five witnesses plus four explicitly omitted |
| Full earlier public-input set | All 34 summaries/episodes/analysis records or refusal results unchanged |
| Fresh archive, Node 24.21.0 | Install, lint, typecheck, 384 unit checks, both builds and 98 browser workflows pass |
| Packed local CLI, Node 22.6.0 and 24.21.0 | All five oracle cases pass in each installed runtime |
| Chromium and Firefox, 1440px and 375px | Offline imports, episode inspection, actual JSON/Markdown downloads and recomputation retain the correction |

Reproduction, public input hashes, before/after reports, installation receipts
and reviewed screenshots are retained in Stutterscope's
`studies/mangohud-local-clock/`. The public capture and its controlled edits are
fetched into ignored cache directories; they are not redistributed. Only the
small synthetic fixtures are committed.

The rule requires disagreement greater than both 10 ms and a factor of two.
MangoHud samples its logging clock separately from the present duration: a
disagreement does not identify the cause, and smaller omissions can escape the
check. An intact capture is a compatibility control, not proof of all capture
configurations.

The reviewed source was pushed as `7c0ba5d`; deployment `9ab3133` matches all 33
canonical build files. Four hosted Chromium/Firefox desktop/mobile contexts
download 16 JSON reports matching the installed CLI, plus Markdown and PNG
reports, after disconnecting. They retain the correction through settings and
interval changes. Cold offline imports can request local fonts; no additional
code or capture data is needed. Publication receipts are retained with the study.

No npm release or tag was made. The catalogue continues to link the existing
deployed examples. Web build: `npm run build`, output `dist/`. CLI build:
`npm run build:cli`, output `dist-cli/`.
