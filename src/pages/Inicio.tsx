import { Link } from 'react-router-dom';
import { MODULOS } from '../modulos';

export function Inicio() {
  return (
    <nav aria-label="Módulos">
      <ul className="menu">
        {MODULOS.map((m) => (
          <li key={m.slug}>
            <Link to={`/${m.slug}`} className="menu__item">
              <span className="menu__icone" aria-hidden="true">
                {m.icone}
              </span>
              <span className="menu__texto">
                <span className="menu__titulo">{m.titulo}</span>
                <span className="menu__descricao">{m.descricao}</span>
              </span>
              <span className="menu__seta" aria-hidden="true">
                ›
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
