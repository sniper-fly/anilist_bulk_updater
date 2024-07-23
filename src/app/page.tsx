'use client'

import updater from "./updater";

export default function Home() {
  // const { data } = await getClient().query({
  //   query: TEST_QUERY,
  // });
  // const entries = data?.MediaListCollection?.lists?.[0]?.entries
  // if (!entries) return "";
  // const titles = entries.map((entry) => entry?.media?.title?.native);

  // const medium = entries != undefined ? Array.from(entries) : null;
  return <main>
    <h1>AniList Updater</h1>
    <button onClick={ () => { updater(); }} >Update</button>
  </main>;
}
