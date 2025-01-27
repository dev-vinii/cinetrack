import { axiosInstance } from "@/lib/axios";

export interface Movies {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export async function getMovies(
  page: number,
  genre?: string,
  selectedYear?: string
): Promise<Movies> {
  const params = {
    params: {
      page,
      with_genres: genre,
      include_adult: true,
      language: "pt-BR",
      primary_release_year: selectedYear,
    },
  };

  const response = await axiosInstance.get(`/discover/movie`, params);

  return response.data;
}
