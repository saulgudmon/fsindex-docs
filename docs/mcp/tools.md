---
sidebar_position: 2
title: Tool reference
description: Inputs and behavior for the fsindex MCP search, count, and status tools.
---

# MCP tool reference

fsindex exposes three read-only tools: `search`, `count`, and `status`.

## `search`

Returns a page of matching entries, the total number of matches, query duration, and current `scan_state`. All supplied filters are combined with **AND**.

### Filters

| Input | Type | Meaning |
| --- | --- | --- |
| `name` | string | Substring matched against the file name. |
| `path` | string | Substring matched against the full path. |
| `regex` | boolean | Treat `name` and `path` as regular expressions. Default `false`. |
| `case_sensitive` | boolean | Use case-sensitive name/path matching. Default `false`. |
| `search_path` | boolean | Match `name` against the whole path instead of only the file name. |
| `volumes` | integer[] | Restrict results to volume IDs reported by `status`. |
| `volume_names` | string[] | Restrict to volumes whose name or mount path contains any value. |
| `kind` | string | One of `file`, `dir`, or `symlink`. |
| `extensions` | string[] | File extensions, with or without the leading dot. |
| `min_size` | integer | Minimum size in bytes. |
| `max_size` | integer | Maximum size in bytes. |
| `modified_after` | integer | Modified at or after this Unix timestamp in seconds. |
| `modified_before` | integer | Modified at or before this Unix timestamp in seconds. |
| `include_offline` | boolean | Include indexed entries from offline volumes. Default `false`. |

### Sorting and pagination

| Input | Type | Meaning |
| --- | --- | --- |
| `sort` | string | `name`, `path`, `size`, `mtime`, `kind`, or `extension`. Default `name`. |
| `desc` | boolean | Reverse sort order. Default `false`. |
| `offset` | integer | Zero-based pagination offset. Default `0`. |
| `limit` | integer | Page size. Default `100`; maximum `5000`. |

Example tool arguments:

```json
{
  "name": "report",
  "extensions": ["pdf"],
  "modified_after": 1767225600,
  "sort": "mtime",
  "desc": true,
  "limit": 25
}
```

Every hit identifies its `volume` and includes path, kind, size, modification time, and inode metadata.

## `count`

Counts matching entries without returning individual hits. It accepts the same filters as `search`, but no sorting or pagination inputs.

Use `count` when the question is existential or aggregate:

```json
{
  "extensions": ["rs"],
  "path": "/projects/"
}
```

This is substantially cheaper than requesting a broad result set merely to inspect its length.

## `status`

Takes no arguments. It reports:

- daemon version, process ID, and uptime;
- total entries, files, directories, symlinks, and bytes;
- configured roots and socket/config paths;
- each volume's ID, name, mount, state, roots, totals, and watcher state;
- overall `scan_state`, including whether results are complete.

Call `status` before narrowing by a volume ID and whenever an empty result would drive an important decision.
