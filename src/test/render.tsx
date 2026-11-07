import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "../context/ToastProvider";

interface Options {
  /** rota inicial, ex.: "/postar" */
  route?: string;
  /** padrão da rota que renderiza `ui`, ex.: "/tarefas/:id/editar" */
  path?: string;
}

/** Renderiza `ui` com Query, Toast e Router. Quando `path` não é "/", a rota "/" mostra "Página inicial". */
export function renderWithProviders(ui: ReactElement, { route = "/", path = "/" }: Options = {}) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={path} element={ui} />
            {path !== "/" && <Route path="/" element={<p>Página inicial</p>} />}
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </QueryClientProvider>,
  );
}
