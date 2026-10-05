---
sidebar_position: 2
title: Search and count
description: All filters, sorting, pagination, and value formats for fsindex search and count.
---

# Search and count

`search` returns entries. `count` accepts the same filters but returns only the number of matches. All supplied filters are combined with **AND**.

## `search`

```text
fsindex search [QUERY] [OPTIONS]
```

The optional positional `QUERY` is matched against file names unless `--search-path` is set.

```bash
fsindex search img --file --ext jpg --limit 20
fsindex search --path /projects --regex 'report.*\.pdf$' --sort mtime --desc
fsindex search --min-size 100M --volume-name Ext
fsindex search vacation --modified-after 30d
```

## `count`

```text
fsindex count [QUERY] [OPTIONS]
```

Use it for existence and aggregate checks:

```bash
fsindex count --ext rs
fsindex count Cargo --file --path /projects
```

Sorting, pagination, and reverse order do not change a count's meaning, though the CLI accepts the shared search argument set.

## Matching options

| Option | Meaning |
| --- | --- |
| `QUERY` | Substring—or regex with `--regex`—matched against names. |
| `--path <STRING>` | Match a substring or regex against the full path. |
| `--regex` | Interpret `QUERY` and `--path` as regular expressions. |
| `--case-sensitive` | Match case-sensitively; default matching is case-insensitive. |
| `--search-path` | Match `QUERY` against the whole path rather than only the name. |

## Entry and volume filters

| Option | Meaning |
| --- | --- |
| `--volume <ID>` | Restrict to a volume ID. Repeatable. |
| `--volume-name <NAME>` | Restrict to a volume name or mount containing the value. Repeatable or comma-separated. |
| `--file` | Return only files. Conflicts with `--dir`. |
| `--dir` | Return only directories. |
| `--symlink` | Return only symbolic links. |
| `--ext <EXT>` | Restrict by extension; the dot is optional. Repeatable or comma-separated. |
| `--include-offline` | Include cached entries belonging to offline volumes. |

:::note Kind flags
If several non-conflicting kind flags are provided, the CLI resolves them in the order `--file`, `--dir`, then `--symlink`. Use one kind flag per query.
:::

## Size and time filters

| Option | Meaning |
| --- | --- |
| `--min-size <SIZE>` | Minimum size. |
| `--max-size <SIZE>` | Maximum size. |
| `--modified-after <TIME>` | Modified at or after a Unix timestamp, or within a relative duration. |
| `--modified-before <TIME>` | Modified at or before a Unix timestamp, or relative duration. |

Sizes accept raw bytes or binary suffixes `B`, `K`, `M`, `G`, and `T`; decimal values are allowed. For example, `1.5G` is converted to bytes using powers of 1024.

Times accept Unix seconds or a relative age. Relative units include seconds (`s`), minutes (`m`), hours (`h`), days (`d`), weeks (`w`), 30-day months (`mo`), and 365-day years (`y`), plus their documented long forms.

```bash
fsindex search --min-size 1.5G --max-size 4G
fsindex search --modified-after 12h
fsindex search --modified-before 2w
```

## Sorting and pagination

| Option | Default | Meaning |
| --- | --- | --- |
| `--sort <KEY>` | `name` | `name`, `path`, `size`, `mtime`, `kind`, or `extension`. |
| `--desc` | off | Reverse sort order. |
| `--limit <N>` | `50` | Maximum results; `0` asks the daemon to apply its default. |
| `--offset <N>` | `0` | Skip the first N matches. |
| `--json` | off | Emit the full structured response. |

The human-readable summary reports the displayed range, total matches, query duration, and a freshness note when the index is incomplete.
