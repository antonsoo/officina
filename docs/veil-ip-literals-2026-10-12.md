# Veil: complete IPv6 literal masking

Source is pushed to
[`e5444d1b1ab686bdf6fb3d3eba5ea86b2d254f3b`](https://github.com/antonsoo/veil/commit/e5444d1b1ab686bdf6fb3d3eba5ea86b2d254f3b).
The package release, version 0.4.4, tags and hosted demo remain unchanged.

The baseline masked `2001:db8::192.0.2.33` as `⟨IPV6_1⟩.0.2.33`, exposing
part of the address. It also left scope identifiers such as `%en0` visible.
The detector now consumes and validates a complete mixed/scoped literal and
stores its exact spelling under one surrogate. Malformed candidates cannot
produce a valid prefix or embedded IPv4 fragment.

| Constructed workflow | Baseline | Corrected |
| --- | ---: | ---: |
| Expected literal/control outcomes | 28/150 | 150/150 |
| Complete redaction in actual CLI workflows | 0/21 | 21/21 |
| Complete redaction in local SDK HTTP captures | 0/21 | 21/21 |
| Offline Chromium/Firefox outcomes, desktop/phone | 40/148 | 148/148 |

All exact and streamed restorations pass. The SDK captures use real OpenAI
and Anthropic serializers with a local transport, without provider calls.
The generated positive addresses are checked with libc `inet_pton`; this
validates address bytes, not privacy policy or interface existence.

Loopback/unspecified exclusions remain. Mapped addresses follow IPv4
classification in both dotted and hex notation; global IPv6 low bits do not
make an address loopback. Explicit exceptions recognize assigned NAT64/SRv6
prefixes inside the standard library's reserved ranges. Other reserved-space
exclusions still keep Python slices and markup readable. Scope IDs are opaque,
with documented character support; no network/interface resolution occurs.
The deprecated IPv4-compatible dotted spelling remains recognized, while its
pure-hex spelling remains excluded. This is not universal IPv6 recall.

A fresh replay retains all 10,339 resolved detections across 1,483 public files
and 2,616,034 words unchanged. Clean Python 3.12 lint, formatting, mypy and
627 tests pass, with one optional spaCy-backend skip. Separately installed
sdist-built wheels on Python 3.10.21 and 3.14.7 each pass the same 627 tests and
all targeted application/CLI/SDK replays. All 35 package files match across
source, sdist, wheel and both installations.

The clean Node 24 build passes 16 existing browser scenarios. Targeted runs
verify 296 downloaded text/vault files each, zero offline requests, four
visually inspected before/after screenshots and ten received assets matching
the clean build byte for byte. Timing evidence is limited to five constructed
malformed-token shapes on a shared WSL2 host.

The [study](https://github.com/antonsoo/veil/blob/e5444d1b1ab686bdf6fb3d3eba5ea86b2d254f3b/studies/ip-literals/README.md)
and [artifact verification](https://github.com/antonsoo/veil/blob/e5444d1b1ab686bdf6fb3d3eba5ea86b2d254f3b/docs/verification-ip-literals-2026-10-12.md)
retain the exact rules, limitations, commands and hashes.
The [public-source receipt](evidence/veil-ip-literals-2026-10-12.json) verifies
clean local/remote main equality and all 22 changed files, 836,781 bytes, against
pinned public GitHub source. Tags and `gh-pages` match the pre-work refs.
