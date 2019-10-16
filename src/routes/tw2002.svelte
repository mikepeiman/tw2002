<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import shipsData from "../store/shipsData.json";
  import SectorComponent from ".././components/SectorComponent.svelte";
  import WarpRouteProgress from ".././components/WarpRouteProgress.svelte";
  import PlayerStats from ".././components/PlayerStats.svelte";
  import Modal from ".././components/Modal.svelte";
  import createGraph from "ngraph.graph";
  import path from "ngraph.path";
  import Nanobar from "nanobar";

  // import { galaxy } from "../store"
  import seedrandom from "seedrandom";
  // import '../components/galaxy-generator.js'
  $: nanobar = {};
  $: galaxyArray = [];
  $: galaxy = createGraph();
  $: galaxyGraph = {};
  $: galSize = 1000;
  $: warpMin = 3;
  $: warpMax = 6;
  $: currentShip = {};
  $: delayInterval = 150;
  $: moveTime = currentShip.moves * delayInterval;
  $: currentSectorId = 0;
  $: currentSectorMatch = false;
  $: currentGalaxyTrace = [];
  $: currentRoute = [];
  $: currentRouteReversed = [];
  $: allShipsInGame = [];
  $: preGameSetup = true;
  $: command = "";
  // $: matches = 1;
  let modal, keyTrigger;
  // $: sectorList = document.getElementById('sector-list');

  onMount(() => {
    let warpProgress = document.getElementsByClassName(
      "warp-progress-container"
    );
    console.log(`warp progress`);
    console.dir(warpProgress);
    warpMin = document.getElementById("warpsMin").value;
    warpMax = document.getElementById("warpsMax").value;
    galSize = document.getElementById("galSize").value;
    Object.filter = (obj, predicate) =>
      Object.keys(obj)
        .filter(key => predicate(obj[key]))
        .reduce((res, key) => ((res[key] = obj[key]), res), {});

    generateGalaxy(galSize, warpMin, warpMax).then(galaxy => {
      linkGalaxy(galaxy);
      // galaxy = galaxy;
      localStorage.setItem("galaxy", JSON.stringify(galaxy));

      findPath(0, galSize-1);

      let filteredGalaxy = Object.filter(galaxy, node =>
        node.hasOwnProperty("id")
      );
      localStorage.setItem("filteredGalaxy", JSON.stringify(filteredGalaxy));
      Object.keys(filteredGalaxy).forEach(key => {
        let system = galaxy[key];
        galaxyArray = [...galaxyArray, system];
      });
      localStorage.setItem("galaxyArray", JSON.stringify(galaxyArray));
    });
  });

  async function findPath(a, b) {
    console.log(`findPath function a ${a}, b ${b}`);

    let pathFinder = await path.aStar(galaxy);
    let found = pathFinder.find(a, b);
    for (let id in found) {
      currentRoute = [...currentRoute, found[id].id];
    }
    
    currentRouteReversed = currentRoute.slice().reverse()
    console.log(`currentRoute: ${currentRoute}, reversed ${currentRouteReversed}`);
    return currentRoute;
  }

  function generateGalaxyWithNewProps(e) {
    console.log(e.keyCode);
    console.log("key pressed");
    e.keyCode === 13 ? newGalaxy() : console.log("other key pressed");
  }

  function startGame() {
    let warpProgress = document.getElementsByClassName(
      "warp-progress-container"
    );
    console.log(`warp progress`);
    console.dir(warpProgress);
    var options = {
      id: "my-nanobar",
      class: "my-nanobar",
      target: document.getElementsByClassName("warp-progress-container")[0]
    };

    nanobar = new Nanobar(options);
    console.log(`startGame() triggered`);
    console.log(`currentSectorId ${currentSectorId}`);
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
    ship.location = currentSectorId;
    ship.moves = 3;
    currentGalaxyTrace = [galaxy[ship.location]];
    currentShip = ship;
    localStorage.setItem(
      "currentGalaxyTrace",
      JSON.stringify(currentGalaxyTrace)
    );
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
    }, moveTime);
  }

  async function warpTo(warpId, e) {
    console.log(`warpTo e`);
    console.log(e);
    currentRoute = [];
    findPath(currentSectorId, warpId).then(path => {
      console.log(`warpTo findPath().then path found: ${path}`);
      path.pop();
      path.reverse();
      let len = path.length;
      nanobar.go(0);
      path.forEach((sector, index) => {
        console.log(
          `index+1 ${index + 1} / len ${len} = ${((index + 1) / len) * 100}`
        );
        setTimeout(() => {
          updateCurrentGalaxyTrace(sector);
          travelTo(sector);
          nanobar.go(((index + 1) / len) * 100);
        }, index * moveTime);
      });
      // nanobar.go(100)
    });
    console.log(`warpTo path found: ${currentRoute}`);
    await currentRoute.forEach(sector => {
      console.log(`sector in currentRoute.forEach ${sector}`);
      let validWarpId = updateCurrentGalaxyTrace(warpId);
      console.log(`validWarpId in currentRoute.forEach ${validWarpId}`);
      travelTo(validWarpId);
    });
  }

  function isThisSectorInstantiatedAlready(sectorId) {
    let matches = currentGalaxyTrace.filter(s => s.id === sectorId).length;
    console.log(
      `$$$$$$$$$$$$$$$ inside isThisSectorInstantiatedAlready, sectors matching ${sectorId} are: ${matches}`
    );

    galaxy[sectorId].instance = matches;
    return matches;
    // return `sector-${sector}-outlink-${warp}-instance-${matches}`
    // another way to do this, rather than unique IDs for every warp, is to remove the IDs from prior instances.
    // Can you think of any use case where you'd need them?
  }

  function updateCurrentGalaxyTrace(id) {
    if (id !== "random") {
      let nextSector = galaxy[id];
      currentGalaxyTrace = [...currentGalaxyTrace, nextSector];
      currentSectorId = id;

      // let matches = isThisSectorInstantiatedAlready(id);
      // let current = galaxy[currentSectorId];
      // console.log(`############################################`);
      // console.log(`warpTo direct requested: ${id}`);
      // console.log(`currentSectorId: ${currentSectorId}`);
      // // return number of matches with warpTo sector ID in currentGalaxyTrace

      // if (current.data.outlinks.includes(parseInt(id))) {
      //   let oldSectorLink = document.getElementById(
      //     `sector-${currentSectorId}-instance-${current.data.instance}-outlink-${id}`
      //   );
      //   console.log(
      //     `sector-${currentSectorId}-instance-${current.data.instance}-outlink-${id}`
      //   );
      //   oldSectorLink.classList = "warp warp-highlight-completed";

      //   // update global var to new current sector ID
      //   currentSectorId = id;

      //   let nextSector = galaxy[id];

      //   currentGalaxyTrace = [...currentGalaxyTrace, nextSector];
      //   console.log(
      //     `@@@ @@@ @@@ currentGalaxyTrace[currentGalaxyTrace.length-1] ${currentGalaxyTrace[currentGalaxyTrace.length - 1].id}`
      //   );

      //   currentGalaxyTrace[currentGalaxyTrace.length - 1].instance = matches;
      //   localStorage.setItem(
      //     "currentGalaxyTrace",
      //     JSON.stringify(currentGalaxyTrace)
      //   );
      //   return id;
      // } else {
      //   console.log("... sorry, it is not a direct jump from our sector");
      //   insertNotification();
      //   return false;
      // }
    } else {
      console.log("else random sector");
      let nextSector = getRandomSector(galaxy);
      currentGalaxyTrace = [...currentGalaxyTrace, nextSector];
      return nextSector.id;
    }
  }

  function renderDuplicateSectorIds(sectorId, warpId) {
    // let currentSectorCount = 1
    // "sector-{sector.id}-instance-{sector.instance}-outlink-{warp}"
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
    let current = galaxy[currentSectorId];
    let arr = command.split("");
    let lastChar = arr[command.length - 1];
    let matchedWarps = [];
    let outlinks = current.data.outlinks;
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
          `sector-${currentSectorId}-instance-${current.data.instance}-outlink-${warp}`
        );
        thisWarp.classList = "warp";
      });
      return;
    }
    if (matches.length === 1) {
      outlinks.forEach(warp => {
        let thisWarp = document.getElementById(
          `sector-${currentSectorId}-instance-${current.data.instance}-outlink-${warp}`
        );
        thisWarp.classList = "warp";
      });
      let thisWarp = document.getElementById(
        `sector-${currentSectorId}-instance-${current.data.instance}-outlink-${matches[0]}`
      );
      thisWarp.classList.toggle("warp-highlight-single");
      if (e.keyCode === 13) {
        console.log(`isInt command? ${isInt(command)} matches === 1`);
        if (isInt(command)) {
          warpTo(matches[0]);
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
        console.log(`more than one match, enter key hit, matches: ${matches}`);
        if (isInt(command)) {
          matches.forEach(warp => {
            console.log(
              `ENTER KEY hit, if isInt(command), matches.forEach, current sector ID ${currentSectorId}`
            );
            console.log(
              `sector-${currentSectorId}-instance-${current.data.instance}-outlink-${warp}`
            );
            let thisWarp = document.getElementById(
              `sector-${currentSectorId}-instance-${current.data.instance}-outlink-${warp}`
            );
            thisWarp.classList = "warp";
          });
          warpTo(command);
          console.log(
            `Supposed to warp to ${command} typeof ${typeof command}`
          );
        } else {
          alert(`What is this command, ${command}?`);
        }
        command = "";
      } else {
        matches.forEach(warp => {
          let thisWarp = document.getElementById(
            `sector-${currentSectorId}-instance-${current.data.instance}-outlink-${warp}`
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

    generateGalaxy(galSize, warpMin, warpMax).then(galaxy => {
      linkGalaxy(galaxy);
      // galaxy = galaxy;
      localStorage.setItem("galaxy", JSON.stringify(galaxy));

      findPath(0, galSize-1);

      let filteredGalaxy = Object.filter(galaxy, node =>
        node.hasOwnProperty("id")
      );
      localStorage.setItem("filteredGalaxy", JSON.stringify(filteredGalaxy));
      Object.keys(filteredGalaxy).forEach(key => {
        let system = galaxy[key];
        galaxyArray = [...galaxyArray, system];
      });
      localStorage.setItem("galaxyArray", JSON.stringify(galaxyArray));
    });
  }

  function initGalaxy() {
    galaxy = JSON.parse(localStorage.getItem("galaxy"));
    // return (galaxy = galaxy);
  }

  async function loadGalaxy() {
    console.log("loadGalaxy clicked");
    // galaxyArray = JSON.parse(localStorage.getItem("galaxyArray"));
    galaxy = JSON.parse(localStorage.getItem("galaxy"));
    preGameSetup = true;
    console.log(galaxy);
    return galaxy;
    // console.log(galaxyArray);
    // return (galaxy = galaxy);
  }

  async function generateGalaxy(galSize, warpMin, warpMax) {
    for (let sectorId = 0; sectorId < galSize; sectorId++) {
      let newSector = await makeSector(sectorId, warpMin, warpMax);
      galaxy[sectorId] = newSector;
      // console.log(`current galaxy[sectorId]: ${galaxy[sectorId]}`);
      // console.log(newSector);
    }
    return galaxy;
  }

  function makeSector(sectorId, warpMin, warpMax) {
    let sector = galaxy.addNode(sectorId, {
      id: sectorId,
      warpsQuota: getRandomInt(warpMin, warpMax),
      inlinks: [],
      outlinks: [],
      shipsInSector: []
    });
    // sector.id = sectorId;
    // sector.data.warpsQuota = getRandomInt(warpMin, warpMax);
    // sector.data.inlinks = [];
    // sector.data.outlinks = [];
    // sector.data.shipsInSector = [];
    // sector.data.accepting = {
    //   inlinks: true,
    //   outlinks: true
    // };
    return sector;
  }

  function sortNumericArray(a, b) {
    return a - b;
  }

  async function linkGalaxy(galaxy) {
    console.log(`from linkGalaxy(), localStorage galaxy: `);
    console.log(galaxy);
    galaxy.forEachNode(sector => {
      let needsLinks = sector.data.warpsQuota - sector.data.outlinks;
      let warps = [];
      let overflow = 0;

      // don't run link generator if this sector is already full
      if (needsLinks > 0) {
        getValidSectorToLinkTo(needsLinks, overflow, warps, sector, galaxy);
      }

      sector.data.inlinks.sort(sortNumericArray);
      sector.data.outlinks.sort(sortNumericArray);
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

    if (sector.data.inlinks.length > 0) {
      sector.data.inlinks.forEach(link => {
        if (!sector.data.outlinks.includes(link)) {
          sector.data.outlinks.push(link);
        }
      });
    }
    needsLinks = sector.data.warpsQuota - sector.data.outlinks.length;

    // end inlinks check, now main while loop to randomly generate outlinks

    while (needsLinks > 0) {
      let rand = getRandomSector(galaxy);
      // console.log(`needslinks, rand = ${rand.id}`);

      if (
        rand.id !== sector.id &&
        !sector.data.outlinks.includes(rand.id) &&
        rand.data.outlinks.length <= rand.data.warpsQuota
      ) {
        warps.push(rand.id);
        warps.sort();
        sector.data.outlinks.push(rand.id);
        sector.data.inlinks.push(rand.id);
        galaxy.addLink(sector.id, rand.id);

        // only push inlink to the outlinked (rand) sector if it is not already at quota
        // if(rand.data.inlinks >= rand.data.warpsQuota) {
        rand.data.inlinks.push(sector.id);
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
    // let arr = Object.keys(galaxy).filter(key => console.log(`key ${key}`))
    // console.log(`getRandomSectr, galaxy arr filtered ${arr}, length ${arr}`)
    // let len = Object.keys(galaxy).length
    // console.log(`getRandomSectr, galaxy length ${len}`)
    // console.log(galaxy)
    return galaxy[Math.floor(Math.random() * galSize)];
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
    position: relative;
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
  <title>TW2002</title>
</svelte:head>
<section class="tw2002">
  <div class="game-header">
    <div class="game-title">
      <h1>TW2002 Redux:</h1>
      <p>Because I'm not done playing yet.</p>
    </div>
  </div>
  <PlayerStats></PlayerStats>
  <WarpRouteProgress {currentRouteReversed} {currentGalaxyTrace} let:routeLength></WarpRouteProgress>
  <!-- <div class="warp-progress-container">
    <div class="warp-progress-container-child" />
  </div> -->
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
              value="300"
              name="galSize"
              id="galSize"
              on:keyup={generateGalaxyWithNewProps} />
          </label>
          <label for="warpsMin">
            Min warps:
            <input
              type="number"
              value="3"
              name="warpsMin"
              id="warpsMin"
              on:keyup={generateGalaxyWithNewProps} />
          </label>
          <label for="warpsMax">
            Max warps:
            <input
              type="number"
              value="6"
              name="warpsMax"
              id="warpsMax"
              on:keyup={generateGalaxyWithNewProps} />
          </label>
        </div>
      </div>
    </div>
    <div class="commands-window">
      <Modal
        modalId="modal-galaxy"
        keyTrigger="g"
        modalHeading="GALAXY"
        modalContent="Loading galaxy..."
        buttonContent="Click or press 'G' to log galaxy"
        buttonId="galaxy" />
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
        {#each galaxyArray as sector}
          <SectorComponent {sector} let:warp>
            <span
              slot="outlinks"
              class="warp"
              id="sector-{sector.id}-instance-{sector.data.instance}-outlink-{warp}">
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
              id="sector-{sector.id}-instance-{sector.data.instance}-outlink-{warp}"
              on:click={() => warpTo(warp)}>
              <!--  on:click={() => findPath(sector.id, warp)} -->
              {warp}
            </span>
            <span slot="inlinks" class="warp">{warp}</span>
          </SectorComponent>
        {/each}
      </div>
    {/if}
  </div>

</section>
