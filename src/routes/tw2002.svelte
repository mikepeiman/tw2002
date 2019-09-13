<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  // import { galaxy } from "../store"
  import seedrandom from "seedrandom";
  // import '../components/galaxy-generator.js'

  $: galaxy = [];
  $: galSize = 50;
  $: warpMin = 5;
  $: warpMax = 5;

  onMount(() => {
    warpMin = document.getElementById("warpsMin").value;
    warpMax = document.getElementById("warpsMax").value;
    galSize = document.getElementById("galSize").value;
    generateGalaxy(galSize, warpMin, warpMax).then(g => {
      linkGalaxy(g);
      localStorage.setItem("galaxy", JSON.stringify(g));
      initGalaxy();
    });
  });

  function testKeyup(e) {
    console.log(e.keyCode);
    console.log("key pressed");
    e.keyCode === 13 ? newGalaxy() : console.log("other key pressed");
  }

  function startGame() {
    console.log(`startGame() triggered`);
  }

  function newGalaxy() {
    warpMin = document.getElementById("warpsMin").value;
    warpMax = document.getElementById("warpsMax").value;
    galSize = document.getElementById("galSize").value;

    generateGalaxy(galSize, warpMin, warpMax).then(g => {
      linkGalaxy(g);
      localStorage.setItem("galaxy", JSON.stringify(g));
      initGalaxy();
    });
  }

  function initGalaxy() {
    galaxy = JSON.parse(localStorage.getItem("galaxy"));
    return galaxy = galaxy;
  }

  function loadGalaxy() {
    console.log("loadGalaxy clicked");
    galaxy = JSON.parse(localStorage.getItem("galaxy"));
    console.log(galaxy);
    // return galaxy = galaxy
  }

  async function generateGalaxy(galSize, warpMin, warpMax) {
    // more possible settings:
    // warpDensity, oneWayWarpDensity
    let galaxy = [];
    for (let syscount = 0; syscount < galSize; syscount++) {
      galaxy[syscount] = await makeSector(syscount, warpMin, warpMax);
    }
    return galaxy;
  }

  function makeSector(syscount, warpMin, warpMax) {
    let sector = {};
    sector.id = syscount;
    sector.warpsQuota = getRandomInt(warpMin, warpMax);
    sector.inlinks = [];
    sector.outlinks = [];
    sector.shipsInSector = [];
    sector.accepting = {
      inlinks: true,
      outlinks: true
    };
    return sector;
  }

  function sortNumericArray(a, b) {
    return a - b;
  }

  async function linkGalaxy(galaxy) {
    console.log(`from linkGalaxy(), localStorage galaxy: `);
    console.log(galaxy);
    galaxy.forEach(sector => {
      let needsLinks = sector.warpsQuota - sector.outlinks;
      let warps = [];
      let overflow = 0;

      // don't run link generator if this sector is already full
      if (needsLinks > 0) {
        getValidSectorToLinkTo(needsLinks, overflow, warps, sector, galaxy);
      }

      sector.inlinks.sort(sortNumericArray);
      sector.outlinks.sort(sortNumericArray);
    });
    return galaxy;
  }

  async function getValidSectorToLinkTo(
    needsLinks,
    overflow,
    warps,
    sector,
    galaxy
  ) {
    // first check if this sector already has inlinks.
    // if so, for each inlink, add it to the outlinks array if it is not already there.
    // then, assign new needsLinks value for while loop

    if (sector.inlinks.length > 0) {
      sector.inlinks.forEach(link => {
        if (!sector.outlinks.includes(link)) {
          sector.outlinks.push(link);
        }
      });
    }
    needsLinks = sector.warpsQuota - sector.outlinks.length;

    // end inlinks check, now main while loop to randomly generate outlinks

    while (needsLinks > 0) {
      let rand = getRandomSector(galaxy);

      if (
        rand.id !== sector.id &&
        !sector.outlinks.includes(rand.id) &&
        rand.outlinks.length <= rand.warpsQuota
      ) {
        warps.push(rand.id);
        warps.sort();
        sector.outlinks.push(rand.id);
        sector.inlinks.push(rand.id);

        // only push inlink to the outlinked (rand) sector if it is not already at quota
        // if(rand.inlinks >= rand.warpsQuota) {
        rand.inlinks.push(sector.id);
        // }

        needsLinks--;
        overflow = 0;
        getValidSectorToLinkTo(needsLinks, overflow, warps, sector, galaxy);
      } else {
        ++overflow;
        if (overflow > 10) {
          return "Overflow error";
          needsLinks = 0;
          break;
          return -1;
        } else {
          getValidSectorToLinkTo(needsLinks, overflow, warps, sector, galaxy);
        }
      }
      return -1;
    }
  }

  function getRandomSector(galaxy) {
    return galaxy[Math.floor(Math.random() * galaxy.length)];
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let prng = seedrandom();
    let randomInRange = Math.floor(prng() * (max - min + 1)) + min;
    return randomInRange;
  }

  function getSector(id) {
    return galaxy[id];
  }

  class Sector {
    constructor(id, name, numOutlinks, outlinks, inlinks) {
      this.id = id;
      this.name = name;
      this.numOutlinks = numOutlinks;
      this.outlinks = outlinks;
      this.inlinks = inlinks;
    }

    getWarps() {
      return `Warps from this sector are ${this.warps}`;
    }
  }

  class Ship {
    constructor(id, name, baseCost, holds, moves) {
      this.id = id;
      this.name = name;
      this.baseCost = baseCost;
      this.holds = holds;
      this.moves = moves;
    }

    getCost() {
      return `Today's price is $${baseCost * 1.5}}`;
    }
  }
</script>

<style lang="scss">
  .tw2002 {
    // background: rgba(0, 0, 0, 0.15);
    // padding: 1rem;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .game {
    display: grid;
    grid-template-columns: 12% 12% 1fr;
    height: calc(80% + 5px);
  }

  
  .sector-list {
    width: auto;
    // height: 70vh;
    overflow-y: scroll;
    background: rgba(55, 155, 175, 0.35);
  }


  .commands-window {
    border-left: 5px solid rgba(155, 25, 255, 1);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    & label {
      color: rgba(155, 25, 255, 1);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 0 1rem 0;
    }
  }
  .game-menu {
    display: flex;
    flex-direction: column;
    justify-content: stretch;
  }
  .game-title {
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: 5px solid rgba(155, 25, 255, 1);
    padding: 1rem;
    & h1 {
      margin: 0;
    }
    & p {
      margin: 0;
      padding: 0;
    }
  }

  .controls {
    display: flex;
    flex-direction: column;
    // height: 4rem;
    margin-bottom: 1rem;
    &.subgroup {
      flex-direction: column;
      & label {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }

  input {
    background: rgba(0, 0, 255, 0.25);
    outline: none;
    border: 1px solid rgba(0, 0, 0, 0.25);
    padding: 0.25rem;
    width: 8ch;
    text-align: right;
    margin: 0.125rem;
    box-shadow: none;
    transition: all 0.25s;
    &:hover {
      background: rgba(255, 255, 255, 0.25);
      border: 1px solid rgba(155, 25, 255, 1);
    }
  }

  input[type="number"] {
    -webkit-appearance: textfield;
    -moz-appearance: textfield;
    appearance: textfield;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }

  button {
    background: rgba(0, 0, 255, 0.25);
    outline: none;
    border: none; // 1px solid rgba(155, 25, 255, 1);
    padding: 0 0.5rem;
    margin: .25rem;
    height: 3rem;
    box-shadow: none;
    transition: all 0.25s;
    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }
  }

  #start-game {
  }

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

<svelte:head>
  <title>About</title>
</svelte:head>
<section class="tw2002">
  <div class="game-header">
    <div class="game-title">
      <h1>TW2002 Redux:</h1>
      <p>Because I'm not done playing yet.</p>
    </div>
  </div>
  <div class="game">
    <div class="game-menu">
      <div class="controls">

        <button id="generate-game" on:click={newGalaxy}>
          Generate New Universe
        </button>
        <button id="generate-links" on:click={loadGalaxy}>
          Load Local Galaxy
        </button>
        <button id="generate-links" on:click={startGame}>Start Game</button>
        <div id="game-settings" class="controls subgroup">
          <label for="galSize">
            Galaxy size:
            <input
              type="number"
              value="50"
              name="galSize"
              id="galSize"
              on:keyup={testKeyup} />
          </label>
          <label for="warpsMin">
            Min warps:
            <input
              type="number"
              value="5"
              name="warpsMin"
              id="warpsMin"
              on:keyup={testKeyup} />
          </label>
          <label for="warpsMax">
            Max warps:
            <input
              type="number"
              value="5"
              name="warpsMax"
              id="warpsMax"
              on:keyup={testKeyup} />
          </label>
        </div>
      </div>
    </div>
    <div class="commands-window">
      <label for="command-input">
        Enter command:
        <input
          type="text"
          value=""
          name="command"
          id="command-input"
          on:keyup={testKeyup} />
      </label>
    </div>
    <div class="sector-list">
      {#each galaxy as sector}
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
      {/each}
    </div>
  </div>

</section>
