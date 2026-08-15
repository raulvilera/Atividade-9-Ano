// Estilo: Caderno de Campo Editorial. Este módulo mantém o envio discreto, seguro e coerente com o registo formativo.

export type SubmissionPayload = {
  submittedAt: string;
  student: {
    nome: string;
    numero: string;
    serie: string;
    email: string;
    ra: string;
    digito: string;
    situacao: string;
  };
  answers: Record<string, string>;
  score: number;
  total: number;
};

const PUBLIC_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbx9ZbrXBzWFVlKjfM3e-tKHYsSOINLTwcYGmHSLAYRUFcay4ouheegjSMFwpxkMM_6S/exec";
const endpoint = (import.meta.env.VITE_SHEETS_ENDPOINT as string | undefined)?.trim() || PUBLIC_SHEETS_ENDPOINT;

export async function submitAssessment(payload: SubmissionPayload) {
  localStorage.setItem("evo-campo:last-submission", JSON.stringify(payload));

  if (!endpoint) {
    return { mode: "local" as const, message: "Resposta guardada neste dispositivo. O envio online ainda não foi configurado." };
  }

  try {
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return { mode: "online" as const, message: "Respostas enviadas para a folha de cálculo." };
  } catch {
    return { mode: "local" as const, message: "Não foi possível contactar a folha. A resposta ficou guardada neste dispositivo." };
  }
}
