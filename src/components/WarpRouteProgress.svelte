<script>
  export let currentRouteReversed, currentGalaxyTrace, routeLength;

  routeLength = currentRouteReversed.length
  console.log(`WarpRouteProgress component`)
  console.log(`currentRoute length ${routeLength}`)
  // let reversed = currentRoute.slice().reverse()
</script>

<style>
  .warp-progress-container {
    /* padding: .5rem 1rem 1rem 1rem; */
    background: rgba(55, 255, 0, 0.5);
    width: 100%;
    /* height: 1rem; */
    position: relative;
    border-bottom: 5px solid rgba(155, 25, 255, 1);
  }
  .warp-progress-container-child {
    /* height: 1rem; */
    display: flex;
    justify-content: center;
    width: 60vw;
  }

  .warp-route-trace {
    padding: .5rem 1rem;
    margin: .5rem;
    background: rgba(0, 0, 0, 0.5);
  }

</style>

<div class="warp-progress-container">
  <div class="warp-progress-container-child">
    {#each currentRouteReversed as warp}
      <div class="warp-route-trace">{warp}</div>
    {/each}
  </div>
</div>
