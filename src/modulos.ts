/** Lista dos módulos exibidos no menu inicial. A ordem aqui é a ordem na tela. */
export interface Modulo {
  slug: string;
  titulo: string;
  descricao: string;
  icone: string;
}

export const MODULOS: Modulo[] = [
  { slug: 'prescricoes', titulo: 'Prescrições', descricao: 'Modelos de prescrição', icone: '📝' },
  { slug: 'hidroeletroliticos', titulo: 'Distúrbios Hidroeletrolíticos', descricao: 'Na, K, Ca, Mg, P', icone: '💧' },
  { slug: 'ventilacao', titulo: 'Ventilação Mecânica', descricao: 'Parâmetros e ajustes', icone: '🫁' },
  { slug: 'escores', titulo: 'Escores', descricao: 'Calculadoras clínicas', icone: '📊' },
  { slug: 'drogas', titulo: 'Drogas', descricao: 'DVA, sedação, analgesia', icone: '💉' },
  { slug: 'equipamentos', titulo: 'Equipamentos', descricao: 'Bombas, monitores, VM', icone: '🩺' },
];
