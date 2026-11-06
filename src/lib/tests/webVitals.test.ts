import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import { reportWebVitals } from "../webVitals";

vi.mock("web-vitals", () => ({
  onCLS: vi.fn(),
  onFCP: vi.fn(),
  onINP: vi.fn(),
  onLCP: vi.fn(),
  onTTFB: vi.fn(),
}));

describe("reportWebVitals", () => {
  it("registra o reporter em todas as métricas", () => {
    const reporter = vi.fn();

    reportWebVitals(reporter);

    for (const register of [onCLS, onFCP, onINP, onLCP, onTTFB]) {
      expect(register).toHaveBeenCalledWith(reporter);
    }
  });
});
