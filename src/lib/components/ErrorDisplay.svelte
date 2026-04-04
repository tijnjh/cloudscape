<script lang="ts">
  import { CircleAlertIcon } from "@lucide/svelte";
  import { serializeError } from "serialize-error";

  const { error }: { error: unknown } = $props();

  const err = $derived(serializeError(error));
</script>

<div class="rounded-lg @container bg-rose-500/20 text-rose-800-200 p-4">
  <div class="flex flex-col gap-4 @lg:flex-row">
    <CircleAlertIcon class="shrink-0" />
    {err.message}
  </div>
</div>
