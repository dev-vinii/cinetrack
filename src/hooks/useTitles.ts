import { getTitles, Media, SortBy } from "@/service/titles";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type Param = {
  media: Media;
  page: number;
  genre?: string;
  year?: string;
  query?: string;
  sort?: SortBy;
};

export function useTitles({ media, page, genre, year, query, sort }: Param) {
  return useQuery({
    queryKey: ["titles", media, page, genre, year, query, sort],
    queryFn: () => getTitles({ media, page, genre, year, query, sort }),
    placeholderData: keepPreviousData,
  });
}
