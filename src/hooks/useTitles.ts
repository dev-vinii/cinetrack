import { getTitles, Media } from "@/service/titles";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type Param = {
  media: Media;
  page: number;
  genre?: string;
  year?: string;
  query?: string;
};

export function useTitles({ media, page, genre, year, query }: Param) {
  return useQuery({
    queryKey: ["titles", media, page, genre, year, query],
    queryFn: () => getTitles({ media, page, genre, year, query }),
    placeholderData: keepPreviousData,
  });
}
