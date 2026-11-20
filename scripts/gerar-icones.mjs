// Gera os PNGs do ícone a partir de public/favicon.svg.
// Uso (só quando trocar o ícone): node scripts/gerar-icones.mjs  (requer Playwright)
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { readFileSync } from 'node:fs';

const svg = readFileSync('public/favicon.svg', 'utf8');
const tamanhos = { 'apple-touch-icon.png': 180, 'icon-192.png': 192, 'icon-512.png': 512 };
const browser = await chromium.launch();
for (const [arquivo, px] of Object.entries(tamanhos)) {
  const page = await browser.newPage({ viewport: { width: px, height: px } });
  await page.setContent(`<style>*{margin:0}svg{width:${px}px;height:${px}px;display:block}</style>${svg}`);
  await page.screenshot({ path: `public/${arquivo}` });
  await page.close();
}
await browser.close();
console.log('Ícones gerados em public/');
