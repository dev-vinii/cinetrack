export type Media = "movie" | "tv";

export interface Title {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TitleList {
  page: number;
  results: Title[];
  total_pages: number;
  total_results: number;
}

interface GetTitlesParams {
  media: Media;
  page: number;
  genre?: string;
  year?: string;
  query?: string;
}

export async function getTitles({
  media,
  page,
  genre,
  year,
  query,
}: GetTitlesParams): Promise<TitleList> {
  const params = new URLSearchParams({ media, page: String(page) });
  if (genre) params.set("genre", genre);
  if (year) params.set("year", year);
  if (query?.trim()) params.set("query", query.trim());

  const response = await fetch(`/api/titles?${params}`);

  if (!response.ok) {
    throw new Error("Falha ao buscar títulos");
  }

  return response.json();
}
