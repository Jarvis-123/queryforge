# QueryForge

**Citation-first document Q&A** — classify intent, retrieve markdown chunks, answer with `[Source N]` links.

Domain-agnostic open-source demo. The sample corpus is fictional **Acme Corp** handbook content (no employer IP).

**Repository:** https://github.com/Jarvis-123/queryforge · **Live demo:** https://queryforge-nu.vercel.app

## Why this exists

Internal ops hubs need answers that **cite procedure**, not guess. QueryForge is the public extract of that pattern:

1. **Intent routing** — procedure, template, policy, metric, people
2. **Retrieval** — keyword search over a markdown corpus with intent-aware boosts
3. **Answer** — retrieval-only by default; optional OpenAI synthesis when `OPENAI_API_KEY` is set
4. **Governance** — never invent metrics; sources are always listed

Production recruiting systems stay private. This repo is the verifiable artifact.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional LLM mode

```bash
export OPENAI_API_KEY=sk-...
export OPENAI_MODEL=gpt-4o-mini   # optional
npm run dev
```

Without an API key, the demo runs in **retrieval-only** mode (still shows sources).

## Deploy

```bash
npm run build
vercel deploy --prod
```

Set `OPENAI_API_KEY` in Vercel project settings if you want LLM answers in production.

## Architecture

```
corpus/sample/*.md     → fictional handbook docs (frontmatter + body)
src/lib/intent.ts      → query intent classifier
src/lib/retrieve.ts    → corpus load + search
src/lib/prompt.ts      → citation-first prompt + retrieval fallback
src/lib/query.ts       → orchestration
src/app/api/query/     → POST { query }
```

## Sample questions

- How do I get an offer approved?
- Draft a welcome email for a new hire
- Who owns expense policy exceptions?
- How many open reqs do we have?
- What is the remote work policy?

## License

MIT — see [LICENSE](./LICENSE).

## Author

[Amit Singh](https://www.linkedin.com/in/amit-singh-he-him-his-936059a9/) · Portfolio pattern extracted from internal TA ops tooling.
