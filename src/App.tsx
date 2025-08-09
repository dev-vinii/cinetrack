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
    <main className="min-h-screen w-full">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20" />
        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                🍿
              </div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                CineTrack
              </h1>
            </div>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Descubra os filmes mais populares e encontre sua próxima experiência cinematográfica
            </p>
            
            <div className="pt-8">
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader className="animate-spin text-purple-400" size={64} />
            <p className="text-gray-400 text-lg">Carregando filmes...</p>
          </div>
        )}
        {!isLoading && <Movies movies={movies} page={page} setPage={setPage} />}
      </div>
    </main>
  );
}

export default App;
