<script lang="ts">
  import { resolve } from "$app/paths";
  import type { Comment } from "$lib/schemas/comment";
  import { formatDate } from "$lib/utils";
  import ListingThumbnail from "./ListingThumbnail.svelte";
  import Badge from "./ui/Badge.svelte";

  const { comment }: { comment: Comment } = $props();

  function formatTimestamp(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
</script>

<div class="flex gap-4">
  <a
    href={resolve("/[user]", { user: comment.user.permalink })}
    aria-label={comment.user.username}
    class="shrink-0"
  >
    <ListingThumbnail
      src={comment.user.avatar_url}
      alt={`Profile picture of ${comment.user.permalink}`}
      class="rounded-full"
    />
  </a>

  <div class="flex min-w-0 flex-col gap-1">
    <div class="flex items-center gap-2">
      <a
        href={resolve("/[user]", { user: comment.user.permalink })}
        class="truncate font-medium hover:underline"
      >
        {comment.user.username}
      </a>

      {#if comment.timestamp != null}
        <Badge label={`@ ${formatTimestamp(comment.timestamp)}`} />
      {/if}
    </div>

    <p class="whitespace-pre-wrap wrap-break-word text-base-600-400">
      {comment.body}
    </p>

    <span class="text-sm text-accent/50">
      {formatDate(comment.created_at)}
    </span>
  </div>
</div>
