import Image from "next/image";
import { Title } from "@/service/titles";

interface TitleCardProps {
  title: Title;
}

export function TitleCard({ title }: TitleCardProps) {
  const year = title.release_date?.slice(0, 4);
  const rating = title.vote_average ? title.vote_average.toFixed(1) : null;

  return (
    <article>
      <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-line bg-muted">
        {title.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${title.poster_path}`}
            alt={`Pôster de ${title.title}`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-mute">
            {title.title.charAt(0)}
          </div>
        )}
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm leading-snug font-medium text-ink">
        {title.title}
      </h3>
      <p className="mt-0.5 text-xs text-mute">
        {year}
        {year && rating ? " · " : null}
        {rating ? <span className="text-gold">{rating} ★</span> : null}
      </p>
    </article>
  );
}
