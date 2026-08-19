import type { SearchHit } from "@/lib/types";
import { intentPromptBlock, type QueryIntent } from "@/lib/intent";

export const SYSTEM_INSTRUCTION = `You are QueryForge, a citation-first document assistant.

Rules:
- Answer only from the sources below. If sources do not contain the answer, say what is missing.
- Reference sources as [Source N] when stating facts or steps.
- Never invent metrics, counts, or policy exceptions.
- Prefer short, operational steps over essays.`;

export function formatSourcesBlock(hits: SearchHit[]): string {
  if (!hits.length) {
    return "(No corpus matches were found for this query.)";
  }

  return hits
    .map((hit, i) => {
      const lines = [
        `[Source ${i + 1}] ${hit.doc.title}`,
        `Category: ${hit.doc.category}`,
        `Excerpt: ${hit.snippet}`,
        `Doc id: ${hit.doc.id}`,
      ];
      return lines.join("\n");
    })
    .join("\n\n");
}

export function buildLlmPrompt(params: {
  query: string;
  intent: QueryIntent;
  hits: SearchHit[];
}): { system: string; user: string } {
  const intentBlock = intentPromptBlock(params.intent);
  const sources = formatSourcesBlock(params.hits);

  return {
    system: SYSTEM_INSTRUCTION,
    user: [
      intentBlock,
      "",
      `User question: ${params.query.trim()}`,
      "",
      "Corpus sources:",
      sources,
    ].join("\n"),
  };
}

export function buildRetrievalAnswer(params: {
  query: string;
  intent: QueryIntent;
  hits: SearchHit[];
}): string {
  const top = params.hits.filter((h) => h.score > 0).slice(0, 3);
  if (!top.length) {
    return "I couldn't find a strong match in the sample Acme Corp handbook. Try rephrasing or browse the corpus list below.";
  }

  const intro =
    params.intent === "template"
      ? "Based on the handbook (retrieval-only mode — set OPENAI_API_KEY for synthesized drafts):"
      : "Here's what the handbook says (retrieval-only mode):";

  const bullets = top
    .map(
      (hit, i) =>
        `[Source ${i + 1}] **${hit.doc.title}** — ${hit.snippet} _(category: ${hit.doc.category})_`,
    )
    .join("\n\n");

  return `${intro}\n\n${bullets}`;
}
