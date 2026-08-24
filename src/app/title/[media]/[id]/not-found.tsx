import Link from "next/link";

export default function TitleNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold text-ink">Título não encontrado</h1>
      <p className="text-mute">
        O filme ou série que você procura não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="rounded-md bg-ticket px-4 py-2 text-sm font-medium text-white hover:bg-ticket/90"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
