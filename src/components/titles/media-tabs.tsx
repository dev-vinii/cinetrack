"use client";

import { Media } from "@/service/titles";

const tabs: { value: Media; label: string }[] = [
  { value: "movie", label: "Filmes" },
  { value: "tv", label: "Séries" },
];

interface MediaTabsProps {
  media: Media;
  setMedia: (media: Media) => void;
}

export function MediaTabs({ media, setMedia }: MediaTabsProps) {
  return (
    <nav className="-mb-5 flex gap-6" aria-label="Tipo de título">
      {tabs.map((tab) => {
        const isActive = tab.value === media;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => setMedia(tab.value)}
            aria-current={isActive ? "page" : undefined}
            className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
              isActive
                ? "border-gold text-white"
                : "border-transparent text-white/50 hover:text-white/80"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
