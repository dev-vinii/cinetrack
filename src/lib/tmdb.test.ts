import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getTmdbApiKey, tmdbFetch, tmdbHeaders } from "./tmdb";

describe("getTmdbApiKey", () => {
  const originalKey = process.env.TMDB_API_KEY;

  afterEach(() => {
    process.env.TMDB_API_KEY = originalKey;
  });

  it("returns trimmed API key", () => {
    process.env.TMDB_API_KEY = "  test-key  ";
    expect(getTmdbApiKey()).toBe("test-key");
  });

  it("returns undefined when key is empty", () => {
    process.env.TMDB_API_KEY = "   ";
    expect(getTmdbApiKey()).toBeUndefined();
  });
});

describe("tmdbHeaders", () => {
  const originalKey = process.env.TMDB_API_KEY;

  afterEach(() => {
    process.env.TMDB_API_KEY = originalKey;
  });

  it("throws when API key is missing", () => {
    delete process.env.TMDB_API_KEY;
    expect(() => tmdbHeaders()).toThrow(/TMDB_API_KEY/);
  });

  it("returns bearer authorization header", () => {
    process.env.TMDB_API_KEY = "secret-token";
    expect(tmdbHeaders()).toEqual({
      Accept: "application/json",
      Authorization: "Bearer secret-token",
    });
  });
});

describe("tmdbFetch", () => {
  const originalKey = process.env.TMDB_API_KEY;

  beforeEach(() => {
    process.env.TMDB_API_KEY = "secret-token";
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })))
    );
  });

  afterEach(() => {
    process.env.TMDB_API_KEY = originalKey;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("calls TMDB with path, query params and auth headers", async () => {
    const params = new URLSearchParams({ page: "1", language: "pt-BR" });

    await tmdbFetch("/discover/movie", params, { next: { revalidate: 300 } });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.themoviedb.org/3/discover/movie?page=1&language=pt-BR",
      expect.objectContaining({
        next: { revalidate: 300 },
        headers: {
          Accept: "application/json",
          Authorization: "Bearer secret-token",
        },
      })
    );
  });
});
