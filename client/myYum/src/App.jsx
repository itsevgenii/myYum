import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import routes from "./routes";
import Login from "./pages/login/Login";

function App() {
  const [count, setCount] = useState(0);

  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
}

export default App;
