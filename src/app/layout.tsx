import type { Metadata } from "next";
import { Providers } from "./providers";
import "@/styles/index.css";

export const metadata: Metadata = {
  title: {
    default: "CineTrack — Descubra filmes",
    template: "%s | CineTrack",
  },
  description:
    "Busque filmes pelo título, filtre por gênero e ano, e explore o que está em alta no cinema.",
  openGraph: {
    title: "CineTrack",
    description:
      "Busque filmes pelo título, filtre por gênero e ano, e explore o que está em alta no cinema.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
