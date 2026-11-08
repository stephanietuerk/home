import type { NextConfig } from 'next';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants';

const angularDevServer =
  process.env.ANGULAR_DEV_SERVER ?? 'http://localhost:4200';

// The repo root has its own package-lock.json, so Next would otherwise treat
// it as the workspace root.
const turbopack = { root: import.meta.dirname };

export default function config(phase: string): NextConfig {
  // In dev, mirror the Firebase rewrites: any /projects/* path without a page
  // in this app is served by the Angular dev server (`ng serve`). Rewrites are
  // unsupported in a static export, so this only exists for `next dev`.
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      turbopack,
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

  return { output: 'export', turbopack };
}
