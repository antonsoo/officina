# Search the command, test the point

This addition connects Officina's existing catalogue to the I.1 experiment inside
Stoicheia's first lesson. It adds no repository or new catalogue layout.

Search for the Greek `τέμνουσιν` (accented or unaccented), Latin `inter se secant`,
`120/241`, or `rational circle intersection`. The matching row identifies the
modern rational-point restriction and opens the existing bilingual reader at the
intersection command. Its recorded-review URL is pinned to a full source revision.

The local journey checked both browsers at 1440 and 375 px: search, explicit shared
search link, the workshop destination, precision change, the 56/97 candidate,
verified Greek source page 12, native ten-scan reading download, and reopening
that reading from disk without requests. The local receipt verifies the published
link target but navigates to a local production reader; it makes no public delivery
claim. The local source revision is checked with `git show`; a public run also
requires the exact pinned raw review bytes from GitHub.

The screenshots are actual operated views. The phone stacks the diagram thumbnail
above the question and source distinction; desktop places them side by side.
The existing colour, typography and keyboard behavior are unchanged.

```sh
node scripts/stoicheia-intersection-journeys.mjs CATALOGUE_URL RECEIPT_DIRECTORY
```

For local work before publishing, a third argument supplies the production reader
URL. Public publication evidence is recorded separately.
