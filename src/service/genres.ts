import { axiosInstance } from "@/lib/axios";

export interface Genres {
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export async function getGenres(): Promise<Genres> {
  const params = {
    language: "pt-BR",
  };

  const response = await axiosInstance.get(`/genre/movie/list`, { params });

  return response.data;
}
