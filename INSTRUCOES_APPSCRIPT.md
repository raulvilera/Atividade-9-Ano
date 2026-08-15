# 📋 Instruções de Instalação - AppScript Google Sheets

## 🎯 Objetivo
Integrar a atividade de ciências com Google Sheets para registrar automaticamente as respostas dos alunos com formatação de cores (verde = correto, vermelho = errado).

---

## 📝 PASSO 1: Acessar Google Apps Script

1. **Abra a planilha Google Sheets:**
   - Acesse: https://docs.google.com/spreadsheets/d/1CcoSFYXaP-x7pHe7uyyodSeD5Xa4sSy173egGAAZsno

2. **Crie um AppScript:**
   - Clique em **Extensões** (no menu superior)
   - Selecione **Apps Script**
   - Uma nova aba será aberta no Google Apps Script

---

## ✍️ PASSO 2: Adicionar o Código AppScript

1. **Na janela do Apps Script:**
   - Limpe o conteúdo padrão do arquivo `Code.gs`
   - **Cole o conteúdo completo** do arquivo `AppScript.gs` que foi fornecido

2. **Salve o projeto:**
   - Pressione **Ctrl+S** (ou Cmd+S no Mac)
   - Dê um nome ao projeto: **"Atividade Ciências 9A"**

---

## 🚀 PASSO 3: Implantar como API Web

1. **Clique em "Implantar"** (botão azul no canto superior direito)

2. **Selecione "Novo Deploy":**
   - Tipo de implementação: **API Web**
   - Executar como: **[Seu e-mail da escola]**
   - Quem tem acesso: **Qualquer pessoa**

3. **Copie a URL de Implantação:**
   - Após a implantação, você receberá uma URL como:
   ```
   https://script.google.com/macros/d/[SCRIPT_ID]/usercallback
   ```

---

## 🔗 PASSO 4: Atualizar a URL no Código da Atividade

1. **No arquivo `Home.tsx` da atividade:**
   - Procure pela linha: `const GOOGLE_APPS_SCRIPT_URL = "..."`
   - **Substitua** pela URL que você copiou

2. **Exemplo:**
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/d/AKfycbxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx/usercallback";
   ```

---

## ✅ PASSO 5: Testar o AppScript

1. **Na aba do Apps Script:**
   - Clique na função **`testSubmission()`**
   - Clique no ícone de play (▶) para executar

2. **Verifique a planilha:**
   - Volte para Google Sheets
   - Abra a aba **"9°A(Evolução)"**
   - Você deve ver uma linha de teste com:
     - ✅ Respostas corretas em **VERDE**
     - ❌ Respostas erradas em **VERMELHO**
     - Aprendizagens a revisar listadas na última coluna

---

## 🎓 ESTRUTURA DA PLANILHA

A planilha será criada automaticamente com as seguintes colunas:

| Coluna | Conteúdo |
|--------|----------|
| A | DATA |
| B | NOME DO ALUNO |
| C | RA (Registro de Aluno) |
| D | DIG. (Dígito) |
| E | E-MAIL |
| F-L | Q1 a Q7 (Múltipla Escolha) |
| M | Q8 - Dissertativa |
| N | Q9 - Dissertativa |
| O | Q10 - Dissertativa |
| P | ACERTOS |
| Q | ERROS |
| R | APROVEITAMENTO (%) |
| S | APRENDIZAGENS A REVISAR |

---

## 🎨 FORMATAÇÃO AUTOMÁTICA

- **CÉLULAS VERDES** 🟢: Resposta correta
- **CÉLULAS VERMELHAS** 🔴: Resposta errada
- **CABEÇALHO AZUL** 🔵: Formatação automática
- **ÚLTIMA COLUNA**: Mostra quais Aprendizagens Essenciais devem ser revisadas

---

## 🔄 FLUXO DE FUNCIONAMENTO

1. Aluno acessa a atividade online
2. Responde todas as 10 questões
3. Clica em **"Enviar Respostas"**
4. Os dados são enviados para o AppScript
5. AppScript processa as respostas:
   - Compara com o gabarito
   - Calcula acertos/erros
   - Identifica aprendizagens a revisar
6. Registra na planilha com formatação automática

---

## ⚙️ GABARITO (Pode ser alterado)

O gabarito está definido no AppScript:

```javascript
const ANSWER_KEY = {
  1: 1,  // Especiação
  2: 1,  // Ancestralidade
  3: 2,  // Evidências fósseis
  4: 1,  // Evolução convergente/divergente
  5: 0,  // Seleção natural
  6: 0,  // Isolamento reprodutivo
  7: 1,  // Biodiversidade e evolução
};
```

Se precisar alterar o gabarito, edite esses valores (0=A, 1=B, 2=C, 3=D)

---

## 🆘 POSSÍVEIS PROBLEMAS

### ❌ "Erro de CORS" ou "Erro ao enviar"
**Solução:** Verifique se a URL do AppScript está correta e se você copiou a URL completa

### ❌ "Planilha não encontrada"
**Solução:** Certifique-se de que o ID da planilha está correto no AppScript (variável `SHEET_ID`)

### ❌ "Aba '9°A(Evolução)' não criada"
**Solução:** Edite manualmente para remover caracteres especiais ou execute `testSubmission()` para criar

---

## 📊 ANÁLISE DOS RESULTADOS

Após receber várias respostas, você pode:

1. **Filtrar por aproveitamento** (coluna R)
2. **Ver aprendizagens críticas** (coluna S)
3. **Planejar aulas de revisão** baseado nos dados
4. **Acompanhar evolução** comparando registros anteriores

---

## 📞 SUPORTE

Para dúvidas sobre:
- **Código da Atividade**: Verifique `Home.tsx`
- **Formatação CSS**: Consulte `index.css`
- **AppScript**: Verifique `AppScript.gs`
- **Google Sheets API**: Acesse https://developers.google.com/sheets

---

**✅ Pronto!** Sua atividade está integrada com Google Sheets!
