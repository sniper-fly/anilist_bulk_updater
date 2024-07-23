import { getClient } from "@/ApolloClient";
import { gql } from "@/graphql/gql";

const TEST_QUERY = gql(`
  query TEST_QUERY {
    MediaListCollection(userName: "felock", type: ANIME) {
      lists {
        entries {
          media {
            id
            status
            title {
              native
              romaji
              english
            }
          }
        }
      }
    }
  }
`);

export default async function Home() {
  // const { data } = await getClient().query({
  //   query: TEST_QUERY,
  // });
  // const entries = data?.MediaListCollection?.lists?.[0]?.entries
  // if (!entries) return "";
  // const titles = entries.map((entry) => entry?.media?.title?.native);

  // const medium = entries != undefined ? Array.from(entries) : null;
  return <main>
    <h1>AniList Updater</h1>

  </main>;
}
