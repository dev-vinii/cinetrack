import { NextRequest, NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const media =
    request.nextUrl.searchParams.get("media") === "tv" ? "tv" : "movie";

  let response: Response;

  try {
    response = await tmdbFetch(
      `/genre/${media}/list`,
      new URLSearchParams({ language: "pt-BR" }),
      { next: { revalidate: 86400 } }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao buscar gêneros";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "Falha ao buscar gêneros" },
      { status: response.status }
    );
  }

  return NextResponse.json(await response.json());
}
