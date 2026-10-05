---
sidebar_position: 3
title: Agent usage patterns
description: Reliable and efficient ways for agents to query fsindex.
---

# Agent usage patterns

The MCP server sends these principles to clients as server instructions. They are also useful when writing prompts or agent policies.

## Choose the cheapest tool

Use `count` for “does this exist?” and “how many?” questions. Use `search` only when the agent needs paths or metadata. Use `status` for volume discovery and confidence checks.

| Intent | Tool |
| --- | --- |
| “Are there any `.env` files?” | `count` |
| “List the five newest database backups.” | `search` |
| “Which ID belongs to the archive drive?” | `status` |
| “Can I trust that no result exists?” | `status`, then `count` or `search` |

## Page broad searches

Search responses include both `total` and the current page. If `total` exceeds the returned result count, increment `offset` by `limit` to fetch the next page.

Avoid asking for the maximum page size reflexively. A small, sorted page often answers the question with less context usage.

## Check freshness before trusting absence

Every response carries `scan_state`. When `scan_state.complete` is `false`, results may be partial because an initial scan or reconcile is running, a volume is offline, events are pending, or a directory could not be watched.

Positive matches are still useful during an incomplete scan. An empty result is not strong evidence of absence until the index is complete.

## Compose filters deliberately

All filters are ANDed. Prefer structured filters over encoding everything into a regex:

```json
{
  "name": "backup",
  "extensions": ["tar.gz", "zip"],
  "min_size": 104857600,
  "volume_names": ["archive"]
}
```

Use volume IDs when exact identity matters. Use `volume_names` when the request naturally names a drive or mount and a loose match is acceptable.

## Respect the data boundary

fsindex cannot answer questions about file contents. Once it discovers candidate paths, use a file-reading or search tool to inspect those files. Do not interpret a filename match as evidence about what a file contains.
