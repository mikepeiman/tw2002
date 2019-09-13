<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  // import { galaxy } from "../store"
  import seedrandom from "seedrandom";
  // import '../components/galaxy-generator.js'

  //  galaxy = galaxy.useLocalStorage()
  $: galaxy = [];
  $: galSize = 50;
  $: warpMin = 5;
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

      // don't run link generator if this sector is already full
      if (needsLinks > 0) {
        getValidSectorToLinkTo(needsLinks, overflow, warps, sector, galaxy);
      }

      sector.inlinks.sort(sortNumericArray)
      sector.outlinks.sort(sortNumericArray)
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

    if(sector.inlinks.length > 0) {
      console.log(`some inlinks on sector [${sector.id}] with quota [${sector.warpsQuota}]`)
      sector.inlinks.forEach(link => {
        console.log(`link [${link}]`)
        if(!sector.outlinks.includes(link)) {
          sector.outlinks.push(link)
        }
      })
    }
    needsLinks = sector.warpsQuota - sector.outlinks.length
    console.log(`new outlinks: [${sector.outlinks}] and needsLinks ${needsLinks}`)

// end inlinks check, now main while loop to randomly generate outlinks

    while (needsLinks > 0) {
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

        // only push inlink to the outlinked (rand) sector if it is not already at quota
        // if(rand.inlinks >= rand.warpsQuota) {
          rand.inlinks.push(sector.id); 
        // }

        needsLinks--;
        overflow = 0;
        getValidSectorToLinkTo(needsLinks, overflow, warps, sector, galaxy)
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
          
          needsLinks = 0;
          break;
          return -1
        } else {
          // setTimeout(getValidSectorToLinkTo(needsLinks, overflow, warps, sector, galaxy), 1);
          getValidSectorToLinkTo(needsLinks, overflow, warps, sector, galaxy)
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
    // padding: 1rem;
    background: rgba(55, 155, 175, 0.35);
  }
  
  .sector-details {
    padding: .25rem;
    color: rgba(0,0,0,0.75);
    &.sector-name {
      background: rgba(155,55,55,0.75);
    }
    &.warps-quota {
      background: rgba(55,55,155,0.75);
    }

  }

 .sector-number {
      color: #eee;
    }


  .svelte-universe {
    display: grid;
    padding: 0.5rem 1rem;
    grid-template-columns: 20% 80%;
    // grid-template-rows: 2rem auto;
    &:nth-child(even) {
      background: rgba(0,0,0,0.1);
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
          <input type="number" value="50" name="galSize" id="galSize" />
        </label>
        <label for="warpsMin">
          Min warps:
          <input type="number" value="5" name="warpsMin" id="warpsMin" />
        </label>
        <label for="warpsMin">
          Max warps:
          <input type="number" value="5" name="warpsMax" id="warpsMax" />
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
        <div class="warps-group">
          <span class="sector-details sector-name">
            Sector <span class="sector-number">{sector.id}</span>
          </span>
          <span class="sector-details warps-quota">
            warps quota: <span class="warps-quota-number">{sector.warpsQuota}</span>
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
  <!-- {/if} -->
</section>
