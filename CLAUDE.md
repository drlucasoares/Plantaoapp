# Plantão — regras do projeto

Site/PWA de apoio ao plantão médico (PS, enfermaria, UTI), usado principalmente
no iPhone. O responsável é médico e leigo em programação: **explique cada mudança
em linguagem simples, em português**, e mostre o plano antes de mudanças grandes.

## Regras clínicas e de segurança (inegociáveis)

1. **Toda droga tem fonte e data de revisão.**
   Cada item em `src/data/**/*.json` precisa de `fonte`, `revisao.data` (AAAA-MM-DD,
   não futura) e `revisao.revisor`. O teste `src/data/dados.test.ts` bloqueia o
   deploy se faltar. Nunca invente doses: se não houver fonte, não inclua.
2. **Todo cálculo tem teste com caso de resposta conhecida.**
   Função de cálculo nova → arquivo `*.test.ts` ao lado, com pelo menos um caso
   cuja resposta venha de referência (livro, diretriz, bula), citada em comentário.
   Testar também os limites e entradas inválidas.
3. **Nenhum dado de paciente é armazenado.**
   Proibido no código do app: `localStorage`, `sessionStorage`, `indexedDB`,
   `document.cookie`, `caches.open`, envio para servidores/analytics. Dados do
   paciente (ex.: peso) ficam só na memória (React state) e somem ao fechar.
   O teste `src/privacidade.test.ts` verifica isso.
4. **Layout mobile-first.** CSS base para celular; `@media (min-width: …)` só para
   telas maiores. Áreas de toque ≥ 48px, campos com fonte ≥ 16px (evita zoom no
   iOS), respeitar `env(safe-area-inset-*)`, suportar modo claro e escuro.

## Convenções

- Textos da interface em português do Brasil; números com vírgula decimal na tela.
- Unidades sempre explícitas (mg, mcg/kg/min, mL/h…). Nunca mostrar número sem unidade.
- Dados clínicos ficam em JSON em `src/data/` (formato em `src/data/README.md`),
  nunca embutidos no código.
- Cálculos em funções puras em `src/lib/` (sem React), para serem testáveis.
- Peso do paciente: use `usePeso().pesoKg` (é `null` se vazio/inválido — trate isso).
- Rotas com `HashRouter` (`#/modulo`) por causa do GitHub Pages.
- Rodapé sempre lembra: ferramenta de apoio, não substitui o julgamento clínico.

## Antes de liberar qualquer código

```bash
npm test              # todos os testes passam
npm run contraprova   # defeitos propositais precisam ser detectados
npm run build         # checagem de tipos + build de produção
```

Ao criar cálculo/regra nova, **acrescente mutações em `scripts/contraprova.sh`**
que estraguem essa lógica e confirme que os testes as detectam.

## Estrutura

- `src/modulos.ts` — lista e ordem dos módulos do menu
- `src/pages/` — páginas; `src/components/` — peças reutilizáveis
- `src/state/PesoContext.tsx` — peso compartilhado (somente memória)
- `src/lib/` — lógica e cálculos puros + testes
- `src/data/` — dados clínicos em JSON + validador
- `public/` — ícones; `scripts/gerar-icones.mjs` regera os PNGs a partir do SVG
- `.github/workflows/deploy.yml` — testes + publicação no GitHub Pages a cada push na `main`
