<script>
export let sector
</script>

<div class="svelte-universe">
  <div class="warps-group">
    <span class="sector-details sector-name">
      Sector
      <span class="sector-number">{sector.id}</span>
    </span>
    <span class="sector-details warps-quota">
      warps quota:
      <span class="warps-quota-number">{sector.warpsQuota}</span>
    </span>
  </div>
  <div class="warps-group">
    <span class="sector-warps">
      OUT:
      {#each sector.outlinks as warp}
        <span class="warp">{warp}</span>
      {/each}
    </span>
    <span class="sector-warps">
      IN:
      {#each sector.inlinks as warp}
        <span class="warp">{warp}</span>
      {/each}
    </span>
  </div>
</div>

<style lang=scss>

  .sector-details {
    padding: 0.25rem;
    color: rgba(0, 0, 0, 0.75);
    &.sector-name {
      background: rgba(155, 55, 55, 0.75);
    }
    &.warps-quota {
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
     animation-duration: 0.1s;
      animation-name: nodeInserted;
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
  .warp {
    padding: 0.25rem;
    margin-right: 0.25rem;
    width: 5ch;
    background: rgba(0, 0, 0, 0.1);
    border-bottom: 3px solid rgba(0, 50, 250, 0.5);
    transition: all 0.15s;
    &:hover {
      background: rgba(255, 155, 205, 0.25);
      border-bottom: 3px solid rgba(0, 50, 250, 0.75);
    }
  }

</style>
