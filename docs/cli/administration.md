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

## `update`

Check for and install updates (self-update the per-user install):

```bash
fsindex update
fsindex update --check
fsindex update --version 0.1.1
fsindex update --dry-run
```

`--check` reports whether a newer version is available and how the current build was installed (self-updatable, AppImage, or package-managed). See [Install & uninstall](../install.md#update) for the full story.

## `uninstall`

Remove the per-user install — binaries, desktop launcher, icon, and systemd user unit:

```bash
fsindex uninstall
fsindex uninstall --purge      # also remove configuration and caches
fsindex uninstall --dry-run    # show what would be removed
```

See [Install & uninstall](../install.md#uninstall) for the uninstaller one-liner and details.
