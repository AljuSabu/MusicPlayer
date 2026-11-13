import { connection, NextResponse } from "next/server";

type Probe = {
  headers?: {
    status?: string;
    code?: number;
    error_message?: string;
    results_count?: number;
  };
};

const tests: Record<string, string> = {
  plain: "limit=1",
  featured: "limit=1&featured=1&order=popularity_week&groupby=artist_id",
  buzzrate:
    "limit=3&order=buzzrate&groupby=artist_id&type=single+albumtrack&audioformat=mp32",
  trending:
    "limit=3&order=popularity_week&groupby=artist_id&type=single+albumtrack&audioformat=mp32",
};

export async function GET() {
  await connection(); // always run live, never prerender

  const clientId = process.env.JAMENDO_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({
      hasKey: false,
      hint: "JAMENDO_CLIENT_ID is not set for this deployment. Add it for the Production environment and redeploy.",
    });
  }

  const results: Record<string, unknown> = {};

  for (const [name, extra] of Object.entries(tests)) {
    const started = Date.now();
    try {
      const res = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${encodeURIComponent(clientId.trim())}&format=json&${extra}`,
        { cache: "no-store", signal: AbortSignal.timeout(8000) },
      );
      const text = await res.text();

      let body: Probe | null = null;
      try {
        body = JSON.parse(text) as Probe;
      } catch {
        // not JSON
      }

      results[name] = {
        httpStatus: res.status,
        ms: Date.now() - started,
        apiStatus: body?.headers?.status ?? null,
        apiCode: body?.headers?.code ?? null,
        apiMessage: body?.headers?.error_message ?? null,
        resultsCount: body?.headers?.results_count ?? null,
        notJsonStart: body ? undefined : text.slice(0, 200),
      };
    } catch (err) {
      results[name] = {
        ms: Date.now() - started,
        error:
          err instanceof Error ? `${err.name}: ${err.message}` : String(err),
      };
    }
  }

  return NextResponse.json({
    hasKey: true,
    keyLength: clientId.length,
    keyHasWhitespaceOrQuotes: /[\s"']/.test(clientId),
    region: process.env.VERCEL_REGION ?? null,
    results,
  });
}
