<script>
import { fade } from 'svelte/transition';
export let sector, warp
</script>

<div class="svelte-universe" transition:fade  id="sector-{sector.id}">
  <div class="sector-details">
    <span class="sector-name">
      Sector
      <span class="sector-number" >{sector.id}</span>
    </span>
    <span class="warps-quota">
      warps quota:
      <span class="warps-quota-number">{sector.warpsQuota}</span>
    </span>
  </div>
  <div class="warps-group">
    <span class="sector-warps">
      OUT:
      {#each sector.outlinks as warp}
        <slot name="outlinks" warp={warp} class="warp" id="{sector.id}-{warp}">No outlinks here!</slot>
      {/each}
    </span>
    <span class="sector-warps">
      IN:
      {#each sector.inlinks as warp}
        <slot name="inlinks" warp={warp}>No outlinks here!</slot>
      {/each}
    </span>
  </div>
</div>

<style lang=scss>

  .sector-details {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.5rem;
    color: rgba(0, 0, 0, 0.75);
    & .sector-name {
      background: rgba(155, 55, 55, 0.75);
    }
    & .warps-quota {
      background: rgba(55, 55, 155, 0.75);
    }
  }

  .sector-number {
    color: #eee;
  }

  .svelte-universe {
    display: grid;
    padding: 0.5rem 1rem .5rem 0;
    border-left: 5px solid rgba(155, 25, 255, 1);
    grid-template-columns: 20% 80%;
    padding-left: 1rem;
    // grid-template-rows: 2rem auto;
    &:nth-child(even) {
      background: rgba(0, 0, 0, 0.1);
    }
  }

  .warps-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .sector-warps {
    display: grid;
    grid-template-columns: repeat(12, 5.25ch);
    grid-gap: 1ch;
  }

</style>
