<script lang="ts">
  import GenericListing from "./GenericListing.svelte";

  const { user }: { user: SC.User } = $props();
</script>

<GenericListing
  title={`${user.username}`}
  subtitle={user.permalink}
  thumbnail={{
    src: user.avatar_url,
    alt: `Profile picture of ${user.permalink}`,
    class: "rounded-full",
  }}
  href={`/${user.permalink}`}
  badges={[user.verified && "Verified"]}
/>
