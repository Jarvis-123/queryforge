export const QUERY_INTENTS = [
  "procedure",
  "template",
  "policy",
  "metric",
  "people",
] as const;

export type QueryIntent = (typeof QUERY_INTENTS)[number];

const TEMPLATE_QUERY =
  /\b(draft|template|email|wording|copy-?ready|write (an|a)|message to)\b/i;
const METRIC_QUERY =
  /\b(how many|count|kpi|metric|total|number of|report)\b/i;
const POLICY_QUERY =
  /\b(policy|compliance|allowed|not allowed|rule|regulation|gdpr|retention)\b/i;
const PEOPLE_QUERY =
  /\b(who owns|point of contact|poc|contact|owner|escalat|reach out to)\b/i;
const PROCEDURE_QUERY =
  /\b(how (do|to)|step|process|procedure|workflow|approval|where (do|is|can))\b/i;

export function classifyQueryIntent(query: string): QueryIntent {
  const q = query.trim();
  if (!q) return "procedure";

  if (PEOPLE_QUERY.test(q)) return "people";
  if (POLICY_QUERY.test(q)) return "policy";
  if (TEMPLATE_QUERY.test(q)) return "template";
  if (METRIC_QUERY.test(q)) return "metric";
  if (PROCEDURE_QUERY.test(q)) return "procedure";

  return "procedure";
}

export function intentPromptBlock(intent: QueryIntent): string {
  switch (intent) {
    case "procedure":
      return "Intent: procedure — cite the handbook section; give ordered steps with source links.";
    case "template":
      return "Intent: template — produce copy-ready draft text with {{placeholders}}; do not invent approvals.";
    case "policy":
      return "Intent: policy — cite the policy doc; be explicit about constraints and exceptions.";
    case "metric":
      return "Intent: metrics — do not invent counts; say what report or system holds live numbers.";
    case "people":
      return "Intent: people — name the owner or team from the corpus; include contact when listed.";
    default:
      return "";
  }
}

export function intentLabel(intent: QueryIntent): string {
  return intent.charAt(0).toUpperCase() + intent.slice(1);
}
