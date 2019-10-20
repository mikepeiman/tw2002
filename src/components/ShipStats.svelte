<script>
import { fade } from 'svelte/transition';
export let ship, currentShip
</script>

<div class="ship-stats info-panel">

<h1>Ship</h1>
<span class="data-stats">Type: {currentShip.name}</span>
<span class="data-stats">Moves: {currentShip.moves}</span>

</div>

<style lang=scss>

.data-stats {
  background: linear-gradient(90deg,rgba(255,100,155,0.75), rgba(155,100,255,0.75));
  padding: 0.15rem .35rem;
  margin: 1rem;
  line-height: 2rem;
}

.ship-stats {

}

</style>
