import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./routes/__root";
import { authorRoute } from "./routes/authors";
import { booksRoute } from "./routes/books";
import { genreRoute } from "./routes/genres";

const routeTree = rootRoute.addChildren([authorRoute, booksRoute, genreRoute]);

export const router = createRouter({
  routeTree,
  context: {},
});
