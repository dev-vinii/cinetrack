import { Card, CardFooter, CardHeader } from "@/components/ui/card";
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
    <section>
      <div className="flex flex-wrap gap-10 justify-center">
        {movies?.results.map((movie) => (
          <Card
            key={movie.id}
            className="w-80 p-8 shadow-2xl bg-white border-none"
          >
            <CardHeader className="text-center font-semibold text-base">
              {movie.title}
            </CardHeader>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-96 object-cover rounded-md"
            />
            <CardFooter className="text-sm !mt-2 justify-center">
              Nota: {movie.vote_average.toFixed(1)}
            </CardFooter>
          </Card>
        ))}

        <Pagination className="flex gap-2.5">
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => setPage(page > 1 ? page - 1 : page)}
          >
            Anterior
          </PaginationPrevious>

          {page > 1 && (
            <PaginationItem
              className="list-none flex items-center"
              onClick={() => setPage(page - 1)}
            >
              {page - 1}
            </PaginationItem>
          )}

          <PaginationItem className="list-none flex items-center font-bold">
            {page}
          </PaginationItem>

          <PaginationItem
            className="list-none flex items-center"
            onClick={() => setPage(page + 1)}
          >
            {page + 1}
          </PaginationItem>

          <PaginationNext
            className="cursor-pointer"
            onClick={() =>
              setPage(page + 1 <= (movies?.total_pages ?? 0) ? page + 1 : page)
            }
          >
            Próximo
          </PaginationNext>
        </Pagination>
      </div>
    </section>
  );
}
