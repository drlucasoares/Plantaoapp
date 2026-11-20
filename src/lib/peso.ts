/**
 * Interpretação e validação do peso digitado pelo usuário.
 *
 * Regras:
 * - Aceita vírgula ou ponto como separador decimal ("72,5" ou "72.5").
 * - Ignora espaços e o sufixo "kg" ("72,5 kg").
 * - Faixa plausível: PESO_MIN_KG a PESO_MAX_KG (inclusive).
 *   0,3 kg cobre prematuros extremos; 300 kg cobre obesidade grave.
 */

export const PESO_MIN_KG = 0.3;
export const PESO_MAX_KG = 300;

export type ResultadoPeso =
  | { estado: 'vazio' }
  | { estado: 'valido'; kg: number }
  | { estado: 'invalido'; motivo: string };

export function interpretarPeso(texto: string): ResultadoPeso {
  const limpo = texto.trim().toLowerCase().replace(/\s*kg$/, '').replace(/\s+/g, '');

  if (limpo === '') return { estado: 'vazio' };

  // Apenas dígitos, com no máximo um separador decimal.
  if (!/^\d+([.,]\d+)?$/.test(limpo)) {
    return { estado: 'invalido', motivo: 'Digite apenas números (ex.: 72,5)' };
  }

  const kg = Number(limpo.replace(',', '.'));

  if (kg < PESO_MIN_KG || kg > PESO_MAX_KG) {
    return {
      estado: 'invalido',
      motivo: `Peso fora da faixa plausível (${formatarPeso(PESO_MIN_KG)} a ${formatarPeso(PESO_MAX_KG)} kg)`,
    };
  }

  return { estado: 'valido', kg };
}

/** Formata número no padrão brasileiro, sem zeros desnecessários: 72.5 → "72,5". */
export function formatarPeso(kg: number): string {
  return kg.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
}
