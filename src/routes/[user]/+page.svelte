<script lang="ts">
  import { page } from "$app/state";
  import { getUserPlaylists, getUserTracks, resolveUser } from "$lib/api/user";
  import AsyncView from "$lib/components/AsyncView.svelte";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { paginated_limit } from "$lib/constants";
  import type { Collection } from "$lib/schemas/collection";
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import { resource } from "runed";
  import { useSearchParams } from "runed/kit";
  import * as v from "valibot";

  const userResource = resource(
    () => page.params.user,
    () => resolveUser(page.params.user!),
  );

  const params = useSearchParams(
    v.object({
      kind: v.optional(v.picklist(["tracks", "playlists"]), "tracks"),
    }),
    {
      noScroll: true,
      pushHistory: false,
    },
  );

  const userDetailsQuery = createInfiniteQuery(() => ({
    queryKey: ["user", userResource.current?.id, params.kind],
    queryFn: async ({ pageParam = 0 }) => {
      const data = {
        id: userResource.current!.id,
        offset: pageParam * paginated_limit,
        limit: paginated_limit,
      };
      let results: Collection<Track | Playlist>;
      switch (params.kind) {
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
  <title>{userResource.current?.username}</title>
  <meta name="description" content={userResource.current?.description} />
  <link rel="icon" href={userResource.current?.avatar_url} />
  <meta name="og:image" content={userResource.current?.avatar_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <AsyncView resource={userResource}>
      {#snippet content(user)}
        <HeroSection
          pictureSrc={user.avatar_url}
          title={user.username}
          description={user.description}
          badges={[user.verified && "Verified"]}
          roundedPicture
        />
      {/snippet}
    </AsyncView>
  {/snippet}

  {#snippet right()}
    <div class="flex gap-2">
      {#each ["tracks", "playlists"] as const as kind (kind)}
        <Button
          variant={params.kind === kind ? "primary" : "secondary"}
          class="capitalize"
          onclick={() => (params.kind = kind)}
        >
          {kind}
        </Button>
      {/each}
    </div>

    <InfiniteQueryView query={userDetailsQuery} />
  {/snippet}
</Main>
