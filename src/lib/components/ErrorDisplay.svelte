<script lang="ts">
  import { CircleAlertIcon } from "@lucide/svelte";
  import { serializeError } from "serialize-error";

  const { error }: { error: unknown } = $props();

  const err = $derived(serializeError(error));
</script>

<div class="@container rounded-lg bg-rose-500/20 p-4 text-rose-800-200">
  <div class="flex flex-col gap-4 @lg:flex-row">
    <CircleAlertIcon class="shrink-0" />
    {err.message}
  </div>
</div>
