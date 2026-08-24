import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGenres } from "@/hooks/use-genres";
import { useTitles } from "@/hooks/use-titles";
import {
  trackCatalogError,
  trackCatalogFilter,
  trackCatalogSearch,
} from "@/lib/datadog";
import { buildTitle } from "@/test/factories/title";
import { Catalog } from "./catalog";

vi.mock("@/hooks/use-titles", () => ({
  useTitles: vi.fn(),
}));

vi.mock("@/hooks/use-genres", () => ({
  useGenres: vi.fn(),
}));

vi.mock("@/lib/datadog", () => ({
  trackCatalogFilter: vi.fn(),
  trackCatalogSearch: vi.fn(),
  trackCatalogError: vi.fn(),
}));

const title = buildTitle({ title: "Inception" });

function mockCatalog(overrides: Partial<ReturnType<typeof useTitles>> = {}) {
  vi.mocked(useTitles).mockReturnValue({
    data: {
      page: 1,
      results: [title],
      total_pages: 1,
      total_results: 1,
    },
    isLoading: false,
    isError: false,
    isFetching: false,
    error: null,
    refetch: vi.fn(),
    ...overrides,
  } as ReturnType<typeof useTitles>);
}

describe("Catalog analytics", () => {
  beforeEach(() => {
    vi.mocked(useGenres).mockReturnValue({
      data: { genres: [{ id: 28, name: "Ação" }] },
    } as ReturnType<typeof useGenres>);
    mockCatalog();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("tracks catalog.filter when media changes", async () => {
    const user = userEvent.setup();
    render(<Catalog />);

    await user.click(screen.getByRole("button", { name: "Séries" }));

    expect(trackCatalogFilter).toHaveBeenCalledWith({
      media: "tv",
      year: undefined,
      sort: "popularity",
      changed: "media",
    });
  });

  it("tracks catalog.search after the query settles", () => {
    vi.useFakeTimers();
    render(<Catalog />);

    fireEvent.change(screen.getByRole("textbox", { name: "Buscar pelo título" }), {
      target: { value: "inception" },
    });

    expect(trackCatalogSearch).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(trackCatalogSearch).toHaveBeenCalledWith({
      queryLength: 9,
      media: "movie",
      genre: undefined,
      year: undefined,
      sort: "popularity",
    });
  });

  it("tracks catalog.fetch when titles fail to load", () => {
    const error = new Error("Falha ao buscar títulos");
    mockCatalog({ isError: true, data: undefined, error });

    render(<Catalog />);

    expect(trackCatalogError).toHaveBeenCalledWith(error, {
      media: "movie",
      page: 1,
      genre: undefined,
      year: undefined,
      queryLength: 0,
      sort: "popularity",
    });
  });
});
