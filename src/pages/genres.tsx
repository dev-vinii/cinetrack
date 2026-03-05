import { useGenres } from "@/hooks/useGenres";

export function Genres() {
  const { genres } = useGenres();

  return (
    <div>
      <h1>Genres</h1>
      <ul>
        {genres?.map((genre) => (
          <li key={genre.id}>{genre.name}</li>
        ))}
      </ul>
    </div>
  );
}
