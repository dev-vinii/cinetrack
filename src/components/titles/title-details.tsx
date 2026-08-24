import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Star, Tv } from "lucide-react";
import { TitleDetails } from "@/service/title-details";

interface TitleDetailsViewProps {
  details: TitleDetails;
}

function formatRuntime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

export function TitleDetailsView({ details }: TitleDetailsViewProps) {
  const year = details.release_date?.slice(0, 4);
  const rating = details.vote_average
    ? details.vote_average.toFixed(1)
    : null;
  const mediaLabel = details.media === "tv" ? "Série" : "Filme";

  return (
    <div className="min-h-screen">
      <div className="relative bg-marquee text-white">
        {details.backdrop_path ? (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
              alt=""
              fill
              priority
              className="object-cover opacity-40"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-marquee via-marquee/80 to-marquee/40" />
          </>
        ) : (
          <div className="absolute inset-0 bg-marquee" />
        )}

        <div className="relative mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Voltar ao catálogo
          </Link>
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-10 sm:px-6 md:flex-row lg:px-8">
          <div className="relative mx-auto aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-md border border-white/10 bg-muted shadow-xl sm:mx-0 sm:w-56">
            {details.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                alt={`Pôster de ${details.title}`}
                fill
                priority
                sizes="(max-width: 640px) 192px, 224px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-semibold text-mute">
                {details.title.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-end gap-4">
            <div>
              <p className="text-sm font-medium tracking-wide text-gold uppercase">
                {mediaLabel}
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                {details.title}
              </h1>
              {details.tagline && (
                <p className="mt-2 text-base text-white/60 italic">
                  {details.tagline}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
              {year && <span>{year}</span>}
              {rating && (
                <span className="inline-flex items-center gap-1 text-gold">
                  <Star className="size-4 fill-gold" aria-hidden="true" />
                  {rating}
                  <span className="text-white/50">
                    ({details.vote_count.toLocaleString("pt-BR")} votos)
                  </span>
                </span>
              )}
              {details.runtime && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-4" aria-hidden="true" />
                  {formatRuntime(details.runtime)}
                </span>
              )}
              {details.seasons != null && (
                <span className="inline-flex items-center gap-1">
                  <Tv className="size-4" aria-hidden="true" />
                  {details.seasons}{" "}
                  {details.seasons === 1 ? "temporada" : "temporadas"}
                  {details.episodes != null && ` · ${details.episodes} eps.`}
                </span>
              )}
              {details.status && (
                <span className="rounded-full border border-white/20 px-2.5 py-0.5 text-xs">
                  {details.status}
                </span>
              )}
            </div>

            {details.genres.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <li
                    key={genre.id}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium"
                  >
                    {genre.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {details.overview && (
          <section className="mb-10">
            <h2 className="mb-3 text-lg font-semibold text-ink">Sinopse</h2>
            <p className="max-w-3xl leading-relaxed text-mute">
              {details.overview}
            </p>
          </section>
        )}

        {details.cast.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-ink">Elenco</h2>
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {details.cast.map((member) => (
                <li key={member.id}>
                  <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-line bg-muted">
                    {member.profile_path ? (
                      <Image
                        src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-mute">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-1 text-sm font-medium text-ink">
                    {member.name}
                  </p>
                  <p className="line-clamp-1 text-xs text-mute">
                    {member.character}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
