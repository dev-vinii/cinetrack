"use client";

import { useEffect } from "react";
import { TitleCard } from "@/components/titles/title-card";
import { Button } from "@/components/ui/button";
import { Media, TitleList } from "@/service/titles";
import {
  Pagination,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TitleGridProps {
  page: number;
  setPage: (page: number) => void;
  media: Media;
  titles: TitleList | undefined;
  isFetching?: boolean;
}

export function TitleGrid({
  page,
  setPage,
  media,
  titles,
  isFetching,
}: TitleGridProps) {
  const totalPages = Math.min(titles?.total_pages ?? 0, 500);
  const hasResults = (titles?.results.length ?? 0) > 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (!hasResults) {
    return (
      <div className="rounded-lg border border-line bg-surface px-6 py-12 text-center">
        <p className="font-medium text-ink">
          {media === "tv"
            ? "Nenhuma série encontrada"
            : "Nenhum filme encontrado"}
        </p>
        <p className="mt-1 text-sm text-mute">
          Tente outro título, gênero ou ano.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div
        className={`grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${
          isFetching ? "opacity-60" : "opacity-100"
        }`}
      >
        {titles?.results.map((title) => (
          <TitleCard key={title.id} media={media} title={title} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="flex items-center gap-1">
          <PaginationPrevious
            className={`cursor-pointer ${
              page <= 1 ? "pointer-events-none opacity-40" : ""
            }`}
            onClick={() => page > 1 && setPage(page - 1)}
            aria-label="Página anterior"
            aria-disabled={page <= 1}
          />

          {page > 1 && (
            <PaginationItem className="list-none">
              <Button
                type="button"
                variant="ghost"
                className="h-9 min-w-9"
                onClick={() => setPage(page - 1)}
              >
                {page - 1}
              </Button>
            </PaginationItem>
          )}

          <PaginationItem className="list-none">
            <span className="flex h-9 min-w-9 items-center justify-center rounded-md bg-ticket px-2.5 text-sm font-medium text-white">
              {page}
            </span>
          </PaginationItem>

          {page < totalPages && (
            <PaginationItem className="list-none">
              <Button
                type="button"
                variant="ghost"
                className="h-9 min-w-9"
                onClick={() => setPage(page + 1)}
              >
                {page + 1}
              </Button>
            </PaginationItem>
          )}

          <PaginationNext
            className={`cursor-pointer ${
              page >= totalPages ? "pointer-events-none opacity-40" : ""
            }`}
            onClick={() => page < totalPages && setPage(page + 1)}
            aria-label="Próxima página"
            aria-disabled={page >= totalPages}
          />
        </Pagination>
      )}
    </div>
  );
}
