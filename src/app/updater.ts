"use server";

import { getClient } from "@/ApolloClient";
import { gql } from "@/graphql/gql";

const MUTATION_INTERVAL = 2000;

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
  let currentIndex = 0;

  const intervalId = setInterval(() => {
    if (currentIndex < ids.length) {
      executeMutation(ids[currentIndex], intervalId);
      currentIndex++;
    } else {
      clearInterval(intervalId);
    }
  }, MUTATION_INTERVAL);
}

async function executeMutation(id: number, intervalId: NodeJS.Timeout) {
  try {
    const { data } = await getClient().mutate({
      mutation: SAVE_MEDIA_QUERY,
      variables: { mediaId: id },
    });
    console.log(data);
  } catch (error) {
    console.error(`Error executing mutation for id ${id}:`, error);
    clearInterval(intervalId);
  }
}
