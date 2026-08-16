/**
 * ATIVIDADE DE CIÊNCIAS — 3º BIMESTRE | 9º ANO A
 * Integração Google Sheets: recebimento, correção, cores, aprendizagens e dashboard.
 * Cole em Extensões > Apps Script; execute setupWorkbook(); depois publique como Aplicação Web.
 */

const CONFIG = {
  spreadsheetId: "1CcoSFYXaP-x7pHe7uyyodSeD5Xa4sSy173egGAAZsno",
  responseSheet: "Respostas",
  learningSheet: "Aprendizagens",
  dashboardSheet: "Dashboard",
  className: "9º Ano A",
  activityName: "Ciências — 3º Bimestre",
  correctColor: "#b8dcf0",
  correctTextColor: "#0f4963",
  wrongColor: "#ffd5d0",
  wrongTextColor: "#8b302d",
  essayColor: "#fff1c7",
  essayTextColor: "#7b591c",
  blankColor: "#ffffff",
  headerColor: "#193f42",
};

const ANSWER_KEY = { q1: "B", q2: "B", q3: "C", q4: "B", q5: "A", q6: "A", q7: "B" };
const OBJECTIVE_QUESTIONS = Object.keys(ANSWER_KEY);
const ESSAY_QUESTIONS = ["q8", "q9", "q10"];
const QUESTION_IDS = [...OBJECTIVE_QUESTIONS, ...ESSAY_QUESTIONS];

const QUESTION_LEARNINGS = {
  q1: { code: "EF09CI01-A", type: "Objetiva", title: "Compreender especiação e isolamento reprodutivo", essential: "Relacionar barreiras geográficas e reprodutivas à formação de novas espécies." },
  q2: { code: "EF09CI01-B", type: "Objetiva", title: "Reconhecer ancestralidade comum", essential: "Interpretar estruturas homólogas como evidências de ancestralidade comum." },
  q3: { code: "EF09CI01-C", type: "Objetiva", title: "Interpretar o registro fóssil", essential: "Relacionar camadas sedimentares e fósseis às mudanças da vida ao longo do tempo." },
  q4: { code: "EF09CI01-D", type: "Objetiva", title: "Diferenciar evolução convergente e divergente", essential: "Distinguir semelhanças por função de semelhanças relacionadas à origem evolutiva." },
  q5: { code: "EF09CI01-E", type: "Objetiva", title: "Compreender seleção natural", essential: "Reconhecer a ação da seleção natural sobre variações herdáveis em populações." },
  q6: { code: "EF09CI01-F", type: "Objetiva", title: "Relacionar isolamento e diversidade", essential: "Explicar como diferenças reprodutivas podem reduzir o fluxo gênico entre populações." },
  q7: { code: "EF09CI01-G", type: "Objetiva", title: "Compreender mudanças na biodiversidade", essential: "Interpretar a biodiversidade como resultado de mudanças, ramificações e extinções." },
  q8: { code: "EF09CI01-H", type: "Dissertativa", title: "Interpretar fósseis de transição", essential: "Usar evidências fósseis para explicar mudanças estruturais e ancestralidade ao longo do tempo." },
  q9: { code: "EF09CI01-I", type: "Dissertativa", title: "Ler árvores filogenéticas", essential: "Interpretar pontos de ramificação como indícios de ancestralidade comum entre grupos." },
  q10: { code: "EF09CI01-J", type: "Dissertativa", title: "Relacionar conservação e evolução", essential: "Explicar por que a conservação de habitats contribui para a manutenção da biodiversidade." },
};

const HEADERS = [
  "ID do envio", "Data/Hora", "Nome do aluno", "Nº de chamada", "Série", "RA", "Dígito RA", "E-mail institucional", "Situação",
  ...QUESTION_IDS,
  ...ESSAY_QUESTIONS.map((id) => `${id.toUpperCase()} — resposta dissertativa`),
  ...QUESTION_IDS.map((id) => `${id.toUpperCase()} — resultado`),
  ...QUESTION_IDS.map((id) => `${id.toUpperCase()} — aprendizagem`),
  "Acertos objetivos", "Total objetivos", "Nota objetiva (0–10)", "Percentual objetivo",
  "Aprendizagens atingidas", "Aprendizagens essenciais não atingidas", "Observações",
];

function doGet() {
  return json_({ ok: true, message: "Endpoint de respostas disponível.", activity: CONFIG.activityName });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const payload = parsePayload_(event);
    validatePayload_(payload);
    return json_({ ok: true, ...registerSubmission_(payload) });
  } catch (error) {
    return json_({ ok: false, error: errorMessage_(error) });
  } finally {
    lock.releaseLock();
  }
}

function setupWorkbook() {
  const book = getBook_();
  const responses = getOrCreateSheet_(book, CONFIG.responseSheet);
  const learnings = getOrCreateSheet_(book, CONFIG.learningSheet);
  const dashboard = getOrCreateSheet_(book, CONFIG.dashboardSheet);
  ensureResponseSheet_(responses);
  ensureLearningSheet_(learnings);
  ensureDashboardSheet_(dashboard);
  refreshDashboard_();
  book.setActiveSheet(dashboard);
  SpreadsheetApp.getUi().alert("Abas Respostas, Aprendizagens e Dashboard configuradas.");
}

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Atividade de Ciências")
    .addItem("Configurar planilha", "setupWorkbook")
    .addItem("Atualizar dashboard", "refreshDashboard_")
    .addItem("Reaplicar correção e cores", "formatExistingRows")
    .addItem("Limpar filtro do dashboard", "clearDashboardFilter_")
    .addToUi();
}

function onEdit(event) {
  if (event && event.range && event.range.getSheet().getName() === CONFIG.dashboardSheet && event.range.getA1Notation() === "B2") refreshDashboard_();
}

function registerSubmission_(payload) {
  const sheet = getOrCreateSheet_(getBook_(), CONFIG.responseSheet);
  ensureResponseSheet_(sheet);
  const student = payload.student;
  const answers = OBJECTIVE_QUESTIONS.map((id) => normalizeAnswer_(payload.answers[id]));
  const essays = ESSAY_QUESTIONS.map((id) => safeText_(payload.essays && payload.essays[id] || payload.answers[id]));
  const statuses = QUESTION_IDS.map((id, index) => {
    if (ESSAY_QUESTIONS.includes(id)) return essays[ESSAY_QUESTIONS.indexOf(id)] ? "Recebida — correção manual" : "Não respondida";
    if (!answers[index]) return "Não respondida";
    return answers[index] === ANSWER_KEY[id] ? "Correta" : "Incorreta";
  });
  const learningResults = statuses.map((status) => status === "Correta" ? "Atingida" : status === "Recebida — correção manual" ? "Aguardando correção" : "Não atingida");
  const correctCount = statuses.filter((status) => status === "Correta").length;
  const total = OBJECTIVE_QUESTIONS.length;
  const grade = Math.round((correctCount / total) * 100) / 10;
  const percent = Math.round((correctCount / total) * 10000) / 100;
  const attained = QUESTION_IDS.filter((id, i) => learningResults[i] === "Atingida").map((id) => `${QUESTION_LEARNINGS[id].code} — ${QUESTION_LEARNINGS[id].title}`);
  const notAttained = QUESTION_IDS.filter((id, i) => learningResults[i] === "Não atingida").map((id) => `${QUESTION_LEARNINGS[id].code} — ${QUESTION_LEARNINGS[id].title}`);
  const pending = QUESTION_IDS.filter((id, i) => learningResults[i] === "Aguardando correção").map((id) => `${QUESTION_LEARNINGS[id].code} — ${QUESTION_LEARNINGS[id].title}`);
  const row = sheet.getLastRow() + 1;
  const values = [[
    Utilities.getUuid(), new Date(), safeText_(student.nome), safeText_(student.numero), safeText_(student.serie || CONFIG.className), safeText_(student.ra), safeText_(student.digito), safeText_(student.email), safeText_(student.situacao || "Enviada"),
    ...answers, ...essays, ...statuses, ...learningResults, correctCount, total, grade, percent / 100, attained.join("\n"), notAttained.join("\n"), safeText_(payload.observacoes),
  ]];
  sheet.getRange(row, 1, 1, HEADERS.length).setValues(values);
  sheet.getRange(row, 2).setNumberFormat("dd/MM/yyyy HH:mm:ss");
  sheet.getRange(row, column_("Nota objetiva (0–10)"), 1, 1).setNumberFormat("0.0");
  sheet.getRange(row, column_("Percentual objetivo"), 1, 1).setNumberFormat("0.00%");
  applyAnswerColours_(sheet, row, answers, essays, statuses);
  applyLearningColours_(sheet, row, learningResults);
  refreshDashboard_();
  return { submissionId: values[0][0], row, score: correctCount, total, grade, percent, pendingManualCorrection: pending };
}

function ensureResponseSheet_(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, HEADERS.length).setBackground(CONFIG.headerColor).setFontColor("#fffdf7").setFontWeight("bold").setWrap(true).setHorizontalAlignment("center");
  if (sheet.getFilter()) sheet.getFilter().remove();
  sheet.getRange(1, 1, Math.max(2, sheet.getMaxRows()), HEADERS.length).createFilter();
  sheet.setColumnWidth(1, 190); sheet.setColumnWidth(2, 145); sheet.setColumnWidth(3, 230); sheet.setColumnWidth(8, 280);
  for (let col = column_("q1"); col <= column_("q10"); col++) sheet.setColumnWidth(col, 76);
  for (let col = column_("Q8 — resposta dissertativa"); col < column_("Q1 — resultado"); col++) sheet.setColumnWidth(col, 260);
}

function ensureLearningSheet_(sheet) {
  const headers = ["Questão", "Tipo", "Código", "Aprendizagem", "Aprendizagem essencial", "Gabarito", "Correção"];
  const rows = QUESTION_IDS.map((id) => [id.toUpperCase(), QUESTION_LEARNINGS[id].type, QUESTION_LEARNINGS[id].code, QUESTION_LEARNINGS[id].title, QUESTION_LEARNINGS[id].essential, ANSWER_KEY[id] || "Manual", ESSAY_QUESTIONS.includes(id) ? "Manual" : "Automática"]);
  sheet.clear();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setBackground(CONFIG.headerColor).setFontColor("#fffdf7").setFontWeight("bold").setWrap(true);
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows).setWrap(true);
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 80); sheet.setColumnWidth(2, 110); sheet.setColumnWidth(3, 120); sheet.setColumnWidth(4, 270); sheet.setColumnWidth(5, 520); sheet.setColumnWidth(6, 100); sheet.setColumnWidth(7, 130);
}

function ensureDashboardSheet_(sheet) {
  sheet.clear();
  sheet.getCharts().forEach((chart) => sheet.removeChart(chart));
  sheet.getRange("A1:H1").merge().setValue(`${CONFIG.activityName} — Dashboard de resultados`).setBackground(CONFIG.headerColor).setFontColor("#fffdf7").setFontWeight("bold").setFontSize(16);
  sheet.getRange("A2").setValue("Aluno selecionado").setFontWeight("bold"); sheet.getRange("B2").setValue("Todos").setBackground("#fff7e8").setFontWeight("bold");
  sheet.getRange("A4:B9").setValues([["Nome", ""], ["RA", ""], ["Série", ""], ["Acertos objetivos", ""], ["Nota objetiva", ""], ["Percentual objetivo", ""]]);
  sheet.getRange("A4:A9").setFontWeight("bold").setBackground("#e7f0eb");
  sheet.getRange("D4:H4").setValues([["Questão", "Resposta", "Gabarito", "Resultado", "Aprendizagem"]]).setBackground(CONFIG.headerColor).setFontColor("#fffdf7").setFontWeight("bold");
  sheet.getRange("A12:H12").merge().setValue("Aprendizagens atingidas").setBackground(CONFIG.correctColor).setFontColor(CONFIG.correctTextColor).setFontWeight("bold");
  sheet.getRange("A15:H15").merge().setValue("Aprendizagens essenciais não atingidas").setBackground(CONFIG.wrongColor).setFontColor(CONFIG.wrongTextColor).setFontWeight("bold");
  sheet.getRange("A18:H18").merge().setValue("Dissertativas aguardando correção manual").setBackground(CONFIG.essayColor).setFontColor(CONFIG.essayTextColor).setFontWeight("bold");
  sheet.setFrozenRows(3);
  sheet.setColumnWidth(1, 180); sheet.setColumnWidth(2, 300); sheet.setColumnWidth(3, 110); sheet.setColumnWidth(4, 100); sheet.setColumnWidth(5, 280); sheet.setColumnWidth(6, 140); sheet.setColumnWidth(7, 150); sheet.setColumnWidth(8, 420);
}

function refreshDashboard_() {
  const book = getBook_(); const response = book.getSheetByName(CONFIG.responseSheet); const dashboard = getOrCreateSheet_(book, CONFIG.dashboardSheet);
  if (!response || response.getLastRow() < 2) { ensureDashboardSheetIfMissing_(dashboard); return; }
  ensureDashboardSheetIfMissing_(dashboard);
  const rows = response.getRange(2, 1, response.getLastRow() - 1, HEADERS.length).getValues();
  const names = ["Todos"].concat([...new Set(rows.map((row) => row[2]).filter(Boolean))].sort());
  dashboard.getRange("B2").setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(names, true).setAllowInvalid(false).build());
  const selected = dashboard.getRange("B2").getDisplayValue() || "Todos";
  const current = selected === "Todos" ? rows[rows.length - 1] : [...rows].reverse().find((row) => row[2] === selected);
  dashboard.getRange("A4:B9").clearContent(); dashboard.getRange("D5:H30").clearContent().clearFormat(); dashboard.getRange("A13:H19").clearContent();
  if (!current) { dashboard.getRange("A13").setValue("Nenhum envio encontrado para o filtro selecionado."); return; }
  const answerStart = column_("q1") - 1; const essayStart = column_("Q8 — resposta dissertativa") - 1; const statusStart = column_("Q1 — resultado") - 1; const learningStart = column_("Q1 — aprendizagem") - 1;
  dashboard.getRange("A4:B9").setValues([["Nome", current[2]], ["RA", current[5]], ["Série", current[4]], ["Acertos objetivos", current[column_("Acertos objetivos") - 1]], ["Nota objetiva", current[column_("Nota objetiva (0–10)") - 1]], ["Percentual objetivo", current[column_("Percentual objetivo") - 1]]]);
  dashboard.getRange("B8").setNumberFormat("0.0"); dashboard.getRange("B9").setNumberFormat("0.00%");
  const detail = QUESTION_IDS.map((id, index) => [id.toUpperCase(), ESSAY_QUESTIONS.includes(id) ? current[essayStart + ESSAY_QUESTIONS.indexOf(id)] || "—" : current[answerStart + index] || "—", ANSWER_KEY[id] || "Manual", current[statusStart + index], QUESTION_LEARNINGS[id].title]);
  dashboard.getRange(5, 4, detail.length, 5).setValues(detail).setWrap(true);
  detail.forEach((item, index) => { const range = dashboard.getRange(5 + index, 4, 1, 5); const manual = String(item[3]).indexOf("manual") >= 0; range.setBackground(item[3] === "Correta" ? CONFIG.correctColor : item[3] === "Incorreta" ? CONFIG.wrongColor : manual ? CONFIG.essayColor : CONFIG.blankColor).setFontColor(item[3] === "Correta" ? CONFIG.correctTextColor : item[3] === "Incorreta" ? CONFIG.wrongTextColor : manual ? CONFIG.essayTextColor : "#173e3f"); });
  const attained = QUESTION_IDS.filter((id, i) => current[learningStart + i] === "Atingida").map((id) => `${QUESTION_LEARNINGS[id].code} — ${QUESTION_LEARNINGS[id].title}`);
  const notAttained = QUESTION_IDS.filter((id, i) => current[learningStart + i] === "Não atingida").map((id) => `${QUESTION_LEARNINGS[id].code} — ${QUESTION_LEARNINGS[id].title}`);
  const pending = QUESTION_IDS.filter((id, i) => current[learningStart + i] === "Aguardando correção").map((id) => `${QUESTION_LEARNINGS[id].code} — ${QUESTION_LEARNINGS[id].title}`);
  dashboard.getRange("A13:H13").merge().setValue(attained.length ? attained.join("\n") : "Nenhuma aprendizagem objetiva marcada como atingida.").setWrap(true).setBackground("#f1f8f3");
  dashboard.getRange("A16:H16").merge().setValue(notAttained.length ? notAttained.join("\n") : "Nenhuma aprendizagem objetiva marcada como não atingida.").setWrap(true).setBackground("#fff2f0");
  dashboard.getRange("A19:H19").merge().setValue(pending.length ? pending.join("\n") : "Nenhuma questão dissertativa aguardando correção.").setWrap(true).setBackground("#fff9e9");
}

function formatExistingRows() {
  const sheet = getBook_().getSheetByName(CONFIG.responseSheet); if (!sheet || sheet.getLastRow() < 2) return;
  for (let row = 2; row <= sheet.getLastRow(); row++) {
    const answers = sheet.getRange(row, column_("q1"), 1, OBJECTIVE_QUESTIONS.length).getDisplayValues()[0];
    const essays = sheet.getRange(row, column_("Q8 — resposta dissertativa"), 1, ESSAY_QUESTIONS.length).getDisplayValues()[0];
    const statuses = QUESTION_IDS.map((id, i) => ESSAY_QUESTIONS.includes(id) ? (essays[ESSAY_QUESTIONS.indexOf(id)] ? "Recebida — correção manual" : "Não respondida") : answers[i] ? (answers[i] === ANSWER_KEY[id] ? "Correta" : "Incorreta") : "Não respondida");
    const learning = statuses.map((status) => status === "Correta" ? "Atingida" : status === "Recebida — correção manual" ? "Aguardando correção" : "Não atingida");
    sheet.getRange(row, column_("Q1 — resultado"), 1, QUESTION_IDS.length).setValues([statuses]); sheet.getRange(row, column_("Q1 — aprendizagem"), 1, QUESTION_IDS.length).setValues([learning]); applyAnswerColours_(sheet, row, answers, essays, statuses); applyLearningColours_(sheet, row, learning);
  }
  refreshDashboard_();
}

function applyAnswerColours_(sheet, row, answers, essays, statuses) {
  const answerBackgrounds = answers.map((answer, i) => !answer ? CONFIG.blankColor : statuses[i] === "Correta" ? CONFIG.correctColor : CONFIG.wrongColor);
  const answerFonts = answers.map((answer, i) => !answer ? "#173e3f" : statuses[i] === "Correta" ? CONFIG.correctTextColor : CONFIG.wrongTextColor);
  sheet.getRange(row, column_("q1"), 1, OBJECTIVE_QUESTIONS.length).setBackgrounds([answerBackgrounds]).setFontColors([answerFonts]).setFontWeight("bold").setHorizontalAlignment("center");
  sheet.getRange(row, column_("Q8 — resposta dissertativa"), 1, ESSAY_QUESTIONS.length).setBackgrounds([essays.map((text) => text ? CONFIG.essayColor : CONFIG.blankColor)]).setFontColors([essays.map((text) => text ? CONFIG.essayTextColor : "#173e3f")]).setWrap(true);
}

function applyLearningColours_(sheet, row, results) {
  const backgrounds = results.map((result) => result === "Atingida" ? CONFIG.correctColor : result === "Aguardando correção" ? CONFIG.essayColor : CONFIG.wrongColor);
  const fonts = results.map((result) => result === "Atingida" ? CONFIG.correctTextColor : result === "Aguardando correção" ? CONFIG.essayTextColor : CONFIG.wrongTextColor);
  sheet.getRange(row, column_("Q1 — aprendizagem"), 1, QUESTION_IDS.length).setBackgrounds([backgrounds]).setFontColors([fonts]).setFontWeight("bold").setWrap(true);
}

function clearDashboardFilter_() { const sheet = getBook_().getSheetByName(CONFIG.dashboardSheet); if (sheet) { sheet.getRange("B2").setValue("Todos"); refreshDashboard_(); } }
function ensureDashboardSheetIfMissing_(sheet) { if (sheet.getRange("A1").getDisplayValue() !== `${CONFIG.activityName} — Dashboard de resultados`) ensureDashboardSheet_(sheet); }
function column_(header) { return HEADERS.indexOf(header) + 1; }
function getBook_() { return SpreadsheetApp.openById(CONFIG.spreadsheetId); }
function getOrCreateSheet_(book, name) { return book.getSheetByName(name) || book.insertSheet(name); }
function parsePayload_(event) { const raw = event && event.postData && event.postData.contents; if (!raw) throw new Error("Corpo da requisição ausente."); return JSON.parse(raw); }
function validatePayload_(payload) { if (!payload || typeof payload !== "object") throw new Error("Formato inválido."); if (!payload.student || !safeText_(payload.student.nome)) throw new Error("Nome do aluno ausente."); if (!payload.answers || typeof payload.answers !== "object") throw new Error("Respostas ausentes."); }
function normalizeAnswer_(value) { const answer = safeText_(value).toUpperCase(); return ["A", "B", "C", "D"].includes(answer) ? answer : ""; }
function safeText_(value) { return String(value == null ? "" : value).trim().slice(0, 5000); }
function errorMessage_(error) { return String(error && error.message ? error.message : error); }
function json_(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
