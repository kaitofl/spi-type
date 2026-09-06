import { readFile, writeFile } from 'node:fs/promises';

for (const file of ['dist/client/index.html', 'dist/client/404.html']) {
  const html = await readFile(file, 'utf8');
  const pageRelative = html.replace(
    /(["'])\/(?=(_next|favicon\.svg|og\.png|types(?:-|\/)|questions\/))/g,
    '$1./',
  );
  await writeFile(file, pageRelative);
}
