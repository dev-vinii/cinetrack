"use client";

import { useEffect, useRef, useState } from "react";
import { Filters } from "@/components/filters/filters";
import { MediaTabs } from "@/components/titles/media-tabs";
import { TitleGrid } from "@/components/titles/title-grid";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useTitles } from "@/hooks/use-titles";
import { useGenres } from "@/hooks/use-genres";
import {
  trackCatalogError,
  trackCatalogFilter,
  trackCatalogSearch,
} from "@/lib/datadog";
import { Media, SortBy } from "@/service/titles";

export function Catalog() {
  const [media, setMedia] = useState<Media>("movie");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState<string | undefined>();
  const [sort, setSort] = useState<SortBy>("popularity");
  const debouncedQuery = useDebouncedValue(query, 400);
  const { data: genres } = useGenres(media);
  const { data: titles, isLoading, isError, isFetching, error, refetch } = useTitles({
    media,
    page,
    genre,
    year,
    query: debouncedQuery,
    sort,
  });
  const lastSearch = useRef<string | null>(null);
  const lastError = useRef<unknown>(null);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (!trimmed) {
      lastSearch.current = null;
      return;
    }
    if (lastSearch.current === trimmed) return;
    lastSearch.current = trimmed;

    trackCatalogSearch({
      queryLength: trimmed.length,
      media,
      genre: genre || undefined,
      year,
      sort,
    });
    // Only the settled query should create a search event.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- filter fields are snapshot context
  }, [debouncedQuery]);

  useEffect(() => {
    if (!isError) {
      lastError.current = null;
      return;
    }

    const currentError = error ?? new Error("Falha ao buscar títulos");
    if (lastError.current === currentError) return;
    lastError.current = currentError;

    trackCatalogError(currentError, {
      media,
      page,
      genre: genre || undefined,
      year,
      queryLength: debouncedQuery.trim().length,
      sort,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- snapshot the filters at error time
  }, [isError, error]);

  const handleMediaChange = (value: Media) => {
    setMedia(value);
    setGenre("");
    setPage(1);
    trackCatalogFilter({ media: value, year, sort, changed: "media" });
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleGenreChange = (value: string) => {
    setGenre(value);
    setPage(1);
    trackCatalogFilter({
      media,
      genre: value || undefined,
      year,
      sort,
      changed: "genre",
    });
  };

  const handleYearChange = (value: string | undefined) => {
    setYear(value);
    setPage(1);
    trackCatalogFilter({
      media,
      genre: genre || undefined,
      year: value,
      sort,
      changed: "year",
    });
  };

  const handleSortChange = (value: SortBy) => {
    setSort(value);
    setPage(1);
    trackCatalogFilter({
      media,
      genre: genre || undefined,
      year,
      sort: value,
      changed: "sort",
    });
  };

  const genreName = genre
    ? genres?.genres.find((item) => item.id.toString() === genre)?.name
    : undefined;

  const resultLabel = (() => {
    const parts: string[] = [];
    if (debouncedQuery) parts.push(`“${debouncedQuery}”`);
    if (genreName) parts.push(genreName);
    if (year) parts.push(year);
    if (parts.length === 0) {
      return sort === "rating" ? "Melhor avaliados" : "Em alta agora";
    }
    return parts.join(" · ");
  })();

  const countLabel = media === "tv" ? "séries" : "filmes";

  return (
    <div className="min-h-screen">
      <header className="bg-marquee">
        <div className="h-1.5 bg-gold" />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="text-xl font-semibold tracking-tight text-white">
              Cine<span className="text-gold">Track</span>
            </h1>
            <p className="text-sm text-white/60">
              Busque por título, gênero e ano.
            </p>
          </div>
          <Filters
            media={media}
            query={query}
            setQuery={handleQueryChange}
            genre={genre}
            setGenre={handleGenreChange}
            selectedYear={year}
            setSelectedYear={handleYearChange}
            sort={sort}
            setSort={handleSortChange}
          />
          <MediaTabs media={media} setMedia={handleMediaChange} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold text-ink">{resultLabel}</h2>
          {titles && !isLoading && (
            <p className="text-sm text-mute">
              {titles.total_results.toLocaleString("pt-BR")} {countLabel}
              {titles.total_pages > 1 && (
                <span>
                  {" "}
                  · pág. {page} de {Math.min(titles.total_pages, 500)}
                </span>
              )}
            </p>
          )}
        </div>

        {isError && (
          <div className="rounded-lg border border-line bg-surface px-6 py-12 text-center">
            <p className="font-medium text-ink">
              Não foi possível carregar os títulos
            </p>
            <p className="mt-1 text-sm text-mute">
              Verifique sua conexão e tente de novo.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 rounded-md bg-ticket px-4 py-2 text-sm font-medium text-white hover:bg-ticket/90"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isError && isLoading && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <div className="aspect-[2/3] animate-pulse rounded-md bg-line" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-line" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-line" />
              </div>
            ))}
          </div>
        )}

        {!isError && !isLoading && (
          <TitleGrid
            media={media}
            titles={titles}
            page={page}
            setPage={setPage}
            isFetching={isFetching}
          />
        )}
      </main>
    </div>
  );
}
