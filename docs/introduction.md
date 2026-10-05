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

## Install

Use the [install script](https://raw.githubusercontent.com/saulgudmon/fsindex/refs/heads/main/packaging/install.sh) to install a release on Linux x86_64 or ARM64. No source checkout or root access is needed; the default install location is `~/.local`.

Install Bash, curl, tar, minisign, and either Python 3 or jq using your distribution's package manager first. The installer also needs `sha256sum` or `shasum` to verify downloads.

```bash
curl -fsSL https://raw.githubusercontent.com/saulgudmon/fsindex/refs/heads/main/packaging/install.sh | bash
export PATH="$HOME/.local/bin:$PATH"
```

Add the `export PATH` line to your shell's startup file if `~/.local/bin` is not already on your `PATH`. The installer verifies the release manifest with minisign and checks the archive's SHA-256 checksum before installing.

### Start the daemon

On systems with a systemd user session, enable the installed service:

```bash
systemctl --user enable --now fsindexd
fsindex status
```

Without systemd, download the script and run `bash install.sh --no-service`, then run `fsindexd` in a terminal. Leave it running and use a second terminal for `fsindex status` and client setup.

For the desktop interface, run `fsindex-gui` or use the installed application launcher. The GUI requires WebKitGTK 4.1.

### Update

Re-run the install command to update in place. To customize an installation, download the script and use `bash install.sh --help` to see options such as `--prefix`, `--channel`, and `--version`.

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
