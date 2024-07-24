"use client";

import { gql } from "@/graphql";
import UpdateButton from "./updateButton";
import { useQuery } from "@apollo/client";

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

export default function Home() {
  const { loading, error, data } = useQuery(LIST_POPULAR_ANIME, {
    variables: { page: 1 },
  });

  if (loading) return <p>Loading...</p>;

  const medium = data?.Page?.media;

  if (error || !medium) return <p>Error</p>;

  const animeInfo = []
  for (const media of medium) {
    animeInfo.push({
      id: media?.id,
      title: media?.title?.native,
    });
  }

  console.log(data)
  console.log(animeInfo)

  return (
    <main>
      <h1>AniList Updater</h1>
      <UpdateButton />
    </main>
  );
}
