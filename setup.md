# Setup Guide — router-mcp-connect-sdk

---

## Prerequisites


| Tool    | Version | Notes                                                                               |
| ------- | ------- | ----------------------------------------------------------------------------------- |
| Node.js | 24.x    | `node -v` should print `v24…`. 20+ works.                                           |
| pnpm    | 9.x+    | Use the global `pnpm` already on your machine. Do **not** use npm/yarn or corepack. |




## Clone

```bash
git clone https://github.com/CodisteEmergingTech/router-mcp-connect-sdk.git
cd router-mcp-connect-sdk
```



## Environment

No `.env` file. Nothing is loaded at runtime.

`CONNECT_APP_URL` is **optional and build-time only**. tsup inlines it as `HOSTED_APP_URL`. If you omit it, the default is `https://connect.eightos.xyz`.

Consumers can still override the iframe URL at runtime with `connectAppUrl` (the dashboard does this). You only need the env var if you want a different baked-in default.

Do not commit `.env` if you create one — it is gitignored.

## Install dependencies

From the repo root:

```bash
pnpm install --frozen-lockfile
```

`--frozen-lockfile` matches CI and avoids rewriting `pnpm-lock.yaml`.

pnpm may warn that some packages skipped build scripts (`esbuild`). That is expected for a first install. Run `pnpm typecheck` / `pnpm build` first; only use `pnpm approve-builds` if the build fails to start.

React 19 is installed as an optional peer so the `./react` entry typechecks. Vanilla apps do not need it at runtime.

## Build / watch

Production build (writes `dist/`):

```bash
pnpm build
```

Local connect-page as the baked-in iframe default:

```bash
CONNECT_APP_URL=http://localhost:3100 pnpm build
```

Watch mode (rebuilds on `src/` changes):

```bash
pnpm dev
```

or, for the local iframe default:

```bash
CONNECT_APP_URL=http://localhost:3100 pnpm dev
```

Useful scripts:

```bash
pnpm typecheck   # tsc --noEmit
pnpm build       # tsup → dist/ (ESM, CJS, IIFE + .d.ts)
pnpm dev         # tsup --watch
```

There is no `pnpm test` and no Lefthook config in this repo.

Outputs after a successful build:

- `dist/index.*` — vanilla `EightOSConnect`
- `dist/react.*` — `ConnectButton` + `useConnect`
- `dist/index.global.js` — IIFE (`EightOSConnect` global)

`dist/` is gitignored. Rebuild after a clean clone.



To consume a local SDK build from another workspace package:

```bash
pnpm add /absolute/path/to/router-mcp-connect-sdk
```

Or keep using the published `@eightos/connect-sdk` from npm.

## Verify

```bash
pnpm typecheck
pnpm build
```

Then confirm artifacts exist:

```bash
ls dist/index.d.ts dist/index.js dist/react.d.ts
```

