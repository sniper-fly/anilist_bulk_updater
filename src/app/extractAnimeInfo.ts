import { List_Popular_AnimeQuery } from "@/graphql/graphql";
import { AnimeInfo } from "./types";

export function extractAnimeInfo(data: List_Popular_AnimeQuery): AnimeInfo[] {
  const medium = data?.Page?.media;

  if (!medium) return [];

  const animeInfo = [];
  for (const media of medium) {
    if (!media || !media.id || !media?.title?.native) continue;

    animeInfo.push({
      id: media.id,
      title: media.title.native,
    });
  }
  return animeInfo;
}
