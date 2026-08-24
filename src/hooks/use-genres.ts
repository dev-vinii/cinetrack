import { getGenres } from "@/service/genres";
import { Media } from "@/service/titles";
import { useQuery } from "@tanstack/react-query";

export function useGenres(media: Media) {
  return useQuery({
    queryKey: ["genres", media],
    queryFn: () => getGenres(media),
    staleTime: 1000 * 60 * 60,
  });
}
