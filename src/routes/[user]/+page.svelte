<script lang="ts">
  import { getUserPlaylists, getUserTracks, resolveUser } from "$lib/api/user";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import QueryView from "$lib/components/QueryView.svelte";
  import SegmentedPicker from "$lib/components/ui/SegmentedPicker.svelte";
  import { paginated_limit } from "$lib/constants";
  import type { Collection } from "$lib/schemas/collection";
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
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
      const data = {
        id: userQuery.data!.id,
        offset: pageParam * paginated_limit,
        limit: paginated_limit,
      };
      let results: Collection<Track | Playlist>;
      switch (searchParams.kind) {
        case "playlists":
          results = await getUserPlaylists(data);
          break;
        default:
          results = await getUserTracks(data);
          break;
      }
      return results.collection;
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
