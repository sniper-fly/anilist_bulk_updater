"use server";

import { getClient } from "@/ApolloClient";
import { gql } from "@/graphql/gql";
import { MUTATION_INTERVAL } from "./constants";

const SAVE_MEDIA_QUERY = gql(` 
  mutation SAVE_MEDIA_QUERY($mediaId: Int!) {
    SaveMediaListEntry(mediaId: $mediaId) {
      media {
        title {
          native
        }
      }
    }
  }
`);

export default async function updater(ids: number[]) {
  return new Promise<void>((resolve) => {
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex < ids.length) {
        getClient().mutate({
          mutation: SAVE_MEDIA_QUERY,
          variables: { mediaId: ids[currentIndex] },
        });
        currentIndex++;
      } else {
        clearInterval(intervalId);
        resolve();
      }
    }, MUTATION_INTERVAL);
  });
}
