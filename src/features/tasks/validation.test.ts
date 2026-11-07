import { validateTask } from "./validation";

describe("validateTask", () => {
  it("aceita título e descrição válidos", () => {
    expect(validateTask({ title: "Ok", description: "" })).toEqual({});
  });

  it("exige título", () => {
    expect(validateTask({ title: "   ", description: "" }).title).toBe("O título é obrigatório");
  });

  it("limita o título a 120 caracteres", () => {
    const errors = validateTask({ title: "a".repeat(121), description: "" });
    expect(errors.title).toContain("120");
  });

  it("limita a descrição a 2000 caracteres", () => {
    const errors = validateTask({ title: "Ok", description: "a".repeat(2001) });
    expect(errors.description).toContain("2000");
  });
});
