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
}

export function Filters({ genre, setGenre }: FiltersProps) {
  const { data: genres } = useGenres();

  return (
    <>
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
    </>
  );
}
