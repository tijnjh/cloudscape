<script lang="ts">
  import { page } from "$app/state";
  import { scApi, getPermalinkPath } from "$lib/api/utils";
  import HeroSection from "$lib/components/HeroSection.svelte";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import { PAGINATION_LIMIT } from "$lib/constants";
  import { Collection } from "$lib/schemas/collection";
  import { Playlist } from "$lib/schemas/playlist";
  import { Track } from "$lib/schemas/track";
  import { User } from "$lib/schemas/user";
  import AsyncResultQueryView from "../../lib/components/AsyncResultQueryView.svelte";
  import { createInfiniteQuery, createQuery } from "@tanstack/svelte-query";
  import { useSearchParams } from "runed/kit";
  import { match } from "ts-pattern";
  import * as v from "valibot";

  const userQuery = createQuery(() => ({
    queryKey: ["user", page.params.user],
    queryFn: () => scApi(getPermalinkPath(page.params.user!), { schema: User }),
    enabled: !!page.params.user,
  }));

  const params = useSearchParams(
    v.object({
      kind: v.optional(v.picklist(["tracks", "playlists"]), "tracks"),
    }),
    {
      noScroll: true,
      pushHistory: false,
    },
  );

  const user = $derived(
    userQuery.data?.match({
      ok: (v) => v,
      err: () => null,
    }),
  );

  const userDetailsQuery = createInfiniteQuery(() => ({
    queryKey: ["user", user?.id, params.kind],
    queryFn: async ({ pageParam = 0 }) => {
      const { id, offset, limit } = {
        id: user?.id ?? 0,
        offset: pageParam * PAGINATION_LIMIT,
        limit: PAGINATION_LIMIT,
      };
      let results: (Track | Playlist)[];

      results = (
        await scApi(`/users/${id}/${params.kind}`, {
          params: { limit, offset },
          headers: { "Accept-Language": "en-US,en;q=0.5" },
          schema: match(params.kind)
            .with("tracks", () => Collection(Track))
            .with("playlists", () => Collection(Playlist))
            .exhaustive(),
        })
      ).unwrap().collection;

      return results;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 0 ? undefined : allPages.length,
  }));
</script>

<svelte:head>
  <title>{user?.username}</title>
  <meta name="description" content={user?.description} />
  <link rel="icon" href={user?.avatar_url} />
  <meta name="og:image" content={user?.avatar_url} />
</svelte:head>

<Main>
  {#snippet left()}
    <AsyncResultQueryView query={userQuery}>
      {#snippet content(user)}
        <HeroSection
          pictureSrc={user.avatar_url}
          title={user.username}
          roundedPicture
        />
      {/snippet}
    </AsyncResultQueryView>
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
