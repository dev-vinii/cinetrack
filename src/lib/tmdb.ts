const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export function getTmdbApiKey(): string | undefined {
  return process.env.TMDB_API_KEY?.trim() || undefined;
}

export function tmdbHeaders(): HeadersInit {
  const apiKey = getTmdbApiKey();

  if (!apiKey) {
    throw new Error(
      "TMDB_API_KEY não configurada. Copie .env.example para .env e preencha sua chave em https://www.themoviedb.org/settings/api"
    );
  }

  return {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
}

export async function tmdbFetch(
  path: string,
  params?: URLSearchParams,
  init?: RequestInit
): Promise<Response> {
  const query = params?.toString();
  const url = `${TMDB_BASE_URL}${path}${query ? `?${query}` : ""}`;

  return fetch(url, {
    ...init,
    headers: {
      ...tmdbHeaders(),
      ...init?.headers,
    },
  });
}
