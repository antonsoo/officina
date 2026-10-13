# Flakemap: preserve uncertainty in local runner clocks

Source commit
[`02cb6e007505f56a91158c39fa5f330e7b6ada0c`](https://github.com/antonsoo/flakemap/commit/02cb6e007505f56a91158c39fa5f330e7b6ada0c)
was pushed to `main` and verified against the remote branch. All 27 changed
files, totaling 1,890,952 bytes, matched their pinned public raw URLs.
The [publication receipt](evidence/flakemap-sidecar-timezones-2026-10-13-public.json)
records sizes and SHA-256 values. Tags and `gh-pages` remained unchanged.
No package release or hosted build was published; the source version remains 0.3.7.

## Reproduced failure and repair

The metadata reader silently attached UTC to timestamps without a timezone.
That could reverse the recency conclusion when CI artifacts came from runners
in different timezones. In a controlled 30-run history, failures at indices
0, 2 and 4 came from a +09:00 runner, followed by 25 passing UTC runs. With
explicit offsets, Flakemap correctly called the burst quiet. Removing the
offsets moved the old failures after the newer passes and produced a new-flake
alert, without a completeness warning.

```text
Recorded instants + offsets -> old failures, then 25 passes -> quiet
Same clocks without offsets -> UTC invented                -> new flake
Corrected reader            -> chronology unavailable      -> new-flake gate 2
                           + valid sequence/report times  -> quiet; gate 0
```

Sidecar timestamps now require an explicit UTC offset. Local clocks and dates
alone warn and are ignored as recorded times. A valid sequence or an aware
JUnit/TRX report start can still supply chronology. Both fallback paths preserve
the timestamp warning, so the completeness gate returns 2. All 30 observed
outcomes remain usable; none are excluded for lacking a timestamp offset.

The [executable study](https://github.com/antonsoo/flakemap/blob/02cb6e007505f56a91158c39fa5f330e7b6ada0c/studies/sidecar-timezones/README.md)
labels its generated histories synthetic. It retains the UTC truth/input-tree
hashes, full-report hashes, both gate exits, metadata sources, activity and
warnings for 15 profiles. Each new-flake command also runs under a second host
timezone. These are controlled reproductions, not production incident counts.

| Case | Before: activity; new / incomplete exits | After: activity; new / incomplete exits |
| --- | --- | --- |
| Explicit mixed offsets | quiet; 0 / 0 | quiet; 0 / 0 |
| Offset-free clocks | new; 1 / 0 | unavailable; 2 / 2 |
| Offset-free clocks plus valid sequences | unavailable; 2 / 2 | quiet; 0 / 2 |
| Offset-free clocks plus aware JUnit/TRX times | new; 1 / 0 | quiet; 0 / 2 |
| Genuine timestamp/sequence disagreement | unavailable; 2 / 2 | unavailable; 2 / 2 |
| Full 15-profile replay | 7/15 intended results | 15/15 intended results |

Six unaffected profiles retain byte-identical complete JSON. The existing
malformed-timestamp control keeps its behavior with a clearer diagnostic.
All 274 tracked timestamp sidecars already include offsets. Seven existing
histories totaling 298 runs retain identical complete JSON and exit codes,
including existing incomplete/unavailable results.

## Verification and boundaries

The [verification receipt](https://github.com/antonsoo/flakemap/blob/02cb6e007505f56a91158c39fa5f330e7b6ada0c/studies/sidecar-timezones/results/verification.json)
records a clean archive of implementation `9e871c1`, preserving all 912 tracked
files. Python 3.12.12 completed locked installation, lint, formatting, type
checking, 375 checks and the sdist/wheel build. The wheel was built from its
source distribution.

| Separate wheel installation | CLI invocations | Disagreements | Packaged files matching source |
| --- | ---: | ---: | ---: |
| Python 3.10.21 / minimum Rich 13.7.0 | 45 | 0 | 30 |
| Python 3.14.7 / Rich 15.0.0 | 45 | 0 | 30 |

Both installed environments match the corrected source's full replay records
and all 15 HTML outputs exactly. The 91,487-byte wheel has SHA-256
`5215d64ce21031e2751f817a24b48b21ef997bbb1fd1abf0a98761379efcdd88`.

[48 offline browser workflows](https://github.com/antonsoo/flakemap/blob/02cb6e007505f56a91158c39fa5f330e7b6ada0c/studies/sidecar-timezones/results/browser.json)
cover six before/after reports in Chromium 153 and Firefox 155 at 1200 and 375
pixels. They verify activity labels, every outcome cell, keyboard-opened failure
records and warnings, with no page errors, remote requests or page overflow.
The eight retained screenshots were visually reviewed. The initial checker
incorrectly expected Firefox local-file navigation to expose a response object;
the corrected checker hashes the loaded file in both engines and compares the
response body when exposed. No application code or report changed for that
harness correction; the clean implementation archive remained unchanged.

An explicit offset can itself be wrong. This change cannot verify the producer's
clock, infer a missing timezone, or reconcile genuinely contradictory evidence.
Original metadata can still retain filesystem times labeled `mtime`, but those
never enter recorded-time ranges or failure timestamps. A historic timestamp
should gain `Z` only when it was actually recorded in UTC. Counts remain useful
when chronology is unavailable; recency conclusions do not.
