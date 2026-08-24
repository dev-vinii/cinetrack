import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { buildTitle } from "@/test/factories/title";
import { TitleCard } from "./title-card";

describe("TitleCard", () => {
  it("renders title, year and rating", () => {
    const title = buildTitle({
      title: "Inception",
      release_date: "2010-07-16",
      vote_average: 8.4,
    });

    render(<TitleCard title={title} />);

    expect(screen.getByRole("heading", { name: "Inception" })).toBeInTheDocument();
    expect(screen.getByText(/2010/)).toBeInTheDocument();
    expect(screen.getByText("8.4 ★")).toBeInTheDocument();
  });

  it("renders poster image when poster_path is provided", () => {
    const title = buildTitle({
      title: "Inception",
      poster_path: "/poster.jpg",
    });

    render(<TitleCard title={title} />);

    const image = screen.getByRole("img", { name: "Pôster de Inception" });
    expect(image).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/poster.jpg"
    );
  });

  it("renders title initial when poster is missing", () => {
    const title = buildTitle({
      title: "Inception",
      poster_path: null,
      vote_average: 0,
    });

    render(<TitleCard title={title} />);

    expect(screen.getByText("I")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
