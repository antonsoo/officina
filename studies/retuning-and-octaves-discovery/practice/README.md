# Find the new listening practice

Sammû now lets a visitor retune the prescribed string by ear, isolate the selected partials, and save the attempt beside the exact base and source-reading packet. The catalogue description includes those actions. Its existing cycle demo and pinned cycle study remain valid.

| Query             | Previous public catalogue | Updated catalogue |
| ----------------- | ------------------------- | ----------------- |
| retune by ear     | No results                | Sammû             |
| isolated partials | No results                | Sammû             |

The [before receipt](before.json) records eight real public searches across Chromium and Firefox at 1280 px and 375 px. The [local receipt](local.json) checks ten queries in each configuration: the two additions, the previous seven retuning/octave queries, and Mesopotamian overtones. All forty searches return the intended single card, including refiltering offline. Screenshots were inspected at desktop and phone widths.

The source change affects one description in `public/projects.json`. The build preserves all other forty-seven output files byte for byte. No new application code or thumbnail is needed.

```sh
npm run build
node scripts/replay-native-workflow-search.mjs http://127.0.0.1:4387/officina/ /tmp/officina-practice after studies/retuning-and-octaves-discovery/practice/queries.json
```

The parent [retuning and octave study](../README.md) retains the initial publication, keyboard navigation and demo-state evidence. Sammû’s [practice review](https://github.com/antonsoo/sammu/blob/b025186cf2cd6e36142a6822a4a78289b84abe62/docs/practice-review.md) identifies its implementation, numerical controls, native packet and offline upgrade.

Published source: `bce6d1d`; Pages: `e489164`. [All 48 canonical hosted files](public-bytes.json) match the build, with only the catalogue description changed. [All forty hosted searches](public.json) repeat the local results and offline filtering in both engines at both widths. The earlier demo and evidence targets are unchanged. [Build inventory and forty-seven preserved files](build.json).
