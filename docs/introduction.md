---
slug: /
sidebar_position: 1
title: What is fsindex?
description: A live, in-memory filesystem index for agents, people, and scripts.
---

# A filesystem index built for agents

fsindex is a Linux-only, per-user daemon that keeps a live index of filenames and metadata across configured roots and mounted volumes. Agents query it through MCP; people and scripts use the CLI.

:::info Scope
fsindex indexes **names and metadata only**: paths, size, modification time, inode, entry kind, and volume. It never reads or searches file contents.
:::

## One index, multiple clients

```mermaid
flowchart LR
  A[Agent] -->|MCP over stdio| M[fsindex-mcp]
  H[Human or script] -->|CLI| C[fsindex]
  M -->|Unix socket| D[fsindexd]
  C -->|Unix socket| D
  D --> I[(Live in-memory index)]
```

The daemon owns the index. `fsindex-mcp` and `fsindex` are thin clients, so every interface sees the same results and freshness state.

## What it answers well

- Does a file or directory with this name exist?
- Where are the largest matching files?
- Which matching items changed recently?
- Which indexed volume contains this path?
- Is the index complete enough to trust an empty result?

## Where to go next

- Connect an agent in [MCP setup](./mcp/setup.md).
- Learn the three agent tools in the [MCP tool reference](./mcp/tools.md).
- Explore every command and global option in the [CLI overview](./cli/overview.md).

Installation and first-run instructions are intentionally omitted until the distribution method is finalized.
