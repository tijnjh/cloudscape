<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { $api as api } from "$lib/api/utils";
  import CollectionView from "$lib/components/CollectionView.svelte";
  import Main from "$lib/components/Main.svelte";
  import SearchBar from "$lib/components/SearchBar.svelte";
  import SegmentedPicker from "$lib/components/ui/SegmentedPicker.svelte";
  import { Collection } from "$lib/schemas/collection";
  import { Playlist } from "$lib/schemas/playlist.js";
  import { Track } from "$lib/schemas/track.js";
  import { User } from "$lib/schemas/user.js";
  import { createQuery } from "@tanstack/svelte-query";
  import { Debounced } from "runed";
  import { useSearchParams } from "runed/kit";
  import { match } from "ts-pattern";
  import * as v from "valibot";

  let { params } = $props();

  const searchParams = useSearchParams(
    v.object({
      q: v.optional(v.string(), ""),
    }),
    {
      noScroll: true,
      pushHistory: false,
    },
  );

  const debouncedQ = new Debounced(() => searchParams.q);

  const searchQuery = createQuery(() => ({
    queryKey: [
      "search",
      () => debouncedQ.current,
      () => params.kind,
      () => page.url.searchParams,
    ],
    queryFn: async () => {
      if (!debouncedQ.current) {
        return { collection: [] } as Collection<Track | Playlist | User>;
      }

      const path = match(params.kind)
        .with(undefined, () => "search")
        .otherwise(() => `search/${params.kind}`);

      return await api(path, {
        searchParams: page.url.searchParams,
      }).json(Collection(v.union([Track, Playlist, User])));
    },
  }));

  function onchange(str: string) {
    const path = match(str)
      .with("all", () => "")
      .otherwise(() => str);

    goto(resolve(`/search/${path}?q=${searchParams.q}`));
  }
</script>

<svelte:head>
  <title>results for '{debouncedQ.current}' - Cloudscape</title>
</svelte:head>

<Main>
  {#snippet left()}
    <SearchBar value={searchParams.q} />
  {/snippet}

  {#snippet right()}
    <SegmentedPicker
      options={["all", "tracks", "playlists", "users"]}
      current={match(params.kind)
        .with(undefined, () => "all")
        .otherwise(() => params.kind)}
      {onchange}
    />
    <CollectionView query={searchQuery} />
  {/snippet}
</Main>
