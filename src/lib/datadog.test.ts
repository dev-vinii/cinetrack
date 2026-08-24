import { datadogRum } from "@datadog/browser-rum";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  initDatadogRum,
  trackCatalogError,
  trackCatalogFilter,
  trackCatalogSearch,
  trackTitleOpen,
} from "./datadog";

vi.mock("@datadog/browser-rum", () => ({
  datadogRum: {
    init: vi.fn(),
    addAction: vi.fn(),
    addError: vi.fn(),
    getInitConfiguration: vi.fn(),
  },
}));

describe("initDatadogRum", () => {
  const originalApplicationId = process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID;
  const originalClientToken = process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;

  afterEach(() => {
    process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID = originalApplicationId;
    process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN = originalClientToken;
    vi.clearAllMocks();
  });

  it("does not init without credentials", () => {
    delete process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID;
    delete process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN;

    initDatadogRum();

    expect(datadogRum.init).not.toHaveBeenCalled();
  });

  it("inits RUM when credentials are present", () => {
    process.env.NEXT_PUBLIC_DATADOG_APPLICATION_ID = "app-id";
    process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN = "client-token";

    initDatadogRum();

    expect(datadogRum.init).toHaveBeenCalledWith(
      expect.objectContaining({
        applicationId: "app-id",
        clientToken: "client-token",
        service: "cinetrack",
      })
    );
  });
});

describe("RUM actions", () => {
  beforeEach(() => {
    vi.mocked(datadogRum.getInitConfiguration).mockReturnValue({
      applicationId: "app-id",
      clientToken: "client-token",
    } as ReturnType<typeof datadogRum.getInitConfiguration>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("does not track when RUM is not initialized", () => {
    vi.mocked(datadogRum.getInitConfiguration).mockReturnValue(undefined);

    trackCatalogFilter({
      media: "movie",
      sort: "popularity",
      changed: "genre",
    });

    expect(datadogRum.addAction).not.toHaveBeenCalled();
  });

  it("tracks catalog.filter without empty fields", () => {
    trackCatalogFilter({
      media: "movie",
      genre: "",
      year: undefined,
      sort: "rating",
      changed: "sort",
    });

    expect(datadogRum.addAction).toHaveBeenCalledWith("catalog.filter", {
      media: "movie",
      sort: "rating",
      changed: "sort",
    });
  });

  it("tracks catalog.search with query length", () => {
    trackCatalogSearch({
      queryLength: 9,
      media: "tv",
      genre: "18",
      sort: "popularity",
    });

    expect(datadogRum.addAction).toHaveBeenCalledWith("catalog.search", {
      queryLength: 9,
      media: "tv",
      genre: "18",
      sort: "popularity",
    });
  });

  it("tracks title.open", () => {
    trackTitleOpen({ media: "movie", id: 27205 });

    expect(datadogRum.addAction).toHaveBeenCalledWith("title.open", {
      media: "movie",
      id: 27205,
    });
  });

  it("tracks catalog.fetch errors", () => {
    const error = new Error("Falha ao buscar títulos");

    trackCatalogError(error, {
      media: "movie",
      page: 2,
      queryLength: 0,
      sort: "popularity",
    });

    expect(datadogRum.addError).toHaveBeenCalledWith(error, {
      source: "catalog.fetch",
      media: "movie",
      page: 2,
      queryLength: 0,
      sort: "popularity",
    });
  });
});
