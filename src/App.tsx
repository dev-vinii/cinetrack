import { RouterProvider } from "@tanstack/react-router";
import { router } from "./route";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
