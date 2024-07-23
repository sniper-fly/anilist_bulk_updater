"use server";

import { getClient } from "@/ApolloClient";
import { gql } from "@/graphql/gql";

const SAVE_MEDIA_QUERY = gql(` 
  mutation SAVE_MEDIA_QUERY {
    SaveMediaListEntry(mediaId:1) {
      media {
        title {
          native
        }
      }
    }
  }
`);

export default async function updater() {
  const { data } = await getClient().mutate({
    mutation: SAVE_MEDIA_QUERY,
  });

  console.log(data);

  return data;
}
