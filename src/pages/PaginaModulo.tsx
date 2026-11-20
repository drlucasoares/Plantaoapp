import { Link } from 'react-router-dom';
import type { Modulo } from '../modulos';
import { usePeso } from '../state/PesoContext';
import { formatarPeso } from '../lib/peso';

/** Página provisória de cada módulo — será substituída pelo conteúdo real. */
export function PaginaModulo({ modulo }: { modulo: Modulo }) {
  const { pesoKg } = usePeso();

  return (
    <section className="pagina">
      <h1>
        <span aria-hidden="true">{modulo.icone} </span>
        {modulo.titulo}
      </h1>
      <p className="pagina__aviso">Em construção.</p>
      <p className="pagina__peso">
        Peso em uso: <strong>{pesoKg === null ? 'não informado' : `${formatarPeso(pesoKg)} kg`}</strong>
      </p>
      <Link to="/" className="botao">
        Voltar ao início
      </Link>
    </section>
  );
}
