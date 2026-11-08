import path from 'node:path';
import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const angularDevServer =
  process.env.ANGULAR_DEV_SERVER ?? 'http://localhost:4200';

const shared: NextConfig = {
  // The repo root has its own package-lock.json, so Next would otherwise treat
  // it as the workspace root.
  turbopack: { root: import.meta.dirname },
  // Lets any .scss file `@use 'typography'` etc. without relative paths.
  sassOptions: { loadPaths: [path.join(import.meta.dirname, 'src/styles')] },
};

export default function config(phase: string): NextConfig {
  // In dev, mirror the Firebase rewrites: any /projects/* path without a page
  // in this app is served by the Angular dev server (`ng serve`). Rewrites are
  // unsupported in a static export, so this only exists for `next dev`.
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...shared,
      async rewrites() {
        return {
          beforeFiles: [],
          afterFiles: [],
          fallback: [
            {
              source: '/projects/:path*',
              destination: `${angularDevServer}/projects/:path*`,
            },
          ],
        };
      },
    };
  }

  return { ...shared, output: 'export' };
}
