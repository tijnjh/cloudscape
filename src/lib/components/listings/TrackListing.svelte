<script lang="ts">
  import { page } from "$app/state";
  import { favoriteTrackIds, global, nowPlaying } from "$lib/global.svelte";
  import type { Track } from "$lib/schemas/track";
  import GenericListing from "./GenericListing.svelte";
  import { ChevronRightIcon, StarIcon, StarOffIcon } from "@lucide/svelte";

  const { track }: { track: Track } = $props();

  const isFavorited = $derived(favoriteTrackIds.current.includes(track.id));
</script>

<GenericListing
  title={track.title}
  subtitle={track.user.username}
  thumbnail={{
    src: track.artwork_url,
    alt: `Album cover of ${track.title}`,
  }}
  onclick={() => {
    nowPlaying.current = track;

    setTimeout(() => {
      global.isPaused = false;
    }, 50);
  }}
  badges={track.policy === "SNIP" ? ["30s only"] : []}
  actions={[
    {
      label: isFavorited ? "Unfavorite" : "Favorite",
      icon: isFavorited ? StarOffIcon : StarIcon,
      onclick: () => {
        if (favoriteTrackIds.current.includes(track.id)) {
          favoriteTrackIds.current = favoriteTrackIds.current.filter(
            (id) => id !== track.id,
          );
          return;
        } else {
          favoriteTrackIds.current.push(track.id);
        }
      },
    },
    page.route.id !== "/[user]/[track]"
      ? {
          label: "Go to Track",
          icon: ChevronRightIcon,
          href: `/${track.user.permalink}/${track.permalink}`,
        }
      : undefined,
  ]}
/>
