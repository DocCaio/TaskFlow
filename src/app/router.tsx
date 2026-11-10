import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/layout/Layout";


export const router = createBrowserRouter([
  {
    element: <Layout />,

    hydrateFallbackElement: <p className="p-8 text-texto/70">Carregando...</p>,
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