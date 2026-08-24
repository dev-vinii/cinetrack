import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TitleDetailsView } from "@/components/titles/title-details";
import { getTitleDetails } from "@/service/title-details";
import { Media } from "@/service/titles";

interface PageProps {
  params: Promise<{ media: string; id: string }>;
}

function parseMedia(value: string): Media | null {
  return value === "tv" ? "tv" : value === "movie" ? "movie" : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { media: mediaParam, id: idParam } = await params;
  const media = parseMedia(mediaParam);
  const id = Number(idParam);

  if (!media || Number.isNaN(id)) {
    return { title: "Título não encontrado" };
  }

  try {
    const details = await getTitleDetails(media, id);
    if (!details) return { title: "Título não encontrado" };

    return {
      title: details.title,
      description: details.overview || undefined,
      openGraph: {
        title: details.title,
        description: details.overview || undefined,
        images: details.poster_path
          ? [`https://image.tmdb.org/t/p/w500${details.poster_path}`]
          : undefined,
      },
    };
  } catch {
    return { title: "Título não encontrado" };
  }
}

export default async function TitlePage({ params }: PageProps) {
  const { media: mediaParam, id: idParam } = await params;
  const media = parseMedia(mediaParam);
  const id = Number(idParam);

  if (!media || Number.isNaN(id)) {
    notFound();
  }

  const details = await getTitleDetails(media, id);

  if (!details) {
    notFound();
  }

  return <TitleDetailsView details={details} />;
}
