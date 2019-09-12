// I set the "newSector" variable to the return value of a recursive function
// that function begins by choosing a randomSector, and then checks against violations
// it continues to call itself, choosing new randomSectors, until it finds one with no violations

// recursiveFunction is passed the variable "isNewSectorOK" which is set to boolean false
// when this is set to "true" the function returns a sector object
// the function checks if this randomSector is the same as the originatingSector. if so, it 

// violations:
// 1. randomSector = originatingSector
// 2. randomSector is included in the originatingSector's outlinks already
// 3. randomsector is already at maximum outlinks or inlinks


function recursiveCheckSector(galaxy, id1, id2) {
  console.log(`recursiveCheckSector ONE - currentSector ${id1}, newSector ${id2}`)
  let currentSector = galaxy[id1]
  let newSector = galaxy[id2] !== undefined ? galaxy[id2] : galaxy[id2-2]
  console.log(`recursiveCheckSector TWO - currentSector ${currentSector.id}, newSector ${newSector.id}`)
  if(id1 === id2) {
    console.log(`id1 ${id1} === id2 ${id2}`)
    id2++
    recursiveCheckSector(galaxy, id1, id2)
  }
  if(currentSector.outlinks.includes(id2)) {
    console.log(`currentSector.outlinks.includes(id2) ${currentSector.outlinks} ${id2}`)
    id2++
    recursiveCheckSector(galaxy, id1, id2)
  }
  if(newSector.complete === true) {
    console.log(`newSector.complete === true ${newSector.complete}`)
    id2++
    recursiveCheckSector(galaxy, id1, id2)
  }
  return id2
}

function warpMaker(galaxy) {
  galaxy.forEach(sector => {
    console.log(`warpMaker, galaxy.forEach sector`)
    console.log(sector)

  // let sector = galaxy[1]
  // // check if sector needs any warps added or deleted
  if(sector.complete === true) { return }
  // set warps quota
  let warpsIn = sector.inlinks
  let warpsOut = sector.outlinks
  let warpsQuota = getRandomInt(1,6)
  sector.warpsQuota = warpsQuota
  let needsMoreWarps = warpsQuota - warpsOut.length
  // determine if warps quota matches warps out:
  //    if so, set "sectorComplete = true" flag
  if(needsMoreWarps === 0) {
    sector.complete = true
    return
  } else {
    console.log(`needsMoreWarps: ${needsMoreWarps} for sector: ${sector.id}`)
  //    if not, determine if difference is positive or negative
  //    if positive: add more warps
  //    if negative: remove warps
    if(needsMoreWarps > 0) {
      console.log(`needsMoreWarps is positive - we need more warps!`)
      // add warps
      for(let i = 0; i < needsMoreWarps; i++) {
        
        var randomSector = galaxy[Math.floor(Math.random()*galaxy.length)];
        let randomId = recursiveCheckSector(galaxy, sector.id, randomSector.id)
        // need to check if random sector is same as calling sector and get new value if so
        // if(randomSector.id !== sector.id) {
        //   // need to check if random sector is duplicate of existing warp out
        //   if(!warpsOut.includes(randomSector.id)) {
        //     warpsOut.push(randomSector.id)
        //     warpsIn.push(randomSector.id)
        //     randomSector.inlinks.push(sector.id)
        //     randomSector.outlinks.push(sector.id)
        //   } else {
        //     console.log(`Calling warpMaker recursively because warpsOut ${warpsOut} include this random sector ${randomSector.id}`)

        //   }
        // } else {

        //   console.log(`Calling warpMaker recursively because this sector ${sector.id} matches this random sector ${randomSector.id}`)

        // }
        console.log(`randomId after recursiveCheckSector: ${randomId}`)
            warpsOut.push(randomId)
            warpsIn.push(randomId)
            galaxy[randomId].inlinks.push(sector.id)
            galaxy[randomId].outlinks.push(sector.id)
      }
    } else {
      console.log(`needsMoreWarps is negative - remove some warps!`)
      // remove excess warps
      for(let i = 0; i > needsMoreWarps; i--) {
        // need to check if random sector is same as calling sector and get new value if so
        console.log(`Remove excess warps: has ${warpsOut.length}, wants ${warpsQuota}`)
        warpsOut.pop();
      }
    }
  }
    })
  // warpMaker(galaxy, galaxy[sector.id+1])
}


function generateWarps(galaxy, sector) {
  // for each sector in galaxy, create (min-max) links to random sectors
  // for each linked sector, create a link back to the originating sector

  // let warps = sector.warps.twoWay
  // let warpsIn = sector.warps.in
  // let warpsOut = sector.warps.out
    let warpsIn = sector.inlinks
    let warpsOut = sector.outlinks
    let warpsQuota = getRandomInt(1,6)
    sector.warps.quota = warpsQuota
    console.log(`inside generateWarps, called from generateGalaxy`)
    console.log(`##########################    [${sector.id}].warpsQuota: ${warpsQuota}   ##############################`)
    console.log(`warps out *** ${warpsOut} *** in *** ${warpsIn} ***`)


  // need to check if random sector is duplicate of existing warp out

  sector.warpsQuota = warpsQuota
  let needsMoreWarps = warpsQuota - warpsOut.length
  needsMoreWarps > 0 ? console.log(`This sector needs ${needsMoreWarps} more warps`) : console.log(`!!!!!!!!!!!!!!!! needsMoreWarps: ${needsMoreWarps} !!!!!!!!!!!!!!!!!!!!!`)
  for(let i = 0; i < needsMoreWarps; i++) {
    var randomSector = galaxy[Math.floor(Math.random()*galaxy.length)];
    // need to check if random sector is same as calling sector and get new value if so
    console.log(`randomSector is ${randomSector.id}`)
    console.log(randomSector)
    if(randomSector.id !== sector.id) {
      if(!warpsOut.includes(randomSector.id)) {
        warpsOut.push(randomSector.id)
        warpsIn.push(randomSector.id)
        randomSector.inlinks.push(sector.id)
        randomSector.outlinks.push(sector.id)
      }
    }

  }
    console.log(`inside generateWarps, called from generateGalaxy, [${sector.id}].warpsQuota: ${warpsQuota}`)
  console.log(`                     ####    [${sector.id}]warps: out ${warpsOut.length} [${warpsOut}] in ${warpsIn.length} [${warpsIn}]`)



  //   if(warpsOut.length < warpsQuota) {
  //     let needsMoreLinks = warpsQuota - warpsOut
  //     if(warpsIn.length > 0) {
  //       console.log(`we have inlinks on ${sector.name} (${sector.id})!`)
  //       console.log(sector.inlinks)
  //       warpsIn.forEach(link => {
  //         console.log(`a link inside sector.inlinks.forEach ${link}`)
  //         // var randomSector = universe[Math.floor(Math.random()*universe.length)];
  //         // randomSector.id === sector.id ? randomSector.id + 1 : randomSector

  //       })
  //     } else {
  //       for(let i = 0; i < needsMoreLinks; i++) {
  //         console.log(`sector ${sector.name} (${sector.id}) should have ${sector.numOutlinks} outlinks; currently has ${sector.outlinks.length} oulinks and ${sector.inlinks.length} inlinks`)
  //         console.log(galaxy.length)
  //         // create temp array of random numbers within range of universe size, as sector IDs
  //         var randomSector = galaxy[Math.floor(Math.random()*galaxy.length)];
  //         console.log(`random sector number ${randomSector.id}`)
  //         randomSector.id === sector.id ? randomSector.id++ : randomSector

  //         // next, set outlinks
  //         sector.outlinks.push(randomSector.id)
  //         randomSector.inlinks.push(sector.id)
  //       }
  //     }
  //   } else {
  //     console.log(`sector outlinks are already full at ${sector.outlinks.length} of ${sector.numOutlinks} on ${sector.id}: ${sector.name}`)
  //       console.log(`Final check on sectors: Sector ${sector.id} contains the outlinks ${sector.outlinks} and the inlinks ${sector.inlinks}`)
  //   sector.outlinks.forEach(link => {
  //     console.log(`This sector ${link} contains the following outlinks ${universe[link].outlinks}`)
  //   })
  //   }
  }
