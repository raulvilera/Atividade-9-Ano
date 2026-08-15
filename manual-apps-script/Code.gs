/**
 * Registro de Respostas — Evolução e Biodiversidade | 9º Ano A
 *
 * Este endpoint recebe o envio da atividade, escreve uma linha na aba
 * “9ºAno A (3ºBimestre)”, calcula o resultado e colore cada alternativa:
 * azul = correta; vermelho = incorreta; branco = não respondida.
 */

const SPREADSHEET_ID = "SUBSTITUA_PELO_ID_DA_SUA_PLANILHA";
const SHEET_NAME = "9ºAno A (3ºBimestre)";
const ANSWER_KEY = ["B", "C", "A", "D", "C", "B", "D", "A", "C", "B", "A", "D"];
const HEADERS = [
  "Data/Hora", "Nome do Aluno", "Nº de chamada", "Série", "RA", "Dígito RA", "E-mail institucional",
  "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Q12",
  "Acertos", "Nota (0-10)", "Situação", "Feedback",
];

/** Confirma que o endpoint foi publicado e identifica a aba configurada. */
function doGet() {
  return json_({
    ok: true,
    sheet: SHEET_NAME,
    message: "Endpoint de respostas disponível.",
  });
}

/**
 * Recebe um JSON no formato:
 * {
 *   submittedAt: "2026-...",
 *   student: { nome, numero, serie, ra, digito, email, situacao },
 *   answers: { q1: "A", ..., q12: "D" }
 * }
 */
function doPost(event) {
  try {
    const payload = parsePayload_(event);
    validatePayload_(payload);

    const student = payload.student;
    const answers = ANSWER_KEY.map((_, index) => normalizeAnswer_(payload.answers[`q${index + 1}`]));
    const score = answers.reduce((total, answer, index) => total + Number(answer === ANSWER_KEY[index]), 0);
    const grade = Math.round((score / ANSWER_KEY.length) * 100) / 10;
    const sheet = getSheet_();

    ensureHeaders_(sheet);
    const row = sheet.getLastRow() + 1;
    sheet.getRange(row, 1, 1, HEADERS.length).setValues([[
      new Date(),
      safeText_(student.nome),
      safeText_(student.numero),
      safeText_(student.serie),
      safeText_(student.ra),
      safeText_(student.digito),
      safeText_(student.email),
      ...answers,
      score,
      grade,
      safeText_(student.situacao),
      `Questões respondidas: ${answers.filter(Boolean).length}/${ANSWER_KEY.length}`,
    ]]);

    sheet.getRange(row, 1).setNumberFormat("dd/MM/yyyy HH:mm:ss");
    applyAnswerColours_(sheet, row, answers);

    return json_({ ok: true, row: row, score: score, grade: grade });
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

/** Executar manualmente apenas se desejar reaplicar as cores às linhas existentes. */
function formatExistingRows() {
  const sheet = getSheet_();
  ensureHeaders_(sheet);

  if (sheet.getLastRow() < 2) return;

  for (let row = 2; row <= sheet.getLastRow(); row += 1) {
    const answers = sheet.getRange(row, 8, 1, ANSWER_KEY.length).getDisplayValues()[0];
    applyAnswerColours_(sheet, row, answers);
  }
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  return sheet;
}

function ensureHeaders_(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setBackground("#193f42")
    .setFontColor("#fffdf7")
    .setFontWeight("bold")
    .setFontFamily("Arial")
    .setWrap(true)
    .setHorizontalAlignment("center");
  sheet.autoResizeColumns(1, HEADERS.length);
}

function applyAnswerColours_(sheet, row, answers) {
  const backgrounds = answers.map((answer, index) => {
    if (!answer) return "#ffffff";
    return answer === ANSWER_KEY[index] ? "#b8dcf0" : "#ffd5d0";
  });

  const fontColours = answers.map((answer, index) => {
    if (!answer) return "#173e3f";
    return answer === ANSWER_KEY[index] ? "#0f4963" : "#8b302d";
  });

  sheet.getRange(row, 8, 1, ANSWER_KEY.length)
    .setBackgrounds([backgrounds])
    .setFontColors([fontColours])
    .setFontWeight("bold")
    .setHorizontalAlignment("center");
}

function parsePayload_(event) {
  const raw = event && event.postData && event.postData.contents;
  if (!raw) throw new Error("Corpo da requisição ausente.");
  return JSON.parse(raw);
}

function validatePayload_(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Formato de envio inválido.");
  if (!payload.student || !safeText_(payload.student.nome)) throw new Error("Nome do aluno ausente.");
  if (!payload.answers || typeof payload.answers !== "object") throw new Error("Respostas ausentes.");
}

function normalizeAnswer_(value) {
  const answer = safeText_(value).toUpperCase();
  return ["A", "B", "C", "D"].includes(answer) ? answer : "";
}

function safeText_(value) {
  return String(value == null ? "" : value).trim().slice(0, 500);
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
