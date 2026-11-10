import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";
import { env } from "./env";

export type VitalsReporter = (metric: Metric) => void;

export const defaultReporter: VitalsReporter = (metric) => {
  if (import.meta.env.DEV) {
    console.info(`[web-vitals] ${metric.name}`, Math.round(metric.value * 100) / 100, metric.rating);
  }

  if (env.vitalsUrl && typeof navigator.sendBeacon === "function") {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      page: window.location.pathname,
    });
    navigator.sendBeacon(env.vitalsUrl, body);
  }
};

export function reportWebVitals(reporter: VitalsReporter = defaultReporter) {
  onCLS(reporter);
  onFCP(reporter);
  onINP(reporter);
  onLCP(reporter);
  onTTFB(reporter);
}
