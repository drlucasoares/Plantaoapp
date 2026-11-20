/**
 * Calcula o "caminho base" do site (onde ficam os arquivos).
 *
 * No GitHub Actions, o passo configure-pages informa o caminho:
 * - repositório "drlucasoares.github.io" → ""            → site em "/"
 * - repositório "Plantaoapp"             → "/Plantaoapp" → site em "/Plantaoapp/"
 * No computador (npm run dev), não há valor → "/".
 */
export function calcularBase(basePath?: string): string {
  const limpo = (basePath ?? '').trim().replace(/^\/+|\/+$/g, '');
  return limpo === '' ? '/' : `/${limpo}/`;
}
