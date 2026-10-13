// Builds src/lib/mediaManifest.json: every image actually shipped in public/images,
// with its size, folder and whether the site's code references it. Runs before
// `next dev` / `next build` (package.json pre-scripts) so the admin Media Library
// always lists the real files, including on Firebase App Hosting.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const PUB = join(ROOT, 'public');
const IMG = /\.(jpe?g|png|webp|avif|gif|svg)$/i;
const SKIP = new Set(['incoming', 'For mobile view for hero section']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) { if (!SKIP.has(name)) walk(p, out); }
    else if (IMG.test(name)) out.push({ p, st });
  }
  return out;
}

function sources(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) sources(p, out);
    else if (/\.(tsx?|css)$/.test(name)) out.push(readFileSync(p, 'utf8'));
  }
  return out.join('\n');
}

const code = sources(join(ROOT, 'src'));
const items = walk(join(PUB, 'images'))
  .map(({ p, st }) => {
    const url = '/' + relative(PUB, p).split(sep).join('/');
    const folder = url.split('/').slice(2, -1).join('/') || 'images';
    return { url, name: url.split('/').pop(), folder, bytes: st.size, modified: st.mtime.toISOString(), used: code.includes(url) };
  })
  .sort((a, b) => a.url.localeCompare(b.url));

writeFileSync(join(ROOT, 'src', 'lib', 'mediaManifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 0) + '\n');
console.log(`media manifest: ${items.length} images`);
