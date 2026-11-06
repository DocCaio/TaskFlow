import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Layout } from "../layout/Layout";

describe("Layout", () => {
  it("renderiza navbar, conteúdo da rota e footer", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<p>Conteúdo da página</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByText("Conteúdo da página")).toBeInTheDocument();
    expect(screen.getByText(/todos os direitos reservados/i)).toBeInTheDocument();
  });
});
