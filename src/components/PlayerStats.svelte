<script>
import { fade } from 'svelte/transition';
export let turns, name, player
</script>

<div class="player-stats">

<h1>Player</h1>
<span class="data-stats">Name: {player.name}</span>
<span class="data-stats">Turns: {player.turns}</span>

</div>

<style lang=scss>

  .data-stats {
    background: linear-gradient(90deg,rgba(255,100,155,0.75), rgba(155,100,255,0.75));
    padding: 0.15rem .35rem;
    margin: 1rem;
    line-height: 2rem;
  }

.player-stats {
  position: absolute;
  width: 20ch;
  // height: 300px;
  top: 0;
  right: 30ch;
  background: #333;
  color: white;
  padding: 1rem;
  border: 5px solid black;
  z-index: 999;
}

</style>
