import { Books } from "@/pages/books";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";

export const booksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books",
  component: () => <Books />,
});
