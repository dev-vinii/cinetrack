import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { trackTitleOpen } from "@/lib/datadog";
import { buildTitle } from "@/test/factories/title";
import { TitleCard } from "./title-card";

vi.mock("@/lib/datadog", () => ({
  trackTitleOpen: vi.fn(),
}));

describe("TitleCard", () => {
  it("renders title, year and rating", () => {
    const title = buildTitle({
      title: "Inception",
      release_date: "2010-07-16",
      vote_average: 8.4,
    });

    render(<TitleCard media="movie" title={title} />);

    expect(screen.getByRole("heading", { name: "Inception" })).toBeInTheDocument();
    expect(screen.getByText(/2010/)).toBeInTheDocument();
    expect(screen.getByText("8.4 ★")).toBeInTheDocument();
  });

  it("links to the title details page", () => {
    const title = buildTitle({ id: 27205, title: "Inception" });

    render(<TitleCard media="movie" title={title} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/title/movie/27205");
  });

  it("tracks title.open when the card is clicked", async () => {
    const user = userEvent.setup();
    const title = buildTitle({ id: 27205, title: "Inception" });

    render(<TitleCard media="movie" title={title} />);
    await user.click(screen.getByRole("link"));

    expect(trackTitleOpen).toHaveBeenCalledWith({ media: "movie", id: 27205 });
  });

  it("renders poster image when poster_path is provided", () => {
    const title = buildTitle({
      title: "Inception",
      poster_path: "/poster.jpg",
    });

    render(<TitleCard media="movie" title={title} />);

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

    render(<TitleCard media="movie" title={title} />);

    expect(screen.getByText("I")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
