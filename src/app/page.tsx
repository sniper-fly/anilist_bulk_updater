"use client";

import { gql } from "@/graphql";
import UpdateButton from "./updateButton";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { extractAnimeInfo } from "./extractAnimeInfo";
import { AnimeInfo } from "./types";
import { MediaSort } from "@/graphql/graphql";
import { useInView } from "react-intersection-observer";

const LIST_POPULAR_ANIME = gql(`
  query LIST_POPULAR_ANIME($page: Int, $sort: [MediaSort]) {
    Page(page: $page, perPage: 50) {
      media(sort: $sort, type: ANIME, countryOfOrigin: JP, format_not_in: [MUSIC]) {
        id
        title {
          native
        }
      }
    }
  }
`);

export default function Home() {
  const [offset, setOffset] = useState(0);
  const { ref, inView } = useInView();
  const [listAnime, { loading, error, data }] =
    useLazyQuery(LIST_POPULAR_ANIME);
  const [animeList, setAnimeList] = useState<AnimeInfo[]>([]);

  async function loadMoreAnime() {
    const { data } = await listAnime({
      variables: { page: offset + 1, sort: MediaSort.ScoreDesc },
    });
    if (!data) return;
    setAnimeList((prev) => [...prev, ...extractAnimeInfo(data)]);
    setOffset((prev) => prev + 1);
  }

  useEffect(() => {
    if (inView) {
      loadMoreAnime();
    }
  }, [inView]);

  return (
    <main className="flex flex-row">
      <div className="w-1/3 p-10">
        <header className="py-4 text-2xl text-center font-bold">
          AniList Updater
        </header>
        <UpdateButton animeIds={animeList.map((anime) => anime["id"])} />
      </div>
      <div className="w-2/3 h-screen p-10">
        <ScrollArea className="h-full rounded-md border">
          <div className="p-4">
            {animeList.map((anime, i) => (
              <>
                <div key={anime.id} className="my-2 text-sm">
                  {i + 1 + ": " + anime.title}
                </div>
              </>
            ))}
            <div ref={ref}>{loading && <p>Loading...</p>}</div>
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}
