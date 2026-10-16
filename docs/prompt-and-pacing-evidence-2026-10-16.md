# Prompt and pacing evidence that the input cannot supply

Contextscope and Stutterscope now preserve several boundaries that previously
produced complete-looking results from incomplete input. The catalogue links
to concrete counterexamples, and Stutterscope's demo opens the attributed native
capture directly.

| Project and input | Reproduced failure | Corrected behavior |
| --- | --- | --- |
| Contextscope, Claude output/citation settings | An unchanged 14,130-token visible prefix could receive a modeled cache hit after settings changed provider-injected instructions | Output formats isolate prompt scopes; citation changes preserve eligible tool entries while isolating systems/messages; calibration retains supported controls |
| Contextscope, identical-pixel PNG transports | Re-encoding one image changed the local Claude estimate from 8,095 to 457,130 tokens | Media stays inspectable; unsupported local totals, context fractions and sequence cache costs remain unavailable |
| Contextscope, stored OpenAI context | Two 5,201-token visible inputs with different previous-response IDs predicted a 5,120-token second cache read | Stored responses, conversations, prompt templates, item references and opaque history remain unresolved; known captured usage stays separate |
| Stutterscope, filtered Intel gold capture | 175 retained frames were treated as 174 adjacent pacing pairs | Original per-stream ordinals support only 91 pairs, separated by 83 clock boundaries; retained FPS/distributions stay unchanged |
| Stutterscope, untouched public FrameView rows | A 9.249 ms source-clock interval was joined to a retained 4.439 ms frame | Mark the unsupported adjacency and retain a clock witness; do not infer a missing-frame count or hardware cause |

The Contextscope inputs are controlled application requests serialized through
actual SDK mock transports, not provider token/cache measurements. The PNG
control has independently verified identical decoded pixels. Its transport size
cannot establish a model token count. Captured response counters remain known
when the corresponding local estimate is unavailable, including zero cache reads.

The [media study](https://github.com/antonsoo/contextscope/tree/17bcb353fb596170a448e39cf3c0e69c92a67e06/studies/media-accounting),
[injected-settings study](https://github.com/antonsoo/contextscope/tree/17bcb353fb596170a448e39cf3c0e69c92a67e06/studies/injected-settings)
and [stored-context study](https://github.com/antonsoo/contextscope/tree/17bcb353fb596170a448e39cf3c0e69c92a67e06/studies/stored-context)
retain raw SDK bodies, before/after reports, installed artifacts and actual
offline downloads. Clean verification passed 625 core checks and 114 browser
checks; installed Node 20/24 reports match source. All 42 canonical demo files
match the tested build, and 44 hosted export workflows were verified. The
existing [public-agent trajectory study](https://github.com/antonsoo/contextscope/tree/4d2183dbc1dd524480c5da9653a6b8e9dc9da410/studies/real-trajectories)
remains the separate large observational evaluation; controlled repair cases
are not an empirical accuracy rate.

The [native-present study](https://github.com/antonsoo/stutterscope/tree/336993f5ac07bbdb9f650488676977e497374205/studies/present-clock)
uses an independent oracle based on original per-stream record ordinals before
filtering Intel's gold data. Those are ETW regression fixtures, not fresh game
benchmarks. A separate five-row excerpt retains the untouched FrameView case.
The wider replay byte-verifies 34 public captures: 27 parse, seven keep their
existing refusals, and 26 parsed reports are completely unchanged. The remaining
capture acquires the supported clock boundary. Missing durations and causes stay
unknown; coarse or absent clocks can conceal other gaps.

Try the [filtered-present example](https://antonsoo.github.io/stutterscope/?example=filtered-presents).
It bundles the native CSV and Intel license, supports keyboard loading and retry,
and recomputes/exports offline after loading. Bounded witnesses expose source-line
pairs, elapsed/native durations and rounding allowances, with an explicit omitted
count. Tiny positive allowances remain nonzero in human reports. The existing
[1% low definition comparison](https://github.com/antonsoo/stutterscope/tree/124f67eebfe9662a2fc1c609f754fb5c04700979/studies/real-captures)
is still available as a separate measurement of competing metric definitions.

Stutterscope's clean source build passes 362 core checks and 86 production browser
checks. All 33 canonical demo files match that build, and 40 hosted export
workflows pass. A separately installed local tarball matches all 21 native/control
workflows on Node 22.6/24, including the real executable. Native clock checks add
cost: one cached 112,316-frame CLI run measured a median 595 ms before and 657 ms
after across five alternating processes on 14-logical-CPU WSL2. This is a narrow
timing check, not general throughput evidence.

The public registry artifacts remain Contextscope 0.3.3 and Stutterscope 0.2.5,
checked independently on 2026-10-16. They predate these source corrections.
Installing a local tarball does not establish a registry release. Each project's
study records source, installed-package and hosted verification separately.

## Catalogue verification

The [clean-archive receipt](evidence/prompt-pacing-verification-2026-10-16.json)
pins catalogue source `d8d3dc4`: install, catalogue validation, lint, formatting,
typecheck, 32 unit checks, build and 32 production browser scenarios pass.
Forty-eight source/build inputs match that archive. The thumbnail is an actual
1200x750 capture of the hosted native example, scrolled to its metrics; no
application content was edited.

The [public source receipt](evidence/prompt-pacing-source-2026-10-16.json) compares
all five changed source/evidence files at that immutable revision. The
[canonical HTTP receipt](evidence/prompt-pacing-hosting-2026-10-16.json) compares
all 38 build files, including `projects.json` and the updated WebP, without
cache-busting queries. The [public handoff receipt](evidence/prompt-pacing-browser-2026-10-16.json)
follows the actual catalogue link in Chromium/Firefox at desktop/phone widths,
then downloads the hosted native report offline. All four complete reports
match the installed-CLI evidence; witnesses, accessibility, page fit, page errors
and CSP observations are checked. The catalogue, both project sources and both
demos are published; npm artifacts remain unchanged.
