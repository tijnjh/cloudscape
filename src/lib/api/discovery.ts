import { $api } from "./utils";

export async function getSelections() {
  return await $api<SC.Collection<SC.Selection<SC.Playlist | SC.User>>>(
    "/mixed-selections",
  );
}

export async function getRelatedTracks(id: number) {
  return await $api<SC.Collection<SC.Track>>(`/tracks/${id}/related`);
}

export async function getSearchSuggestions(query: string) {
  return await $api<
    SC.Collection<{
      output: string;
      query: string;
    }>
  >("/search/queries", {
    searchParams: { q: query },
  });
}
