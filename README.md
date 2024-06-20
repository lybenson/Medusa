# medusa-english

An Electron application with React and TypeScript

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```

Uncaught Exception:
Error: dlopen(/var/folders/v5/y24zc7s146g73h_4qyb2k3f00000gn/T/.com.syen.medusa.7l8UQV, 0x0001): tried: '/var/folders/v5/y24zc7s146g73h_4qyb2k3f00000gn/T/.com.syen.medusa.7l8UQV' (code signature in <F35AE2A7-07C4-37CC-A67C-B97B708E8DCE> '/private/var/folders/v5/y24zc7s146g73h_4qyb2k3f00000gn/T/.com.syen.medusa.7l8UQV' not valid for use in process: mapping process and mapped file (non-platform) have different Team IDs), '/System/Volumes/Preboot/Cryptexes/OS/var/folders/v5/y24zc7s146g73h_4qyb2k3f00000gn/T/.com.syen.medusa.7l8UQV' (no such file), '/var/folders/v5/y24zc7s146g73h_4qyb2k3f00000gn/T/.com.syen.medusa.7l8UQV' (code signature in <F35AE2A7-07C4-37CC-A67C-B97B708E8DCE> '/private/var/folders/v5/y24zc7s146g73h_4qyb2k3f00000gn/T/.com.syen.medusa.7l8UQV' not valid for use in process: mapping process and mapped file (non-platform) have different Team IDs), '/private/var/folders/v5/y24zc7s146g73h_4qyb2k3f00000gn/T/.com.syen.medusa.7l8UQV' (code signature in <F35AE2A7-07C4-37CC-A67C-B97B708E8DCE> '/private/var/folders/v5/y24zc7s146g73h_4qyb2k3f00000gn/T/.com.syen.medusa.7l8UQV' not valid for use in process: mapping process and mapped file (non-platform) have different Team IDs), '/System/Volumes/Preboot/Cryptexes/OS/private/var/folders/v5/y24zc7s146g73h_4qyb2k3f00000gn/T/.com.syen.medusa.7l8UQV' (no such file), '/private/var/folders/v5/y24zc7s146g73h_4qyb2k3f00000gn/T/.com.syen.medusa.7l8UQV' (code signature in <F35AE2A7-07C4-37CC-A67C-B97B708E8DCE> '/private/var/folders/v5/y24zc7s146g73h_4qyb2k3f00000gn/T/.com.syen.medusa.7l8UQV' not valid for use in process: mapping process and mapped file (non-platform) have different Team IDs)
at process.func [as dlopen] (node:electron/js2c/node_init:2:2214)
at Module.\_extensions..node (node:internal/modules/cjs/loader:1470:18)
at Object.func [as .node] (node:electron/js2c/node_init:2:2441)
at Module.load (node:internal/modules/cjs/loader:1215:32)
at Module.\_load (node:internal/modules/cjs/loader:1031:12)
at c.\_load (node:electron/js2c/node_init:2:13801)
at Module.require (node:internal/modules/cjs/loader:1240:19)
at require (node:internal/modules/helpers:179:18)
at bindings (/Applications/medusa-english.app/Contents/Resources/app.asar/node_modules/bindings/bindings.js:112:48)
at new Database (/Applications/medusa-english.app/Contents/Resources/app.asar/node_modules/better-sqlite3/lib/database.js:48:64)
