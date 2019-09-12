<script>
  import { onMount } from "svelte";
  import seedrandom from "seedrandom";
  // import '../components/galaxy-generator.js'

  let galaxy = []; 
  let numberOfSectors = 50;


  onMount(() => {
    galaxy = JSON.parse(localStorage.getItem("galaxy"));
    generateGalaxy(50,1,6).then(g => {
      localStorage.setItem("galaxy", JSON.stringify(g))
      linkGalaxy(g)
    })
  });

  async function generateGalaxy(numberOfSectors, warpMin, warpMax) {
    // more possible settings:
    // warpDensity, oneWayWarpDensity
    let galaxy = []
    for (let syscount = 0; syscount < numberOfSectors; syscount++) {
      galaxy[syscount] = await makeSector(syscount, warpMin, warpMax);
    }
    localStorage.setItem("galaxy", JSON.stringify(galaxy));
    return galaxy
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
    }
    return sector
  }


  function linkGalaxy() {
    let galaxy = JSON.parse(localStorage.getItem("galaxy"));
    console.log(`from linkGalaxy(), localStorage galaxy: `)
    console.log(galaxy)
    galaxy.forEach(sector => {
      setOutlinks(sector, galaxy)
    });
    localStorage.setItem("galaxy", JSON.stringify(galaxy));
  }

  async function setOutlinks(sector, galaxy) {
    let needsLinks = sector.warpsQuota - sector.outlinks
      getValidSectorToLinkTo(needsLinks, sector, galaxy)
  }

  async function getValidSectorToLinkTo(count, sector, galaxy) {
    let warps = []
    while(count > 0) {
      // get random sector
      let rand = getRandomSector(galaxy)
      // check if it is valid:
      //    does not match current sector
      //    is not already in outlinks
      //    target has not hit warpsQuota >= inlinks.length or outlinks.length
      if(rand.id !== sector.id
        && !sector.outlinks.includes(rand.id)
        && !rand.outlinks.length >= rand.warpsQuota) {

      }


      warps.push(rand.id)
      count--
    }
    sector.outlinks = warps
    return warps
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
    border-bottom: 3px solid rgba(0, 50, 250, .5);
    transition: all .15s;
    &:hover {
      background: rgba(255,155,205, 0.25);
      border-bottom: 3px solid rgba(0, 50, 250, .75);
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
    <button id="generate-game" on:click={generateGalaxy(50, 1, 6)}>
      Generate New Universe
    </button>
    <button id="generate-links" on:click>Generate Sector Links</button>
    <button id="start-game">Start Game</button>
    <div id="controls" class="section group">
      <div class="col">
        <label for="galaxy">Galaxy:</label>
        <select id="galaxy" name="galaxy">
          <option value="1">Galaxy 1</option>
          <option value="2">Galaxy 2</option>
          <option value="3">Galaxy 3</option>
          <option value="4">Galaxy 4</option>
          <option value="5">Galaxy 5</option>
          <option value="6">Galaxy 6</option>
          <option value="7">Galaxy 7</option>
          <option value="8">Galaxy 8</option>
        </select>
      </div>
      <div class="col">
        <label for="alternate">Alternate:</label>
        <input
          type="checkbox"
          id="alternate"
          name="alternate"
          value="1"
          checked />
      </div>
      <div class="col">
        <label for="planet">Planet:</label>
        <select id="planet" name="planet" value="0">0</select>
      </div>
      <div id="info" class="col" />
    </div>

  </div>

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
</section>
