export type CorpusDoc = {
  id: string;
  title: string;
  category: string;
  body: string;
  href: string;
};

export type SearchHit = {
  doc: CorpusDoc;
  score: number;
  snippet: string;
};

export type QueryResponse = {
  query: string;
  intent: string;
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    category: string;
    href: string;
    snippet: string;
    score: number;
  }>;
  mode: "retrieval" | "llm";
};
