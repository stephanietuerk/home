// Combines both app builds into the single folder Firebase Hosting serves:
//   dist/public/           <- Next shell (static export)
//   dist/public/projects/  <- Angular projects (built with base href /projects/)
// React project pages are also exported under projects/, so the two builds
// share that folder; any file both builds produce is an error.
import { cpSync, existsSync, rmSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const shellDist = new URL('apps/shell/out/', root);
const projectsDist = new URL('apps/projects/dist/stephanietuerk/browser/', root);
const out = new URL('dist/public/', root);

for (const dir of [shellDist, projectsDist]) {
  if (!existsSync(dir)) {
    throw new Error(`Missing build output: ${dir.pathname}`);
  }
}

rmSync(out, { recursive: true, force: true });
cpSync(shellDist, out, { recursive: true });
try {
  cpSync(projectsDist, new URL('projects/', out), {
    recursive: true,
    force: false,
    errorOnExist: true,
  });
} catch (error) {
  if (error.code === 'ERR_FS_CP_EEXIST') {
    throw new Error(
      `The shell and Angular builds both produce ${error.path ?? 'a file'} under projects/`
    );
  }
  throw error;
}

console.log(`Assembled site in ${out.pathname}`);
