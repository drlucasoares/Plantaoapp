# Dados clínicos (`/src/data`)

Aqui ficam os dados clínicos do app, em arquivos **JSON** (texto estruturado).
O código lê esses arquivos; para atualizar uma dose, edita-se o JSON — não o código.

## Formato de uma droga

Veja `drogas.exemplo.json` (dados **fictícios**, só para mostrar o formato).

| Campo | Obrigatório | Exemplo |
|---|---|---|
| `id` | sim | `"noradrenalina"` (minúsculas, sem acento) |
| `nome` | sim | `"Noradrenalina"` |
| `apresentacao` | não | `"Ampola 4 mg/4 mL"` |
| `diluicao_padrao` | não | descrição + concentração final + unidade |
| `dose.minima` / `dose.maxima` / `dose.unidade` | se houver `dose` | `0.05`, `1`, `"mcg/kg/min"` |
| `fonte` | **sim** | referência bibliográfica completa |
| `revisao.data` | **sim** | `"2026-11-20"` (AAAA-MM-DD) |
| `revisao.revisor` | **sim** | nome do médico que revisou |

> Números usam **ponto** como decimal no JSON (`0.05`, não `0,05`).

## Garantia automática

O teste `src/data/dados.test.ts` lê **todos** os arquivos `.json` desta pasta e
recusa qualquer droga sem `fonte`, sem `revisao.data` válida ou sem `revisor`.
Se falhar, o site **não é publicado**.
