<script lang="ts" generics="T extends Collection<Track | Playlist | User>">
  import { page } from "$app/state";
  import { Collection } from "$lib/schemas/collection";
  import type { Playlist } from "$lib/schemas/playlist";
  import type { Track } from "$lib/schemas/track";
  import type { User } from "$lib/schemas/user";
  import QueryView from "./QueryView.svelte";
  import PlaylistListing from "./listings/PlaylistListing.svelte";
  import TrackListing from "./listings/TrackListing.svelte";
  import UserListing from "./listings/UserListing.svelte";
  import Button from "./ui/Button.svelte";
  import type { CreateQueryResult } from "@tanstack/svelte-query";

  const { query }: { query: CreateQueryResult<T> } = $props();

  function hijackUrl(url: string) {
    return url.replace(
      "https://api-v2.soundcloud.com",
      `${page.url.protocol}//${page.url.host}`,
    );
  }

  const offsetParam = $derived(
    Number(page.url.searchParams.get("offset") || "0"),
  );
</script>

<QueryView {query} isLoading={(q) => q.isPending || q.isFetching}>
  {#snippet content(data)}
    <div class="flex items-center justify-between">
      page {(offsetParam + 10) / 10}
      {#if data.next_href}
        <Button href={hijackUrl(data.next_href)}>next</Button>
      {/if}
    </div>
    {#each data.collection as listing (listing.id)}
      {#if listing.kind === "track"}
        <TrackListing track={listing} />
      {:else if listing.kind === "playlist"}
        <PlaylistListing playlist={listing} />
      {:else if listing.kind === "user"}
        <UserListing user={listing} />
      {/if}
    {/each}
  {/snippet}
</QueryView>
