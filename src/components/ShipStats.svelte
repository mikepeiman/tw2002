<script>
import { fade } from 'svelte/transition';
export let ship, currentShip
</script>

<div class="ship-stats">

<h1>ship Stats</h1>
<span>name: {currentShip.name}</span>
<span>moves: {currentShip.moves}</span>
<span>currentShip: {currentShip}</span>

</div>

<style lang=scss>

.ship-stats {
  position: absolute;
  width: 100px;
  height: 300px;
  top: 0;
  right: 10px;
  background: rgba(0,0,0,0.75);
  color: white;
  padding: 1rem;
  border: 5px solid black;
  z-index: 999;
}

</style>
