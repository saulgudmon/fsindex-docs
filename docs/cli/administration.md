---
sidebar_position: 3
title: Status and administration
description: Inspect index health, reconcile volumes, reload configuration, and discover paths.
---

# Status and administration

## `status`

Show daemon uptime, index totals, scan freshness, paths, and every volume:

```bash
fsindex status
fsindex status --json
```

Use this to find volume IDs for `--volume` and to determine whether an empty query result is trustworthy.

## `reconcile`

Force a full rescan of all online volumes:

```bash
fsindex reconcile
```

Or reconcile a single volume by ID:

```bash
fsindex reconcile 3
```

The request is sent to the daemon, which reports the action it scheduled or performed.

## `reload`

Ask the running daemon to reread its configuration file:

```bash
fsindex reload
```

Use `status` afterward to confirm roots, volumes, and freshness.

## `paths`

Print the default socket and configuration locations without connecting to the daemon:

```bash
fsindex paths
```

## `config`

Print the built-in default configuration as TOML:

```bash
fsindex config
```

This does not print a customized file loaded by a running daemon. Use `status` to locate that daemon's configuration file.
