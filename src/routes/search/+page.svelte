<script lang="ts">
  import { scApi } from "$lib/api/utils";
  import InfiniteQueryView from "$lib/components/InfiniteQueryView.svelte";
  import Main from "$lib/components/Main.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import Input from "$lib/components/ui/Input.svelte";
  import { PAGINATION_LIMIT } from "$lib/constants";
  import { Collection } from "$lib/schemas/collection";
  import { Playlist } from "$lib/schemas/playlist";
  import { Track } from "$lib/schemas/track";
  import { User } from "$lib/schemas/user";
  import { SearchIcon } from "@lucide/svelte";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import { Debounced } from "runed";
  import { useSearchParams } from "runed/kit";
  import { match } from "ts-pattern";
  import * as v from "valibot";

  const params = useSearchParams(
    v.object({
      q: v.optional(v.string(), ""),
      kind: v.optional(v.picklist(["tracks", "playlists", "users"]), "tracks"),
    }),
    {
      noScroll: true,
      pushHistory: false,
    },
  );

  const debouncedQ = new Debounced(() => params.q);

  type Listing = Track | Playlist | User;

  const searchQuery = createInfiniteQuery(() => ({
    queryKey: ["search", debouncedQ.current, params.kind],
    queryFn: async ({ pageParam }) => {
      if (!debouncedQ.current) return [] as Listing[];

      const [kind, schema] = match(params.kind)
        .with("tracks", () => ["tracks", Track] as const)
        .with("playlists", () => ["playlists", Playlist] as const)
        .with("users", () => ["users", User] as const)
        .exhaustive();

      const res = await scApi(`/search/${kind}`, {
        schema: Collection(schema),
        params: {
          q: debouncedQ.current,
          offset: pageParam * PAGINATION_LIMIT,
          limit: PAGINATION_LIMIT,
        },
      });

      return res.match({
        ok: (v) => v.collection,
        err: () => [],
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length < PAGINATION_LIMIT ? allPages.length : undefined,
  }));
</script>

<svelte:head>
  <title>results for '{debouncedQ.current}' - Cloudscape</title>
</svelte:head>

<Main>
  {#snippet left()}
    <form
      onsubmit={(e) => {
        e.preventDefault();
        searchQuery.refetch();
      }}
      class="mx-auto flex w-full max-w-xl gap-2"
    >
      <Input
        type="text"
        bind:value={params.q}
        class="w-full"
        placeholder="Search"
        icon={SearchIcon}
      />
    </form>

    <div class="mx-auto flex w-full max-w-xl gap-2">
      {#each ["tracks", "playlists", "users"] as const as kind (kind)}
        {#key params.kind}
          <Button
            variant={params.kind === kind ? "primary" : "secondary"}
            class="capitalize"
            onclick={() => {
              params.kind = kind;
              searchQuery.refetch();
            }}
          >
            {kind}
          </Button>
        {/key}
      {/each}
    </div>
  {/snippet}

  {#snippet right()}
    <InfiniteQueryView query={searchQuery} />
  {/snippet}
</Main>
