"use server";

const SAVE_MEDIA_MUTATION = /* GRAPHQL */`
  mutation SAVE_MEDIA_MUTATION {
    SaveMediaListEntry(mediaId:1) {
      media {
        title {
          native
        }
      }
    }
  }
`

export default async function updater() {
  const token = process.env.AUTH_TOKEN;
  const url = "https://graphql.anilist.co";
  const options = {
    method: "POST",
    headers: {
      Authorization: token ? "Bearer " + token : "",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: SAVE_MEDIA_MUTATION,
    }),
  };

  fetch(url, options).then(handleResponse, handleError);

  function handleError(error: any) {
    console.log(error);
  }

  function handleResponse(response: any) {
    console.log(response);
  }
}
