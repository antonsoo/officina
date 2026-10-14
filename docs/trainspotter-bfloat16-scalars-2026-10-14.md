# Native bfloat16 readings are retained, 2026-10-14

Trainspotter `7eebb62` treated all five native bfloat16 loss readings as
unreadable while equivalent float32 controls loaded. The event file was written
by TensorFlow 2.20.0's low-level summary API with scalar-plugin metadata, and
TensorFlow's own decoder retained the actual values. These are synthetic
constants, not a training run. Ordinary `tf.summary.scalar` casts to float32
and is a distinct producer path.

Code `522fcba` decodes scalar bfloat16 binary/repeated-half-value payloads
without a TensorFlow dependency. It preserves the recorded quantized value
`0.10009765625`, rather than reconstructing the original `0.1`. Missing,
malformed or non-scalar payloads remain unreadable; NaNs, infinities and
signed zero remain numeric observations. Other dtypes keep their SDK decoder.

| Verification | Retained result |
| --- | --- |
| Unmodified native event file | 754 bytes; five previously unreadable loss readings now match TensorFlow, with unchanged float32 controls |
| Actual library/CLI replay | Six workflows; baseline six disagreements, corrected zero; analyze/watch warning gates change from incomplete exit 2 to valid exit 0 |
| Independent numeric oracle | All 65,536 bfloat16 bit patterns match native TensorFlow decode through both scalar payload encodings |
| Installed current environment | Python 3.14.7 / NumPy 2.5.4 / TensorBoard 2.21.0: six workflows and 14 regressions pass; TensorFlow absent |
| Installed minimum environment | Python 3.10.21 / NumPy 1.24.0 / TensorBoard 2.12.0: same results; TensorFlow absent; setuptools<81 for the older SDK |
| Fresh source archive | Configured lint/type checks, 671 Python tests without skips, package/site builds and 208 offline Chromium/Firefox report workflows including keyboard and accessibility |
| Artifact identity | All 29 runtime files including py.typed match source, wheel, source archive and three installations |
| Separate report study | Eight offline before/after controls at 1440/375px in both engines; loss counts change from zero to five and the curve becomes available; all screenshots inspected |

The [study](https://github.com/antonsoo/trainspotter/blob/07426be/studies/bfloat16-scalars/README.md)
retains the native producer, original bytes, payload/value receipt, compressed
oracle, CLI captures, installed results, check logs and inspected screenshots.
Its permanent producer reproduced the numeric expectations and oracle bytes.
A core-only Python 3.12.12 installation also reads the baseline HF example with
TensorBoard and TensorFlow absent.

The initial oracle prototype hit a NumPy conversion error when constructing a
TensorProto from an eager bfloat16 scalar; the oracle uses an explicit native
protobuf and TensorFlow's decoder. The initial browser selector matched both
input headings and was corrected to the existing `input-heading` id. Both
logs remain retained; neither is a product renderer or upstream SDK fix.

Evidence commit `07426be` matched remote `main` after the authorized push.
Thirteen pinned public files were fetched back and byte-compared with the
clean checkout. The [source receipt](evidence/trainspotter-bfloat16-scalars-2026-10-14.json)
records the full commit, URLs, sizes and SHA-256 hashes. Issue `officina-n0nt`
is closed. The wheel is a local build of 0.2.6, **not a PyPI release**.
`uv run python scripts/build_site.py` produces `site/` with 17 sample reports;
that local build was not deployed here.

The codec does not recover pre-quantization values, expand arbitrary tensor
shape support or retain NaN payload/signalling distinctions in Python numeric
comparisons. The capture does not establish training quality or the prevalence
of this low-level producer path in real workloads.
