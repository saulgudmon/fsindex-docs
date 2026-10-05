---
sidebar_position: 4
title: Configuration
description: Configure roots, exclusions, reconciliation, compaction, sockets, and logging.
---

# Configuration

The daemon reads a per-user TOML file. Run `fsindex paths` to see the default location on the current system, or start `fsindexd` with `--config <PATH>`.

```toml
roots = [
  { path = "~/", label = "home" },
  { path = "/run/media/me/Ext", label = "Ext" },
]

[exclusions]
use_defaults = true
names = []
patterns = []

max_results = 1000
reconcile_interval_secs = 3600
debounce_ms = 250
compact_interval_secs = 900
compact_dead_percent = 50
log = "info"
```

## Reference

| Key | Default | Meaning |
| --- | --- | --- |
| `roots` | home directory | Directories to index. `~` is expanded. Each root may have a label. |
| `exclusions.use_defaults` | `true` | Skip common dependency, cache, VCS, and build directories. |
| `exclusions.names` | `[]` | Additional directory names to skip anywhere in a root. |
| `exclusions.patterns` | `[]` | Additional regular expressions matched against full paths. |
| `max_results` | `1000` | Default daemon page size when a request omits its limit. |
| `reconcile_interval_secs` | `3600` | Interval between correctness-floor full rescans per volume. |
| `debounce_ms` | `250` | Window used to coalesce filesystem event bursts. |
| `max_dirs_per_volume` | `250000` | Maximum per-directory watches on a volume. |
| `max_pending_dirs` | `50000` | Pending-directory threshold that escalates to a full reconcile. |
| `compact_interval_secs` | `900` | How often to consider compacting tombstoned index slots. |
| `compact_dead_percent` | `50` | Dead-to-live percentage that triggers compaction. |
| `socket` | runtime default | Optional Unix socket override. |
| `log` | `info` | Tracing filter, such as `debug` or `fsindex_core=debug`. |

After editing the file, run `fsindex reload`. A root change can make the index incomplete while new data is scanned.

## Default exclusions

The built-in set favors relevant search results and scan speed. It includes `.git`, `node_modules`, `target`, `build`, `.cache`, `__pycache__`, virtual environments, common package-manager caches, framework build directories, trash directories, and `lost+found`.

Disable it only when those trees are intentionally part of your discovery workflow.

## Socket consistency

The daemon, CLI, and MCP server normally agree on the default socket. If you override it, make the same path available to each component:

- daemon: `fsindexd --socket <PATH>` or `FSINDEX_SOCKET`;
- CLI: `fsindex --socket <PATH> ...` or `FSINDEX_SOCKET`;
- MCP server: pass `FSINDEX_SOCKET` through the MCP client configuration.
