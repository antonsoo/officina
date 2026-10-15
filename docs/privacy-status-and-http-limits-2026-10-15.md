# Mailbox masks, trace status, HTTP limits and first offline analysis

Four reproduced corrections are public in the source repositories. The linked
studies retain original SDK/CLI/browser observations, clean installs and limits.
No registry release, version tag or manual hosted deployment was performed.

| Project | Reproduced problem | Corrected behavior | Public source and evidence |
| --- | --- | --- | --- |
| Veil | `first!last@example.org` leaked its `first!` prefix; quoted and international mailboxes could pass through. | Mask complete supported mailbox identities before SDK serialization; restore the exact original text. | [Source e3e9c5b](https://github.com/antonsoo/veil/commit/e3e9c5b8e4de72911f29241a353777b28d9398cf), [study](https://github.com/antonsoo/veil/blob/e3e9c5b8e4de72911f29241a353777b28d9398cf/studies/email-boundaries/README.md) |
| TraceLens | Quoted error code `"2"` became UNSET; an unreadable status could produce a false 100% error reduction. | Preserve known error encodings; retain raw unknown statuses and leave their error/retry measurements unknown. | [Source a0af5e4](https://github.com/antonsoo/tracelens/commit/a0af5e4b222837fe97486eb063b2593b258c4bd3), [study](https://github.com/antonsoo/tracelens/blob/a0af5e4b222837fe97486eb063b2593b258c4bd3/studies/status-evidence/README.md) |
| mcplint | A 96 MiB response aborted the real audit CLI under a 256 MiB V8 old-space cap, discarding its good first page. | Bound decompressed HTTP JSON and SSE lines/event data at 10 MiB; retain earlier definitions with incomplete coverage, no score and a failing gate. | [Source 49fd216](https://github.com/antonsoo/mcplint/commit/49fd2169d9a700b2132862fe901679cc690c2c7f), [study](https://github.com/antonsoo/mcplint/blob/49fd2169d9a700b2132862fe901679cc690c2c7f/studies/http-bounds/README.md) |
| Contextscope | A first offline import failed loading a lazy presentation module; Chromium stayed stuck after reconnecting and retrying. | Prepare presentation and tokenizer code before file intake; retry invalid or cancelled startup downloads, then analyze the first local file offline. | [Source b295f6d](https://github.com/antonsoo/contextscope/commit/b295f6dd1df6c4610579565f32e41f0e132c1a35), [study](https://github.com/antonsoo/contextscope/blob/b295f6dd1df6c4610579565f32e41f0e132c1a35/studies/first-offline/README.md) |

Veil's 19 supported mailbox fixtures improve from 3 complete masks to 19.
All 288 expected request bodies and 21 difficult tool-argument bodies now receive
complete masks through actual installed OpenAI and Anthropic SDK transports.
Restoration remains exact. The retained 10,580 contact-tag replay gains eight full
masks; twelve tags still lack full coverage. Mailbox syntax is not deliverability,
and punctuation can also match source templates. The study records that tradeoff.

TraceLens replays 39 status/default/Jaeger cases through the core and 156 actual
console commands: 26 disagreements become zero. All 52 commands for the 13
already-correct cases keep their output. Offline Chromium/Firefox at desktop and
375 px retain unknown outcomes and raw downloads; installed Node 20.0.0 and
26.7.0 agree with source. Unset status remains the protocol default, not proof of
application success or complete instrumentation.

mcplint's six constructed oversized initialization/later-page cases abort in the
original build across HTTP JSON and both SSE transports. All six now return a
bounded diagnostic or incomplete report. Three ordinary SDK reports stay the
same apart from timestamps and ephemeral loopback labels. Installed Node floors,
actual standalone audit/comparison reports and offline browser downloads retain
the correction. Read bounds do not establish an overall memory/CPU sandbox.

Contextscope removes the previous warm-up requirement: cold first-import failures
drop from four to zero across Chromium/Firefox at desktop and 375 px. Four native
SDK histories retain the original CLI reports through 32 actual JSON/HTML export
pairs; eight original-message downloads preserve the captured source. Twenty-four
real HTTP/cache/worker fault workflows recover before intake, send no preparation
jobs and complete their first native import offline. The existing 2.1 MB tokenizer
download now happens at startup, delaying intake on slow connections. All 141
generated CLI/library files remain unchanged. The prior README promised offline
use only after a first analysis; this extends that boundary to the ready chooser.

Public-byte receipts are linked in each study. TraceLens verifies 96 changed
files, mcplint 51 and Contextscope 77 at their implementation/verification source heads; their
subsequent publication metadata was checked too. Bulk Git uploads needed a
transfer workaround; the original commit history was preserved. Package releases
and hosted-build state remain separate from these source receipts.
