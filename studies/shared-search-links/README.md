# Let a source-word link open its search

An Erechtheion discovery note linked to `?q=σιμιο`, but the catalogue read no
query parameters. The [captured public before state](before.json) reproduces
the same failure with `minore pressura`: empty search, all thirty cards, and no
visible matching Frontinus workshop.

Source `4ab2f63` reads an incoming `q` and optional exact `audience`, then applies
the existing literal, case/accent-insensitive matching. **Copy search link** is
an explicit sharing action; typing and audience changes still make no data
requests and write neither the address nor browser storage. A clipboard denial
leaves a selected ordinary link. Clear removes incoming filter parameters, so
reload stays clear. Repeated parameters, unknown audiences and queries over 512
characters identify a complete reset rather than a partly applied filter.

The link uses the existing catalogue fragment, for example
[Frontinus’s pressure qualification](https://antonsoo.github.io/officina/?q=minore+pressura&audience=Ancient+world#catalogue)
or [a Greek worker’s name](https://antonsoo.github.io/officina/?q=σιμιο#catalogue).
The query is only put in a shareable URL when the user asks; incoming links
already contain their deliberately shared query.

The browser suite exercised loading and clearing a Greek incoming link,
copying/restoring query plus audience with clipboard permission denied,
ambiguous/unknown/oversized settings, literal markup, no extra filtering
requests and the existing focus/theme/retry behavior in Chromium and Firefox.
All 42 browser cases passed. [Layout review](local/layout.json) additionally
checks the visible copied-link field in phone/light and desktop/dark views,
with no overflow or accessibility violations. The accompanying screenshots
were visually inspected.

[Forty local continuous journeys](local/journeys.json) now start from incoming
source-word links, covering all ten curated workshops in both browsers at 1280
and 375 pixels. They continue through actual lesson controls and an immutable
source-review heading. Source `4ab2f63` was built again from a clean Node
24.21.0 install, producing the same 67 files as the working build.

Normal child deployment `b08eab0` published the reviewed source without removing
older hashed assets. The [before](hosted-files-before.json) and
[after](hosted-files-after.json) canonical inventories match all 67 build files,
with the real entry URL checked before and after both passes.

[Forty public journeys](hosted/journeys.json) repeat incoming search-link ->
lesson -> operated controls -> immutable review for all ten curated workshops,
in Chromium and Firefox at desktop and phone widths. The [four public control
journeys](hosted/controls.json) separately restore Latin query plus audience,
copy the correct public URL with clipboard permission denied, clear/reload to
all thirty tools, and open a Greek worker-name link to the ledger.

The source, clean build, deployment and captured public responses are separate
records. These checks do not establish a CI run or promise future CDN state.
