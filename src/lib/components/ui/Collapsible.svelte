<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    summary,
  }: {
    children: Snippet;
    summary: string;
  } = $props();
</script>

<details class="relative overflow-hidden">
  <summary
    class="mb-2 w-fit cursor-pointer rounded-md bg-mist-300-700 px-4 py-1"
  >
    {summary}
  </summary>
  <div class="mb-32 pt-2">
    {@render children()}
  </div>
</details>
