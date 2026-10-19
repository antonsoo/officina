# From the catalogue to the next weekly batch

The am-i-unlucky card now makes next-batch planning discoverable and opens a
worked live example directly. The source description also retains the older
community-logged Genshin pity-rate discovery term. Its historical study remains
in that project's README and presets; the new card finding names the chosen
weekly model and omits calendar-time forecasts.

The source addition chooses a first day independently for each weekly source,
then keeps seven-day spacing. One weekly 50% attempt starting on day 2 has a
9-day mean and a 50% chance by day 2. The old day-7 default keeps its 14-day
mean. This extends the supported schedules; it does not correct the mathematics
of the former stated day-7 model.

The [pinned study](https://github.com/antonsoo/am-i-unlucky/tree/7d3404163a60edec86ebbd179e1643bdd045785a/studies/next-batch)
retains 134 rational reference models, 9,514 CDF comparisons, full-tail means,
ten unchanged boundary controls, actual share-link reloads and separate clean
and live verification. These are constructed independent-rate models, not
measured player histories. Calendar dates, time zones, missed batches and pity
remain outside time mode. The tool's other modes keep their own assumptions.

The [direct example](https://antonsoo.github.io/am-i-unlucky/?mode=time&sources=%5B%7B%22name%22%3A%22Weekly+raid%22%2C%22rate%22%3A%2250%25%22%2C%22attempts%22%3A1%2C%22everyDays%22%3A7%2C%22firstDay%22%3A2%7D%5D&k=1&days=2)
uses the app's ordinary shareable inputs. The [source receipt](../studies/next-batch-search/source.json)
compares the complete immutable README with its Git object. Its source,
compiled build, hosted bytes and reference-model evidence remain distinct.

The focused browser replay searches `weekly reset`, follows the actual
same-tab **Live demo** link, and checks the opened app's first day, mean,
budget chance and 90% milestone. It returns to the catalogue and repeats
filtering offline. The separate `community-logged` query still finds the card.
No application, network or worker responses are mocked.

[Before](../studies/next-batch-search/before/receipt.json), all four new-workflow
searches find zero cards. The [candidate](../studies/next-batch-search/local/receipt.json)
finds one intended card in each Chromium/Firefox desktop/phone workflow;
every clicked public demo opens day 2, 9 days, 50% by day 2 and 90% by day 23.
There are no page/CSP errors, filter-driven catalogue requests or document
overflow. A history return can reload the catalogue; those navigation requests
are recorded separately from filtering. The recorded-card and linked-app
screenshots were opened and inspected. The existing visual system remains.

Source `0fb6794` passes a fresh Node 24.21.0 / npm 11.19.0 installation, lint,
strict types, formatting, all 38 unit checks and all 32 production browser
workflows. Every [clean build file](../studies/next-batch-search/clean-build.json)
matches the working Node 26 build by SHA-256. These catalogue checks remain
separate from the calculator's 418 unit checks, 146 browser workflows and
independent rational reference.
