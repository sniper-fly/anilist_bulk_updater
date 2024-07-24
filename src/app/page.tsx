"use client";

import { gql } from "@/graphql";
import UpdateButton from "./updateButton";
import { useLazyQuery, useQuery } from "@apollo/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { extractAnimeInfo } from "./extractAnimeInfo";
import { AnimeInfo } from "./types";

const LIST_POPULAR_ANIME = gql(`
  query LIST_POPULAR_ANIME($page: Int) {
    Page(page: $page, perPage: 50) {
      media(sort: POPULARITY_DESC) {
        id
        title {
          native
        }
      }
    }
  }
`);

// {
//   variables: { page: 1 },
// }

export default function Home() {
  const [listAnime, { loading, error, data }] =
    useLazyQuery(LIST_POPULAR_ANIME);
  const [animeList, setAnimeList] = useState<AnimeInfo[]>([]);

  useEffect(() => {
    (async () => {
      for (let i = 1; i <= 5; i++) {
        const { data } = await listAnime({ variables: { page: i } });
        if (!data) return;
        setAnimeList((prev) => [...prev, ...extractAnimeInfo(data)]);
      }
    })();
  }, []);

  // const medium = data?.Page?.media;

  // if (error || !medium) return <p>Error</p>;

  // const animeInfo = [];
  // for (const media of medium) {
  //   if (!media || !media.id || !media?.title?.native) continue;

  //   animeInfo.push({
  //     id: media.id,
  //     title: media.title.native,
  //   });
  // }

  return (
    <main className="flex flex-row">
      <div className="w-1/3 p-10">
        <header className="py-4 text-2xl text-center font-bold">
          AniList Updater
        </header>
        <UpdateButton />
      </div>
      <div className="w-2/3 h-screen p-10">
        <ScrollArea className="h-full rounded-md border">
          <div className="p-4">
            {animeList.map((anime) => (
              <>
                <div key={anime.id} className="my-2 text-sm">
                  {anime.title}
                </div>
              </>
            ))}
            {loading && <p>Loading...</p>}
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}
