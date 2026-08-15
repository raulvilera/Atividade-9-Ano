/**
 * AppScript para Atividade de Ciências - 9º Ano A
 * Integração com Google Forms e Sheets
 * Registra respostas dos alunos com formatação automática
 * Células vermelhas para respostas erradas, azuis para corretas
 */

const SHEET_ID = "1CcoSFYXaP-x7pHe7uyyodSeD5Xa4sSy173egGAAZsno";
const SHEET_NAME = "9°A(Evolução)";

// Gabarito das respostas corretas
const ANSWER_KEY = {
  1: 1,  // Especiação
  2: 1,  // Ancestralidade
  3: 2,  // Evidências fósseis
  4: 1,  // Evolução convergente/divergente
  5: 0,  // Seleção natural
  6: 0,  // Isolamento reprodutivo
  7: 1,  // Biodiversidade e evolução
};

// Aprendizagens Essenciais por questão
const ESSENTIAL_LEARNING = {
  1: "Especiação e isolamento reprodutivo",
  2: "Ancestralidade comum",
  3: "Evidências fósseis",
  4: "Evolução convergente e divergente",
  5: "Seleção natural",
  6: "Isolamento reprodutivo",
  7: "Biodiversidade e evolução",
  8: "Fósseis de transição",
  9: "Árvore filogenética",
  10: "Conservação da biodiversidade"
};

// Criar ou obter a planilha
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = null;
  
  try {
    sheet = spreadsheet.getSheetByName(SHEET_NAME);
  } catch (e) {
    // Criar nova aba se não existir
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    initializeHeaders(sheet);
  }
  
  return sheet;
}

// Inicializar cabeçalhos da planilha
function initializeHeaders(sheet) {
  const headers = [
    "DATA",
    "NOME",
    "RA",
    "DIG.",
    "E-MAIL",
    "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7",
    "Q8 (Dissertativa)", "Q9 (Dissertativa)", "Q10 (Dissertativa)",
    "ACERTOS",
    "ERROS",
    "APROVEITAMENTO (%)",
    "APRENDIZAGENS A REVISAR"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Formatar cabeçalho
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#1e40af");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(11);
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  headerRange.setWrap(true);
  
  // Definir largura das colunas
  sheet.setColumnWidth(1, 100);  // DATA
  sheet.setColumnWidth(2, 250);  // NOME
  sheet.setColumnWidth(3, 100);  // RA
  sheet.setColumnWidth(4, 80);   // DIG
  sheet.setColumnWidth(5, 200);  // EMAIL
  
  // Colunas de questões
  for (let i = 6; i <= 17; i++) {
    sheet.setColumnWidth(i, 80);
  }
  
  // Colunas finais
  sheet.setColumnWidth(18, 80);  // ACERTOS
  sheet.setColumnWidth(19, 80);  // ERROS
  sheet.setColumnWidth(20, 120); // APROVEITAMENTO
  sheet.setColumnWidth(21, 300); // APRENDIZAGENS A REVISAR
}

// Função principal - recebe POST da atividade
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const sheet = getOrCreateSheet();
    
    // Processar respostas
    const rowData = processStudentResponse(data);
    
    // Adicionar nova linha
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    
    sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
    
    // Aplicar formatação
    formatResponseRow(sheet, newRow, data);
    
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Respostas registradas com sucesso!" })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Processar respostas do estudante
function processStudentResponse(data) {
  const student = data.student;
  const answers = data.answers;
  const essays = data.essays;
  const timestamp = data.date || new Date().toLocaleDateString("pt-BR");
  
  const rowData = [
    timestamp,
    student.name,
    student.ra,
    student.dig,
    student.email
  ];
  
  let correctCount = 0;
  let wrongCount = 0;
  const essentialsToReview = new Set();
  
  // Processar questões de múltipla escolha (Q1-Q7)
  for (let q = 1; q <= 7; q++) {
    const studentAnswer = answers[q];
    const correctAnswer = ANSWER_KEY[q];
    
    if (studentAnswer !== undefined) {
      const isCorrect = studentAnswer === correctAnswer;
      
      // Converter para letra (A, B, C, D)
      const answerLetter = String.fromCharCode(65 + studentAnswer);
      rowData.push(answerLetter);
      
      if (isCorrect) {
        correctCount++;
      } else {
        wrongCount++;
        essentialsToReview.add(ESSENTIAL_LEARNING[q]);
      }
    } else {
      rowData.push("—");
      wrongCount++;
      essentialsToReview.add(ESSENTIAL_LEARNING[q]);
    }
  }
  
  // Processar questões dissertativas (Q8-Q10)
  for (let q = 8; q <= 10; q++) {
    const essayAnswer = essays[q] || "";
    
    // Verificar se há resposta
    if (essayAnswer.length > 0) {
      rowData.push(essayAnswer.substring(0, 100) + (essayAnswer.length > 100 ? "..." : ""));
    } else {
      rowData.push("—");
      essentialsToReview.add(ESSENTIAL_LEARNING[q]);
    }
  }
  
  // Cálculos finais
  const totalQuestions = 7; // Apenas múltipla escolha para cálculo
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  
  rowData.push(correctCount);
  rowData.push(wrongCount);
  rowData.push(percentage);
  rowData.push(Array.from(essentialsToReview).join(" • "));
  
  return rowData;
}

// Aplicar formatação na linha de resposta
function formatResponseRow(sheet, rowNumber, data) {
  const answers = data.answers;
  const essays = data.essays;
  
  // Formatar questões de múltipla escolha
  for (let q = 1; q <= 7; q++) {
    const colNumber = 5 + q; // Coluna da questão
    const cell = sheet.getRange(rowNumber, colNumber);
    
    const studentAnswer = answers[q];
    const correctAnswer = ANSWER_KEY[q];
    
    if (studentAnswer !== undefined) {
      const isCorrect = studentAnswer === correctAnswer;
      
      if (isCorrect) {
        // Verde para correto
        cell.setBackground("#dcfce7");
        cell.setFontColor("#166534");
        cell.setFontWeight("bold");
      } else {
        // Vermelho para errado
        cell.setBackground("#fee2e2");
        cell.setFontColor("#991b1b");
        cell.setFontWeight("bold");
      }
    }
  }
  
  // Formatar questões dissertativas (apenas verificar se respondidas)
  for (let q = 8; q <= 10; q++) {
    const colNumber = 5 + q;
    const cell = sheet.getRange(rowNumber, colNumber);
    
    const essayAnswer = essays[q];
    if (essayAnswer && essayAnswer.length > 0) {
      cell.setBackground("#dbeafe");
      cell.setFontColor("#1e40af");
    } else {
      cell.setBackground("#fee2e2");
      cell.setFontColor("#991b1b");
    }
  }
  
  // Formatar coluna de aproveitamento
  const percentCell = sheet.getRange(rowNumber, 20);
  const data_range = sheet.getRange(rowNumber, 1, 1, 20);
  data_range.setVerticalAlignment("middle");
  data_range.setFontSize(10);
}

// Função para teste manual
function testSubmission() {
  const testData = {
    student: {
      name: "ALICE CARVALHO",
      ra: "000114160176",
      dig: "X",
      email: "0000114160176XSP@al.educacao.sp.gov.br"
    },
    answers: {
      1: 1,
      2: 1,
      3: 1,  // Errado (deveria ser 2)
      4: 1,
      5: 0,
      6: 0,
      7: 1
    },
    essays: {
      8: "Fósseis de transição mostram características intermediárias entre dois grupos evolutivos.",
      9: "Um ponto de ramificação indica ancestralidade comum entre os grupos.",
      10: "Ações: reflorestamento e criação de áreas protegidas. A conservação preserva a biodiversidade necessária para evolução."
    },
    date: new Date().toLocaleDateString("pt-BR")
  };
  
  const rowData = processStudentResponse(testData);
  console.log("Dados processados:", rowData);
  
  const sheet = getOrCreateSheet();
  const lastRow = sheet.getLastRow();
  const newRow = lastRow + 1;
  
  sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
  formatResponseRow(sheet, newRow, testData);
  
  console.log("Dados inseridos na linha:", newRow);
}

// Função para listar todas as abas
function listSheets() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  const sheets = spreadsheet.getSheets();
  console.log("Abas disponíveis:");
  sheets.forEach(sheet => {
    console.log("- " + sheet.getName());
  });
}
