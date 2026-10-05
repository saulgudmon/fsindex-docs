---
sidebar_position: 1
title: CLI overview
description: fsindex command structure, shared options, output modes, and examples.
---

# CLI overview

The `fsindex` command queries and controls the running daemon. It does not scan the filesystem itself.

```text
fsindex [--socket <PATH>] <COMMAND>
```

## Global option

| Option | Environment | Meaning |
| --- | --- | --- |
| `--socket <PATH>` | `FSINDEX_SOCKET` | Connect to a non-default daemon socket. |

The command-line value takes precedence over the environment variable. With neither set, the CLI uses the platform's default per-user socket.

## Commands

| Command | Purpose |
| --- | --- |
| [`search`](./search-count.md#search) | Return matching indexed entries. |
| [`count`](./search-count.md#count) | Count matches without returning entries. |
| [`status`](./administration.md#status) | Show index totals, volumes, and freshness. |
| [`reconcile`](./administration.md#reconcile) | Force a full rescan. |
| [`reload`](./administration.md#reload) | Reload configuration from disk. |
| [`paths`](./administration.md#paths) | Print default socket and config paths. |
| [`config`](./administration.md#config) | Print the effective default configuration. |

## Human and JSON output

`search`, `count`, and `status` accept `--json`. Human-readable search output writes entries to standard output and the match summary to standard error, which makes piping paths and monitoring the summary independently possible.

Use JSON for scripts:

```bash
fsindex status --json
fsindex search invoice --ext pdf --json
fsindex count --ext rs --json
```

## Exit failures

Connection failures include the hint `is fsindexd running?`. Errors are also returned when arguments cannot be parsed, such as an unsupported size suffix, time unit, or sort key.
