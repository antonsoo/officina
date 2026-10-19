# Resolve the actual setup-uv action release

On 2026-10-19, the workflows below referenced `astral-sh/setup-uv@v10`,
but the upstream repository exposed neither `refs/tags/v10` nor
`refs/heads/v10`. Both GitHub API endpoints returned 404, and a native
`git ls-remote` query returned only the explicitly named `v10.3.0` tag.
An unresolved action reference prevents a workflow from reaching its commands.

The correction replaces those references with the published
[`v10.3.0` release](https://github.com/astral-sh/setup-uv/releases/tag/v10.3.0),
resolving to `1c37ad07a6a961277cf70c0d37d6f313000f5884`.
Its action manifest uses Node 24 and accepts all inputs used by these workflows.
No application code or workflow commands change.

| Public repository and commit | References corrected | Commit |
| --- | ---: | --- |
| [am-i-unlucky](https://github.com/antonsoo/am-i-unlucky/commit/8365451b6e1fbd822a6f6e4699c5e504975c0531) | 1 | `8365451` |
| [veil](https://github.com/antonsoo/veil/commit/b5eb28ae294bc54cf86e66a9388f6f135760989b) | 3 | `b5eb28a` |
| [trainspotter](https://github.com/antonsoo/trainspotter/commit/740811d40981572bdf71a02aae5a8cde023c7979) | 4 | `740811d` |
| [gnomon](https://github.com/antonsoo/gnomon/commit/1acc6ad039d4003b7547ffa0e6f65abe7956a953) | 1 | `1acc6ad` |
| [flakemap](https://github.com/antonsoo/flakemap/commit/d9471f6b87dc2f00d9a1c94f746adf96747e4eef) | 4 | `d9471f6` |
| [errorbars](https://github.com/antonsoo/errorbars/commit/8e768ac2907454d42f51474ee28c5cd0e4c3577d) | 3 | `8e768ac` |
| [fieldproof](https://github.com/antonsoo/fieldproof/commit/d93ab5982edc83f3fbdaef7f99269e74fbb08797) | 3 | `d93ab59` |
| [mergeglass](https://github.com/antonsoo/mergeglass/commit/62bd6f42b0a9155fd9efa80765188d89e8be08df) | 1 | `62bd6f4` |

All 20 references across eight public repositories were pushed. Each commit's
changed-file inventory was checked against its workflow files, each resulting
YAML document parsed, and remote `main` was checked at the pushed commit.
The [machine-readable receipt](../studies/setup-uv-refs/results.json) retains
full before/after revisions, file inventories, action-manifest hash, supported
inputs and the reference query. Reference existence is an observation at the
recorded time; it is not a promise about future upstream tags.

These checks establish source configuration and reference resolution. They do
not claim that GitHub's runners executed the workflows successfully. Local
product checks and published artifact evidence remain separate records.
