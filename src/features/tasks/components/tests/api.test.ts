import { createTask, deleteTask, getTask, listTasks, updateTask } from "../../api";

function ok(body: unknown, status = 200) {
  return new Response(body === undefined ? null : JSON.stringify(body), { status });
}

describe("tasks api", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it("listTasks faz GET /tasks", async () => {
    fetchMock.mockResolvedValue(ok([]));

    await listTasks();

    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/tasks$/), expect.anything());
  });

  it("getTask faz GET /tasks/:id", async () => {
    fetchMock.mockResolvedValue(ok({ id: 5 }));

    await getTask(5);

    expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(/\/tasks\/5$/), expect.anything());
  });

  it("createTask faz POST com o corpo em JSON", async () => {
    fetchMock.mockResolvedValue(ok({ id: 1 }, 201));

    await createTask({ title: "Nova" });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/tasks$/),
      expect.objectContaining({ method: "POST", body: JSON.stringify({ title: "Nova" }) }),
    );
  });

  it("updateTask faz PUT em /tasks/:id", async () => {
    fetchMock.mockResolvedValue(ok({ id: 2 }));

    await updateTask(2, { title: "Editada", status: "DONE" });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/tasks\/2$/),
      expect.objectContaining({ method: "PUT" }),
    );
  });

  it("deleteTask faz DELETE em /tasks/:id", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));

    await expect(deleteTask(3)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/tasks\/3$/),
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
