// GOLDEN GETAWAY — gta6-cover-art-01 round 2 candidate A (Node 22, stdlib only).
// Copies this directory's app/ and screenshots/ into the output directory and
// writes /output/dossier.json with the vendored make.fun library. Paths are
// resolved from this file's own URL, never from the working directory.
//   MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Clear stale output first, so a re-run is byte-identical even when an
// earlier run left files behind (e.g. a removed screenshot or sample).
mkdirSync(out, { recursive: true });
for (const sub of ['app', 'screenshots']) {
  rmSync(join(out, sub), { recursive: true, force: true });
}
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  }),
);
