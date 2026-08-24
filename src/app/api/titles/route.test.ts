import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { buildTmdbMovieResult } from "@/test/factories/tmdb-result";
import { GET } from "./route";

const { tmdbFetchMock } = vi.hoisted(() => ({
  tmdbFetchMock: vi.fn(),
}));

vi.mock("@/lib/tmdb", () => ({
  tmdbFetch: tmdbFetchMock,
}));

function createRequest(search = "") {
  return new NextRequest(`http://localhost/api/titles${search}`);
}

function mockTmdbResponse(results: unknown[], overrides: Record<string, unknown> = {}) {
  tmdbFetchMock.mockResolvedValue(
    new Response(
      JSON.stringify({
        page: 1,
        total_pages: 1,
        total_results: results.length,
        results,
        ...overrides,
      }),
      { status: 200 }
    )
  );
}

describe("GET /api/titles", () => {
  beforeEach(() => {
    tmdbFetchMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses discover endpoint with popularity sort by default", async () => {
    const movie = buildTmdbMovieResult({ title: "Movie A" });
    mockTmdbResponse([movie]);

    const response = await GET(createRequest("?media=movie&page=1"));
    const body = await response.json();

    expect(tmdbFetchMock).toHaveBeenCalledWith(
      "/discover/movie",
      expect.any(URLSearchParams),
      expect.any(Object)
    );

    const params = tmdbFetchMock.mock.calls[0][1] as URLSearchParams;
    expect(params.get("sort_by")).toBe("popularity.desc");
    expect(body.results[0].title).toBe("Movie A");
  });

  it("uses rating sort and minimum vote count on discover", async () => {
    mockTmdbResponse([]);

    await GET(createRequest("?media=movie&sort=rating"));

    const params = tmdbFetchMock.mock.calls[0][1] as URLSearchParams;
    expect(params.get("sort_by")).toBe("vote_average.desc");
    expect(params.get("vote_count.gte")).toBe("100");
  });

  it("uses search endpoint when query is provided", async () => {
    mockTmdbResponse([
      buildTmdbMovieResult({
        title: "Matrix",
        release_date: "1999-03-31",
        vote_average: 8.7,
        genre_ids: [28],
      }),
    ]);

    await GET(createRequest("?media=movie&query=matrix"));

    expect(tmdbFetchMock).toHaveBeenCalledWith(
      "/search/movie",
      expect.any(URLSearchParams),
      expect.any(Object)
    );

    const params = tmdbFetchMock.mock.calls[0][1] as URLSearchParams;
    expect(params.get("query")).toBe("matrix");
  });

  it("filters search results by genre on the server", async () => {
    mockTmdbResponse([
      buildTmdbMovieResult({
        title: "Action Movie",
        vote_average: 6,
        genre_ids: [28],
      }),
      buildTmdbMovieResult({
        title: "Drama Movie",
        vote_average: 9,
        genre_ids: [18],
      }),
    ]);

    const response = await GET(
      createRequest("?media=movie&query=test&genre=28&sort=rating")
    );
    const body = await response.json();

    expect(body.results).toHaveLength(1);
    expect(body.results[0].title).toBe("Action Movie");
  });

  it("returns 500 when TMDB client throws", async () => {
    tmdbFetchMock.mockRejectedValue(new Error("TMDB_API_KEY não configurada"));

    const response = await GET(createRequest("?media=movie"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toMatch(/TMDB_API_KEY/);
  });
});
