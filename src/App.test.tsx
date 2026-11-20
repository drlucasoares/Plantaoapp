import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Rotas } from './App';
import { PesoProvider } from './state/PesoContext';
import { MODULOS } from './modulos';

function montar(rota = '/') {
  return render(
    <PesoProvider>
      <MemoryRouter initialEntries={[rota]}>
        <Rotas />
      </MemoryRouter>
    </PesoProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('página inicial', () => {
  it('mostra os 6 módulos na ordem combinada', () => {
    montar();
    const links = screen.getAllByRole('link');
    expect(links.map((l) => l.querySelector('.menu__titulo')?.textContent)).toEqual([
      'Prescrições',
      'Distúrbios Hidroeletrolíticos',
      'Ventilação Mecânica',
      'Escores',
      'Drogas',
      'Equipamentos',
    ]);
  });

  it('cada módulo tem o endereço combinado', () => {
    montar();
    const hrefs = screen.getAllByRole('link').map((l) => l.getAttribute('href'));
    expect(hrefs).toEqual([
      '/prescricoes',
      '/hidroeletroliticos',
      '/ventilacao',
      '/escores',
      '/drogas',
      '/equipamentos',
    ]);
  });

  it.each(MODULOS.map((m) => [m.titulo, m.slug]))('abre a página "%s"', async (titulo) => {
    montar();
    await userEvent.click(screen.getByRole('link', { name: new RegExp(titulo) }));
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(titulo);
    expect(screen.getByText('Em construção.')).toBeInTheDocument();
  });

  it('rota desconhecida mostra "não encontrada"', () => {
    montar('/xyz');
    expect(screen.getByRole('heading', { name: /não encontrada/i })).toBeInTheDocument();
  });
});

describe('peso do paciente', () => {
  it('é compartilhado entre as páginas', async () => {
    const user = userEvent.setup();
    montar();
    await user.type(screen.getByLabelText('Peso do paciente'), '72,5');
    expect(screen.getByText(/Usando 72,5 kg/)).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /Drogas/ }));
    expect(screen.getByLabelText('Peso do paciente')).toHaveValue('72,5');
    expect(screen.getByText('72,5 kg', { selector: 'strong' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: /Início/ }));
    await user.click(screen.getByRole('link', { name: /Escores/ }));
    expect(screen.getByText('72,5 kg', { selector: 'strong' })).toBeInTheDocument();
  });

  it('mostra erro para peso fora da faixa e não o usa', async () => {
    const user = userEvent.setup();
    montar('/drogas');
    await user.type(screen.getByLabelText('Peso do paciente'), '700');
    expect(screen.getByLabelText('Peso do paciente')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText(/fora da faixa/)).toBeInTheDocument();
    expect(screen.getByText('não informado', { selector: 'strong' })).toBeInTheDocument();
  });

  it('botão limpar apaga o peso', async () => {
    const user = userEvent.setup();
    montar();
    await user.type(screen.getByLabelText('Peso do paciente'), '80');
    await user.click(screen.getByRole('button', { name: 'Limpar peso' }));
    expect(screen.getByLabelText('Peso do paciente')).toHaveValue('');
  });

  it('NÃO é salvo: some ao "reabrir" o app e nada vai para o armazenamento', async () => {
    const user = userEvent.setup();
    const { unmount } = montar();
    await user.type(screen.getByLabelText('Peso do paciente'), '72,5');
    unmount(); // simula fechar o app

    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
    expect(document.cookie).toBe('');

    montar(); // simula reabrir
    expect(screen.getByLabelText('Peso do paciente')).toHaveValue('');
  });
});
