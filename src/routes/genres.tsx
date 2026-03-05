import { Books } from "@/pages/books";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";

export const genreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/genres",
  component: Books,
});
