import { getMovies } from "@/service/movies";
import { useQuery } from "@tanstack/react-query";

type Param = {
  page: number;
  genre: string;
  selectedYear?: string;
};

export function useMovies({ page, genre, selectedYear }: Param) {
  return useQuery({
    queryKey: ["movies", page, genre, selectedYear],
    queryFn: () => getMovies(page, genre, selectedYear),
  });
}
