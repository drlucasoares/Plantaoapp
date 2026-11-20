import { describe, expect, it } from 'vitest';

/**
 * Regra do projeto: nenhum dado de paciente é armazenado.
 * Este teste varre o código-fonte (exceto testes) e falha se encontrar
 * qualquer API de armazenamento persistente.
 */
const fontes = import.meta.glob(['./**/*.{ts,tsx}', '!./**/*.test.{ts,tsx}', '!./test-setup.ts'], {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

// Remove comentários (/* ... */ e // ...) para não acusar textos explicativos.
function semComentarios(codigo: string): string {
  return codigo.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
}

const PROIBIDO = /\b(localStorage|sessionStorage|indexedDB|document\.cookie|caches\.open)\b/;

describe('privacidade', () => {
  it('varre ao menos os arquivos principais', () => {
    expect(Object.keys(fontes)).toEqual(expect.arrayContaining(['./state/PesoContext.tsx', './App.tsx']));
  });

  it('o detector funciona (controle positivo)', () => {
    expect(semComentarios('const x = localStorage.getItem("p");')).toMatch(PROIBIDO);
    expect(semComentarios('// localStorage proibido\nconst y = 1;')).not.toMatch(PROIBIDO);
  });

  it.each(Object.keys(fontes))('%s não usa armazenamento persistente', (arquivo) => {
    expect(semComentarios(fontes[arquivo])).not.toMatch(PROIBIDO);
  });
});
