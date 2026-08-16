/**
 * Registro de respostas — Evolução e Biodiversidade | 9º Ano A
 *
 * Cole este arquivo em Extensões > Apps Script, no projeto vinculado à planilha.
 * Depois execute setupWorkbook() uma vez, autorize o projeto e publique como
 * Aplicação Web executada como você, com acesso conforme a política da escola.
 */

const CONFIG = {
  spreadsheetId: "1CcoSFYXaP-x7pHe7uyyodSeD5Xa4sSy173egGAAZsno",
  responseSheet: "Respostas",
  dashboardSheet: "Dashboard",
  learningSheet: "Aprendizagens",
  className: "9º Ano A",
  activityName: "Ciências — 3º Bimestre",
  correctColor: "#b8dcf0",
  correctTextColor: "#0f4963",
  wrongColor: "#ffd5d0",
  wrongTextColor: "#8b302d",
  blankColor: "#ffffff",
  headerColor: "#193f42",
  accentColor: "#e06e46",
};

const ANSWER_KEY = {
  q1: "B", q2: "C", q3: "A", q4: "D", q5: "C", q6: "B",
  q7: "D", q8: "A", q9: "C", q10: "B", q11: "A", q12: "D",
};

const QUESTION_LEARNINGS = {
  q1: { code: "AE10.1", title: "Relacionar seleção natural e síntese evolutiva", essential: "Reconhecer que a seleção atua sobre variações herdáveis em populações." },
  q2: { code: "AE10.2", title: "Compreender o isolamento e a especiação", essential: "Relacionar isolamento geográfico, fluxo gênico reduzido e isolamento reprodutivo." },
  q3: { code: "AE10.3", title: "Interpretar mudanças de frequência", essential: "Analisar como o ambiente pode alterar o sucesso reprodutivo relativo entre variantes." },
  q4: { code: "AE10.4", title: "Ler relações de ancestralidade em cladogramas", essential: "Identificar ancestralidade comum relativa a partir dos nós de um cladograma." },
  q5: { code: "AE10.5", title: "Diferenciar evolução convergente e divergente", essential: "Relacionar origem evolutiva e função ao interpretar estruturas biológicas." },
  q6: { code: "AE10.6", title: "Reconhecer grupos monofiléticos", essential: "Identificar grupos que incluem um ancestral comum e todos os seus descendentes." },
  q7: { code: "AE10.7", title: "Compreender a construção histórica da ciência", essential: "Reconhecer que novas evidências podem ampliar, corrigir ou integrar explicações." },
  q8: { code: "AE10.8", title: "Interpretar fósseis e estruturas homólogas", essential: "Usar evidências fósseis e anatômicas para sustentar ancestralidade comum." },
  q9: { code: "AE10.9", title: "Interpretar evidências genéticas", essential: "Fazer inferências comparativas sem confundir semelhança genética com ancestralidade direta." },
  q10: { code: "AE10.10", title: "Relacionar variação, ambiente e biodiversidade", essential: "Explicar a evolução como resultado de processos populacionais ao longo das gerações." },
  q11: { code: "AE10.11", title: "Relacionar isolamento à formação de espécies", essential: "Explicar como o isolamento pode reduzir o fluxo gênico e favorecer a especiação." },
  q12: { code: "AE10.12", title: "Relacionar divergência evolutiva e biodiversidade", essential: "Compreender como trajetórias distintas podem originar novas linhagens e modos de vida." },
};

const QUESTION_IDS = Object.keys(ANSWER_KEY);
const ANSWER_HEADERS = QUESTION_IDS;
const STATUS_HEADERS = QUESTION_IDS.map((id) => `${id.toUpperCase()} — status`);
const LEARNING_HEADERS = QUESTION_IDS.map((id) => `${id.toUpperCase()} — aprendizagem`);
const HEADERS = [
  "ID do envio", "Data/Hora", "Nome do aluno", "Nº de chamada", "Série", "RA", "Dígito RA", "E-mail institucional", "Situação",
  ...ANSWER_HEADERS, ...STATUS_HEADERS, ...LEARNING_HEADERS,
  "Acertos", "Total", "Nota (0–10)", "Percentual", "Aprendizagens atingidas", "Aprendizagens essenciais não atingidas", "Observações",
];

function doGet() {
  return json_({ ok: true, message: "Endpoint de respostas disponível.", activity: CONFIG.activityName, sheet: CONFIG.responseSheet });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const payload = parsePayload_(event);
    validatePayload_(payload);
    const result = registerSubmission_(payload);
    return json_({ ok: true, ...result });
  } catch (error) {
    return json_({ ok: false, error: errorMessage_(error) });
  } finally {
    lock.releaseLock();
  }
}

/** Execute uma vez depois de colar o script. Cria abas, cabeçalhos, filtros e dashboard. */
function setupWorkbook() {
  const book = getBook_();
  const responseSheet = getOrCreateSheet_(book, CONFIG.responseSheet);
  ensureResponseSheet_(responseSheet);
  const learningSheet = getOrCreateSheet_(book, CONFIG.learningSheet);
  ensureLearningSheet_(learningSheet);
  const dashboardSheet = getOrCreateSheet_(book, CONFIG.dashboardSheet);
  ensureDashboardSheet_(dashboardSheet);
  refreshDashboard_();
  book.setActiveSheet(dashboardSheet);
  SpreadsheetApp.getUi().alert("Configuração concluída. As abas Respostas, Aprendizagens e Dashboard estão prontas.");
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Atividade de Ciências")
    .addItem("Configurar planilha", "setupWorkbook")
    .addItem("Atualizar dashboard", "refreshDashboard_")
    .addItem("Reaplicar cores e correções", "formatExistingRows")
    .addItem("Limpar filtro do dashboard", "clearDashboardFilter_")
    .addToUi();
}

/** Atualiza o painel ao trocar o aluno na célula B2 do Dashboard. */
function onEdit(event) {
  if (!event || !event.range) return;
  const sheet = event.range.getSheet();
  if (sheet.getName() !== CONFIG.dashboardSheet) return;
  if (event.range.getA1Notation() === "B2") refreshDashboard_();
}

function registerSubmission_(payload) {
  const book = getBook_();
  const sheet = getOrCreateSheet_(book, CONFIG.responseSheet);
  ensureResponseSheet_(sheet);
  const student = payload.student;
  const answers = QUESTION_IDS.map((id) => normalizeAnswer_(payload.answers[id]));
  const statuses = answers.map((answer, index) => {
    const id = QUESTION_IDS[index];
    if (!answer) return "Não respondida";
    return answer === ANSWER_KEY[id] ? "Correta" : "Incorreta";
  });
  const learningResults = statuses.map((status, index) => status === "Correta" ? "Atingida" : "Não atingida");
  const correctCount = statuses.filter((status) => status === "Correta").length;
  const total = QUESTION_IDS.length;
  const grade = Math.round((correctCount / total) * 100) / 10;
  const percent = Math.round((correctCount / total) * 10000) / 100;
  const attained = QUESTION_IDS.filter((id, index) => learningResults[index] === "Atingida").map((id) => `${QUESTION_LEARNINGS[id].code} — ${QUESTION_LEARNINGS[id].title}`);
  const notAttained = QUESTION_IDS.filter((id, index) => learningResults[index] !== "Atingida").map((id) => `${QUESTION_LEARNINGS[id].code} — ${QUESTION_LEARNINGS[id].title}`);
  const id = Utilities.getUuid();
  const row = sheet.getLastRow() + 1;
  const values = [[
    id, new Date(), safeText_(student.nome), safeText_(student.numero), safeText_(student.serie || CONFIG.className),
    safeText_(student.ra), safeText_(student.digito), safeText_(student.email), safeText_(student.situacao),
    ...answers, ...statuses, ...learningResults, correctCount, total, grade, percent / 100,
    attained.join("\n"), notAttained.join("\n"), safeText_(payload.observacoes),
  ]];
  sheet.getRange(row, 1, 1, HEADERS.length).setValues(values);
  sheet.getRange(row, 2).setNumberFormat("dd/MM/yyyy HH:mm:ss");
  sheet.getRange(row, 48).setNumberFormat("0.0");
  sheet.getRange(row, 49).setNumberFormat("0.00%");
  applyAnswerColours_(sheet, row, answers, statuses);
  applyLearningColours_(sheet, row, learningResults);
  refreshDashboard_();
  return { submissionId: id, row: row, score: correctCount, total: total, grade: grade, percent: percent };
}

function ensureResponseSheet_(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setBackground(CONFIG.headerColor).setFontColor("#fffdf7").setFontWeight("bold").setWrap(true).setHorizontalAlignment("center");
  if (sheet.getFilter()) sheet.getFilter().remove();
  sheet.getRange(1, 1, Math.max(2, sheet.getMaxRows()), HEADERS.length).createFilter();
  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 145);
  sheet.setColumnWidth(3, 230);
  sheet.setColumnWidth(8, 280);
  for (let col = 10; col < 10 + QUESTION_IDS.length; col += 1) sheet.setColumnWidth(col, 62);
  for (let col = 10 + QUESTION_IDS.length; col < 10 + QUESTION_IDS.length * 2; col += 1) sheet.setColumnWidth(col, 95);
  for (let col = 10 + QUESTION_IDS.length * 2; col < HEADERS.length; col += 1) sheet.setColumnWidth(col, 180);
}

function ensureLearningSheet_(sheet) {
  const headers = ["Questão", "Código", "Aprendizagem essencial", "Alternativa correta"];
  const rows = QUESTION_IDS.map((id) => [id.toUpperCase(), QUESTION_LEARNINGS[id].code, QUESTION_LEARNINGS[id].essential, ANSWER_KEY[id]]);
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setBackground(CONFIG.headerColor).setFontColor("#fffdf7").setFontWeight("bold");
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 90); sheet.setColumnWidth(2, 110); sheet.setColumnWidth(3, 560); sheet.setColumnWidth(4, 150);
  sheet.getRange(2, 4, rows.length, 1).setBackground(CONFIG.correctColor).setFontColor(CONFIG.correctTextColor).setFontWeight("bold").setHorizontalAlignment("center");
}

function ensureDashboardSheet_(sheet) {
  sheet.clear();
  sheet.getCharts().forEach((chart) => sheet.removeChart(chart));
  sheet.getRange("A1:H1").merge().setValue(`${CONFIG.activityName} — Dashboard de resultados`).setBackground(CONFIG.headerColor).setFontColor("#fffdf7").setFontWeight("bold").setFontSize(16);
  sheet.getRange("A2").setValue("Aluno selecionado").setFontWeight("bold");
  sheet.getRange("B2").setValue("Todos").setBackground("#fff7e8").setFontWeight("bold");
  sheet.getRange("A4:B9").setValues([["Nome", ""], ["RA", ""], ["Série", ""], ["Acertos", ""], ["Nota", ""], ["Percentual", ""]]);
  sheet.getRange("A4:A9").setFontWeight("bold").setBackground("#e7f0eb");
  sheet.getRange("D4:H4").setValues([["Questão", "Resposta", "Gabarito", "Resultado", "Aprendizagem"]]).setBackground(CONFIG.headerColor).setFontColor("#fffdf7").setFontWeight("bold");
  sheet.getRange("A12:H12").merge().setValue("Aprendizagens atingidas").setBackground(CONFIG.correctColor).setFontColor(CONFIG.correctTextColor).setFontWeight("bold");
  sheet.getRange("A13:H13").merge().setValue("Selecione um aluno em B2 para visualizar os resultados discriminados.");
  sheet.getRange("A15:H15").merge().setValue("Aprendizagens essenciais não atingidas").setBackground(CONFIG.wrongColor).setFontColor(CONFIG.wrongTextColor).setFontWeight("bold");
  sheet.getRange("A16:H16").merge().setValue("Selecione um aluno em B2 para visualizar os objetivos que precisam ser retomados.");
  sheet.setFrozenRows(3);
  sheet.setColumnWidth(1, 180); sheet.setColumnWidth(2, 260); sheet.setColumnWidth(3, 110); sheet.setColumnWidth(4, 100); sheet.setColumnWidth(5, 110); sheet.setColumnWidth(6, 110); sheet.setColumnWidth(7, 110); sheet.setColumnWidth(8, 350);
}

function refreshDashboard_() {
  const book = getBook_();
  const responseSheet = book.getSheetByName(CONFIG.responseSheet);
  const dashboard = getOrCreateSheet_(book, CONFIG.dashboardSheet);
  if (!responseSheet) return;
  ensureDashboardSheetIfMissing_(dashboard);
  const rows = getResponseRows_(responseSheet);
  const names = ["Todos"].concat([...new Set(rows.map((row) => row[2]).filter(Boolean))].sort());
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(names, true).setAllowInvalid(false).build();
  dashboard.getRange("B2").setDataValidation(rule);
  const selected = dashboard.getRange("B2").getDisplayValue() || "Todos";
  const current = selected === "Todos" ? rows[rows.length - 1] : [...rows].reverse().find((row) => row[2] === selected);
  dashboard.getRange("A4:B9").clearContent();
  dashboard.getRange("D5:H40").clearContent().clearFormat();
  dashboard.getRange("A12:H13").clearContent();
  dashboard.getRange("A15:H16").clearContent();
  if (!current) {
    dashboard.getRange("A4:B9").setValues([["Nome", ""], ["RA", ""], ["Série", ""], ["Acertos", ""], ["Nota", ""], ["Percentual", ""]]);
    dashboard.getRange("A13").setValue("Nenhum envio encontrado para o filtro selecionado.");
    return;
  }
  const answerStart = 9;
  const statusStart = answerStart + QUESTION_IDS.length;
  const learningStart = statusStart + QUESTION_IDS.length;
  const summaryStart = answerStart + QUESTION_IDS.length * 3;
  dashboard.getRange("A4:B9").setValues([["Nome", current[2]], ["RA", current[5]], ["Série", current[4]], ["Acertos", current[summaryStart]], ["Nota", current[summaryStart + 2]], ["Percentual", current[summaryStart + 3]]]);
  dashboard.getRange("B8").setNumberFormat("0.0"); dashboard.getRange("B9").setNumberFormat("0.00%");
  const detail = QUESTION_IDS.map((id, index) => [id.toUpperCase(), current[answerStart + index] || "—", ANSWER_KEY[id], current[statusStart + index], QUESTION_LEARNINGS[id].title]);
  dashboard.getRange(5, 4, detail.length, 5).setValues(detail).setWrap(true);
  detail.forEach((item, index) => {
    const target = dashboard.getRange(5 + index, 4, 1, 5);
    target.setBackground(item[3] === "Correta" ? CONFIG.correctColor : item[3] === "Não respondida" ? CONFIG.blankColor : CONFIG.wrongColor);
    target.setFontColor(item[3] === "Correta" ? CONFIG.correctTextColor : item[3] === "Incorreta" ? CONFIG.wrongTextColor : "#173e3f");
  });
  const attainedText = QUESTION_IDS.filter((id, index) => current[learningStart + index] === "Atingida").map((id) => `${QUESTION_LEARNINGS[id].code} — ${QUESTION_LEARNINGS[id].title}`);
  const notAttainedText = QUESTION_IDS.filter((id, index) => current[learningStart + index] !== "Atingida").map((id) => `${QUESTION_LEARNINGS[id].code} — ${QUESTION_LEARNINGS[id].title}`);
  dashboard.getRange("A12").setValue("Aprendizagens atingidas"); dashboard.getRange("A13").setValue(attainedText.length ? attainedText.join("\n") : "Nenhuma aprendizagem marcada como atingida neste envio.");
  dashboard.getRange("A15").setValue("Aprendizagens essenciais não atingidas"); dashboard.getRange("A16").setValue(notAttainedText.length ? notAttainedText.join("\n") : "Todas as aprendizagens foram atingidas neste envio.");
  dashboard.getRange("A13:H13").merge(); dashboard.getRange("A16:H16").merge(); dashboard.getRange("A13:H16").setWrap(true);
  dashboard.getRange("A13:H13").setBackground("#f1f8f3"); dashboard.getRange("A16:H16").setBackground("#fff2f0");
}

function ensureDashboardSheetIfMissing_(sheet) {
  if (sheet.getRange("A1").getDisplayValue() !== `${CONFIG.activityName} — Dashboard de resultados`) ensureDashboardSheet_(sheet);
}

function clearDashboardFilter_() {
  const sheet = getBook_().getSheetByName(CONFIG.dashboardSheet);
  if (sheet) { sheet.getRange("B2").setValue("Todos"); refreshDashboard_(); }
}

function formatExistingRows() {
  const sheet = getBook_().getSheetByName(CONFIG.responseSheet);
  if (!sheet || sheet.getLastRow() < 2) return;
  const answerStart = 10;
  const statusStart = answerStart + QUESTION_IDS.length;
  for (let row = 2; row <= sheet.getLastRow(); row += 1) {
    const answers = sheet.getRange(row, answerStart, 1, QUESTION_IDS.length).getDisplayValues()[0];
    const statuses = answers.map((answer, index) => answer ? (answer === ANSWER_KEY[QUESTION_IDS[index]] ? "Correta" : "Incorreta") : "Não respondida");
    sheet.getRange(row, statusStart, 1, QUESTION_IDS.length).setValues([statuses]);
    applyAnswerColours_(sheet, row, answers, statuses);
    sheet.getRange(row, statusStart + QUESTION_IDS.length, 1, QUESTION_IDS.length).setValues([statuses.map((status) => status === "Correta" ? "Atingida" : "Não atingida")]);
  }
  refreshDashboard_();
}

function applyAnswerColours_(sheet, row, answers, statuses) {
  const backgrounds = answers.map((answer, index) => !answer ? CONFIG.blankColor : statuses[index] === "Correta" ? CONFIG.correctColor : CONFIG.wrongColor);
  const fonts = answers.map((answer, index) => !answer ? "#173e3f" : statuses[index] === "Correta" ? CONFIG.correctTextColor : CONFIG.wrongTextColor);
  sheet.getRange(row, 10, 1, QUESTION_IDS.length).setBackgrounds([backgrounds]).setFontColors([fonts]).setFontWeight("bold").setHorizontalAlignment("center");
}

function applyLearningColours_(sheet, row, results) {
  const backgrounds = results.map((result) => result === "Atingida" ? "#e7f0eb" : "#fff2f0");
  const fonts = results.map((result) => result === "Atingida" ? CONFIG.correctTextColor : CONFIG.wrongTextColor);
  sheet.getRange(row, 10 + QUESTION_IDS.length * 2, 1, QUESTION_IDS.length).setBackgrounds([backgrounds]).setFontColors([fonts]).setFontWeight("bold").setHorizontalAlignment("center");
}

function getResponseRows_(sheet) {
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
}

function getBook_() { return SpreadsheetApp.openById(CONFIG.spreadsheetId); }
function getOrCreateSheet_(book, name) { return book.getSheetByName(name) || book.insertSheet(name); }
function parsePayload_(event) { const raw = event && event.postData && event.postData.contents; if (!raw) throw new Error("Corpo da requisição ausente."); return JSON.parse(raw); }
function validatePayload_(payload) { if (!payload || typeof payload !== "object") throw new Error("Formato inválido."); if (!payload.student || !safeText_(payload.student.nome)) throw new Error("Nome do aluno ausente."); if (!payload.answers || typeof payload.answers !== "object") throw new Error("Respostas ausentes."); }
function normalizeAnswer_(value) { const answer = safeText_(value).toUpperCase(); return ["A", "B", "C", "D"].includes(answer) ? answer : ""; }
function safeText_(value) { return String(value == null ? "" : value).trim().slice(0, 1000); }
function errorMessage_(error) { return String(error && error.message ? error.message : error); }
function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
