import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renderiza os links Home, Sobre e Postar", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Sobre" })).toHaveAttribute("href", "/sobre");
    expect(screen.getByRole("link", { name: "Postar" })).toHaveAttribute("href", "/postar");
  });

  it("renderiza a logo", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByAltText("Logo")).toBeInTheDocument();
  });
});