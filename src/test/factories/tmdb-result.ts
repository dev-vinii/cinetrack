import { faker } from "@faker-js/faker";

export interface TmdbResultFixture {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
}

export function buildTmdbMovieResult(
  overrides: Partial<TmdbResultFixture> = {}
): TmdbResultFixture {
  const releaseDate = faker.date.past({ years: 30 });

  return {
    id: faker.number.int({ min: 1, max: 999_999 }),
    title: faker.lorem.words({ min: 1, max: 4 }),
    overview: faker.lorem.paragraph(),
    poster_path: `/${faker.string.alphanumeric(10)}.jpg`,
    release_date: releaseDate.toISOString().slice(0, 10),
    vote_average: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
    genre_ids: [],
    ...overrides,
  };
}

export function buildTmdbTvResult(
  overrides: Partial<TmdbResultFixture> = {}
): TmdbResultFixture {
  const firstAirDate = faker.date.past({ years: 20 });

  return {
    id: faker.number.int({ min: 1, max: 999_999 }),
    name: faker.lorem.words({ min: 1, max: 4 }),
    overview: faker.lorem.paragraph(),
    poster_path: `/${faker.string.alphanumeric(10)}.jpg`,
    first_air_date: firstAirDate.toISOString().slice(0, 10),
    vote_average: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
    genre_ids: [],
    ...overrides,
  };
}
