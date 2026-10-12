# Ghostchars: retain source bytes when a repair write fails

Source at [`426a453`](https://github.com/antonsoo/ghostchars/commit/426a453a7679edd1e70e08318073dff9f37ff397)
fixes a reproduced data-loss defect in `--fix`. The previous writer truncated
the original before the repaired bytes were fully written. Reporting an error
did not recover the lost content.

| Disposable failure case | Before | Fixed installed CLI |
| --- | --- | --- |
| Kernel write limit, UTF-8 | 9,622-byte source reduced to 1,024 bytes; exit 2 | Original bytes and hash preserved; exit 2 |
| Kernel write limit, UTF-16 LE/BE | 19,242-byte source reduced to 1,024 bytes; exit 2 | Original bytes and hash preserved; exit 2 |
| Small file followed by an oversized write | Earlier repair applied; later original truncated | Both originals preserved |
| SIGKILL after a real 32-byte write | Original reduced to 32 bytes | Original preserved; one private partial temporary file remains |

Each replacement is now prepared in an exclusive temporary file beside the
original, checked, flushed and closed. Every replacement is prepared before
the first rename. The writer verifies original bytes and metadata again,
retains POSIX ownership and permission bits, refuses hard links and noticed
edits, and attempts cleanup after ordinary failures. Read-only originals remain
protected even when their parent directories are writable.

The [replay](https://github.com/antonsoo/ghostchars/blob/426a453a7679edd1e70e08318073dff9f37ff397/studies/atomic-repair/README.md)
uses an actual Linux `RLIMIT_FSIZE`, not a mocked exception. Only the timing of
the SIGKILL is injected. Its 12 cases also check ordinary UTF-8/BOM and UTF-16
repairs, executable mode, ownership, read-only paths and hard-link aliases.
The baseline runs on Node 20.0.0; an isolated package built from a clean archive
passes every case on Node 20.0.0 and 24.21.0. Committed, rebuilt and installed
CLI bytes are identical. All 57 installed files and 114 source/build inputs
are compared with the tested clean tree.

The [verification record](https://github.com/antonsoo/ghostchars/blob/426a453a7679edd1e70e08318073dff9f37ff397/docs/verification-atomic-repair-2026-10-12.md)
retains clean install, lint, typecheck, 245-test results in two locales, build,
self-scan, package and browser outputs. The unchanged web app passes 36 existing
Chromium/Firefox workflows without retries. Six inspected browser captures
match the existing images; a new terminal capture shows the installed failure
replay.

There is a measured I/O cost: five fresh 200-file batches per version took
median 830.7 ms before and 3,065.5 ms after on the tested WSL2 filesystem.
Every repaired output was byte-checked. The change requires a writable parent,
changes the inode, and does not copy extended attributes, ACLs or alternate
data streams. It is not a transaction across files, a backup, a power-loss
durability guarantee, or validation of Windows/macOS/network-filesystem
behavior. Those limits are documented alongside the fix.

The [publication receipt](evidence/ghostchars-atomic-repair-2026-10-12.json)
verifies clean local/remote HEAD equality and freshly fetched bytes for all
36 changed public files (670,792 bytes). Both commits use `[skip ci]`.
Package metadata stays at 0.1.5; `gh-pages` and release-tag refs are unchanged.
No package release, tag or hosted deployment was published.
