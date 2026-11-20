import { describe, expect, it } from 'vitest';
import { formatarPeso, interpretarPeso, PESO_MAX_KG, PESO_MIN_KG } from './peso';

describe('interpretarPeso — casos com resposta conhecida', () => {
  it.each([
    ['70', 70],
    ['72,5', 72.5],
    ['72.5', 72.5],
    [' 80 ', 80],
    ['65 kg', 65],
    ['65kg', 65],
    ['0,3', 0.3], // limite inferior (inclusive)
    ['300', 300], // limite superior (inclusive)
    ['3,25', 3.25],
  ])('"%s" → %d kg', (texto, esperado) => {
    expect(interpretarPeso(texto)).toEqual({ estado: 'valido', kg: esperado });
  });

  it.each(['', '   '])('"%s" → vazio', (texto) => {
    expect(interpretarPeso(texto)).toEqual({ estado: 'vazio' });
  });

  it.each([
    'abc',
    '7a',
    '-70', // negativo
    '72,5,3', // dois separadores
    '72.5.3',
    ',5',
    '70,',
    '1e2', // notação científica não é aceita
    '0',
    '0,29', // abaixo do mínimo
    '300,01', // acima do máximo
    '700',
  ])('"%s" → inválido', (texto) => {
    expect(interpretarPeso(texto).estado).toBe('invalido');
  });

  it('limites documentados', () => {
    expect(PESO_MIN_KG).toBe(0.3);
    expect(PESO_MAX_KG).toBe(300);
  });
});

describe('formatarPeso', () => {
  it('usa vírgula decimal e remove zeros desnecessários', () => {
    expect(formatarPeso(72.5)).toBe('72,5');
    expect(formatarPeso(70)).toBe('70');
    expect(formatarPeso(0.3)).toBe('0,3');
  });
});
