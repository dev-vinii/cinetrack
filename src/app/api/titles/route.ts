import { NextRequest, NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";
import { TitleList } from "@/service/titles";

interface TmdbResult {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const media = searchParams.get("media") === "tv" ? "tv" : "movie";
  const page = searchParams.get("page") ?? "1";
  const genre = searchParams.get("genre") || undefined;
  const year = searchParams.get("year") || undefined;
  const query = searchParams.get("query")?.trim() || undefined;

  const params = new URLSearchParams({
    page,
    include_adult: "true",
    language: "pt-BR",
  });

  const yearParam =
    media === "tv"
      ? "first_air_date_year"
      : query
        ? "year"
        : "primary_release_year";

  let endpoint: string;

  if (query) {
    endpoint = media === "tv" ? "/search/tv" : "/search/movie";
    params.set("query", query);
    if (year) params.set(yearParam, year);
  } else {
    endpoint = media === "tv" ? "/discover/tv" : "/discover/movie";
    params.set("sort_by", "popularity.desc");
    if (genre) params.set("with_genres", genre);
    if (year) params.set(yearParam, year);
  }

  let response: Response;

  try {
    response = await tmdbFetch(endpoint, params, { next: { revalidate: 300 } });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Falha ao buscar títulos";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: "Falha ao buscar títulos" },
      { status: response.status }
    );
  }

  const data = await response.json();
  let results = data.results as TmdbResult[];

  // A busca do TMDB não aceita filtro de gênero, então ele é aplicado aqui.
  if (query && genre) {
    const genreId = Number(genre);
    results = results.filter((item) => item.genre_ids.includes(genreId));
  }

  const payload: TitleList = {
    page: data.page,
    total_pages: data.total_pages,
    total_results: data.total_results,
    results: results.map((item) => ({
      id: item.id,
      title: item.title ?? item.name ?? "",
      overview: item.overview,
      poster_path: item.poster_path,
      release_date: item.release_date ?? item.first_air_date ?? "",
      vote_average: item.vote_average,
    })),
  };

  return NextResponse.json(payload);
}
