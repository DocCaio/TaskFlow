import { render, screen } from "@testing-library/react";
import { Sobre } from "./Sobre";

describe("Sobre", () => {
  it("apresenta o projeto e a stack", () => {
    render(<Sobre />);

    expect(screen.getByRole("heading", { name: "Sobre" })).toBeInTheDocument();
    expect(screen.getByText(/TanStack Query/)).toBeInTheDocument();
    expect(screen.getByText(/Zustand/)).toBeInTheDocument();
  });
});
