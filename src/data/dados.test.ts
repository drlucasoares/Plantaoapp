import { describe, expect, it } from 'vitest';
import { validarDroga } from './validarDroga';

const HOJE = new Date('2026-11-20T12:00:00Z');

const drogaValida = {
  id: 'x',
  nome: 'X',
  fonte: 'Livro Y, 2025, p. 10',
  revisao: { data: '2026-01-15', revisor: 'Dr. Fulano' },
  dose: { minima: 0.1, maxima: 1, unidade: 'mcg/kg/min' },
};

describe('validarDroga', () => {
  it('aceita droga completa', () => {
    expect(validarDroga(drogaValida, HOJE)).toEqual([]);
  });

  it('recusa droga sem fonte', () => {
    const { fonte: _f, ...semFonte } = drogaValida;
    expect(validarDroga(semFonte, HOJE).join()).toMatch(/fonte/);
  });

  it('recusa fonte em branco', () => {
    expect(validarDroga({ ...drogaValida, fonte: '   ' }, HOJE).join()).toMatch(/fonte/);
  });

  it('recusa droga sem revisão', () => {
    const { revisao: _r, ...semRevisao } = drogaValida;
    expect(validarDroga(semRevisao, HOJE).join()).toMatch(/revisao/);
  });

  it.each(['15/01/2026', '2026-02-30', '2026-13-01', ''])('recusa data de revisão inválida "%s"', (data) => {
    const d = { ...drogaValida, revisao: { ...drogaValida.revisao, data } };
    expect(validarDroga(d, HOJE).join()).toMatch(/revisao\.data/);
  });

  it('recusa data de revisão no futuro', () => {
    const d = { ...drogaValida, revisao: { ...drogaValida.revisao, data: '2027-01-01' } };
    expect(validarDroga(d, HOJE).join()).toMatch(/futuro/);
  });

  it('recusa revisão sem revisor', () => {
    const d = { ...drogaValida, revisao: { data: '2026-01-15' } };
    expect(validarDroga(d, HOJE).join()).toMatch(/revisor/);
  });

  it('recusa dose mínima maior que a máxima', () => {
    const d = { ...drogaValida, dose: { minima: 2, maxima: 1, unidade: 'mg' } };
    expect(validarDroga(d, HOJE).join()).toMatch(/minima <= maxima/);
  });

  it('recusa dose sem unidade', () => {
    const d = { ...drogaValida, dose: { minima: 1, maxima: 2 } };
    expect(validarDroga(d, HOJE).join()).toMatch(/unidade/);
  });
});

// Lê TODOS os JSON de /src/data e confere cada droga.
const arquivos = import.meta.glob('./**/*.json', { eager: true, import: 'default' });

describe('todos os arquivos de /src/data', () => {
  it('existe ao menos um arquivo de dados', () => {
    expect(Object.keys(arquivos).length).toBeGreaterThan(0);
  });

  for (const [caminho, conteudo] of Object.entries(arquivos)) {
    const drogas = (conteudo as { drogas?: unknown[] }).drogas;
    if (!drogas) continue;
    it(`${caminho}: toda droga tem fonte e data de revisão válidas`, () => {
      const erros = drogas.flatMap((d) => validarDroga(d));
      expect(erros).toEqual([]);
    });
  }
});
