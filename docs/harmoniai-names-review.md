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
four complete journeys to the public lesson. One earlier Firefox replay timed out
waiting for audio progression, without enough captured state to establish a cause.
Both isolated Firefox repeats and the subsequent complete four-context run passed;
the script now captures media diagnostics on failure. This is not evidence about
physical speaker output.

Public catalogue build and browser receipts are recorded separately after publication.
