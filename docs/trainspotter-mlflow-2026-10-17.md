# Trainspotter: native local MLflow histories

Trainspotter can now diagnose a local MLflow SQLite database or legacy FileStore
without one CSV export per metric, an MLflow runtime dependency, or a tracking
server. This is a new input capability. The previous source refused these stores;
it did not contain an MLflow reader to repair.

The [usage and reader contract](https://github.com/antonsoo/trainspotter/blob/main/docs/mlflow.md)
cover run-ID/name selection, full recorded histories, native millisecond clocks,
read-only SQLite snapshots and FileStore's bounded byte-prefix reads. Generic
MLflow steps remain logging coordinates unless the caller declares training
updates. Repeated-step conflicts stay visible and fail integrity gates.

The [native producer study](https://github.com/antonsoo/trainspotter/tree/main/studies/mlflow-native)
retains stores written by SDKs 2.17.2 and 3.17.1 and an independent
`get_metric_history` oracle: 34,210 recorded observations across 32 cases match.
The measurements replay existing training captures; additional conflicting-step,
default-step and special-value cases are controlled. This does not establish a
new training result or general detector accuracy. MLflow SQL can normalize
infinity to finite extremes; the reader preserves the native record and discloses
that it cannot reconstruct the old infinity.

The archived source passed clean installation, lint/type checks, all 793 tests,
package/site builds and 220 real browser report workflows. An installed wheel
also passed the native-history replay and actual watchers with an independent
SDK writer. A larger neighboring run does not steal watch selection; a newly
logged NaN stops the error gate. Native deletion remains explicitly selectable.

The [public sample](https://antonsoo.github.io/trainspotter/mlflow-slowdown.html)
contains its original eight-run SQLite input and an offline vector download.
All 19 hosted HTML files and the root alias matched the verified build. Four
Chromium/Firefox desktop/mobile contexts followed the gallery card, disconnected,
downloaded the database, reproduced its diagnosis with the installed CLI, and
opened its saved SVG. [Separate artifact and publication receipts](https://github.com/antonsoo/trainspotter/blob/main/studies/mlflow-native/verification.md).

Source commits begin at `37cd9e6`; the verified gallery source is `fa02975` and
its Pages deployment is `1021f17`. PyPI 0.2.6 remains older: its actual wheel has
no MLflow reader or FileStore extra. No registry release or tag was made, and
the Hugging Face workbench was not redeployed or verified for this capability.
