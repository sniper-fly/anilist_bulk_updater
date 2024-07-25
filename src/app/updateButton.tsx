"use client";

import updater from "./updater";

type Props = {
  animeIds: number[];
};

export default function UpdateButton({ animeIds }: Props) {
  function handleClick() {
    (async () => {
      await updater(animeIds);
    })();
  }

  return <button onClick={handleClick}>Update</button>;
}
