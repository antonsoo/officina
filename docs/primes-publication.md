# Public discovery of Euclid’s extra prime

Verified 2026-10-28 UTC (2026-10-27 Los Angeles).
[Search πλείους](https://antonsoo.github.io/officina/?q=%CF%80%CE%BB%CE%B5%CE%AF%CE%BF%CF%85%CF%82).

| Stage     | Public observation                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source    | Catalogue main `bc68bb3`; review pins Stoicheia `0b180f208baa372052b2ec2c173d7edaa9f6baac`                                                                    |
| Build     | Fresh clone, Node 24, install/lint/typecheck/source format, 45 tests and build pass                                                                           |
| Delivery  | Fast-forward Pages `de30b5b`; older hashed assets preserved; every canonical file equals the clean build                                                      |
| Search    | Unaccented Greek πλειους finds the exact workshop, actual screenshot and operation-specific summary; typing does not rewrite the URL or refetch the catalogue |
| Operation | Extend the unresolved search to factor 30031, find the smaller prime divisor of 106, descend to 11 and read the composite branch                              |
| Evidence  | Actual displayed Greek p.390 image blob hashes to c745b20db69c37d4d4dfb1a6c90a4a8bea6ac29f447d7c5493c8075486981b30                                            |
| Review    | Native GitHub link reaches the exact pinned review heading and scrolls it into view                                                                           |
| Matrix    | Chromium/Firefox at 1280/375 px: all four complete public journeys pass; no application errors or horizontal document overflow                                |
| Stability | Canonical catalogue root rechecked after journeys; still byte-identical                                                                                       |

[Journey and canonical-file receipts](evidence/primes-publication/).
The actual public catalogue and lesson are used throughout; no local lesson
redirect or substitute review page is involved. Remote CI success is not claimed.

```sh
npm run test:workshops -- https://antonsoo.github.io/officina/ /tmp/officina-primes-public primes
```
