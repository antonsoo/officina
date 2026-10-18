# Native MLflow workbench receipts

These accompany the [publication record](../../trainspotter-mlflow-browser-2026-10-17.md).
The original databases, native SDK histories, adapter and browser replay are
public in [the immutable Space bundle](https://huggingface.co/spaces/antonsoloviev/trainspotter/tree/f47a4950399e2f3e18cdc6dfc6281cb75088f36f/evidence/mlflow-browser).

| Receipt | Scope |
| --- | --- |
| `native-before.json`, `browser-before.json`, `before.png` | Actual old adapter/browser refusal of the native database |
| `clean-verification.json` | Fresh archive, frozen install and standalone build/check outcomes |
| `native-flat-installed.json` | Native SDK oracle comparison through the freshly installed flat app |
| `installed-browser-provenance.json` | All 33 engine-file hashes across public source, installation and browser zip |
| `clean-standard-browser.json`, `public-standard-browser.json` | Ordinary app workflows, lifecycle and network checks |
| `browser-clean.json`, `browser-public.json` | Four contexts each, actual original/report download hashes and complete native comparisons |
| `html-clean.json`, `html-public.json` | All 76 saved-file hashes and 32 complete HTML comparisons per run |
| `publication.json` | Selected Space publication commit and tested manifest hash |
| `public-bytes-before.json`, `public-bytes-after.json` | All 64 immutable Hub files and corresponding served assets, root, manifest and unchanged other Space heads |
| `public-desktop.png`, `public-mobile-inventory.png` | Actual public UI at desktop and phone sizes |

`verify_html.py` compares a browser replay's saved downloads against the HTML
produced by the native replay. Only one generated UTC minute field is normalized;
all other bytes must match. After following the public bundle's reproduction
instructions for both replays:

```sh
python verify_html.py /tmp/public-downloads /tmp/native-mlflow-check /tmp/html-check.json
```

The browser receipts retain actual filenames, byte counts and SHA-256 values.
The original downloaded SQLite and baseline JSON are already retained in the
immutable bundle; its full native JSON reports supply the comparison oracle.
Runtime bootstrap and recreation after Clear require downloads. The no-request
result applies to analysis after the runtime has loaded.
