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
    <section className="flex items-center justify-center gap-6 w-full max-w-md mx-auto" role="search" aria-label="Movie filters">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400 font-medium" aria-hidden="true">🎭</span>
        <Select value={genre} onValueChange={(value) => setGenre(value)}>
          <SelectTrigger 
            className="w-44 p-3 bg-slate-800/50 backdrop-blur-sm border-slate-600/50 rounded-lg text-white hover:bg-slate-700/50 transition-colors duration-200 focus:ring-2 focus:ring-purple-500/50"
            aria-label="Select movie genre"
          >
            {genre
              ? genres?.genres.find((g) => g.id.toString() === genre)?.name
              : "Gênero"}
          </SelectTrigger>

          <SelectContent className="bg-slate-800/95 backdrop-blur-md border-slate-600/50 rounded-lg shadow-2xl">
            {genres?.genres.map((genre) => (
              <SelectItem 
                key={genre.id} 
                value={genre.id.toString()}
                className="text-white hover:bg-slate-700/50 focus:bg-slate-700/50 cursor-pointer"
              >
                {genre.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400 font-medium" aria-hidden="true">📅</span>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger 
            className="w-44 p-3 bg-slate-800/50 backdrop-blur-sm border-slate-600/50 rounded-lg text-white hover:bg-slate-700/50 transition-colors duration-200 focus:ring-2 focus:ring-purple-500/50"
            aria-label="Select release year"
          >
            {selectedYear || "Ano"}
          </SelectTrigger>
          <SelectContent className="bg-slate-800/95 backdrop-blur-md border-slate-600/50 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
            {years.map((year) => (
              <SelectItem 
                key={year} 
                value={year}
                className="text-white hover:bg-slate-700/50 focus:bg-slate-700/50 cursor-pointer"
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}
