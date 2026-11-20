import { Link, Outlet, useLocation } from 'react-router-dom';
import { CampoPeso } from './CampoPeso';
import { NOME_APP } from '../marca';

export function Layout() {
  const { pathname } = useLocation();
  const naInicial = pathname === '/';

  return (
    <div className="app">
      <header className="topo">
        <div className="topo__barra">
          {naInicial ? (
            <span className="topo__marca">✚ {NOME_APP}</span>
          ) : (
            <Link to="/" className="topo__voltar">
              ‹ Início
            </Link>
          )}
        </div>
        <CampoPeso />
      </header>
      <main className="conteudo">
        <Outlet />
      </main>
      <footer className="rodape">
        Ferramenta de apoio. Não substitui o julgamento clínico. Confira sempre doses e fontes.
      </footer>
    </div>
  );
}
