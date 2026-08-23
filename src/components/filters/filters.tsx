"use client";

import { Search, X } from "lucide-react";
import { useGenres } from "@/hooks/useGenres";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Media, SortBy } from "@/service/titles";

interface FiltersProps {
  media: Media;
  query: string;
  setQuery: (query: string) => void;
  genre: string;
  setGenre: (genre: string) => void;
  selectedYear?: string;
  setSelectedYear: (year: string | undefined) => void;
  sort: SortBy;
  setSort: (sort: SortBy) => void;
}

export function Filters({
  media,
  query,
  setQuery,
  genre,
  setGenre,
  selectedYear,
  setSelectedYear,
  sort,
  setSort,
}: FiltersProps) {
  const { data: genres } = useGenres(media);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1920 }, (_, i) =>
    (1920 + i).toString()
  ).reverse();

  const selectedGenreName = genre
    ? genres?.genres.find((item) => item.id.toString() === genre)?.name
    : undefined;

  const hasActiveFilters = Boolean(query || genre || selectedYear);

  return (
    <section role="search" aria-label="Busca e filtros">
      <form
        className="flex flex-col gap-2 md:flex-row md:items-center"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Buscar pelo título</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-mute"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar pelo título..."
            className="h-10 pr-9 pl-9"
            autoComplete="off"
            name="q"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-mute hover:bg-muted hover:text-ink"
              aria-label="Limpar busca"
            >
              <X className="size-4" />
            </button>
          )}
        </label>

        <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
          <Select
            value={genre || "all"}
            onValueChange={(value) => setGenre(value === "all" ? "" : value)}
          >
            <SelectTrigger
              className="h-10 w-full md:w-44"
              aria-label="Filtrar por gênero"
            >
              {selectedGenreName ?? "Gênero"}
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">Todos os gêneros</SelectItem>
              {genres?.genres.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedYear ?? "all"}
            onValueChange={(value) =>
              setSelectedYear(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger
              className="h-10 w-full md:w-32"
              aria-label="Filtrar por ano"
            >
              {selectedYear ?? "Ano"}
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">Todos os anos</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as SortBy)}
          >
            <SelectTrigger
              className="h-10 w-full md:w-40"
              aria-label="Ordenar resultados"
            >
              {sort === "rating" ? "Melhor nota" : "Popularidade"}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularidade</SelectItem>
              <SelectItem value="rating">Melhor nota</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              className="h-10 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => {
                setQuery("");
                setGenre("");
                setSelectedYear(undefined);
              }}
            >
              Limpar
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}
