# Development dependency audit: 2026-11-04

The fresh Node 24 install for the Haidao catalogue update reported ten moderate
entries. They propagated **one** advisory through the lint tree, not ten separate
flaws in the static app: [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249).
The affected minimatch preprocessing can amplify attacker-controlled patterns
at optimization level 2 or higher. This catalogue's fixed developer glob patterns
are not a public input path; the published site has no production npm dependencies.

The fix upgrades ESLint to 10.14.0 and the TypeScript plugin/parser to 8.72.1,
whose peer ranges support ESLint 10. Node 24 and the existing flat configuration
meet the [official migration requirements](https://eslint.org/docs/latest/use/migrate-to-10.0.0).
No lint rule was disabled. The override `minimatch: ^11.0.1` resolves to 11.0.4 in
the lockfile. Keep it until upstream lint packages accept the patched major.

This is a deliberate major-version override, not an assumption that all minimatch
versions are interchangeable. The old ESLint 9 tree used minimatch 3's default
CommonJS function export; overriding that tree would break it. ESLint 10 removes
that tree. The three remaining consumers are ESLint's helper, @eslint/config-array,
and @typescript-eslint/typescript-estree. Their runtime uses are `Minimatch` with
`.match()` and the named `minimatch()` function, retained in version 11. The
[version 11 source](https://github.com/isaacs/minimatch/tree/v11.0.1) removes other
APIs including `makeRe()`, so a blanket override should not be copied into other
repositories without checking their consumers.

The old and new linters inspect exactly the same six files. Deliberately unused
TypeScript and an undefined JavaScript global both still produce the expected
errors. The actual source lint passes with zero warnings. These checks are
recorded in [before](evidence/development-dependencies/lint-before.json) and
[after](evidence/development-dependencies/lint-after.json) receipts. The app's
source, configuration and build dependencies did not change.

The npm audit [before](evidence/development-dependencies/audit-before.json) and
[after](evidence/development-dependencies/audit-after.json) receipts retain the
actual tree reports: ten moderate propagated entries became zero reported
vulnerabilities. This is a dated registry observation, not a permanent security
guarantee. Clean-install/build and public-byte evidence are recorded in the
[Haidao discovery review](haidao-error-pairs.md).
