import { datadogRum } from "@datadog/browser-rum";
import type { Media, SortBy } from "@/service/titles";

export type CatalogFilterChanged = "media" | "genre" | "year" | "sort";

export type CatalogFilterContext = {
  media: Media;
  genre?: string;
  year?: string;
  sort: SortBy;
  changed: CatalogFilterChanged;
};

export type CatalogSearchContext = {
  queryLength: number;
  media: Media;
  genre?: string;
  year?: string;
  sort: SortBy;
};

export type TitleOpenContext = {
  media: Media;
  id: number;
};

export type CatalogErrorContext = {
  source: "catalog.fetch";
  media: Media;
  page: number;
  genre?: string;
  year?: string;
  queryLength: number;
  sort: SortBy;
};

function canTrack() {
  return Boolean(datadogRum.getInitConfiguration());
}

function compactContext<T extends Record<string, unknown>>(context: T) {
  return Object.fromEntries(
    Object.entries(context).filter(([, value]) => value !== undefined && value !== "")
  ) as T;
}

export function initDatadogRum() {
  const applicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID;
  const clientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;

  if (!applicationId || !clientToken) {
    return;
  }

  datadogRum.init({
    applicationId,
    clientToken,
    site: process.env.NEXT_PUBLIC_DATADOG_SITE ?? "datadoghq.com",
    service: "cinetrack",
    env: process.env.NODE_ENV,
    sessionSampleRate: 100,
    sessionReplaySampleRate: 0,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: "mask-user-input",
  });
}

export function trackCatalogFilter(context: CatalogFilterContext) {
  if (!canTrack()) return;
  datadogRum.addAction("catalog.filter", compactContext(context));
}

export function trackCatalogSearch(context: CatalogSearchContext) {
  if (!canTrack()) return;
  datadogRum.addAction("catalog.search", compactContext(context));
}

export function trackTitleOpen(context: TitleOpenContext) {
  if (!canTrack()) return;
  datadogRum.addAction("title.open", context);
}

export function trackCatalogError(error: unknown, context: Omit<CatalogErrorContext, "source">) {
  if (!canTrack()) return;
  datadogRum.addError(error, compactContext({ source: "catalog.fetch", ...context }));
}
