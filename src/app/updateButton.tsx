"use client";

import updater from "./updater";

export default function UpdateButton() {
  function handleClick() {
    (async () => {
      await updater();
    })();
  }

  return <button onClick={handleClick}>Update</button>;
}
