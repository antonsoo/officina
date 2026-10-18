# Discover the published native-input workflows

The canonical catalogue returned no cards for **MLflow**, **native NUnit** or
**PresentMon 2.6**, despite the corresponding browser workflows being published.
The [before receipt](../studies/native-workflow-search/before/receipt.json)
retains twelve actual searches: Chromium and Firefox, 1280 and 375 px.

Three existing descriptions now name those formats. Their evidence links point
to the corresponding current studies at immutable public source revisions.
The search implementation and registry links are unchanged. The catalogue's
visible note still distinguishes study revisions, demos and registry packages.

| Tool | Discoverable workflow | Recorded evidence and limits |
| --- | --- | --- |
| Trainspotter | Native MLflow histories, explicit model/dataset scopes, offline charts | Six SDK-written logging controls retain 200 run observations; scope changes no longer produce unsupported training-divergence recommendations. No training or new accuracy estimate is claimed |
| Flakemap | JUnit, native NUnit XML and TRX | 44,724 native NUnit case records from unchanged NodaTime and Math.NET executions match an independent identity/outcome oracle; historical executions do not establish production reliability |
| Stutterscope | Native CapFrameX JSON and PresentMon 2.6 CSV | Complete capture retains 258 CPU/GPU pairs; filtered input has 90 observed pacing pairs and 83 gaps. This was an actual ETL replay through the producer, not a new game/hardware benchmark |

The older 175-frame/91-pair figure belongs to the existing gold CSV. The new
174-frame/90-pair figure belongs to a separate ETL replay through PresentMon
2.6.0. These are different native files; the new count is not a correction to
the old capture's population. The original gold demo remains available.
The catalogue now opens the new native replay directly. Its refreshed thumbnail
is a real 1200 by 750 Chromium viewport of that served example, re-encoded as
WebP. [The original screenshot and hash receipt](../studies/native-workflow-search/thumbnail.json)
retain the source; no recorded measurement was redrawn.
The new thumbnail has its own filename. The older thumbnail bytes remain intact
so a cached older catalogue can still display its matching capture.

[Source-link checks](../studies/native-workflow-search/sources.json) fetched each
immutable public README and compared every byte with its published Git object.
The underlying source/package/hosted/download checks live in those studies,
including the separately published Flakemap and Trainspotter interactive Spaces.
No registry package was published as part of this catalogue update.

The browser replay requires the workspace's locked Playwright and cached engines:

```sh
node scripts/replay-native-workflow-search.mjs https://antonsoo.github.io/officina/ /tmp/native-workflow-search after
```

It checks all three searches in both engines and widths, confirms the matched
card's links remain clickable, and repeats filtering offline. It intercepts no
application assets or search responses. The public receipt and screenshots are
retained separately after deployment.

## Published result

Source `c8147c315d3db9109f4b4ecdb108d84e349b0263` passed a fresh locked install,
lint, types, formatting, all 38 existing checks and all 32 existing browser
scenarios. The [clean-build receipt](../studies/native-workflow-search/clean-build.json)
records each of the forty static files. The runtime search implementation is
unchanged; one existing browser assertion now checks the new recorded finding.

Pages revision `68253be48778862720d7b7412507cb0812bad2e3` advances the branch
normally. All [forty canonical files and both entry checks](../studies/native-workflow-search/hosted-bytes.json)
match that clean build without query cache busters. All thirty-seven prior
JavaScript/style assets and thumbnails remain
[byte-identical](../studies/native-workflow-search/preserved-assets.json).

The [public browser receipt](../studies/native-workflow-search/hosted/receipt.json)
retains all twelve successful searches, their exact study links, clickable card
links and offline refiltering. All twelve public screenshots were visually
reviewed. The separate [publication summary](../studies/native-workflow-search/publication.json)
records source/deployment boundaries; it does not infer installed registry parity.
