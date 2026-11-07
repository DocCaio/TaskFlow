import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";

// Cada página vira um chunk separado (code splitting por rota).
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        lazy: async () => ({ Component: (await import("../pages/Home")).Home }),
      },
      {
        path: "/sobre",
        lazy: async () => ({ Component: (await import("../pages/Sobre")).Sobre }),
      },
      {
        path: "/postar",
        lazy: async () => ({ Component: (await import("../pages/Postar")).Postar }),
      },
      {
        path: "/tarefas/:id/editar",
        lazy: async () => ({ Component: (await import("../pages/EditarTarefa")).EditarTarefa }),
      },
      {
        path: "*",
        lazy: async () => ({ Component: (await import("../pages/NotFound")).NotFound }),
      },
    ],
  },
]);
