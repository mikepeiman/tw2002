<script>
import { fade } from 'svelte/transition';
export let turns, name, player
</script>

<div class="player-stats">

<h1>Player Stats</h1>
<span>name: {player.name}</span>
<span>turns: {player.turns}</span>
<span>player: {player}</span>

</div>

<style lang=scss>

.player-stats {
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
