import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "./routes/__root";
import { booksRoute } from "./routes/books";
import { genreRoute } from "./routes/genres";
import { homeRoute } from "./routes/authors";

const routeTree = rootRoute.addChildren([homeRoute, booksRoute, genreRoute]);

export const router = createRouter({
  routeTree,
  context: {},
});
