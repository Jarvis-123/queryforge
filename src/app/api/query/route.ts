import { NextResponse } from "next/server";
import { runQuery } from "@/lib/query";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: string };
    const query = body.query?.trim();
    if (!query) {
      return NextResponse.json({ error: "Query is required." }, { status: 400 });
    }

    const result = await runQuery(query);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Query failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
