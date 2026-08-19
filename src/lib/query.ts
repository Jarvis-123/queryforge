import { classifyQueryIntent } from "@/lib/intent";
import { buildLlmPrompt, buildRetrievalAnswer } from "@/lib/prompt";
import { searchCorpus } from "@/lib/retrieve";
import type { QueryResponse } from "@/lib/types";

async function synthesizeWithLlm(system: string, user: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content?.trim() ?? null;
}

export async function runQuery(query: string): Promise<QueryResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error("Query is required.");
  }

  const intent = classifyQueryIntent(trimmed);
  const hits = searchCorpus(trimmed, intent, 5);
  const { system, user } = buildLlmPrompt({ query: trimmed, intent, hits });

  const llmAnswer = await synthesizeWithLlm(system, user);
  const answer = llmAnswer ?? buildRetrievalAnswer({ query: trimmed, intent, hits });

  return {
    query: trimmed,
    intent,
    answer,
    mode: llmAnswer ? "llm" : "retrieval",
    sources: hits.map((hit) => ({
      id: hit.doc.id,
      title: hit.doc.title,
      category: hit.doc.category,
      href: hit.doc.href,
      snippet: hit.snippet,
      score: hit.score,
    })),
  };
}
