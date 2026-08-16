/**
 * Direção visual: Arquivo da Biodiversidade — natural-history editorial, marfim, verde fóssil,
 * terracota e azul-petróleo; layout assimétrico, evidências visuais e microinterações discretas.
 */
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, Mail, Search, Send, Sparkles } from "lucide-react";
import { submitAssessment } from "@/lib/submission";

const students = [
  ["ALICE CARVALHO","000114160176","X","0000114160176XSP@al.educacao.sp.gov.br"],
  ["AMANDA PASSOS DE ALMEIDA","000115864899","6","00001158648996SP@al.educacao.sp.gov.br"],
  ["ANA BEATRIZ RODRIGUES OLIVEIRA","000115077002","8","00001150770028SP@al.educacao.sp.gov.br"],
  ["ANA CLARA SOUSA DA COSTA","000123716230","0","00001237162300SP@al.educacao.sp.gov.br"],
  ["ANA JÚLIA MENEZES DA SILVA","000115079886","5","00001150798865SP@al.educacao.sp.gov.br"],
  ["ANDRIELLE FERNANDES DA COSTA","000114143031","9","00001141430319SP@al.educacao.sp.gov.br"],
  ["ARTHUR COHEN BARRETO","000116651899","1","00001166518991SP@al.educacao.sp.gov.br"],
  ["ARTHUR DAVI DE SOUZA FERNANDES","000115287899","2","00001152878992SP@al.educacao.sp.gov.br"],
  ["BELLAMY OHANA CINGANO PEREZ","000123848310","0","00001238483100SP@al.educacao.sp.gov.br"],
  ["EDUARDA ALVES DE SOUZA","000115507309","5","00001155073095SP@al.educacao.sp.gov.br"],
  ["EMANUEL ALVES OLIVEIRA","000112971413","5","00001129714135SP@al.educacao.sp.gov.br"],
  ["ESTHER CRISTINE SILVA RIBEIRO","000113216026","1","00001132160261SP@al.educacao.sp.gov.br"],
  ["EVELLYN ALVES DA SILVA","000121483284","2","00001214832842SP@al.educacao.sp.gov.br"],
  ["EVELLYN YASMIN TAVARES SILVA","000120570957","5","00001205709575SP@al.educacao.sp.gov.br"],
  ["FELIPE DE SOUZA RODRIGUES","000115879478","2","00001158794782SP@al.educacao.sp.gov.br"],
  ["FERNANDA POLACHINI MAYER GOMES MARQUES","000113220165","2","00001132201652SP@al.educacao.sp.gov.br"],
  ["GUSTAVO AUGUSTO TOMBOLO REIS","000121486964","6","00001214869646SP@al.educacao.sp.gov.br"],
  ["HENRIQUE ROCHA CARVALHAL","000125597928","8","00001255979288SP@al.educacao.sp.gov.br"],
  ["HINGRID SARAIVA DOS SANTOS","000115343277","8","00001153432778SP@al.educacao.sp.gov.br"],
  ["IGOR MARTINS PEREIRA","000115083615","5","00001150836155SP@al.educacao.sp.gov.br"],
  ["ISABELLA DOS SANTOS SALDANHA","000115076210","X","0000115076210XSP@al.educacao.sp.gov.br"],
  ["KAUANNY APARECIDA MALAQUIAS LIMA","000115077275","X","0000115077275XSP@al.educacao.sp.gov.br"],
  ["KÉTHILY NAYARA DA SILVA","000114160080","8","00001141600808SP@al.educacao.sp.gov.br"],
  ["LEONARDO DE AVELAR CARVALHO","000115077491","5","00001150774915SP@al.educacao.sp.gov.br"],
  ["LIVIA OLIVEIRA NASCIMENTO","000116528242","2","00001165282422SP@al.educacao.sp.gov.br"],
  ["LOHRAN ROMUALDO MENDES DA SILVA","000115885441","9","00001158854419SP@al.educacao.sp.gov.br"],
  ["LUANA KAROLINE MARTINS DE OLIVEIRA","000114150635","X","0000114150635XSP@al.educacao.sp.gov.br"],
  ["LUIS MIGUEL GONÇALVES DA SILVA","000123848645","9","00001238486459SP@al.educacao.sp.gov.br"],
  ["MANUELLA DE MORAES SOUZA","000114143738","7","00001141437387SP@al.educacao.sp.gov.br"],
  ["MARCELA ROBERTO DE OLIVEIRA","000115077815","5","00001150778155SP@al.educacao.sp.gov.br"],
  ["MATHEUS HENRIQUE ALMEIDA DA SILVA","000112771649","9","00001127716499SP@al.educacao.sp.gov.br"],
  ["MATHEUS TURCHETTO","000113210966","8","00001132109668SP@al.educacao.sp.gov.br"],
  ["MELISSA VICTORIA DE OLIVEIRA CARVALHO","000115887628","2","00001158876282SP@al.educacao.sp.gov.br"],
  ["MIGUEL MARTINS DE ASSIS","000113221116","5","00001132211165SP@al.educacao.sp.gov.br"],
  ["OMRAN RASEKH","000124600717","4","00001246007174SP@al.educacao.sp.gov.br"],
  ["PATRICIA SEGURA","000115077465","4","00001150774654SP@al.educacao.sp.gov.br"],
  ["PRISCILLA VITORIA MENDES DE OLIVEIRA","000121622685","4","00001216226854SP@al.educacao.sp.gov.br"],
  ["RAUL HENRIQUE CRUS BAPTISTA","000114169380","X","0000114169380XSP@al.educacao.sp.gov.br"],
  ["SARAH VITORIA ALVES OLIVEIRA","000115077243","8","00001150772438SP@al.educacao.sp.gov.br"],
  ["YURI GABRIEL DE MORAES PONGOLINO","000115077239","6","00001150772396SP@al.educacao.sp.gov.br"],
  ["ZAYN AL ABIDIN RASULI","000125460635","X","0000125460635XSP@al.educacao.sp.gov.br"],
  ["LARISSA RIBEIRO DO NASCIMENTO","000114069149","1","00001140691491SP@al.educacao.sp.gov.br"],
  ["KAUA BARROS DE PAULA","000115078741","7","00001150787417SP@al.educacao.sp.gov.br"]
].map(([name, ra, dig, email]) => ({ name, ra, dig, email }));

const questions = [
  { number: 1, type: "Múltipla escolha", image: "/Atividade-9-Ano/assets/q01-especiacao.webp", prompt: "Em uma ilha, uma população ancestral de aves foi separada por uma barreira geográfica. Depois de muitas gerações, os dois grupos passaram a apresentar diferenças no formato do bico e não conseguem mais produzir descendentes férteis entre si. Qual processo está melhor representado?", options: ["Mutação dirigida pela necessidade do ambiente.", "Especiação associada ao isolamento reprodutivo.", "Reprodução assexuada de uma única espécie.", "Evolução convergente entre organismos sem ancestral comum."], answer: 1 },
  { number: 2, type: "Múltipla escolha", image: "/Atividade-9-Ano/assets/q02-ancestralidade.webp", prompt: "Ao comparar os membros anteriores de seres humanos, morcegos, baleias e gatos, uma equipe percebeu que os ossos possuem organização básica semelhante, embora desempenhem funções diferentes. Essa evidência sustenta principalmente a ideia de que esses grupos", options: ["surgiram exatamente no mesmo ambiente.", "possuem um ancestral comum em sua história evolutiva.", "têm o mesmo modo de vida atualmente.", "foram produzidos sem modificações ao longo do tempo."], answer: 1 },
  { number: 3, type: "Múltipla escolha", image: "/Atividade-9-Ano/assets/q03-fossil-evidence.webp", prompt: "Em uma escavação, fósseis de organismos marinhos aparecem em camadas mais profundas, enquanto formas com características associadas à vida terrestre aparecem em camadas superiores. Considerando a formação das rochas sedimentares, a interpretação mais adequada é que", options: ["as camadas superiores são sempre mais antigas.", "os fósseis não permitem comparar diferentes momentos da história da vida.", "a sequência das camadas pode registrar mudanças nos organismos ao longo do tempo.", "os organismos das camadas inferiores necessariamente viveram depois dos demais."], answer: 2 },
  { number: 4, type: "Múltipla escolha", image: "/Atividade-9-Ano/assets/q04-convergente-divergente.webp", prompt: "Tubarões e golfinhos apresentam corpos hidrodinâmicos, embora pertençam a grupos evolutivamente distantes. Já o braço humano, a asa do morcego e a nadadeira da baleia têm a mesma base óssea, mas funções diferentes. A primeira situação e a segunda correspondem, respectivamente, a", options: ["evolução divergente e seleção artificial.", "evolução convergente e evolução divergente.", "ancestralidade recente e mutação dirigida.", "isolamento geográfico e evolução convergente."], answer: 1 },
  { number: 5, type: "Múltipla escolha", image: "/Atividade-9-Ano/assets/q05-selecao-natural.webp", prompt: "Em uma população de besouros havia variação natural na cor do corpo. Após a chegada de aves predadoras, os indivíduos mais visíveis foram capturados com maior frequência, e os mais escuros tornaram-se mais comuns nas gerações seguintes. Esse caso ilustra", options: ["a seleção natural atuando sobre uma variação herdável.", "a transformação intencional dos besouros durante a vida.", "a ausência de diferenças entre os indivíduos da população.", "a produção de uma nova espécie em apenas uma geração."], answer: 0 },
  { number: 6, type: "Múltipla escolha", image: "/Atividade-9-Ano/assets/q06-isolamento-reprodutivo.webp", prompt: "Duas populações de sapos vivem em áreas próximas, mas os machos de cada grupo emitem cantos de acasalamento diferentes. As fêmeas respondem apenas ao canto do próprio grupo. Se essa diferença impedir o cruzamento entre as populações, ela poderá favorecer", options: ["o isolamento reprodutivo e a formação de novas espécies.", "a mistura obrigatória dos genes dos dois grupos.", "a redução da biodiversidade por ausência de variação.", "a evolução convergente dos cantos em uma única população."], answer: 0 },
  { number: 7, type: "Múltipla escolha", image: "/Atividade-9-Ano/assets/q07-biodiversidade-tempo.webp", prompt: "O registro fóssil revela que diferentes grupos de seres vivos surgiram, diversificaram-se e desapareceram em diferentes momentos da história da Terra. Esse registro ajuda a compreender que a biodiversidade", options: ["é fixa e não sofre alterações ao longo do tempo.", "resulta de uma história evolutiva marcada por mudanças e ramificações.", "depende apenas do tamanho dos organismos.", "aumenta sempre de forma contínua, sem extinções."], answer: 1 },
  { number: 8, type: "Dissertativa", image: "/Atividade-9-Ano/assets/q08-fossil-transicao.webp", prompt: "Observe a prancha de evidências. Explique como um fóssil com características intermediárias pode contribuir para a compreensão da evolução de um grupo de organismos. Em sua resposta, relacione estrutura, ancestralidade e mudança ao longo do tempo." },
  { number: 9, type: "Dissertativa", image: "/Atividade-9-Ano/assets/q09-arvore-filogenetica.webp", prompt: "Analise a árvore filogenética representada. Explique o que significa um ponto de ramificação e como ele pode ser utilizado para discutir relações de ancestralidade comum entre os grupos apresentados." },
  { number: 10, type: "Dissertativa", image: "/Atividade-9-Ano/assets/q10-conservacao-biodiversidade.webp", prompt: "A imagem apresenta uma área preservada e outra fragmentada. Escreva duas ações humanas que podem contribuir para conservar a biodiversidade e explique por que a conservação dos habitats é importante para a continuidade dos processos evolutivos." }
];

function Field({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return <div className="field"><span>{icon}{label}</span><strong>{value || "—"}</strong></div>;
}

export default function Home() {
  const [studentName, setStudentName] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [essays, setEssays] = useState<Record<number, string>>({});
  const [saveState, setSaveState] = useState<{ type: "idle" | "saving" | "saved" | "local" | "error"; message: string }>({ type: "idle", message: "" });
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);
  const selected = useMemo(() => students.find((student) => student.name === studentName), [studentName]);
  const answered = Object.keys(answers).length + Object.values(essays).filter(Boolean).length;
  const progress = Math.round((answered / questions.length) * 100);

  useEffect(() => {
    if (!zoomedImage) return;
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setZoomedImage(null); };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [zoomedImage]);

  async function handleSubmit() {
    if (!selected) {
      setSaveState({ type: "error", message: "Selecione seu nome antes de enviar." });
      document.querySelector(".student-panel")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (answered < questions.length) {
      setSaveState({ type: "error", message: `Responda todas as ${questions.length} questões antes de enviar.` });
      return;
    }
    setSaveState({ type: "saving", message: "Enviando suas respostas..." });
    const answerPayload = Object.fromEntries(Object.entries(answers).map(([number, option]) => [`q${number}`, String.fromCharCode(65 + option)]));
    const score = questions.filter((question) => question.options && answers[question.number] === question.answer).length;
    const result = await submitAssessment({
      submittedAt: new Date().toISOString(),
      student: { nome: selected.name, numero: "", serie: "9º Ano A", email: selected.email, ra: selected.ra, digito: selected.dig, situacao: "Atividade enviada" },
      answers: answerPayload,
      essays: Object.fromEntries(Object.entries(essays).map(([number, text]) => [`q${number}`, text])),
      score,
      total: 7,
    });
    setSaveState({ type: result.mode === "online" ? "saved" : "local", message: result.message });
    document.querySelector(".footer-note")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return <main className="page-shell">
    <header className="hero">
      <div className="hero-topline"><span className="eyebrow">REGISTRO DE APRENDIZAGEM · 2026</span><span className="class-chip">9º ANO A</span></div>
      <div className="hero-grid">
        <div>
          <div className="brand-lockup"><img src="/Atividade-9-Ano/assets/arquivo-biodiversidade-logo.webp" alt="Símbolo do Arquivo da Biodiversidade" /><span>CIÊNCIAS<br /><small>arquivo da biodiversidade</small></span></div>
          <h1>Leia as evidências.<br /><em>Construa sua explicação.</em></h1>
          <p className="hero-copy">Uma atividade visual sobre evolução e diversidade das espécies, organizada a partir das aulas 1 a 4 do 3º bimestre.</p>
        </div>
        <aside className="hero-note"><span>GUIA PRIORIZADO</span><strong>3º Bimestre</strong><p>Especiação · ancestralidade comum · fósseis · evolução convergente e divergente</p></aside>
      </div>
    </header>

    <section className="student-panel" aria-labelledby="student-heading">
      <div className="section-kicker"><Search size={16} /> IDENTIFICAÇÃO DO ESTUDANTE</div>
      <div className="student-grid">
        <label className="select-wrap"><span id="student-heading">NOME</span><select value={studentName} onChange={(event) => setStudentName(event.target.value)}><option value="">Selecione seu nome</option>{students.map((student) => <option key={student.name} value={student.name}>{student.name}</option>)}</select></label>
        <Field label="SÉRIE" value={selected ? "9º Ano A" : ""} />
        <Field label="RA" value={selected?.ra || ""} />
        <Field label="DIG." value={selected?.dig || ""} />
        <Field label="E-mail institucional" value={selected?.email || ""} icon={<Mail size={14} />} />
        <label className="date-wrap"><span>DATA</span><input type="date" defaultValue="2026-08-15" /></label>
      </div>
      <div className={`student-status ${selected ? "ready" : ""}`}><CheckCircle2 size={17} />{selected ? `Registro preenchido para ${selected.name}. Você já pode iniciar a atividade.` : "Escolha seu nome para preencher automaticamente os demais campos."}</div>
    </section>

    <section className="activity-intro"><div><span className="eyebrow">ATIVIDADE DE CIÊNCIAS (3º BIMESTRE)</span><h2>Evolução e diversidade das espécies</h2></div><div className="progress-box"><div><span>PROGRESSO</span><strong>{progress}%</strong></div><div className="progress-track"><i style={{ width: `${progress}%` }} /></div><small>{answered} de {questions.length} registros respondidos</small></div></section>

    <div className="activity-layout"><aside className="side-index"><div className="side-sticky"><div className="catalog-spine"><span>REGISTRO</span><b>9A / 03</b></div><span className="eyebrow">ÍNDICE DE EVIDÊNCIAS</span><p>Observe a imagem antes de responder. Nas questões dissertativas, escreva com suas próprias palavras e use conceitos científicos.</p><div className="index-list">{questions.map((question) => <a key={question.number} href={`#questao-${question.number}`} className={answers[question.number] !== undefined || essays[question.number] ? "done" : ""}><b>{String(question.number).padStart(2, "0")}</b><span>{question.type}</span></a>)}</div></div></aside>
      <section className="questions" aria-label="Questões da atividade">{questions.map((question, index) => <article className={`question-card ${index % 2 ? "reverse" : ""}`} id={`questao-${question.number}`} key={question.number}><div className="question-meta"><span>QUESTÃO {String(question.number).padStart(2, "0")}</span><span>{question.type}</span></div><h3>{question.prompt}</h3><figure><button type="button" className="image-zoom-trigger" onClick={() => setZoomedImage({ src: question.image, alt: `Ilustração científica relacionada à questão ${question.number}` })} aria-label={`Ampliar imagem da questão ${question.number}`}><img src={question.image} alt={`Ilustração científica relacionada à questão ${question.number}`} /><span className="zoom-hint">Clique para ampliar</span></button><figcaption><span>PRANCHA {String(question.number).padStart(2, "0")}</span><i>COLEÇÃO EVOLUÇÃO / 2026</i><em>Evidência visual para leitura e interpretação</em></figcaption></figure>{question.options ? <div className="options">{question.options.map((option, optionIndex) => <label className={`option ${answers[question.number] === optionIndex ? "selected" : ""}`} key={option}><input type="radio" name={`question-${question.number}`} checked={answers[question.number] === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [question.number]: optionIndex }))} /><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span></label>)}</div> : <textarea value={essays[question.number] || ""} onChange={(event) => setEssays((current) => ({ ...current, [question.number]: event.target.value }))} placeholder="Registre sua explicação aqui..." rows={6} aria-label={`Resposta da questão ${question.number}`} />}</article>)}</section>
    </div>

    <footer className="footer-note"><div><Sparkles size={18} /><span><strong>Releia antes de enviar.</strong> Uma boa resposta apresenta evidência, conceito e justificativa.</span>{saveState.message && <small className={`save-message ${saveState.type}`}>{saveState.message}</small>}</div><div className="footer-actions"><button className="submit-button" type="button" onClick={handleSubmit} disabled={saveState.type === "saving"}>{saveState.type === "saving" ? "Enviando..." : "Enviar respostas"} <Send size={17} /></button><button className="print-button" type="button" onClick={() => window.print()}><ClipboardList size={17} /> Imprimir / salvar em PDF</button></div></footer>
    {zoomedImage && <div className="image-lightbox" role="dialog" aria-modal="true" aria-label="Imagem ampliada" onClick={() => setZoomedImage(null)}><div className="lightbox-panel" onClick={(event) => event.stopPropagation()}><button className="lightbox-close" type="button" onClick={() => setZoomedImage(null)} aria-label="Fechar imagem ampliada">×</button><img src={zoomedImage.src} alt={zoomedImage.alt} /></div></div>}
  </main>;
}
