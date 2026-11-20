import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Inicio } from './pages/Inicio';
import { PaginaModulo } from './pages/PaginaModulo';
import { NaoEncontrada } from './pages/NaoEncontrada';
import { PesoProvider } from './state/PesoContext';
import { MODULOS } from './modulos';

/** Rotas internas do app. Separado de App para poder testar com outro roteador. */
export function Rotas() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        {MODULOS.map((m) => (
          <Route key={m.slug} path={m.slug} element={<PaginaModulo modulo={m} />} />
        ))}
        <Route path="*" element={<NaoEncontrada />} />
      </Route>
    </Routes>
  );
}

// HashRouter (endereços com "#/") porque o GitHub Pages não suporta
// rotas de aplicativo de página única sem esse recurso.
export default function App() {
  return (
    <PesoProvider>
      <HashRouter>
        <Rotas />
      </HashRouter>
    </PesoProvider>
  );
}
