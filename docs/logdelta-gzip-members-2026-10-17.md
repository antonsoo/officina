# Open the whole gzip log in the browser

Logdelta's CLI already reads concatenated gzip streams. Its browser demo used
`DecompressionStream("gzip")`, which rejects bytes after the first member. An
ordinary concatenated log therefore worked in the CLI and failed to open in
Chromium and Firefox.

The correction uses the CLI's Rust decoder in a separate worker for each file.
It validates every member's checksum and trailer before replacing an input,
bounds expansion, and decodes Unicode after joining the complete byte stream.
Baseline and target imports remain independent; completion or cancellation
releases their worker memory. There is no additional compression dependency.

The retained comparison compresses three existing loopback HTTP captures with
GNU gzip, once as a single member and once as six members. These contain 6,000
recorded controlled responses, not a production incident. The first member
contains only startup; all HTTP evidence follows it.

| Evidence | Earlier browser | Corrected browser |
| --- | --- | --- |
| Six-member failing log | Rejected; previous input/report retained | All 2,002 target lines opened |
| Checkout status observations | Could not import the failing target | 10/1,000 and 12/1,000 baseline 503s versus 200/1,000 target |
| Corrupt later CRC/size, truncation, trailing junk | Individual controls not replayed | Whole import rejected; previous complete report retained |
| UTF-8 character or UTF-16 BOM/unit across members | No multi-member import | Original text retained |
| Expanded or decoded text over 25 MiB | Existing size policy | Rejected; no accepted prefix |

The complete raw JSON and portable reports match the native CLI result.
Independent client response counts survive both compression forms. Invalid
UTF-8 keeps its loss marker and cannot pass an exact field watch; a literal
encoded U+FFFD remains valid text. Cancellation, typing and reset discard
queued results, and one import can finish while another is pending.

[Source and native captures](https://github.com/antonsoo/logdelta/tree/0066277f86fa5f02998689832aead2228128a14b/studies/gzip-members)
and [clean/public verification](https://github.com/antonsoo/logdelta/blob/9ff28f6147a8eecfce0322625b667be52f9e34f1/studies/gzip-members/verification.md)
retain before/after screenshots, the actual GNU files, installed-crate replay,
all 23 packaged engine source files, the 20-case compiler matrix and the full
production browser checks. Both Rust 1.85 and the build compiler passed the
locked native suite.

[The public demo](https://antonsoo.github.io/logdelta/) uses Pages commit
`7d06e1c8e9e1b89d06fd26f327902f1c35782de1`. All 39 canonical files and the root
entrypoint matched the tested build before and after the public browser replay.
Four fresh Chromium/Firefox desktop/phone contexts saved 64 downloads and made
no analysis HTTP requests after warm-up. All 60 portable reports identify the
exact executed module; the four raw JSON downloads match native output. Cold
engine-fetch failure and recovery also passed publicly. The existing warm
legacy-cache/two-build regression passed separately in both browsers locally.

The source/main proof commit is `9ff28f6147a8eecfce0322625b667be52f9e34f1`.
No registry release or tag was made. The registry CLI already supports multiple
members; the browser cap and offline-after-load scope remain explicit.
