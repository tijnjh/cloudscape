<script lang="ts">
  import { getUserPlaylists, getUserTracks, resolveUser } from "$lib/api/user";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import QueryView from "$lib/components/QueryView.svelte";
  import SegmentedPicker from "$lib/components/ui/SegmentedPicker.svelte";
  import { max_items_per_page } from "$lib/constants";
  import type { Playlist } from "$lib/schemas/playlist.js";
  import type { Track } from "$lib/schemas/track.js";
  import { match } from "$lib/utils.js";
  import { createInfiniteQuery, createQuery } from "@tanstack/svelte-query";
  import { useSearchParams } from "runed/kit";
  import * as v from "valibot";

  const { params } = $props();

  const userQuery = createQuery(() => ({
    queryKey: ["user", params.user],
    queryFn: () => resolveUser(params.user),
    enabled: !!params.user,
  }));

  const searchParams = useSearchParams(
    v.object({
      kind: v.optional(v.picklist(["tracks", "playlists"]), "tracks"),
    }),
    {
      noScroll: true,
      pushHistory: false,
    },
  );

  const userDetailsQuery = createInfiniteQuery(() => ({
    queryKey: ["user", userQuery.data?.id, searchParams.kind],
    queryFn: async ({ pageParam = 0 }) => {
      if (!userQuery.data) return [];

      const fn = match(searchParams.kind, {
        tracks: () => getUserTracks,
        playlists: () => getUserPlaylists,
      });

      const result = await fn({
        id: userQuery.data.id,
        offset: pageParam * max_items_per_page,
        limit: max_items_per_page,
      })

      return result.collection as (Track | Playlist)[]; // need to cast for some reason :P
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length,
  }));
</script>

<svelte:head>
  <title>{userQuery.data?.username}</title>
  <link rel="icon" href={userQuery.data?.avatar_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <QueryView query={userQuery}>
      {#snippet content(user)}
        <HeroSection
          pictureSrc={user.avatar_url}
          title={user.username}
          description={user.description}
          badges={[user.verified && "Verified"]}
          roundedPicture
        />
      {/snippet}
    </QueryView>
  {/snippet}

  {#snippet right()}
    <SegmentedPicker
      options={["tracks", "playlists"]}
      bind:current={searchParams.kind}
    />

    <InfiniteQueryView query={userDetailsQuery} />
  {/snippet}
</Main>
