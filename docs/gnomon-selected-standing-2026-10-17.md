# Gnomon: place the rod on the selected date

The analemmatic designer previously printed only fixed calendar marks and hid
its date/time controls. An ordinary October date had no marked place to put
the vertical rod. The designer now exposes those controls and prints an open
ring for the selected civil minute, with its local clock, UTC offset and
north/south distance from the ellipse centre. Native SVG and PNG retain the
same point. In the retained Sydney example, it is 12.1 mm south of centre;
editing noon to 18:00 moves the exported point and updates the portable inputs.

[Construction study and actual downloads](https://github.com/antonsoo/gnomon/tree/main/studies/selected-standing)
retain the old and new outputs. Thirty native SVGs cover two hemispheres,
three sizes and five independent DE421 dates. An independent XML reader and
east/north/up Sun calculation check the printed point and its direction toward
the actual hour dot. Maximum errors are 0.0041 degrees in declination and
0.0045 degrees in direction. These are bounded numerical checks of ideal
geometry, not field measurements or a new ephemeris accuracy estimate.
Thirty fixed calendar geometries and 90 complete polar SVGs remain identical.

The selected instant freezes the same civil minute as the existing version-1
portable file, including repeated local times and historical offsets containing
seconds. Apparent-solar hour markings keep their existing meaning. The ring
does not add an animated shadow, polar-style cutting template or analemmatic PDF.

Source capability `c67dc85` is verified from clean archive `a9c60ff`: fresh Node
24.21.0 installation, lint/type checking, 312 unit checks in each of two number
locales, build, native metrology and 74 actual browser workflows completed
with exit 0. Sixty native text layouts fit both browsers. Separate pixel
measurements locate the ring in the actual PNG downloads against DE421.

Source `3cf564b` and Pages `4121fcf` publish that build. All 33 built files and
the canonical root match public HTTP bytes. Four Chromium/Firefox desktop/mobile
contexts disconnect, open the original file, save identical inputs, download
SVG/PNG, then edit the local time and download the new point and inputs. All
eight public SVGs match the reviewed local native files exactly and pass the
independent geometry check; four public PNGs place the ring correctly. Small
control-region screenshot differences were visually reviewed rather than
treated as geometry evidence.
[Publication receipts](https://github.com/antonsoo/gnomon/blob/main/studies/selected-standing/publication.json).
No physical printing, field validation, registry release or tag is claimed.
