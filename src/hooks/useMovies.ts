import { getMovies } from "@/service/movies";
import { useQuery } from "@tanstack/react-query";

export function useMovies(page: number) {
  return useQuery({
    queryKey: ["movies", page],
    queryFn: () => getMovies(page),
  });
}
