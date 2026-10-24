import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { Home } from "../pages/Home";
import { Sobre } from "../pages/Sobre";
import { Postar } from "../pages/Postar";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/sobre", element: <Sobre /> },
      { path: "/postar", element: <Postar /> },
    ],
  },
]);