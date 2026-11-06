import { useTaskFilterStore } from "../tasks/store";

describe("useTaskFilterStore", () => {
  beforeEach(() => {
    useTaskFilterStore.getState().reset();
  });

  it("começa sem filtros", () => {
    expect(useTaskFilterStore.getState()).toMatchObject({ status: "ALL", search: "" });
  });

  it("atualiza o status e a busca", () => {
    useTaskFilterStore.getState().setStatus("DONE");
    useTaskFilterStore.getState().setSearch("react");

    expect(useTaskFilterStore.getState()).toMatchObject({ status: "DONE", search: "react" });
  });

  it("reset volta ao estado inicial", () => {
    useTaskFilterStore.getState().setStatus("DOING");
    useTaskFilterStore.getState().setSearch("x");
    useTaskFilterStore.getState().reset();

    expect(useTaskFilterStore.getState()).toMatchObject({ status: "ALL", search: "" });
  });
});
