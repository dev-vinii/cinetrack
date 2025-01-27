import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useMovies } from "@/hooks/useMovies";
import {
  Pagination,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

function App() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMovies(page);

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <Loader color="#000" className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <main className="max-w-screen p-8 items-center flex flex-col gap-36">
      <section>
        <div className="flex flex-wrap gap-10 justify-center">
          {data?.results.map((movie) => (
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
              onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}
            >
              Anterior
            </PaginationPrevious>

            {page > 1 && (
              <PaginationItem
                className="list-none flex items-center"
                onClick={() => setPage(() => page - 1)}
              >
                {page - 1}
              </PaginationItem>
            )}

            <PaginationItem className="list-none flex items-center font-bold">
              {page}
            </PaginationItem>

            <PaginationItem
              className="list-none flex items-center"
              onClick={() => setPage(() => page + 1)}
            >
              {page + 1}
            </PaginationItem>

            <PaginationNext
              className="cursor-pointer"
              onClick={() =>
                setPage((prev) =>
                  data?.total_pages && prev + 1 <= data.total_pages
                    ? prev + 1
                    : prev
                )
              }
            >
              Próximo
            </PaginationNext>
          </Pagination>
        </div>
      </section>
    </main>
  );
}

export default App;
