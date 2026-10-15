# Splitscope XML annotation integrity, 2026-10-15

Splitscope's raw icon/settings preprocessor could delete timing evidence before
the XML parser saw it. Adding two authored comments around an existing public
Destrega record changed its hypothetical sum of best from 25:11.017 to
26:49.806, with no time or identifier edited. CDATA names were rewritten too;
mismatched XML inside actual opaque elements disappeared before validation.

Implementation `c746723` validates the original source and uses the existing
XML parser's opaque-node handling at three schema paths. The
[published study](https://github.com/antonsoo/splitscope/blob/b9613093cc4bf9de0996501b07136f15c54a64c9/studies/opaque-xml/README.md)
retains before/after built-app imports and complete downloads. Both browsers at
desktop and phone widths disconnect before their first import. Record 58 and
its `[null, 83.691]` source values remain; malformed replacements preserve the
previous calculation. The annotation is synthetic, over a retained licensed
history; this is not a newly recorded speedrun or an achievable-pace claim.

All 25 authored contracts pass after correction, with four passing before.
Expat independently establishes annotation equivalence. The pinned compiled
LiveSplit reference supplies the original data but rejects the 18 annotated
forms directly; those rejections remain in the evidence. All 436 unchanged
public files retain exact parsed-run/route hashes and statuses, including their
three existing rejections. This is compatibility evidence, not a prevalence
estimate for annotations.

Validating original XML has a measured cost: a synthetic 10 MiB icon changes
from 2.37 to 141.93 ms in the retained shared-host median. Large settings remain
opaque; the browser's 25 MiB intake and cancellable 15-second worker boundary
remain. The README replaces the old stripping-speed claim with the current
tradeoff and raw measurements.

A clean archive passes lint (34 warnings, no errors), typecheck, 239 tests and
the production build. The initial parallel browser run had 72 passes, one
contrast finding and one timeout. Both failed checks pass independently without
code changes; the complete serial run then passes all 74. Initial failures are
retained. All 18 tested HTTP assets match both builds, and all three final
screenshots were inspected.

[Public-byte verification](https://github.com/antonsoo/splitscope/blob/b9613093cc4bf9de0996501b07136f15c54a64c9/studies/opaque-xml/results/publication.json)
covers all 25 changed implementation/evidence files; the final remote HEAD and
receipt documentation bytes were also checked. No registry release, tag or
manual hosted deployment was made.
