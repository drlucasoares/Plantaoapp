/**
 * Validador do formato de drogas em /src/data.
 * Regra do projeto: TODA droga precisa de fonte e data de revisão.
 * Retorna a lista de problemas encontrados (vazia = droga válida).
 */

const DATA_ISO = /^\d{4}-\d{2}-\d{2}$/;

function dataIsoValida(texto: string): boolean {
  if (!DATA_ISO.test(texto)) return false;
  const [a, m, d] = texto.split('-').map(Number);
  const data = new Date(Date.UTC(a, m - 1, d));
  // Recusa datas impossíveis como 2026-02-30.
  return data.getUTCFullYear() === a && data.getUTCMonth() === m - 1 && data.getUTCDate() === d;
}

function textoPreenchido(v: unknown): v is string {
  return typeof v === 'string' && v.trim() !== '';
}

export function validarDroga(droga: unknown, hoje: Date = new Date()): string[] {
  const erros: string[] = [];
  if (typeof droga !== 'object' || droga === null) return ['droga não é um objeto'];
  const d = droga as Record<string, unknown>;
  const nome = textoPreenchido(d.nome) ? d.nome : '(sem nome)';

  if (!textoPreenchido(d.id)) erros.push(`${nome}: falta "id"`);
  if (!textoPreenchido(d.nome)) erros.push(`${nome}: falta "nome"`);
  if (!textoPreenchido(d.fonte)) erros.push(`${nome}: falta "fonte"`);

  const revisao = d.revisao as Record<string, unknown> | undefined;
  if (typeof revisao !== 'object' || revisao === null) {
    erros.push(`${nome}: falta "revisao"`);
  } else {
    if (!textoPreenchido(revisao.data) || !dataIsoValida(revisao.data)) {
      erros.push(`${nome}: "revisao.data" deve ser uma data válida AAAA-MM-DD`);
    } else if (new Date(revisao.data + 'T00:00:00Z').getTime() > hoje.getTime()) {
      erros.push(`${nome}: "revisao.data" está no futuro`);
    }
    if (!textoPreenchido(revisao.revisor)) erros.push(`${nome}: falta "revisao.revisor"`);
  }

  const dose = d.dose as Record<string, unknown> | undefined;
  if (dose !== undefined) {
    if (typeof dose.minima !== 'number' || typeof dose.maxima !== 'number' || dose.minima > dose.maxima) {
      erros.push(`${nome}: "dose" precisa de minima <= maxima (números)`);
    }
    if (!textoPreenchido(dose.unidade)) erros.push(`${nome}: "dose.unidade" é obrigatória`);
  }

  return erros;
}
