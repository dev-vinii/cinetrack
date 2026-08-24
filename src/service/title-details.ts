import { tmdbFetch } from "@/lib/tmdb";
import { Media } from "@/service/titles";

export interface TitleGenre {
  id: number;
  name: string;
}

export interface TitleCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TitleDetails {
  id: number;
  media: Media;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: TitleGenre[];
  cast: TitleCastMember[];
  runtime: number | null;
  tagline: string | null;
  status: string | null;
  seasons: number | null;
  episodes: number | null;
}

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  tagline: string;
  status: string;
  genres: TmdbGenre[];
  credits?: { cast: TmdbCastMember[] };
}

interface TmdbTvDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  tagline: string;
  status: string;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: TmdbGenre[];
  credits?: { cast: TmdbCastMember[] };
}

function mapCast(cast: TmdbCastMember[] = []): TitleCastMember[] {
  return cast.slice(0, 10).map((member) => ({
    id: member.id,
    name: member.name,
    character: member.character,
    profile_path: member.profile_path,
  }));
}

function mapMovie(data: TmdbMovieDetails): TitleDetails {
  return {
    id: data.id,
    media: "movie",
    title: data.title,
    overview: data.overview,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    release_date: data.release_date,
    vote_average: data.vote_average,
    vote_count: data.vote_count,
    genres: data.genres,
    cast: mapCast(data.credits?.cast),
    runtime: data.runtime || null,
    tagline: data.tagline || null,
    status: data.status || null,
    seasons: null,
    episodes: null,
  };
}

function mapTv(data: TmdbTvDetails): TitleDetails {
  return {
    id: data.id,
    media: "tv",
    title: data.name,
    overview: data.overview,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    release_date: data.first_air_date,
    vote_average: data.vote_average,
    vote_count: data.vote_count,
    genres: data.genres,
    cast: mapCast(data.credits?.cast),
    runtime: null,
    tagline: data.tagline || null,
    status: data.status || null,
    seasons: data.number_of_seasons,
    episodes: data.number_of_episodes,
  };
}

export async function getTitleDetails(
  media: Media,
  id: number
): Promise<TitleDetails | null> {
  const params = new URLSearchParams({
    language: "pt-BR",
    append_to_response: "credits",
  });

  const path = media === "tv" ? `/tv/${id}` : `/movie/${id}`;

  const response = await tmdbFetch(path, params, { next: { revalidate: 3600 } });

  if (response.status === 404) return null;

  if (!response.ok) {
    throw new Error("Falha ao buscar detalhes do título");
  }

  const data = await response.json();

  return media === "tv"
    ? mapTv(data as TmdbTvDetails)
    : mapMovie(data as TmdbMovieDetails);
}
