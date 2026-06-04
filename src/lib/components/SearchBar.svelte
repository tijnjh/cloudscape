<script lang="ts">
  import Input from "./ui/Input.svelte";
  import { SearchIcon } from "@lucide/svelte";

  let { value = $bindable() }: { value?: string } = $props();
</script>

<form action="/search" class="w-full">
  <Input
    type="text"
    name="q"
    placeholder="Search for artists, tracks or playlists..."
    class="w-full"
    id="search-input"
    icon={SearchIcon}
    bind:value
  />
</form>
