---
sidebar_position: 5
title: Freshness and volumes
description: How fsindex communicates partial scans, watcher health, and offline volumes.
---

# Freshness and volumes

fsindex is designed to avoid silently presenting stale data as complete. Query responses include `scan_state`, and each result identifies its volume.

## When the index is incomplete

`scan_state.complete` is false while:

- an initial scan or full reconcile is running;
- filesystem updates are waiting to be processed;
- an indexed volume is offline;
- the inotify queue overflowed and a reconcile is required;
- one or more directories could not be watched.

The accompanying note explains the current condition. Existing positive results remain useful, but absence is uncertain until the state returns to complete.

## Volume lifecycle

Each mounted filesystem is represented as a volume with its own ID and state. A volume may be online, offline, scanning, or degraded.

When a mount disappears, fsindex marks its volume offline rather than failing unrelated queries. Offline entries are excluded by default and can be included explicitly with `include_offline` or `--include-offline`. When the volume returns, it is rescanned.

## Reconciliation

Live updates come from inotify watchers. fsindex coalesces event bursts and resynchronizes affected directories. A full reconcile runs periodically as a correctness floor and is also triggered after watcher overflow.

Use `fsindex reconcile [VOLUME]` when you need to request one manually.
