import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../StatusBadge";

describe("StatusBadge", () => {
  it.each([
    ["TODO", "A fazer"],
    ["DOING", "Em andamento"],
    ["DONE", "Concluída"],
  ] as const)("mostra o rótulo de %s", (status, label) => {
    render(<StatusBadge status={status} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
