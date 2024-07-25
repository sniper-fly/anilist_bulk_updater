"use client";

import updater from "./updater";
import { gql } from "@/graphql";
import { useLazyQuery } from "@apollo/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { extractAnimeInfo } from "./extractAnimeInfo";
import { AnimeInfo } from "./types";
import { MediaSort } from "@/graphql/graphql";
import { useInView } from "react-intersection-observer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { MUTATION_INTERVAL } from "./constants";

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
  const [listAnime, { loading, error }] = useLazyQuery(LIST_POPULAR_ANIME);
  const [animeList, setAnimeList] = useState<AnimeInfo[]>([]);
  const [firstRank, setFirstRank] = useState(1);
  const [lastRank, setLastRank] = useState(20);
  const [progress, setProgress] = useState(0);

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

  function handleFirstRankChange(event: React.ChangeEvent<HTMLInputElement>) {
    const num = event.target.value as unknown as number;
    const first = Math.max(1, num);
    setFirstRank(Math.min(first, lastRank));
  }

  function handleLastRankChange(event: React.ChangeEvent<HTMLInputElement>) {
    const num = event.target.value as unknown as number;
    const last = Math.min(animeList.length, num);
    setLastRank(Math.max(firstRank, last));
  }

  function handleClick() {
    const animeIds = animeList
      .slice(firstRank - 1, lastRank)
      .map((anime) => anime.id);

    // progress が0かどうかで更新中かどうかを判断しているため、
    // クリックされた瞬間にprogressを0.1にするワークアラウンド
    setProgress(0.1);

    const intervalId = setInterval(() => {
      // jsでの割り算小数点どうなる？
      if (progress >= 100) {
        clearInterval(intervalId);
        return;
      }
      const increment = 100 / (lastRank - firstRank + 1);
      setProgress((prev) => Math.min(prev + increment, 100));
    }, MUTATION_INTERVAL);
    (async () => {
      await updater(animeIds);
      alert("Update Complete");
      clearInterval(intervalId);
      setProgress(0);
    })();
  }

  return (
    <>
      {error && (
        <div className="relative">
          <Alert className="fixed bottom-4 left-4 w-64" variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              API Rate Limit Exceeded. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <main className="flex flex-row">
        <div className="w-1/3 p-10 flex-col space-y-5">
          <header className="pt-4 text-2xl text-center font-bold">
            AniList Updater
          </header>

          <div className="flex flex-row justify-center space-x-1">
            <p>for</p>
            <a
              href="https://anilist.co/user/felock/"
              className="hover:text-blue-700 transition duration-200"
            >
              mirofaker
            </a>
          </div>

          <div className="flex flex-row space-x-4 items-center justify-center text-xl">
            <Input
              type="number"
              className="w-24"
              value={firstRank}
              onChange={handleFirstRankChange}
            />
            <div className=""> ~ </div>
            <Input
              type="number"
              className="w-24"
              value={lastRank}
              onChange={handleLastRankChange}
            />
          </div>

          <div className="flex justify-center">
            <Button disabled={progress != 0} onClick={handleClick}>
              Update
            </Button>
          </div>

          <Progress value={progress} />
        </div>
        <div className="w-2/3 h-screen p-10">
          <ScrollArea className="h-full rounded-md border">
            <div className="p-4">
              {animeList.map((anime, i) => {
                const rank = i + 1;
                const animeEntriesCls =
                  rank >= firstRank && rank <= lastRank
                    ? "my-2 text-sm bg-yellow-100"
                    : "my-2 text-sm";
                return (
                  <>
                    <div key={anime.id} className={animeEntriesCls}>
                      {i + 1 + ": " + anime.title}
                    </div>
                  </>
                );
              })}
              <div ref={ref}>{loading && <p>Loading...</p>}</div>
            </div>
          </ScrollArea>
        </div>
      </main>
    </>
  );
}
