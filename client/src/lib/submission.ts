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
  essays: Record<string, string>;
};

// Endpoint publicado da Aplicação Web do Google Apps Script para esta atividade.
const PUBLIC_SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwmtHT6y_Pi3-AhRHpqvsDwaIKwN3cTJNGYUkjogG9u7963lalDg7G_-fYct1C446Z0/exec";
const endpoint = (import.meta.env.VITE_SHEETS_ENDPOINT as string | undefined)?.trim() || PUBLIC_SHEETS_ENDPOINT;

export async function submitAssessment(payload: SubmissionPayload) {
  localStorage.setItem("atividade-ciencias-9anoa:last-submission", JSON.stringify(payload));
  if (!endpoint) return { mode: "local" as const, message: "Resposta guardada neste dispositivo. O envio online ainda não foi configurado." };
  try {
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    return { mode: "online" as const, message: "Respostas enviadas com sucesso." };
  } catch {
    return { mode: "local" as const, message: "Não foi possível contactar a planilha. A resposta foi guardada neste dispositivo." };
  }
}
