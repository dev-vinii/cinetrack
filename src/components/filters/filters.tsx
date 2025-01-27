import { useGenres } from "@/hooks/useGenres";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

interface FiltersProps {
  genre: string;
  setGenre: (genre: string) => void;
  selectedYear?: string;
  setSelectedYear: (year: string) => void;
}

export function Filters({
  genre,
  setGenre,
  selectedYear,
  setSelectedYear,
}: FiltersProps) {
  const { data: genres } = useGenres();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1920 }, (_, i) =>
    (1920 + i).toString()
  ).reverse();

  return (
    <section className="gap-4 flex items-center justify-end w-full">
      <Select value={genre} onValueChange={(value) => setGenre(value)}>
        <SelectTrigger className="w-40 p-2 bg-white rounded-md border">
          {genre
            ? genres?.genres.find((g) => g.id.toString() === genre)?.name
            : "Gênero"}
        </SelectTrigger>

        <SelectContent className="bg-white shadow-2xl rounded-md border-none">
          {genres?.genres.map((genre) => (
            <SelectItem key={genre.id} value={genre.id.toString()}>
              {genre.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedYear} onValueChange={setSelectedYear}>
        <SelectTrigger className="w-40 p-2 bg-white rounded-md border">
          {selectedYear || "Selecione um ano"}
        </SelectTrigger>
        <SelectContent className="bg-white shadow-2xl rounded-md border-none max-h-60 overflow-y-auto">
          {years.map((year) => (
            <SelectItem key={year} value={year}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </section>
  );
}
