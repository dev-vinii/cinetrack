import { Media } from "@/service/titles";

export interface Genres {
  genres: Genre[];
}

export interface Genre {
  id: number;
  name: string;
}

export async function getGenres(media: Media): Promise<Genres> {
  const response = await fetch(`/api/genres?media=${media}`);

  if (!response.ok) {
    throw new Error("Falha ao buscar gêneros");
  }

  return response.json();
}
