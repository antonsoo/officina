# Source updates, 2026-10-10

This batch combines newly reproduced defects with earlier local changes that
were freshly checked before being pushed. The linked reports retain inputs, commands,
artifacts and the limits of each comparison.

| Repository | Work | Concrete result and evidence |
| --- | --- | --- |
| [errorbars](https://github.com/antonsoo/errorbars/blob/cdc24d7924e278da497449fee63a9aa089890d33/studies/lm-eval-evidence/README.md) | New fix | Import lm-eval scores without selecting an unrelated metric or interpreting numeric document IDs as scores. A real lm-eval 0.4.13 run and installed CLI counterexamples. |
| [mcplint](https://github.com/antonsoo/mcplint/blob/38f936699d70848cadd270d87da812a4037fddd9/studies/connection-deadlines/README.md) | New fix | Bound the whole connection attempt, including initialization and fallback; keep incomplete results unavailable. Eleven real test servers, HTTP/stdio cleanup and minimum/current Node workflows. |
| [am-i-unlucky](https://github.com/antonsoo/am-i-unlucky/blob/97455f92eb3aedf0467e710f03c87d6c52ac9082/studies/pity-tails/README.md) | New fix | Compute long pity tails without turning the truncated horizon into fabricated means, quantiles or affordability. Independent rational Markov calculations and a case with a true mean of 10,000 where the old display gave 902. |
| [stutterscope](https://github.com/antonsoo/stutterscope/blob/124f67eebfe9662a2fc1c609f754fb5c04700979/studies/csv-integrity/README.md) | New fix | Refuse malformed CSV and duplicate headers across the capture parsers instead of silently accepting altered columns. Eighteen CLI controls plus pinned public captures with unchanged valid metrics. |
| [ghostchars](https://github.com/antonsoo/ghostchars/blob/a9d54cf9a283b0a43b1b6f9b1dba02a7576c84ae/studies/discovery-evidence/README.md) | New fix | Keep discovery/read failures visible and prevent repair through rejected or changed filesystem paths. Twenty-four filesystem scenarios; the old code wrote unexpected bytes in eight. This is not a general atomic-write guarantee. |
| [veil](https://github.com/antonsoo/veil/blob/4a404a632f94892aef6af0e39d5985fe99d4a984/studies/surrogate-collisions/README.md) | New fix | Reserve literal surrogates across a complete request before masking, so literal text cannot alias sensitive mappings. Real SDK request boundaries, transactional refusal controls and exact round trips for 1,483 public files. Request scope does not cover provider-held history. |
| [tonemirror](https://github.com/antonsoo/tonemirror/blob/43a1dc72bc7ecc6a7c467d5a4b7a5d99d11f315e/docs/verification-2026-10-10.md) | New fix and remeasurement | Use the documented relative-Hz error threshold, align tracker frames correctly and verify downloaded/cached corpus bytes. A fresh 580-recording rerun. YIN contour error is 1.94% on jointly voiced PTDB frames; voicing error is separately 6.13%. This is a measurement correction, not a detector improvement. |
| [splitscope](https://github.com/antonsoo/splitscope/blob/0062a149613ec07264ee6abd81064511a2372f29/docs/large-histories.md) | New fix | Recover from failed large-history imports, cancel parsing, retain full statistics with bounded chart marks, and correct the PB forecast claim. A 140,000-attempt file, all 436 pinned public files, actual offline imports and a 19.6 MB download with every segment record checked. |
| [flakemap](https://github.com/antonsoo/flakemap/blob/8542d333521e210c98681b73e67df412dfb7ebf4/docs/verification-2026-10-10.md) | Fresh verification and source publication | Publish the earlier execution-evidence changes only after checking actual GoogleTest disabled, skipped and unknown outcomes. Compiled GoogleTest 1.17.0 histories and an installed Python 3.10 workflow. Unknown execution remains insufficient evidence. |
| [gnomon](https://github.com/antonsoo/gnomon/blob/4bdf1ebee39f832bcc579aeb11b55a0f77663da9/docs/verification-2026-10-10.md) | Fresh verification and source publication | Verify the existing full-scale construction exports before publishing their source. 26 PDFs / 192 pages measured digitally, plus actual browser downloads. Printing, assembly and outdoor accuracy remain unverified. |
| [planisphere](https://github.com/antonsoo/planisphere/blob/efa33746b52f0d77b98af29604fe18f06a1082b0/docs/verification-2026-10-10.md) | Fresh verification and source publication | Verify the existing stellar-motion and star-inspection changes before publishing their source. 20,055 positions against ERFA, including high-motion cases, and real JSON/SVG downloads. Physical construction remains unverified. |
| [horologium](https://github.com/antonsoo/horologium/blob/43fd938bb2e1bbd9ed8965da44984e631505d2be/docs/verification-2026-10-10.md) | Fresh verification and source publication | Verify the existing Chinese-calendar corrections and lunar-year inspector before publishing their source. All 200 pinned HKO tables: zero mismatches on 62,821 modern civil days, with 90 historical differences retained. This does not validate all calendars. |
| [logdelta](https://github.com/antonsoo/logdelta/blob/67caad720f297a09a677c056241f74b8e2190940/studies/streaming-inputs/README.md) | New fix | Decode gzip and Unicode headers split across pipe writes without corrupting records or reporting damaged gzip as a successful scan. Actual live CLI pipes, a 6,000-response capture and 32,000 public Loghub lines: 172/172 replay outcomes after the fix, versus 34/172 before. |
| [fieldproof](https://github.com/antonsoo/fieldproof/blob/0330e8afcd9357cd797edaa39d6f948bc2131cec/studies/boolean-evidence/README.md) | New fix | Stop approving Boolean claims from a stray negative word in prose. Single explicit yes/no/true/false answers remain verifiable; ambiguous prose retains its source and needs review. Real text layers in 32 synthetic PDFs, paired claims and installed-wheel replays; deliberately narrower automatic coverage. |
| [tracelens](https://github.com/antonsoo/tracelens/blob/cd114bee1e51299caeb966132a78442b52671acf/studies/protobuf-identities/README.md) | New fix | Preserve case-sensitive Protobuf byte IDs so separate traces and spans cannot collide, and decode original typed attribute names. Actual SDK serialization, 84 parser/CLI outcomes, installed Node 20/26 packages and offline browser navigation with downloaded IDs. The 22-file prior corpus is unchanged. |
| [officina](evidence-audit-2026-10-10.md) | New correction | Correct misleading findings on 17 project cards, preserve denominators and limitations, and pin every evidence link to a public source revision. |

## Source and release boundaries

The fifteen project revisions in the [source snapshot](evidence/source-updates-2026-10-10.json)
were compared with their actual remote `main` heads. Every pinned report was
fetched from the public source and matched against its local bytes. Officina carries this index
and the catalogue correction. These are source updates. No registry package, tag
or manual hosted deployment was made as part of this batch; a demo may serve a
different revision.

Fresh installs and relevant core, CLI and browser checks were used where applicable.
The reports emphasize actual failures, retained public data, independent comparisons
and downloaded artifacts. Passing tests alone does not establish calibration, physical
accuracy, pronunciation quality or behavior on untested provider/runner versions.

Splitscope subsequently corrected a misleading historical forecast summary:
14.3% mean probability versus a PB in 30.9% of evaluated windows. Its old
484/1,457 count refers to finishes below frozen earlier PBs in overlapping windows,
not distinct records. The catalogue now links to the corrected study revision.
