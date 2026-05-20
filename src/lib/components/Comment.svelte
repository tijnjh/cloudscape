<script lang="ts">
  import { resolve } from "$app/paths";
  import { currentTime } from "$lib/global.svelte";
  import type { Comment } from "$lib/schemas/comment";
  import { formatMsToMinuteSecond } from "$lib/utils";

  const { comment }: { comment: Comment } = $props();

  const timestampSeconds = $derived(comment.timestamp / 1000);
</script>

<div class="flex gap-4">
  <img
    src={comment.user.avatar_url}
    alt="User avatar"
    class="size-8 rounded-full"
  />
  <div>
    <h4>
      <a
        class="cursor-pointer text-accent hover:underline"
        href={resolve(`/${comment.user.permalink}`)}
      >
        {comment.user.username}
      </a>
      <span class="text-base-600-400"> at </span>

      <button
        class="cursor-pointer text-accent hover:underline"
        onclick={() => (currentTime.current = timestampSeconds)}
      >
        {formatMsToMinuteSecond(comment.timestamp)}
      </button>
    </h4>
    <p class="bg-base-300-700 px-3 py-2 rounded-lg w-fit wrap-break-word">
      {comment.body}
    </p>
  </div>
</div>
