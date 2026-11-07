import { ApiError, getErrorMessage, request } from "./http";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("request", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("retorna o JSON quando a resposta é ok", async () => {
    fetchMock.mockResolvedValue(jsonResponse([{ id: 1 }]));

    await expect(request("/tasks")).resolves.toEqual([{ id: 1 }]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/tasks"),
      expect.objectContaining({ headers: expect.objectContaining({ "Content-Type": "application/json" }) }),
    );
  });

  it("retorna undefined em 204", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(request("/tasks/1", { method: "DELETE" })).resolves.toBeUndefined();
  });

  it("converte ProblemDetail em ApiError com erros por campo", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ detail: "Dados inválidos", errors: { title: "O título é obrigatório" } }, 400),
    );

    const error = await request("/tasks", { method: "POST" }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 400,
      message: "Dados inválidos",
      fieldErrors: { title: "O título é obrigatório" },
    });
  });

  it("usa mensagem padrão quando o erro não tem corpo JSON", async () => {
    fetchMock.mockResolvedValue(new Response("boom", { status: 500 }));

    await expect(request("/tasks")).rejects.toMatchObject({
      status: 500,
      message: "Ocorreu um erro inesperado.",
    });
  });

  it("avisa quando não consegue conectar", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(request("/tasks")).rejects.toMatchObject({
      status: 0,
      message: "Não foi possível conectar ao servidor.",
    });
  });
});

describe("getErrorMessage", () => {
  it("lê a mensagem de um Error", () => {
    expect(getErrorMessage(new Error("falhou"))).toBe("falhou");
  });

  it("usa mensagem padrão para valores desconhecidos", () => {
    expect(getErrorMessage("x")).toBe("Ocorreu um erro inesperado.");
  });
});
