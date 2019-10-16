<script>
import { fade } from 'svelte/transition';
export let sector, warp
</script>

<div class="player-stats">

<h1>Player Stats</h1>
</div>

<style lang=scss>

.player-stats {
  position: absolute;
  width: 100px;
  height: 300px;
  top: 0;
  right: 100px;
}
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
