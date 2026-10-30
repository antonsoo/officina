# Discovering Which Dorian?

The selected music entry now opens Harmoniai's listening experiment directly.
It holds the starting pitch fixed while comparing Greek and modern Dorian;
degrees 2 and 6 differ. The same-interval-order control changes the modern label
to Phrygian and all pitches agree.

The catalogue also offers a workshop found through “which Dorian”, “same starting
pitch”, and the source words ἡμιτόνιον, βαρύ and ὀξύ. Its preview is an actual
capture of the comparison. The review link pins
[`ea7d717`](https://github.com/antonsoo/harmoniai/blob/ea7d7170c0aa0e2199f7f7f6b8b5d9a2a1c2ab23/docs/name-audit.md#try-the-actual-work),
which contains the operable exercise, source concordance and learning boundaries.

`node scripts/harmoniai-names-journeys.mjs CATALOGUE_URL OUTPUT_DIRECTORY` uses
Chromium and Firefox at 1440 and 375 pixels. It follows the selected entry, then
searches each alias, explicitly copies and reopens the Greek search link, follows
the pinned review by keyboard, compares its public raw bytes with the Git blob,
opens the actual lesson, plays the comparison, switches to the control, displays
and hashes Jan's printed page 198, and downloads the real WAV. The download's hash
must match Harmoniai's separately decoded listening artifact.

Typing a query does not rewrite the current URL. The new workshop's terms do not
replace the existing Sanskrit investigation, which remains separately discoverable.
The selected-work journey script was updated to operate the new music destination.

The [local catalogue receipt](../studies/harmoniai-names-local/review.json) covers
four complete journeys to the public lesson. Two Firefox replays timed out waiting for audio progression. The second retained
media state: fully loaded audio, paused at zero, the initial label, and keyboard
focus on the document body. This points to a navigation/focus race in the browser
script, before the play button was activated, rather than failed audio decoding.
The replay now waits for navigation load and asserts button focus before pressing
Enter. It retains concise media diagnostics on any later failure. This is not
evidence about physical speaker output.

The subsequent public run passed all four complete journeys with those navigation
and focus checks. The local selected-work smoke journey also operated all four
featured projects and both pre-existing architecture/Sanskrit workshop routes.

## Public catalogue evidence

Runtime source `846e955` was installed in a fresh Node 24.22.1 archive. Lint,
formatting, 45 tests, strict TypeScript, catalogue validation and the build passed.
Its 89 files matched the working build and the canonical public responses before
and after the final public journeys. The declaration of 35 projects is unchanged.

- [Clean build](../studies/harmoniai-names-local/clean-build.json)
- [Canonical hosted bytes before](../studies/harmoniai-names-public/bytes-before.json)
- [Four public discovery journeys](../studies/harmoniai-names-public/review.json)
- [Canonical hosted bytes after](../studies/harmoniai-names-public/bytes-after.json)
- [Public screenshot identities](../studies/harmoniai-names-public/screenshot-identities.json)
- [Observed publication state](../studies/harmoniai-names-public/publication-state.json)

Three public screenshots exactly match the retained local captures; the distinct
Firefox desktop capture is retained separately and was visually inspected. The
thumbnail is the actual Harmoniai comparison capture, whose public and local bytes
also matched in Harmoniai's own review.

The published `gh-pages` revision is `a83f7e8`. The Pages API reported the legacy
branch source with a null status, and the Actions listing returned no runs at the
observation time. Those results establish no remote-CI pass. Canonical hosted
bytes and the real public journeys independently establish delivery and operation.
