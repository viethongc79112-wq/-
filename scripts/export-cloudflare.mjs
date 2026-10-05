import { build } from 'vite';
import { cp, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destination = join(root, process.argv.includes('--dist') ? 'dist' : 'output/cloudflare');
const publicDir = join(root, 'public');

// Bilibili serves the videos. Only ship the site, covers, and profile images to Pages.
await build({ root, publicDir: false, build: { outDir: destination, emptyOutDir: true } });
await cp(publicDir, destination, {
  recursive: true,
  filter: source => {
    const path = relative(publicDir, source).split('/');
    return !path.includes('.DS_Store') && !(path[0] === 'media' && ['videos', 'previews'].includes(path[1]));
  },
});

let total = 0;
async function validate(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await validate(path);
    else {
      const { size } = await stat(path);
      if (size > 25 * 1024 * 1024) throw new Error(`Cloudflare Pages 文件超出 25 MiB：${path}`);
      total += size;
    }
  }
}
await validate(destination);
console.log(`Cloudflare 上传目录：${destination}（${(total / 1024 / 1024).toFixed(2)} MiB）`);
