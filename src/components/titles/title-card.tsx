import Link from "next/link";
import Image from "next/image";
import { Media, Title } from "@/service/titles";

interface TitleCardProps {
  media: Media;
  title: Title;
}

export function TitleCard({ media, title }: TitleCardProps) {
  const year = title.release_date?.slice(0, 4);
  const rating = title.vote_average ? title.vote_average.toFixed(1) : null;
  const href = `/title/${media}/${title.id}`;

  return (
    <article>
      <Link href={href} className="group block">
        <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-line bg-muted transition-shadow group-hover:shadow-md">
          {title.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${title.poster_path}`}
              alt={`Pôster de ${title.title}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-mute">
              {title.title.charAt(0)}
            </div>
          )}
        </div>
        <h3 className="mt-2 line-clamp-2 text-sm leading-snug font-medium text-ink group-hover:text-ticket">
          {title.title}
        </h3>
      </Link>
      <p className="mt-0.5 text-xs text-mute">
        {year}
        {year && rating ? " · " : null}
        {rating ? <span className="text-gold">{rating} ★</span> : null}
      </p>
    </article>
  );
}
