import { Loader } from "lucide-react";
import { useMovies } from "@/hooks/useMovies";

import { useState } from "react";
import { Filters } from "@/components/filters/filters";
import { Movies } from "@/components/movies/movies";

function App() {
  const [page, setPage] = useState(1);
  const [genre, setGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState<string | undefined>();
  const { data: movies, isLoading } = useMovies({ page, genre, selectedYear });

  const handleFilterChange = (
    newGenre: string,
    newYear: string | undefined
  ) => {
    setGenre(newGenre);
    setSelectedYear(newYear);
    setPage(1);
  };

  return (
    <main className="max-w-screen p-8 items-center flex flex-col gap-36">
      <section className="flex flex-col gap-4 items-center w-full">
        <h1 className="text-4xl font-bold text-center">Filmes Populares</h1>
        <Filters
          genre={genre}
          setGenre={(newGenre: string) =>
            handleFilterChange(newGenre, selectedYear)
          }
          selectedYear={selectedYear}
          setSelectedYear={(newYear: string) =>
            handleFilterChange(genre, newYear)
          }
        />
      </section>
      {isLoading && <Loader color="#000" className="animate-spin" size={48} />}
      {!isLoading && <Movies movies={movies} page={page} setPage={setPage} />}
    </main>
  );
}

export default App;
