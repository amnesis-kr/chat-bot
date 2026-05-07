import OpenAI from "openai";
import pdfParse from "pdf-parse";
import fs from "fs";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.SAMBANOVA_API_KEY,
  baseURL: "https://api.sambanova.ai/v1",
});

// 서버 시작 시 PDF를 한 번만 읽어 메모리에 보관
let pdfText: string | null = null;

async function getPdfText(): Promise<string> {
  if (pdfText) return pdfText;
  // process.cwd() = my-chatbot 폴더, 한 단계 위의 docs 폴더 참조
  const pdfPath = path.resolve(process.cwd(), "..", "docs", "근로기준법(법률)(제20520호)(20250223).pdf");
  const buf = fs.readFileSync(pdfPath);
  const data = await pdfParse(buf);
  pdfText = data.text;
  return pdfText;
}

const SYSTEM_PROMPT = (law: string) => `당신은 근로기준법 전문 AI 노무사 어시스턴트입니다.
아래 근로기준법 전문을 바탕으로 사용자의 질문에 정확하고 친절하게 답변하세요.

답변 원칙:
- 반드시 아래 법률 원문에 근거하여 답변하세요.
- 해당 조항 번호를 명시하세요 (예: 제50조에 따르면...).
- 법률에 없는 내용은 "해당 내용은 근로기준법에 명시되어 있지 않습니다"라고 안내하세요.
- 전문 용어는 쉽게 풀어서 설명하세요.
- 구체적인 법적 판단이 필요한 경우 전문 노무사 상담을 권유하세요.

--- 근로기준법 전문 ---
${law}
--- 끝 ---`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const law = await getPdfText();

    const stream = await openai.chat.completions.create({
      model: "Meta-Llama-3.3-70B-Instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT(law) },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      stream: true,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || "";
          if (text) controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("API 오류:", error);
    return new Response("오류가 발생했습니다. 잠시 후 다시 시도해주세요.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
