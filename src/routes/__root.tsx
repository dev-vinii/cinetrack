import { createRootRoute, Outlet } from "@tanstack/react-router";

export const rootRoute = createRootRoute({
  component: () => (
    <div>
      {/* <Header /> */}
      <Outlet />
    </div>
  ),
});
