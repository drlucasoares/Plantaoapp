import { Link } from 'react-router-dom';

export function NaoEncontrada() {
  return (
    <section className="pagina">
      <h1>Página não encontrada</h1>
      <Link to="/" className="botao">
        Voltar ao início
      </Link>
    </section>
  );
}
