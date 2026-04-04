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
    class="bg-mist-300-700 mb-2 w-fit px-4 py-1 cursor-pointer rounded-md"
  >
    {summary}
  </summary>
  <div class="pt-2 mb-32">
    {@render children()}
  </div>
</details>
