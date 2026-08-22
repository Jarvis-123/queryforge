"use client";

import { useState } from "react";
import type { QueryResponse } from "@/lib/types";
import { intentLabel, type QueryIntent } from "@/lib/intent";

const EXAMPLES = [
  "How do I get a offer approved?",
  "Draft a welcome email for a new hire",
  "Who owns expense policy exceptions?",
  "How many open reqs do we have?",
  "What is the remote work policy?",
];

const REPO_URL = "https://github.com/Jarvis-123/queryforge";

export function QueryForgeDemo() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(nextQuery?: string) {
    const value = (nextQuery ?? query).trim();
    if (!value) return;

    setLoading(true);
    setError(null);
    setQuery(value);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: value }),
      });
      const data = (await res.json()) as QueryResponse & { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8 px-5 py-10 md:py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          Open source · MIT
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">QueryForge</h1>
        <p className="max-w-2xl text-base leading-relaxed text-[var(--muted)]">
          Citation-first document Q&amp;A: classify intent, retrieve markdown chunks, answer with{" "}
          <code className="rounded bg-[var(--accent-soft)] px-1.5 py-0.5 text-sm text-[var(--foreground)]">
            [Source N]
          </code>{" "}
          links. Sample corpus is fictional Acme Corp — no employer IP.
        </p>
      </header>

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 md:p-6">
        <label htmlFor="query" className="text-sm font-medium text-[var(--muted)]">
          Ask the handbook
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="e.g. How do I approve an offer?"
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-2"
          />
          <button
            type="button"
            onClick={() => submit()}
            disabled={loading}
            className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Searching…" : "Query"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => submit(example)}
              className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              {example}
            </button>
          ))}
        </div>
      </section>

      {error ? (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {result ? (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            <span className="rounded-full border border-[var(--border)] px-3 py-1">
              Intent: {intentLabel(result.intent as QueryIntent)}
            </span>
            <span className="rounded-full border border-[var(--border)] px-3 py-1">
              Mode: {result.mode === "llm" ? "LLM + sources" : "Retrieval-only"}
            </span>
          </div>

          <article className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 md:p-6">
            <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
              Answer
            </h2>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{result.answer}</div>
          </article>

          <div>
            <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted)]">
              Sources
            </h2>
            <ul className="mt-3 space-y-3">
              {result.sources.map((source, index) => (
                <li
                  key={source.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
                >
                  <p className="text-sm font-semibold">
                    [Source {index + 1}] {source.title}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-[var(--muted)]">
                    {source.category}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {source.snippet}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <footer className="border-t border-[var(--border)] pt-6 text-sm text-[var(--muted)]">
        <p>
          Built by{" "}
          <a
            href="https://www.linkedin.com/in/amit-singh-he-him-his-936059a9/"
            className="text-[var(--foreground)] underline-offset-4 hover:underline"
          >
            Amit Singh
          </a>
          . Public extract of a citation-first RAG pattern used in internal ops tooling.
        </p>
        <p className="mt-2">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded text-[var(--foreground)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            View source on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
