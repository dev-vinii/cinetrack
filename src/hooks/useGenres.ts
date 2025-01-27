import { getGenres } from "@/service/genres";
import { useQuery } from "@tanstack/react-query";

export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres(),
  });
}
