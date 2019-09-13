<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  // import { galaxy } from "../store"
  import seedrandom from "seedrandom";
  // import '../components/galaxy-generator.js'

  //  galaxy = galaxy.useLocalStorage()
  $: galaxy = [];
  $: galSize = 15;
  $: warpMin = 1;
  $: warpMax = 5;
  // let galSize = 5;

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
    console.log(galaxy);
    return galaxy = galaxy
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
    sector.accepting = {
      inlinks: true,
      outlinks: true
    };
    return sector;
  }

  function sortNumericArray(a,b) {
    return a - b;
  }

  async function linkGalaxy(galaxy) {
    console.log(`from linkGalaxy(), localStorage galaxy: `);
    console.log(galaxy);
    galaxy.forEach(sector => {
      let needsLinks = sector.warpsQuota - sector.outlinks;
      let warps = [];
      let overflow = 0;
      getValidSectorToLinkTo(needsLinks, overflow, warps, sector, galaxy);
      sector.inlinks.sort(sortNumericArray)
      sector.outlinks.sort(sortNumericArray)
    });
    // galaxy.forEach(sector => {
    //   console.log(`BEFORE sorting sector links: inlinks ${sector.inlinks} outlinks ${sector.outlinks} `)
    //   sector.inlinks.sort(sortNumericArray)
    //   sector.outlinks.sort(sortNumericArray)
    //   console.log(`AFTER sorting sector links: inlinks ${sector.inlinks} outlinks ${sector.outlinks} `)
    // });
    return galaxy;
  }

  async function getValidSectorToLinkTo(
    count,
    overflow,
    warps,
    sector,
    galaxy
  ) {
    while (count > 0) {
      let rand = getRandomSector(galaxy);

      if (
        rand.id !== sector.id &&
        !sector.outlinks.includes(rand.id) &&
        rand.outlinks.length <= rand.warpsQuota
      ) {
        console.log(
          `@@@@@@@@@@@@@@@@@       sector [[[ ${sector.id} ]]] warp ### ${rand.id} ###  passed all tests  @@@@@@@@@@@@@@@@@@@@`
        );
        if (rand.id !== sector.id) {
          console.log(
            `rand.id ${rand.id} !== sector.id ${sector.id} --- ${rand.id !==
              sector.id}`
          );
        }
        if (!sector.outlinks.includes(rand.id)) {
          console.log(
            `!sector.outlinks[ ${sector.outlinks} ].includes(rand.id) ${
              rand.id
            } --- ${!sector.outlinks.includes(rand.id)}`
          );
        }
        if (rand.outlinks.length <= rand.warpsQuota) {
          console.log(
            `rand.outlinks.length ${rand.outlinks.length} <= rand.warpsQuota ${
              rand.warpsQuota
            } --- ${rand.outlinks.length <= rand.warpsQuota}`
          );
        }
        warps.push(rand.id);
        warps.sort();
        console.log(`Warps array currently: ${warps}`);
        sector.outlinks.push(rand.id);
        sector.inlinks.push(rand.id);
        count--;
        overflow = 0;
        getValidSectorToLinkTo(count, overflow, warps, sector, galaxy)
      } else {
        ++overflow;
        console.log("\n\n");
        console.log(
          `##########  We seem to have a problem with sector [[[ ${sector.id} ]]]  >>> WARP #${rand.id} <<<  OVERFLOW @${overflow} ### Not passing tests #############`
        );
        if (rand.id === sector.id) {
          console.log(
            `rand.id ${rand.id} === sector.id ${sector.id} --- ${rand.id ===
              sector.id}`
          );
        }
        if (sector.outlinks.includes(rand.id)) {
          console.log(
            `sector.outlinks[ ${sector.outlinks} ].includes(rand.id) ${
              rand.id
            } --- ${sector.outlinks.includes(rand.id)}`
          );
        }
        if (rand.outlinks.length > rand.warpsQuota) {
          console.log(
            `rand.outlinks.length ${rand.outlinks.length} > rand.warpsQuota ${
              rand.warpsQuota
            } --- ${rand.outlinks.length > rand.warpsQuota}`
          );
          // sector.outlinks = [];
        }
        console.log("\n\n");

        if (overflow > 10) {
          console.log(
            "Hit overflow of over 10 failed link tests! Galaxy size must be too small to accomodate warp conditions."
          );
          return "Overflow error"
          // warps = []
          
          count = 0;
          break;
          return -1
        } else {
          // setTimeout(getValidSectorToLinkTo(count, overflow, warps, sector, galaxy), 1);
          getValidSectorToLinkTo(count, overflow, warps, sector, galaxy)
        }
      }
      return -1
    }
    // sector.outlinks = warps
    // sector.inlinks = warps
    // return warps
  }

  function getRandomSector(galaxy) {
    return galaxy[Math.floor(Math.random() * galaxy.length)];
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let prng = seedrandom();
    let randomInRange = Math.floor(prng() * (max - min + 1)) + min;
    // console.log(`getRandomInt prng: ${prng()}, in range ${randomInRange}`)
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
    background: rgba(0, 0, 0, 0.15);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .game-menu {
    display: flex;
    flex-direction: row;
  }

  button {
    background: rgba(0, 0, 255, 0.25);
    outline: none;
    border: 1px solid rgba(155, 25, 255, 1);
    padding: 0.5rem;
    margin: 0 1rem 1rem 0;
    box-shadow: none;
    transition: all 0.25s;
    &:hover {
      background: rgba(255, 255, 255, 0.25);
      border-radius: 5px;
    }
  }
  #start-game {
  }

  .sector-list {
    width: 100vw;
    height: auto;
    padding: 1rem;
    background: rgba(55, 155, 175, 0.35);
  }

  .svelte-universe {
    display: grid;
    grid-template-columns: 20% 1fr;
    grid-template-rows: 2rem auto;
  }

  .sector-warps {
    display: grid;
    grid-template-columns: 100px 75px 75px repeat(10, 5.25ch);
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
  <h1>TW2002: Redux</h1>

  <p>Because I'm not done playing yet.</p>
  <div class="game-menu">
    <button id="generate-game" on:click={newGalaxy}>
      Generate New Universe
    </button>
    <button id="generate-links" on:click={loadGalaxy}>Load Local Galaxy</button>
    <div id="controls" class="section group">
      <div class="col">
        <label for="galSize">
          Galaxy size:
          <input type="number" value="15" name="galSize" id="galSize" />
        </label>
        <label for="warpsMin">
          Min warps:
          <input type="number" value="2" name="warpsMin" id="warpsMin" />
        </label>
        <label for="warpsMin">
          Max warps:
          <input type="number" value="6" name="warpsMax" id="warpsMax" />
        </label>
      </div>
    </div>

  </div>
  <!-- {#if process.browser} -->
  <div class="sector-list">
    <div id="galaxy_info" />
  </div>
  <div class="sector-list">
    {#each galaxy as sector}
      <div class="svelte-universe">
        <span class="sector-details">
          Sector {sector.id}: {sector.name} |||
        </span>
        <span class="sector-warps">
          warps quota:
          <span class="warp">{sector.warpsQuota}</span>
          warps:
          {#each sector.outlinks as warp}
            <span class="warp">{warp}</span>
          {/each}
        </span>
      </div>
    {/each}
  </div>
  <!-- {/if} -->
</section>
