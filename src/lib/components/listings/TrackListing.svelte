<script module lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { favoriteTrackIds } from "$lib/global.svelte";
  import {
    ClipboardIcon,
    DiscIcon,
    SpeakerIcon,
    StarIcon,
    StarOffIcon,
    UserIcon,
  } from "@lucide/svelte";

  export function getTrackListingMenuActions(track: Track) {
    const isFavorited = favoriteTrackIds.current.includes(track.id);

    return [
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

      ...(page.route.id !== "/[user]/[track]"
        ? [
            {
              label: "Go to track",
              icon: DiscIcon,
              href: resolve("/[user]/[track]", {
                user: track.user.permalink,
                track: track.permalink,
              }),
            },
          ]
        : []),

      ...(page.route.id !== "/[user]"
        ? [
            {
              label: "Go to artist",
              icon: UserIcon,
              href: resolve("/[user]", {
                user: track.user.permalink,
              }),
            },
          ]
        : []),

      ...(!page.url.pathname.includes(`track-stations:${track.id}`)
        ? [
            {
              label: `Go to track station`,
              href: resolve("/[user]/sets/[playlist]", {
                user: "discover",
                playlist: `track-stations:${track.id}`,
              }),
              icon: SpeakerIcon,
            },
          ]
        : []),

      {
        label: "Copy track URL",
        icon: ClipboardIcon,
        onclick: () => {
          navigator.clipboard?.writeText(track.permalink_url);
        },
      },
    ];
  }
</script>

<script lang="ts">
  import { global, nowPlaying } from "$lib/global.svelte";
  import type { Track } from "$lib/schemas/track";
  import GenericListing from "./GenericListing.svelte";

  const { track }: { track: Track } = $props();
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
  actions={getTrackListingMenuActions(track)}
/>
