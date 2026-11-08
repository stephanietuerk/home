// Angular-rendered project ids are listed in three places that must agree:
//   1. apps/shell/src/data/projects.ts        (page: 'angular')
//   2. firebase.json                          (the /projects/ rewrite regex)
//   3. apps/projects/.../routing.constants.ts (the Angular app's routes)
// React-rendered ids (page: 'react') must each have a page folder at
// apps/shell/src/app/projects/<id>/, and must not match the Angular regex.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { projects } from '../apps/shell/src/data/projects.ts';

const root = new URL('../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');

const shellAngularIds = projects
  .filter((p) => p.page === 'angular')
  .map((p) => p.id);
const shellReactIds = projects
  .filter((p) => p.page === 'react')
  .map((p) => p.id);

const routingConstants = read(
  'apps/projects/src/app/core/constants/routing.constants.ts'
);
const angularRouteIds = [...routingConstants.matchAll(/=\s*'([^']+)'/g)].map(
  (m) => m[1]
);

const firebase = JSON.parse(read('firebase.json'));
const angularRewrite = firebase.hosting.rewrites.find(
  (r) => r.destination === '/projects/index.html'
);
if (!angularRewrite?.regex) {
  throw new Error('firebase.json: no regex rewrite to /projects/index.html');
}
const angularRegex = new RegExp(angularRewrite.regex);
const servedByAngular = (id) =>
  angularRegex.test(`/projects/${id}`) &&
  angularRegex.test(`/projects/${id}/nested`);

const errors = [];
const sameSet = (a, b) =>
  a.length === b.length && a.every((x) => b.includes(x));

if (!sameSet(shellAngularIds, angularRouteIds)) {
  errors.push(
    `projects.ts angular ids [${shellAngularIds.sort()}] do not match ` +
      `routing.constants.ts [${angularRouteIds.sort()}]`
  );
}
for (const id of shellAngularIds) {
  if (!servedByAngular(id)) {
    errors.push(`firebase.json does not route /projects/${id} to Angular`);
  }
}
for (const id of shellReactIds) {
  if (angularRegex.test(`/projects/${id}`)) {
    errors.push(`firebase.json routes React project /projects/${id} to Angular`);
  }
}

const reactPagesDir = new URL('apps/shell/src/app/projects/', root);
const reactPageIds = existsSync(reactPagesDir)
  ? readdirSync(reactPagesDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  : [];
if (!sameSet(shellReactIds, reactPageIds)) {
  errors.push(
    `projects.ts react ids [${shellReactIds.sort()}] do not match the page ` +
      `folders in apps/shell/src/app/projects/ [${reactPageIds.sort()}]`
  );
}

if (errors.length > 0) {
  console.error('Route check failed:\n  - ' + errors.join('\n  - '));
  process.exit(1);
}
console.log(
  `Route check passed (${shellAngularIds.length} Angular, ${shellReactIds.length} React).`
);
