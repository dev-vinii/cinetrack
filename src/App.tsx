import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { useMovies } from "./hooks/useMovies";

function App() {
  const { data } = useMovies(1);

  return (
    <main className="w-screen bg-gray-100 !p-10 items-center flex flex-col gap-36 overflow-x-hidden">
      <section className="flex gap-2.5">
        <Input className="w-60" />
        <Button className="border border-black !p-2 cursor-pointer">
          Buscar
        </Button>
      </section>
      <section>
        <div className="grid grid-cols-3 gap-10">
          {data?.results.map((movie) => (
            <Card key={movie.id} className="w-72">
              <CardHeader>{movie.title}</CardHeader>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-96 object-cover"
              />
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
