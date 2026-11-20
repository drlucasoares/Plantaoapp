import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { interpretarPeso, type ResultadoPeso } from '../lib/peso';

/**
 * Peso do paciente, compartilhado entre todas as páginas.
 *
 * PRIVACIDADE: o valor vive SOMENTE na memória (useState).
 * Nada de localStorage, sessionStorage, cookies, IndexedDB ou rede.
 * Ao fechar ou recarregar o app, o peso é apagado — de propósito.
 */

interface PesoContextValue {
  texto: string;
  setTexto: (t: string) => void;
  resultado: ResultadoPeso;
  /** Peso em kg se válido; caso contrário, null. Use isto nos cálculos. */
  pesoKg: number | null;
  limpar: () => void;
}

const PesoContext = createContext<PesoContextValue | null>(null);

export function PesoProvider({ children }: { children: ReactNode }) {
  const [texto, setTexto] = useState('');

  const value = useMemo<PesoContextValue>(() => {
    const resultado = interpretarPeso(texto);
    return {
      texto,
      setTexto,
      resultado,
      pesoKg: resultado.estado === 'valido' ? resultado.kg : null,
      limpar: () => setTexto(''),
    };
  }, [texto]);

  return <PesoContext.Provider value={value}>{children}</PesoContext.Provider>;
}

export function usePeso(): PesoContextValue {
  const ctx = useContext(PesoContext);
  if (!ctx) throw new Error('usePeso deve ser usado dentro de <PesoProvider>');
  return ctx;
}
