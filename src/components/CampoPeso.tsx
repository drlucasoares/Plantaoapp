import { usePeso } from '../state/PesoContext';
import { formatarPeso } from '../lib/peso';

export function CampoPeso() {
  const { texto, setTexto, resultado, limpar } = usePeso();
  const invalido = resultado.estado === 'invalido';

  return (
    <div className="campo-peso">
      <label htmlFor="peso" className="campo-peso__rotulo">
        Peso do paciente
      </label>
      <div className="campo-peso__linha">
        <input
          id="peso"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          enterKeyHint="done"
          placeholder="ex.: 72,5"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          aria-invalid={invalido}
          aria-describedby="peso-status"
          className={invalido ? 'invalido' : undefined}
        />
        <span className="campo-peso__unidade">kg</span>
        {texto !== '' && (
          <button type="button" className="campo-peso__limpar" onClick={limpar} aria-label="Limpar peso">
            ✕
          </button>
        )}
      </div>
      <p id="peso-status" className={`campo-peso__status ${invalido ? 'erro' : ''}`} role="status">
        {resultado.estado === 'vazio' && 'Informe o peso para os cálculos'}
        {resultado.estado === 'valido' && `Usando ${formatarPeso(resultado.kg)} kg · não é salvo`}
        {resultado.estado === 'invalido' && resultado.motivo}
      </p>
    </div>
  );
}
