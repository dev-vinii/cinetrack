import { getGenres } from "@/service/genres";
import { useQuery } from "@tanstack/react-query";

export function useGenres() {
  const { data } = useQuery({
    queryKey: ["genres"],
    queryFn: () => getGenres(),
  });

  // const createGenre = useMutation({
  //   mutationFn: (genre: Genre) => createGenre(genre),
  // });

  // const updateGenre = useMutation({
  //   mutationFn: (genre: Genre) => updateGenre(genre),
  // });

  // const deleteGenre = useMutation({
  //   mutationFn: (id: string) => deleteGenre(id),
  // });

  return { genres: data?.genres };
}
