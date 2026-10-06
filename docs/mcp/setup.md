---
sidebar_position: 1
title: Connect an MCP client
description: Ask your agent to configure fsindex, or follow the manual MCP setup instructions for Codex, Hermes Agent, OpenClaw, Claude Desktop, OpenCode, and more.
---

# Connect an MCP client

`fsindex-mcp` is a local MCP server that communicates over standard input/output. Your MCP client starts it as a child process; the server then connects to the running `fsindexd` daemon through its Unix socket.

## Recommended: ask your agent

If you are using an agent that can configure its own MCP servers, paste this into
your conversation first:

```text
fsindex is installed on this system and ready to use. Configure fsindex for yourself as an MCP server using https://fsindex.zyx0.xyz/docs/mcp/setup, then verify that its search, count, and status tools are available. Use the running fsindexd daemon and the default socket unless status shows otherwise. Reload or start a new session if needed, then tell me when it is ready.
```

This is usually the fastest route: the agent can use its own configuration
workflow and confirm the connection in the same conversation. For manual setup,
continue below.

## Manual MCP setup

## Before connecting

Follow the [installation and daemon startup instructions](../introduction.md#install) first.

You need:

1. A running `fsindexd` daemon.
2. `fsindex-mcp` available on the MCP client's `PATH`, or its absolute path.
3. The same socket selection for both processes.

With the default socket, no environment variables are needed. If the daemon uses a custom socket, pass `FSINDEX_SOCKET` to the MCP server.

## Codex

Add the stdio server from a terminal:

```bash
codex mcp add fsindex -- fsindex-mcp
codex mcp list
```

For a custom socket:

```bash
codex mcp add fsindex --env FSINDEX_SOCKET=/path/to/fsindex.sock -- fsindex-mcp
```

Or configure `~/.codex/config.toml` directly:

```toml
[mcp_servers.fsindex]
command = "fsindex-mcp"

[mcp_servers.fsindex.env]
FSINDEX_SOCKET = "/path/to/fsindex.sock" # omit when using the default
```

Codex's CLI, desktop app, and IDE extension share MCP configuration for the same host. In the app or extension, you can also add an **STDIO** server named `fsindex` with the command `fsindex-mcp`.

## Hermes Agent

Add the server from a terminal:

```bash
hermes mcp add fsindex --command fsindex-mcp
```

Hermes connects immediately and discovers the server's tools. Enable `search`, `count`, and `status` when it asks which tools to expose.

Verify the saved connection:

```bash
hermes mcp test fsindex
```

For a custom socket:

```bash
hermes mcp add fsindex \
  --command fsindex-mcp \
  --env FSINDEX_SOCKET=/path/to/fsindex.sock
```

Start a new session after adding the server, or run `/reload-mcp` in an existing Hermes session.

## OpenClaw

Add the local stdio server and verify it with a live probe:

```bash
openclaw mcp add fsindex --command fsindex-mcp
openclaw mcp doctor fsindex --probe
```

For a custom socket:

```bash
openclaw mcp add fsindex \
  --command fsindex-mcp \
  --env FSINDEX_SOCKET=/path/to/fsindex.sock
```

You can also add it from **Control UI → Settings → MCP**. Choose **Stdio**, name the server `fsindex`, and use `fsindex-mcp` as the command.

## Claude Desktop and generic MCP clients

Add this server entry to the client's MCP configuration:

```json
{
  "mcpServers": {
    "fsindex": {
      "command": "fsindex-mcp"
    }
  }
}
```

If needed, set a custom socket in `env`:

```json
{
  "mcpServers": {
    "fsindex": {
      "command": "/absolute/path/to/fsindex-mcp",
      "env": {
        "FSINDEX_SOCKET": "/path/to/fsindex.sock"
      }
    }
  }
}
```

## OpenCode

Add a local server to `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "fsindex": {
      "type": "local",
      "command": ["fsindex-mcp"],
      "enabled": true
    }
  }
}
```

## Verify the connection

Ask the client to call the `status` tool. A healthy response includes index totals, roots, volumes, and `scan_state`.

If the server starts but cannot connect, the tool returns an error naming the socket it tried. Confirm that `fsindexd` is running and that both processes resolve the same socket.

:::tip Agent instructions are built in
The MCP server publishes usage guidance during initialization, including when to prefer `count` and how to interpret incomplete scans. Clients that honor MCP server instructions receive it automatically.
:::
