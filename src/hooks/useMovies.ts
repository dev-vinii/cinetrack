import { getMovies } from "@/service/movies";
import { useQuery } from "@tanstack/react-query";

type Param = {
  page: number;
  genre: string;
};

export function useMovies({ page, genre }: Param) {
  return useQuery({
    queryKey: ["movies", page, genre],
    queryFn: () => getMovies(page, genre),
  });
}
