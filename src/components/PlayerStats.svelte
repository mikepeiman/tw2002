<script>
import { fade } from 'svelte/transition';
export let turns, name, player
</script>

<div class="player-stats info-panel">

<h1>Player</h1>
<span class="data-stats">Name: {player.name}</span>
<span class="data-stats">Turns: {player.turns}</span>

</div>

<style lang=scss>

  .data-stats {
    background: linear-gradient(90deg,rgba(255,100,155,0.75), rgba(155,100,255,0.75));
    padding: 0.15rem .35rem;
    // line-height: 2rem;
  }

.player-stats {

}

</style>
