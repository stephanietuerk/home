# stephanietuerk.net

Two independently built apps, deployed together to Firebase Hosting:

| App | Location | Serves |
| --- | --- | --- |
| Next.js shell (App Router, static export) | `apps/shell` | `/` and any React project at `/projects/<id>` |
| Angular projects | `apps/projects` | the legacy project pages at `/projects/<id>` (base href `/projects/`) |

The Next app is built with `output: 'export'`, so every page is pre-rendered to HTML at build time
and the whole site is static files. Server-only Next features (request-time rendering, route
handlers that read the request, server actions, default image optimization) are not available.

Moving between the two apps is a full page load. Inside each app, navigation is client-side.

## Setup

Requires Node 22.22 or newer.

```sh
npm run install:all
```

## Development

```sh
npm run dev
```

Starts `next dev` (http://localhost:3000) and `ng serve` (port 4200). Use http://localhost:3000
for everything: in dev, any `/projects/*` path without a Next page is proxied to `ng serve`,
mirroring the Firebase rewrites. Set `ANGULAR_DEV_SERVER` to point the proxy somewhere other than
`http://localhost:4200`.

## Build and deploy

```sh
npm run build
```

Checks that the project routing agrees everywhere it is defined (see below), builds both apps, and
assembles `dist/public` (the Next export at the root, Angular under `projects/`). The GitHub
workflows run this and deploy `dist/public` to Firebase.

To serve the built site locally with the real Firebase routing rules:

```sh
npx firebase-tools emulators:start --only hosting
```

## Which app renders a project

A project's `page` field in `apps/shell/src/data/projects.ts` says which app renders
`/projects/<id>`.

- **Angular projects** must also be listed in the `/projects/` rewrite regex in `firebase.json`
  and in `apps/projects/src/app/core/constants/routing.constants.ts`.
- **React projects** need a page at `apps/shell/src/app/projects/<id>/page.tsx`.

`npm run check:routes` (also run by `npm run build`) verifies all of this.

To migrate an Angular project to React: add its page under `apps/shell/src/app/projects/<id>/`,
switch its `page` to `'react'`, and remove its id from the `firebase.json` regex and the Angular
routes. Its URL stays the same.
