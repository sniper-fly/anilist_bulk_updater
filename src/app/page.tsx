"use client";

import updater from "./updater";

export default function Home() {
  function handleClick() {
    (async () => {
      await updater();
    })();
  }

  return (
    <main>
      <h1>AniList Updater</h1>
      <button onClick={handleClick}>Update</button>
    </main>
  );
}
