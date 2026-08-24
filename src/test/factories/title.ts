import { faker } from "@faker-js/faker";
import { Title } from "@/service/titles";

export function buildTitle(overrides: Partial<Title> = {}): Title {
  const releaseDate = faker.date.past({ years: 30 });

  return {
    id: faker.number.int({ min: 1, max: 999_999 }),
    title: faker.lorem.words({ min: 1, max: 4 }),
    overview: faker.lorem.paragraph(),
    poster_path: `/${faker.string.alphanumeric(10)}.jpg`,
    release_date: releaseDate.toISOString().slice(0, 10),
    vote_average: faker.number.float({ min: 0, max: 10, fractionDigits: 1 }),
    ...overrides,
  };
}
