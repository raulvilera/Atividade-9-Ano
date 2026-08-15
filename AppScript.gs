/** Endpoint da atividade de Ciências – 9º Ano A. */
const SHEET_ID = "1CcoSFYXaP-x7pHe7uyyodSeD5Xa4sSy173egGAAZsno";
const SHEET_NAME = "9°A(Evolução)";
const CLASS_NAME = "9º Ano A";
const ANSWER_KEY = { 1: 1, 2: 1, 3: 2, 4: 1, 5: 0, 6: 0, 7: 1 };
const ESSENTIAL_LEARNING = {
  1: "Especiação e isolamento reprodutivo", 2: "Ancestralidade comum",
  3: "Evidências fósseis", 4: "Evolução convergente e divergente",
  5: "Seleção natural", 6: "Isolamento reprodutivo",
  7: "Biodiversidade e evolução", 8: "Fósseis de transição",
  9: "Árvore filogenética", 10: "Conservação da biodiversidade",
};
const HEADERS = [
  "Data/Hora", "Nome", "Nº", "Turma", "Data Ativ.",
  "Q1 (B)", "Q2 (B)", "Q3 (C)", "Q4 (B)", "Q5 (A)", "Q6 (A)", "Q7 (B)",
  "Q8 (disc.)", "Q9 (disc.)", "Q10 (disc.)", "Acertos", "Erros",
  "Aproveitamento", "Aprendizagens a revisar",
];

function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) initializeSheet(sheet);
  return sheet;
}

/** Execute uma vez no editor para criar e formatar a aba vazia. */
function setupSheet() {
  initializeSheet(getOrCreateSheet());
}

function initializeSheet(sheet) {
  sheet.clearFormats();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setBackground("#07513F").setFontColor("#FFFFFF").setFontWeight("bold")
    .setFontSize(10).setHorizontalAlignment("center").setVerticalAlignment("middle").setWrap(true);
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 52);
  [145, 260, 80, 120, 105].forEach((width, index) => sheet.setColumnWidth(index + 1, width));
  for (let column = 6; column <= 12; column++) sheet.setColumnWidth(column, 72);
  for (let column = 13; column <= 15; column++) sheet.setColumnWidth(column, 250);
  [70, 65, 110, 290].forEach((width, index) => sheet.setColumnWidth(index + 16, width));
}

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || "{}");
    validateSubmission(data);
    const sheet = getOrCreateSheet();
    const result = buildRow(data);
    const row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1, 1, result.values.length).setValues([result.values]);
    formatResponseRow(sheet, row, data);
    return jsonResponse({ success: true, message: "Respostas registradas.", row, correct: result.correct });
  } catch (error) {
    return jsonResponse({ success: false, message: String(error.message || error) });
  }
}

function doGet() {
  return jsonResponse({ success: true, service: "Atividade de Ciências 9º Ano A" });
}

function validateSubmission(data) {
  if (!data.student || !data.student.name) throw new Error("Estudante não informado.");
  if (!data.answers || !data.essays) throw new Error("Respostas incompletas.");
}

function buildRow(data) {
  const student = data.student;
  const answers = data.answers || {};
  const essays = data.essays || {};
  const review = new Set();
  let correct = 0;
  let wrong = 0;
  const values = [
    Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy, HH:mm:ss"),
    student.name, student.ra || "", CLASS_NAME, data.date || "",
  ];
  for (let question = 1; question <= 7; question++) {
    const answered = Object.prototype.hasOwnProperty.call(answers, question);
    const answer = Number(answers[question]);
    values.push(answered ? String.fromCharCode(65 + answer) : "—");
    if (answered && answer === ANSWER_KEY[question]) correct++;
    else { wrong++; review.add(ESSENTIAL_LEARNING[question]); }
  }
  for (let question = 8; question <= 10; question++) {
    const text = String(essays[question] || "").trim();
    values.push(text || "—");
    if (!text) review.add(ESSENTIAL_LEARNING[question]);
  }
  values.push(correct, wrong, Math.round((correct / 7) * 100) + "%", Array.from(review).join(" • "));
  return { values, correct };
}

function formatResponseRow(sheet, row, data) {
  sheet.getRange(row, 1, 1, HEADERS.length).setVerticalAlignment("middle").setFontSize(10).setWrap(true);
  sheet.setRowHeight(row, 46);
  for (let question = 1; question <= 7; question++) {
    const answered = Object.prototype.hasOwnProperty.call(data.answers, question);
    const correct = answered && Number(data.answers[question]) === ANSWER_KEY[question];
    sheet.getRange(row, question + 5)
      .setBackground(correct ? "#2E7DB5" : "#E74C3C")
      .setFontColor("#FFFFFF").setFontWeight("bold").setHorizontalAlignment("center");
  }
  for (let question = 8; question <= 10; question++) {
    const text = String(data.essays[question] || "").trim();
    sheet.getRange(row, question + 5)
      .setBackground(text ? "#EAF2F8" : "#FDEDEC").setFontColor("#1F2937");
  }
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
