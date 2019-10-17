<script>
import { fade } from 'svelte/transition';
export let ship, currentShip
</script>

<div class="ship-stats">

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
  position: absolute;
  width: 20ch;
  // height: 300px;
  top: 0;
  right: 1rem;
  background: #333;
  color: white;
  padding: 1rem;
  border: 5px solid black;
  z-index: 999;
}

</style>
