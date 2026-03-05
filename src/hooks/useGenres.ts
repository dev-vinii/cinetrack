import { getGenres } from "@/service/genres";
import { useQuery } from "@tanstack/react-query";

export function useGenres() {
  return useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres(),
  });
  // quando for create usar useMutation
  // const createGenre = useMutation({
  //   mutationFn: (genre: Genre) => createGenre(genre),
  // });
}
