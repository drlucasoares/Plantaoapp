import { describe, expect, it } from 'vitest';
import { calcularBase } from './base';

describe('calcularBase', () => {
  it.each([
    [undefined, '/'], // computador local
    ['', '/'], // repositório drlucasoares.github.io (endereço raiz)
    ['  ', '/'],
    ['/', '/'],
    ['/Plantaoapp', '/Plantaoapp/'], // repositório de projeto
    ['/Plantaoapp/', '/Plantaoapp/'],
    ['Plantaoapp', '/Plantaoapp/'],
  ])('%j → %j', (entrada, esperado) => {
    expect(calcularBase(entrada)).toBe(esperado);
  });
});
