#!/bin/bash
# Uso: npm run contraprova
# Para cada defeito: o teste PRECISA falhar. Se algum "NÃO DETECTADO" aparecer,
# os testes estão fracos e devem ser reforçados antes de liberar o código.
# Aplica um defeito proposital, roda os testes e confere que FALHAM. Depois restaura.
cd "$(dirname "$0")/.."
LOG=$(mktemp)
total=0; pegos=0
mutar() { # descricao arquivo python-replace-old python-replace-new
  desc="$1"; f="$2"; old="$3"; new="$4"; total=$((total+1))
  cp "$f" "$f.bak"
  python3 -c "import sys;p,o,n=sys.argv[1:];s=open(p).read();assert o in s,'trecho nao encontrado';open(p,'w').write(s.replace(o,n,1))" "$f" "$old" "$new" || { echo "ERRO ao aplicar: $desc"; mv "$f.bak" "$f"; return; }
  if npx vitest run >$LOG 2>&1; then
    echo "❌ NÃO DETECTADO: $desc"
  else
    pegos=$((pegos+1)); n=$(grep -oE 'Tests +[0-9]+ failed' $LOG)
    echo "✅ detectado ($n): $desc"
  fi
  mv "$f.bak" "$f"
}
mutar "limite máximo de peso 300 → 3000 kg" src/lib/peso.ts "PESO_MAX_KG = 300" "PESO_MAX_KG = 3000"
mutar "limite mínimo de peso 0,3 → 0 kg" src/lib/peso.ts "PESO_MIN_KG = 0.3" "PESO_MIN_KG = 0"
mutar "vírgula decimal não convertida (72,5 vira NaN)" src/lib/peso.ts "limpo.replace(',', '.')" "limpo"
mutar "limite superior deixa de ser inclusivo" src/lib/peso.ts "kg > PESO_MAX_KG" "kg >= PESO_MAX_KG"
mutar "aceita qualquer texto como número" src/lib/peso.ts "if (!/^\d+([.,]\d+)?\$/.test(limpo))" "if (false)"
mutar "peso gravado no localStorage" src/state/PesoContext.tsx "const [texto, setTexto] = useState('');" "const [texto, setTexto] = useState(localStorage.getItem('p') ?? ''); localStorage.setItem('p', texto);"
mutar "peso gravado em cookie" src/components/CampoPeso.tsx "onChange={(e) => setTexto(e.target.value)}" "onChange={(e) => { document.cookie = 'p=' + e.target.value; setTexto(e.target.value); }}"
mutar "peso NÃO compartilhado (cada página com o seu)" src/components/Layout.tsx "import { CampoPeso } from './CampoPeso';" "import { CampoPeso as C0 } from './CampoPeso'; import { PesoProvider } from '../state/PesoContext'; const CampoPeso = () => <PesoProvider><C0 /></PesoProvider>;"
mutar "peso inválido usado nos cálculos" src/state/PesoContext.tsx "pesoKg: resultado.estado === 'valido' ? resultado.kg : null" "pesoKg: Number(texto.replace(',', '.')) || null"
mutar "botão limpar não limpa" src/state/PesoContext.tsx "limpar: () => setTexto('')" "limpar: () => {}"
mutar "módulo Escores removido do menu" src/modulos.ts "  { slug: 'escores'" "  // { slug: 'escores'"
mutar "endereço de módulo alterado" src/modulos.ts "{ slug: 'prescricoes'" "{ slug: 'prescricao'"
mutar "ordem dos módulos trocada (Drogas antes de Escores)" src/modulos.ts "export const MODULOS: Modulo[] = [" "export const MODULOS: Modulo[] = [{ slug: 'drogas', titulo: 'Drogas', descricao: '', icone: '' },"
mutar "droga de exemplo SEM fonte" src/data/drogas.exemplo.json '"fonte": "Refer' '"fonte_x": "Refer'
mutar "droga de exemplo com data de revisão inválida" src/data/drogas.exemplo.json '"data": "2026-11-20"' '"data": "20/11/2026"'
mutar "droga de exemplo sem revisor" src/data/drogas.exemplo.json '"revisor": "Nome' '"revisorX": "Nome'
mutar "validador não checa fonte" src/data/validarDroga.ts "if (!textoPreenchido(d.fonte))" "if (false)"
mutar "validador aceita data no futuro" src/data/validarDroga.ts "> hoje.getTime()" "> Infinity"
mutar "validador aceita 30 de fevereiro" src/data/validarDroga.ts "return data.getUTCFullYear() === a" "return true || data.getUTCFullYear() === a"
mutar "validador aceita dose mínima > máxima" src/data/validarDroga.ts "|| dose.minima > dose.maxima" ""
echo; echo "RESULTADO: $pegos de $total defeitos detectados"
rm -f "$LOG"
[ "$pegos" -eq "$total" ] || exit 1
