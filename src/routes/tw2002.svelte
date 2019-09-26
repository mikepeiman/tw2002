<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import shipsData from "../store/shipsData.json";
  import SectorComponent from ".././components/SectorComponent.svelte";
  import Modal from ".././components/Modal.svelte";

  // import { galaxy } from "../store"
  import seedrandom from "seedrandom";
  // import '../components/galaxy-generator.js'

  $: galaxy = [];
  $: galSize = 50;
  $: warpMin = 5;
  $: warpMax = 5;
  $: currentSectorId = 0;
  $: currentSectorMatch = false;
  $: currentGalaxyTrace = [];
  $: allShipsInGame = [];
  $: preGameSetup = true;
  $: command = "";
  // $: matches = 1;
  let modal, keyTrigger;
  // $: sectorList = document.getElementById('sector-list');

  onMount(() => {
    warpMin = document.getElementById("warpsMin").value;
    warpMax = document.getElementById("warpsMax").value;
    galSize = document.getElementById("galSize").value;
    generateGalaxy(galSize, warpMin, warpMax).then(galaxy => {
      linkGalaxy(galaxy);
      localStorage.setItem("galaxy", JSON.stringify(galaxy));
      initGalaxy();
    });
  });

  function generateGalaxyWithNewProps(e) {
    console.log(e.keyCode);
    console.log("key pressed");
    e.keyCode === 13 ? newGalaxy() : console.log("other key pressed");
  }

  function startGame() {
    console.log(`startGame() triggered`);
    // create player
    let player = new Player("Mike");
    // create player's starting ship
    let ship = new ShipFactory(0, player);
    console.log(shipsData);
    console.log(`Ship type name: ${ship.type.name}`);
    console.log(`Ship owner name: ${ship.owner.name}`);
    console.log(`Ship ID: ${ship.id}`);
    // (load and save functionality will come later)
    // place player/ship in sector 0
    ship.location = 0;
    currentGalaxyTrace = [];
    currentGalaxyTrace = [...currentGalaxyTrace, galaxy[ship.location]];
    preGameSetup = false;
  }

  function travelTo(id) {
    setTimeout(() => {
      let sectorList = document.getElementById("sector-list");
      let sectors = sectorList.children;
      let sectorListLength = sectors.length;
      let lastSector = currentGalaxyTrace[sectorListLength - 1];
      let lastSectorEl = sectors[sectorListLength - 1];
      sectorList.scrollBy({
        top: lastSectorEl.offsetHeight,
        behavior: "smooth"
      });
    }, 1);
  }

  function warpTo(sectorId, warpId) {
    // renderDuplicateSectorIds(sectorId, warpId)
    let validWarpId = updateCurrentGalaxyTrace(warpId);
    travelTo(validWarpId);
    // console.log(
    //   `inside warpTo, let's clear that input field value!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`
    // );
    // let input = document.getElementById("command-input");
    // input.value = "";
  }

  function isThisSectorInstantiatedAlready(sector) {
    let matches = currentGalaxyTrace.filter(s => s === sector).length;
    console.log(
      `$$$$$$$$$$$$$$$ inside isThisSectorInstantiatedAlready, sectors matching ${sector} are: ${matches}`
    );
    galaxy[sector].instances = matches;
    // return `sector-${sector}-outlink-${warp}-instance-${matches}`
    // another way to do this, rather than unique IDs for every warp, is to remove the IDs from prior instances.
    // Can you think of any use case where you'd need them?
  }

  function updateCurrentGalaxyTrace(id) {
    if (id !== "random") {
      console.log(`############################################`);
      console.log(`warpTo direct requested: ${id}`);
      console.log(`currentSectorId: ${currentSectorId}`);
      isThisSectorInstantiatedAlready(id);
      if (galaxy[currentSectorId].outlinks.includes(parseInt(id))) {
        let oldSectorLink = document.getElementById(
          `sector-${currentSectorId}-outlink-${id}`
        );
        console.log(`sector-${currentSectorId}-outlink-${id}`);
        oldSectorLink.classList = "warp warp-highlight-completed";
        currentSectorId = id;
        let newSector = galaxy[id];

        currentGalaxyTrace = [...currentGalaxyTrace, newSector];
        localStorage.setItem(
          "currentGalaxyTrace",
          JSON.stringify(currentGalaxyTrace)
        );
        console.log(`warpTo requested: ${id}`);
        console.log(`currentSectorId: ${currentSectorId}`);
        return id;
      } else {
        console.log("... sorry, it is not a direct jump from our sector");
        insertNotification();
        return false;
      }
    } else {
      console.log("else random sector");
      let newSector = getRandomSector(galaxy);
      currentGalaxyTrace = [...currentGalaxyTrace, newSector];
      return newSector.id;
    }
  }

  function renderDuplicateSectorIds(sectorId, warpId) {
    // let currentSectorCount = 1
    // "sector-{sector.id}-outlink-{warp}"
    console.log(`sectorId ${sectorId}, warpId ${warpId}`);
    let sectorCount = currentGalaxyTrace.filter(
      sector => sector.id === sectorId
    ).length;
    console.log(`sectorCount: ${sectorCount}`);
  }

  function insertNotification() {
    console.log(`insertNotification`);
    let el = document.createElement("div");
    el.classList = "warning invalid-sector";
    el.textContent = "Error! Error! Not a valid warp! ABORTING * * *";
    let sectorList = document.getElementById("sector-list");
    sectorList.appendChild(el);
  }

  function getLocationOfLastSector() {
    let sectorList = document.getElementById("sector-list");
    console.log(sectorList);
  }

  async function runGameWatcher(end) {
    for (let i = 0; i < end; i++) {
      let t = setInterval(() => {
        console.log(`runGameWatcher ticking...`);
      }, 1000);
      clearInterval(t);
    }
  }

  async function test() {
    setTimeout(() => {
      console.log(`runGameWatcher ticking...`);
    }, 1000);
  }

  function getShipId() {
    let id = allShipsInGame.length;
    return id;
  }

  function newKey(e) {
    let input = document.getElementById("command-input");
    let val = input.value;
    let warp;
    console.log(`input value: ${command}`);
    console.log(`input value bound command: ${command}`);
    // command = val;
    let currentSector = galaxy[currentSectorId];
    let arr = command.split("");
    let lastChar = arr[command.length - 1];
    let matchedWarps = [];
    let outlinks = currentSector.outlinks;
    console.log(`outlinks: ${outlinks}`);

    let matches = outlinks.filter(link =>
      link.toString().startsWith(command.toString())
    );
    let nonMatches = outlinks.filter(link => !matches.includes(link));
    console.log(
      `matches are: ${matches} (length ${matches.length}), nonmatches are: ${nonMatches}`
    );
    if (matches.length < 1) {
      input.value = "";
      outlinks.forEach(warp => {
        let thisWarp = document.getElementById(
          `sector-${currentSectorId}-outlink-${warp}`
        );
        thisWarp.classList = "warp";
      });
      return;
    }
    if (matches.length === 1) {
      outlinks.forEach(warp => {
        let thisWarp = document.getElementById(
          `sector-${currentSectorId}-outlink-${warp}`
        );
        thisWarp.classList = "warp";
      });
      let thisWarp = document.getElementById(
        `sector-${currentSectorId}-outlink-${matches[0]}`
      );
      thisWarp.classList.toggle("warp-highlight-single");
      if (e.keyCode === 13) {
        console.log(`isInt command? ${isInt(command)} matches === 1`);
        if (isInt(command)) {
          warpTo(currentSectorId, matches[0]);
          console.log(
            `Supposed to warp to ${command} typeof ${typeof command}`
          );
        } else {
          alert(`What is this command, ${command}?`);
        }
        command = "";
      }
    } else {
      if (e.keyCode === 13) {
        console.log(`isInt command? ${isInt(command)}  matches > 1`);
        console.log(`more than one match, enter key hit, matches: ${matches}`)
        if (isInt(command)) {
          
          matches.forEach(warp => {
            console.log(`ENTER KEY hit, if isInt(command), matches.forEach, current sector ID ${currentSectorId}`)
            console.log(`sector-${currentSectorId}-outlink-${warp}`)
            let thisWarp = document.getElementById(
              `sector-${currentSectorId}-outlink-${warp}`
            );
            thisWarp.classList = "warp";
          });
          warpTo(currentSectorId, command);
          console.log(
            `Supposed to warp to ${command} typeof ${typeof command}`
          );
        } else {
          alert(`What is this command, ${command}?`);
        }
        command = "";
      }
      matches.forEach(warp => {
        let thisWarp = document.getElementById(
          `sector-${currentSectorId}-outlink-${warp}`
        );
        if (command === "") {
          console.log(`command = '', resetting warp classes`);
          thisWarp.classList = "warp";
        } else {
          thisWarp.classList.contains("warp-highlight-multiple")
            ? null
            : thisWarp.classList.toggle("warp-highlight-multiple");
        }
      });
    }
  }

  //  thank you, Stack Overflow! https://stackoverflow.com/questions/14636536/how-to-check-if-a-variable-is-an-integer-in-javascript
  // Short-circuiting, and saving a parse operation
  function isInt(value) {
    var x;
    if (isNaN(value)) {
      return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
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
    // return (galaxy = galaxy);
  }

  function loadGalaxy() {
    console.log("loadGalaxy clicked");
    galaxy = JSON.parse(localStorage.getItem("galaxy"));
    preGameSetup = true;
    console.log(galaxy);
    // return (galaxy = galaxy);
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

  class Player {
    constructor(name) {
      this.name = name;
    }
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

  class ShipFactory {
    constructor(type, owner) {
      this.type = shipsData[type];
      this.owner = owner;
      this.id = getShipId();
      // this.name = name;
      // this.baseCost = baseCost;
      // this.holds = holds;
      // this.moves = moves;
    }

    getCost() {
      return `Today's price is $${baseCost * 1.5}}`;
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

<style lang="scss" global>
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
    // display: flex;
    justify-content: flex-end;
    // align-items: flex-end;
    flex-direction: column;
  }

  .commands-window {
    border-left: 5px solid rgba(155, 25, 255, 1);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
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
    border: 1px solid rgba(155, 25, 255, 0);
    padding: 0 0.5rem;
    margin: 0.25rem;
    height: 3rem;
    box-shadow: none;
    transition: all 0.25s;
    &:hover {
      background: rgba(155, 25, 255, 0.25);
      border: 1px solid rgba(155, 25, 255, 1);
    }
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

  .warning {
    // display: grid;
    padding: 0.5rem 1rem 0.5rem 0;
    border-left: 5px solid rgba(255, 25, 25, 1);
    background-image: linear-gradient(
      90deg,
      rgba(155, 25, 250, 0.5),
      rgba(255, 25, 25, 0.5)
    );
    // grid-template-columns: 20% 80%;
    color: white;
    padding-left: 1rem;
  }

  .warp-highlight-single {
    background: rgba(118, 0, 255, 0.5);
    transition: all 0.05s;
  }

  .warp-highlight-multiple {
    background: rgba(255, 0, 118, 0.5);
    transition: all 0.05s;
  }

  .warp-highlight-completed {
    background: rgba(0, 255, 118, 0.25);
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
        <button id="generate-links" on:click={() => warpTo('random')}>
          Go To Random Sector
        </button>
        <div id="game-settings" class="controls subgroup">
          <label for="galSize">
            Galaxy size:
            <input
              type="number"
              value="50"
              name="galSize"
              id="galSize"
              on:keyup={generateGalaxyWithNewProps} />
          </label>
          <label for="warpsMin">
            Min warps:
            <input
              type="number"
              value="5"
              name="warpsMin"
              id="warpsMin"
              on:keyup={generateGalaxyWithNewProps} />
          </label>
          <label for="warpsMax">
            Max warps:
            <input
              type="number"
              value="5"
              name="warpsMax"
              id="warpsMax"
              on:keyup={generateGalaxyWithNewProps} />
          </label>
        </div>
      </div>
    </div>
    <div class="commands-window">
      <Modal
        modalId="modal-test"
        keyTrigger="t"
        modalHeading="TEST"
        modalContent="Test successful!"
        buttonContent="Click or press 'T' to test"
        buttonId="test" />
      <Modal
        modalId="modal-quit"
        keyTrigger="q"
        modalHeading="QUIT"
        modalContent="Do you really want to quit?"
        buttonContent="Click or press 'Q' to quit"
        buttonId="quit" />
      <label for="command-input">
        Enter command:
        <input
          type="text"
          bind:value={command}
          name="command"
          id="command-input"
          on:keyup={newKey} />
      </label>
    </div>
    {#if preGameSetup}
      <div id="sector-list" class="sector-list">
        {#each galaxy as sector}
          <SectorComponent {sector} let:warp>
            <span
              slot="outlinks"
              class="warp"
              id="sector-{sector.id}-outlink-{warp}">
              {warp}
            </span>
            <span slot="inlinks" class="warp">{warp}</span>
          </SectorComponent>
        {/each}
      </div>
    {/if}
    {#if !preGameSetup}
      <div id="sector-list" class="sector-list">
        {#each currentGalaxyTrace as sector}
          <SectorComponent {sector} let:warp>
            <span
              slot="outlinks"
              class="warp"
              id="sector-{sector.id}-outlink-{warp}"
              on:click={() => warpTo(sector.id, warp)}>
              {warp}
            </span>
            <span slot="inlinks" class="warp">{warp}</span>
          </SectorComponent>
        {/each}
      </div>
    {/if}
  </div>

</section>
