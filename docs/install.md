---
sidebar_position: 3
title: Install & uninstall
description: Install fsindex with one command, update it, and remove it cleanly.
---

# Install and uninstall

fsindex installs per-user: everything goes under `~/.local` and no root access
is required.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/saulgudmon/fsindex/refs/heads/main/packaging/install.sh | bash
```

The script is in the [fsindex repository](https://github.com/saulgudmon/fsindex/blob/main/packaging/install.sh) so you can read it first. It:

1. detects your architecture (Linux `x86_64` or `aarch64`),
2. fetches the release manifest,
3. verifies the **minisign signature** and the archive's **SHA-256**,
4. installs the four binaries (`fsindexd`, `fsindex`, `fsindex-mcp`, `fsindex-gui`) to `~/.local/bin`,
5. installs a **desktop launcher** and icon so fsindex appears in your application menu,
6. installs a **systemd user service** for the daemon (unless `--no-service`).

The installer needs Bash, curl (or wget), tar, and either Python 3 or jq. It
uses `minisign` for signature verification and `sha256sum`/`shasum` for the
checksum. If `minisign` is missing it says so and falls back to HTTPS + SHA-256.

If `~/.local/bin` is not on your `PATH`, add it:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Add that line to your shell's startup file (for example `~/.bashrc` or
`~/.zshrc`) to make it permanent.

### Start the daemon

```bash
systemctl --user enable --now fsindexd
fsindex status
```

Without systemd, install with `--no-service` and run `fsindexd` in a terminal
that you leave open.

### Installer options

Download the script first to pass options:

```bash
curl -fsSL -o install.sh https://raw.githubusercontent.com/saulgudmon/fsindex/refs/heads/main/packaging/install.sh
bash install.sh --help
```

| Option | Meaning |
| --- | --- |
| `--prefix DIR` | Install prefix (default `~/.local`). |
| `--channel NAME` | `stable`, `beta`, or `nightly`. |
| `--version VER` | Install a specific version instead of the channel head. |
| `--no-service` | Do not install the systemd user unit. |
| `--check` | Only report whether an update is available. |
| `--dry-run` | Resolve and verify, but do not install. |
| `--uninstall` | Remove the install (see below). |
| `--insecure` | Skip signature verification (not recommended). |

## Update

Three equivalent ways, all going through the same verified path:

```bash
# 1. Re-run the installer (updates in place):
curl -fsSL https://raw.githubusercontent.com/saulgudmon/fsindex/refs/heads/main/packaging/install.sh | bash

# 2. The CLI:
fsindex update

# 3. The desktop app: it checks at startup and shows an "Update available"
#    banner with an Update button.
```

Check without installing, or install a specific version:

```bash
fsindex update --check
fsindex update --version 0.1.1
```

`fsindex update --check` also reports how your build was installed:

```text
update available: 0.1.0 -> 0.1.1 (stable) (self-update available)
update available: 0.1.0 -> 0.1.1 (stable) (AppImage — update via the AppImage)
update available: 0.1.0 -> 0.1.1 (stable) (installed by your package manager — update that)
```

Self-update only applies to the per-user (prefix) install. An AppImage, or a
system package (deb/rpm/AUR/Flatpak), is updated by its own mechanism — fsindex
detects this and tells you rather than fighting it.

:::tip After an update
The daemon is a long-running process. After a self-update, restart it to run the
new version:

```bash
systemctl --user restart fsindexd
```
:::

## Uninstall

Remove the per-user install — binaries, desktop launcher, icon, and the systemd
user unit — with the CLI:

```bash
fsindex uninstall
```

Your configuration and index cache are kept (so a reinstall is quick). To remove
those too:

```bash
fsindex uninstall --purge
```

Preview what would be removed:

```bash
fsindex uninstall --dry-run
```

If the `fsindex` command is not available (for example you removed the binaries
by hand, or `~/.local/bin` is not on `PATH`), run the installer with
`--uninstall` instead. This works even as a one-liner, because the installer
delegates to the uninstaller that shipped with your install:

```bash
curl -fsSL https://raw.githubusercontent.com/saulgudmon/fsindex/refs/heads/main/packaging/install.sh | bash -s -- --uninstall
```

Add `--purge` to also remove configuration and caches:

```bash
curl -fsSL https://raw.githubusercontent.com/saulgudmon/fsindex/refs/heads/main/packaging/install.sh | bash -s -- --uninstall --purge
```

Either method stops and disables the user service first, and refuses to touch a
system-wide install (use your package manager for that).

## From source

```bash
git clone https://github.com/saulgudmon/fsindex
cd fsindex
cargo build --release
```

Set `FSINDEX_CONFIG` and `FSINDEX_SOCKET` to run a checkout side by side with an
installed copy.
