import { Card, CardHeader } from "@/components/ui/card";
import { Movies as MoviesType } from "@/service/movies";
import {
  Pagination,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MoviesProps {
  page: number;
  setPage: (page: number) => void;
  movies: MoviesType | undefined;
}

export function Movies({ page, setPage, movies }: MoviesProps) {
  return (
    <div className="flex flex-wrap gap-10 justify-center">
      {movies?.results.map((movie) => (
        <Card
          key={movie.id}
          className="group w-80 p-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 backdrop-blur-sm overflow-hidden"
          role="article"
          tabIndex={0}
        >
          <div className="relative overflow-hidden">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div 
              className="absolute top-3 right-3 bg-yellow-500/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1"
              aria-label={`Rating: ${movie.vote_average.toFixed(1)} out of 10`}
            >
              ⭐ {movie.vote_average.toFixed(1)}
            </div>
          </div>
          <CardHeader className="p-6 pb-4">
            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-purple-300 transition-colors duration-300">
              {movie.title}
            </h3>
          </CardHeader>
        </Card>
      ))}

      <div className="w-full flex justify-center mt-16">
        <Pagination className="flex items-center gap-3">
          <PaginationPrevious
            className="cursor-pointer bg-slate-800/50 backdrop-blur-sm border-slate-600/50 text-white hover:bg-slate-700/50 transition-all duration-200 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage(page > 1 ? page - 1 : page)}
            aria-label="Go to previous page"
            aria-disabled={page <= 1}
          >
            ← Anterior
          </PaginationPrevious>

          {page > 1 && (
            <PaginationItem
              className="list-none flex items-center cursor-pointer bg-slate-800/30 border-slate-600/30 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg"
              onClick={() => setPage(page - 1)}
            >
              {page - 1}
            </PaginationItem>
          )}

          <PaginationItem className="list-none flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold px-4 py-2 rounded-lg shadow-lg">
            {page}
          </PaginationItem>

          {page < (movies?.total_pages ?? 0) && (
            <PaginationItem
              className="list-none flex items-center cursor-pointer bg-slate-800/30 border-slate-600/30 text-gray-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg"
              onClick={() => setPage(page + 1)}
            >
              {page + 1}
            </PaginationItem>
          )}

          <PaginationNext
            className="cursor-pointer bg-slate-800/50 backdrop-blur-sm border-slate-600/50 text-white hover:bg-slate-700/50 transition-all duration-200 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() =>
              setPage(page + 1 <= (movies?.total_pages ?? 0) ? page + 1 : page)
            }
            aria-label="Go to next page"
            aria-disabled={page >= (movies?.total_pages ?? 0)}
          >
            Próximo →
          </PaginationNext>
        </Pagination>
      </div>
    </div>
  );
}
