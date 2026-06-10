<script lang="ts">
  import { isPaused, nowPlaying, showNowPlayingView } from "$lib/global.svelte";
  import ListingThumbnail from "./ListingThumbnail.svelte";
  import Button from "./ui/Button.svelte";
  import { motion } from "@humanspeak/svelte-motion";
  import { PauseIcon, PlayIcon } from "@lucide/svelte";
  import NumericText from "@numeric-text/svelte";
  import { fly } from "svelte/transition";

  const StatusIcon = $derived(isPaused.current ? PlayIcon : PauseIcon);
</script>

{#if !showNowPlayingView.current}
  <div
    in:fly={{ y: 100 }}
    class="fixed inset-x-2 bottom-2 z-30 mx-auto rounded-2xl bg-base-300-700/75 backdrop-blur-lg md:inset-x-4 md:bottom-4 md:max-w-xl"
  >
    <div class="grid grid-cols-[1fr_auto] items-center gap-4 p-3">
      <button
        onclick={() => (showNowPlayingView.current = true)}
        class="flex gap-4 truncate text-left"
      >
        <ListingThumbnail src={nowPlaying.current?.artwork_url} alt="" />

        <div class="flex w-full min-w-0 flex-col">
          <h3 class="truncate m-0 p-0">
            <NumericText
              class="inline-block"
              value={nowPlaying.current!.title}
            />
          </h3>
          <p class="truncate opacity-50">
            <NumericText
              class="inline-block"
              value={nowPlaying.current!.user.username}
            />
          </p>
        </div>
      </button>

      <Button
        size="icon"
        onclick={() => {
          isPaused.current = !isPaused.current;
        }}
      >
        <motion.div
          initial={{ rotate: 180, scale: 0, filter: "blur(10px)" }}
          animate={isPaused.current
            ? { rotate: 360, scale: 1, filter: "blur(0px)" }
            : { rotate: 180, scale: 1, filter: "blur(0px)" }}
        >
          <StatusIcon fill="currentColor" size={16} />
        </motion.div>
      </Button>
    </div>
  </div>
{/if}
