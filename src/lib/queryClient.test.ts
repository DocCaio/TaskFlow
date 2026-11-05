import { createQueryClient } from "./queryClient";

describe("createQueryClient", () => {
  it("usa cache de 30s, 1 retry e não refaz a busca ao focar a janela", () => {
    const options = createQueryClient().getDefaultOptions().queries;

    expect(options).toMatchObject({ staleTime: 30_000, retry: 1, refetchOnWindowFocus: false });
  });
});
