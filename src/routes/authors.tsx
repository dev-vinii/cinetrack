import { Authors } from "@/pages/authors";
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./__root";

export const authorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/authors",
  component: () => <Authors />,
});
