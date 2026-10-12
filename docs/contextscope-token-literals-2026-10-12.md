# Contextscope: ordinary text should not abort a captured log

Source is pushed to
[`d4c721ce9a26432a406e1df15b27d74ed6e1c235`](https://github.com/antonsoo/contextscope/commit/d4c721ce9a26432a406e1df15b27d74ed6e1c235).
The npm release, version 0.3.3, tags and hosted demo remain unchanged.

A literal `<|endoftext|>` inside an otherwise valid prompt, instruction, tool
definition or tool result caused the tokenizer to throw. One occurrence could
abort analysis of the whole log. Claude logs were affected too because the
shared parser computes both token counts. Public source files in OpenAI's
tiktoken and Hugging Face Transformers contain these ordinary strings.

The counter now uses ordinary-text BPE handling. It neither enables control
tokens nor alters the logged text. For example, `<|endoftext|>` is seven
ordinary o200k_base tokens; 256 adjacent spellings are 1,537 tokens. Existing
Chat Completions framing adjustments remain separate and unchanged.

| Constructed application workflow | Baseline | Corrected |
| --- | ---: | ---: |
| Valid library/CLI cases accepted | 12/62 | 62/62 |
| Invalid CLI controls rejected | 2/2 | 2/2 |
| Valid offline browser imports/pastes accepted | 0/64 | 64/64 |
| Invalid browser imports rejected, prior report retained | 8/8 | 8/8 |

The request bodies are constructed from synthetic text and pinned public code,
not captured provider traffic. OpenAI's native tiktoken 0.12.0 agrees with all
54 direct probes and all 120 extracted text segments. Every accepted CLI case
writes JSON and HTML; the JSON matches the library. Browser replay covers three
request families, public-code tool output, gzip, a cache-threshold case, malformed
JSON and an unsafe numeric control, with 72 real downloads per run.

Full reports for all 240 reconstructed public trajectories (10,555 requests)
and all 11 bundled examples remain byte-identical, including token totals,
findings and cache simulations. This runs both tokenizers and checks source/body
hashes; it is not a bypassed-counter comparison.

A clean Node 24 archive passes lint, type checks, 497 unit tests and 90 existing
browser scenarios. Its npm tarball is installed separately and replayed under
Node 20.0.0 and Node 24.21.0. All valid cases, rejection controls and native
counts agree. The installed command-line entry points also work. All 159 build
inputs, 180 build files, 95 package files and 31 served assets match their
compared archive, exercised build, package or installed copies. The clean
browser replay reproduces the working-build results. Four before/after and
32 regression-panel screenshots were visually inspected.

The [study](https://github.com/antonsoo/contextscope/blob/d4c721ce9a26432a406e1df15b27d74ed6e1c235/studies/token-literals/README.md)
and [artifact verification](https://github.com/antonsoo/contextscope/blob/d4c721ce9a26432a406e1df15b27d74ed6e1c235/docs/verification-token-literals-2026-10-12.md)
retain commands, fixtures, licenses, hashes and limitations. Counts remain
specific to o200k_base; Claude counts are estimates and cache hits are simulated.
There is no new claim about provider framing, live billing or production
prevalence of delimiter strings.

The [public-source receipt](evidence/contextscope-token-literals-2026-10-12.json)
verifies clean local/remote main equality and all 33 changed files, 933,718 bytes,
against pinned public GitHub source. Tags and `gh-pages` match the pre-work refs.
