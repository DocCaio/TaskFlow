import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("mostra o texto de direitos reservados", () => {
    render(<Footer />);

    expect(screen.getByText(/Caio/)).toBeInTheDocument();
    expect(screen.getByText(/todos os direitos reservados/i)).toBeInTheDocument();
  });
});