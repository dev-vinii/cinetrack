import { axiosInstance } from "@/lib/axios";

export interface Root {
  page: number;
  results: Result[];
  total_pages: number;
  total_results: number;
}

interface Result {
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

export async function getMovies(page: number): Promise<Root> {
  const response = await axiosInstance.get(
    `/discover/movie?include_adult=true&include_video=false&language=pt-BR&page=${page}&sort_by=popularity.desc`
  );

  return response.data;
}
