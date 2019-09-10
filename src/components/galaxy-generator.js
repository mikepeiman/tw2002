"use strict";

var base0 = 0x5a4a;
var base1 = 0x0248;
var base2 = 0xb753;

// original code from: https://github.com/alxgiraud/fantasygen/blob/master/public/js/services/markovChainGenerator.js
class FantasygenGenerator_Node {
  constructor(char) {
    this.character = char;
    this.neighbors = [];
  }
}

class FantasygenGenerator_TrieNode {
  constructor() {
    this.children = [];
  }
}

class FantasygenGenerator {
  constructor() {
    this.order = 3;
    this.duplicates = new FantasygenGenerator_TrieNode();
    this.start = new FantasygenGenerator_Node("");
    this.map = {};
  }

  capitalize(str) {
    str = str.charAt(0).toUpperCase() + str.slice(1);

    if (str.length === 1) {
      return str;
    }

    for (var i = 1; i < str.length; i += 1) {
      if (
        !str
          .charAt(i - 1)
          .match(
            /[a-zÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]/i
          ) &&
        str.length > i + 1
      ) {
        str = str.slice(0, i) + str.charAt(i).toUpperCase() + str.slice(i + 1);
      }
    }

    return str;
  }

  addToDuplicatesTrie(word, duplicates) {
    if (word.length > 1) {
      this.addToDuplicatesTrie(word.substr(1), duplicates);
    }

    var currentNode = duplicates,
      childNode;

    for (var i = 0; i < word.length; i += 1) {
      childNode = currentNode.children[word[i]];
      if (!childNode) {
        childNode = new FantasygenGenerator_TrieNode();
        currentNode.children[word[i]] = childNode;
      }
      currentNode = childNode;
    }
  }

  isDuplicate(word, duplicates) {
    word = word.toLowerCase();
    var currentNode = duplicates,
      childNode;

    for (var i = 0; i < word.length; i += 1) {
      childNode = currentNode.children[word[i]];
      if (!childNode) {
        return false;
      }

      currentNode = childNode;
    }

    return true;
  }

  refresh() {
    this.order = 3;
    this.duplicates = new FantasygenGenerator_TrieNode();
    this.start = new FantasygenGenerator_Node("");
    this.map = {};
  }

  setOrder(o) {
    this.order = o;
  }

  addWordsToChain(words) {
    for (var i = 0; i < words.length; i += 1) {
      this.addWordToChain(words[i]);
    }
    return this;
  }

  addWordToChain(word) {
    this.addToDuplicatesTrie(word.toLowerCase(), this.duplicates);

    var previous = this.start,
      key = "",
      char,
      newNode;

    for (var i = 0; i < word.length; i += 1) {
      char = word[i];
      key += char;
      if (key.length > this.order) {
        key = key.substr(1);
      }
      newNode = this.map[key];

      if (!newNode) {
        newNode = new FantasygenGenerator_Node(char);
        this.map[key] = newNode;
      }

      previous.neighbors.push(newNode);
      previous = newNode;
    }

    previous.neighbors.push(null);
  }

  generateWord(
    minLength,
    maxLength,
    startWith,
    endWith,
    contains,
    doesntContains,
    allowDuplicates,
    maxAttempts
  ) {
    if (startWith === undefined) {
      startWith = "";
    }
    if (endWith === undefined) {
      endWith = "";
    }
    if (
      minLength === undefined ||
      minLength < startWith.length ||
      minLength < endWith.length
    ) {
      minLength =
        startWith.length > endWith.length ? startWith.length : endWith.length;
    }
    if (allowDuplicates === undefined) {
      allowDuplicates = false;
    }
    if (maxLength === undefined) {
      maxLength = -1;
    }
    if (maxAttempts === undefined) {
      maxAttempts = 100;
    }

    var word = "",
      repeat = true,
      attempts = 0,
      nextNodeIndex,
      currentNode;

    while (!word.length) {
      attempts += 1;
      if (attempts >= maxAttempts) {
        return;
      }

      nextNodeIndex = Math.floor(Math.random() * this.start.neighbors.length);
      currentNode = this.start.neighbors[nextNodeIndex];
      word = "";

      while (currentNode && (maxLength < 0 || word.length <= maxLength)) {
        word += currentNode.character;
        nextNodeIndex = Math.floor(
          Math.random() * currentNode.neighbors.length
        );
        currentNode = currentNode.neighbors[nextNodeIndex];
      }

      if (
        word.substr(0, startWith.length) !== startWith ||
        word.substr(word.length - endWith.length) !== endWith ||
        (typeof contains !== "undefined" && word.indexOf(contains) === -1) ||
        (typeof doesntContains !== "undefined" &&
          doesntContains.length > 0 &&
          word.indexOf(doesntContains) > -1) ||
        word.length > maxLength ||
        word.length < minLength ||
        (!allowDuplicates && this.isDuplicate(word, this.duplicates))
      ) {
        word = "";
      }
    }

    return this.capitalize(word);
  }
}

// original code from: https://github.com/martindevans/CasualGodComplex/blob/master/CasualGodComplex/StarName.cs
class StarNameGenerator {
  constructor() {
    this._namingStrategies = [
      [100, "this.starNameGenerator.plainMarkov()"],
      [
        100,
        'this.starNameGenerator.withDecoration(1.0, "this.withDecoration(0.001, \\"this.plainMarkov()\\")")'
      ],
      [
        5,
        '(this.starNameGenerator.letter() + "-" + this.starNameGenerator.integer())'
      ],
      [1, "this.starNameGenerator.namedStar()"],
      [1, "this.starNameGenerator.randomSpecialLocation()"]
    ];
    this._prefixStrategies = [
      [100, "this.greek()"],
      [100, "this.decorator()"],
      [1, "this.romanNumeral()"],
      [100, "this.letter()"],
      [100, "this.integer()"],
      [30, "this.decimal()"],
      [0, '"Al"'],
      [0, '"San"']
    ];
    this._suffixStrategies = [
      [10, "this.greek()"],
      [10, "this.decorator()"],
      [10, "this.romanNumeral()"],
      [10, "this.letter()"],
      [10, "this.integer()"],
      [3, "this.decimal()"]
    ];
    this._decorationChoices = [
      [4, "neither"],
      [10, "prefix"],
      [10, "suffix"],
      [2, "both"]
    ];
    // names from: https://github.com/martindevans/CasualGodComplex/blob/master/CasualGodComplex/StarName.cs
    this.realStarNames = [
      "acamar",
      "achernar",
      "achird",
      "acrab",
      "acrux",
      "acubens",
      "adhafera",
      "adhara",
      "ain",
      "akrab",
      "aladfar",
      "alamak",
      "alaraph",
      "alasad",
      "alathfar",
      "albaldah",
      "albali",
      "albireo",
      "alchiba",
      "alcor",
      "alcyone",
      "aldebaran",
      "alderamin",
      "aldhafera",
      "aldhanab",
      "aldhibah",
      "aldib",
      "alfawaris",
      "alfecca",
      "alfirk",
      "algedi",
      "algenib",
      "algieba",
      "algiedi",
      "algol",
      "algorab",
      "alhajoth",
      "alhena",
      "alioth",
      "alkaid",
      "alkalb",
      "alkalurops",
      "alkaphrah",
      "alkes",
      "alkurah",
      "alkurud",
      "almach",
      "alminliar",
      "alnair",
      "alnasl",
      "alnilam",
      "alnitak",
      "alniyat",
      "alphard",
      "alphecca",
      "alpheratz",
      "alrai",
      "alrakis",
      "alrami",
      "alrischa",
      "alruccbah",
      "alsafi",
      "alsciaukat",
      "alshain",
      "alshat",
      "altair",
      "altais",
      "altarf",
      "alterf",
      "althalimain",
      "aludra",
      "alula",
      "alwaid",
      "alya",
      "alzir",
      "ancha",
      "angetenar",
      "ankaa",
      "antares",
      "arcturus",
      "arich",
      "arided",
      "arkab",
      "armus",
      "arneb",
      "arrakis",
      "ascella",
      "asellus",
      "ashlesha",
      "askella",
      "aspidiske",
      "asterion",
      "asterope",
      "atik",
      "atlas",
      "atria",
      "auva",
      "avior",
      "azaleh",
      "azelfafage",
      "azha",
      "azimech",
      "azmidiske",
      "baham",
      "baten",
      "becrux",
      "beid",
      "bellatrix",
      "benetnasch",
      "betelgeuse",
      "biham",
      "botein",
      "brachium",
      "caiam",
      "canopus",
      "capella",
      "caph",
      "caphir",
      "caput",
      "caroli",
      "castor",
      "castula",
      "cebalrai",
      "ceginus",
      "celaeno",
      "celbalrai",
      "chaph",
      "chara",
      "cheleb",
      "chertan",
      "chort",
      "cor",
      "coxa",
      "cujam",
      "cursa",
      "cynosura",
      "dabih",
      "decrux",
      "deneb",
      "denebola",
      "dheneb",
      "diadem",
      "diphda",
      "dnoces",
      "dschubba",
      "dubhe",
      "duhr",
      "edasich",
      "elakrab",
      "electra",
      "elmuthalleth",
      "elnath",
      "eltanin",
      "enif",
      "errai",
      "etamin",
      "fomalhaut",
      "fumalsamakah",
      "furud",
      "gacrux",
      "garnet",
      "gatria",
      "gemma",
      "gianfar",
      "giedi",
      "gienahgurab",
      "girtab",
      "gomeisa",
      "gorgonea",
      "graffias",
      "grafias",
      "grassias",
      "grumium",
      "hadar",
      "hadir",
      "haedus",
      "haldus",
      "hamal",
      "hassaleh",
      "heka",
      "heze",
      "hoedus",
      "homam",
      "hyadum",
      "hydrae",
      "hydrobius",
      "hydrus",
      "izar",
      "jabbah",
      "jih",
      "kabdhilinan",
      "kaffaljidhma",
      "kaitos",
      "kajam",
      "kastra",
      "kaus",
      "keid",
      "kitalpha",
      "kleeia",
      "kochab",
      "kornephoros",
      "kraz",
      "ksora",
      "kullat",
      "kuma",
      "lanx",
      "leonis",
      "lesath",
      "librae",
      "lucida",
      "maasym",
      "mahasim",
      "maia",
      "marfark",
      "marfik",
      "markab",
      "matar",
      "mebsuta",
      "media",
      "medusae",
      "megrez",
      "meissa",
      "mekbuda",
      "menchib",
      "menkab",
      "menkalinan",
      "menkar",
      "menkent",
      "menkib",
      "merak",
      "merga",
      "meridiana",
      "merope",
      "mesarthim",
      "miaplacidus",
      "mimosa",
      "minchir",
      "minelava",
      "minkar",
      "mintaka",
      "mira",
      "mirach",
      "miram",
      "mirfak",
      "mirzam",
      "misam",
      "mizar",
      "mothallah",
      "muliphein",
      "muphrid",
      "murzim",
      "muscida",
      "nair",
      "naos",
      "nash",
      "nashira",
      "navi",
      "nekkar",
      "nembus",
      "neshmet",
      "nihal",
      "nunki",
      "nusakan",
      "okul",
      "peacock",
      "phact",
      "phad",
      "pherkad",
      "pleione",
      "polaris",
      "pollux",
      "porrima",
      "praecipua",
      "procyon",
      "propus",
      "proxi",
      "pulcherrim",
      "rana",
      "ras",
      "rasalas",
      "rastaban",
      "regor",
      "regulus",
      "rigel",
      "rigil",
      "rijl",
      "rotanev",
      "ruchba",
      "ruchbah",
      "rukbat",
      "sabik",
      "sadachbia",
      "sadalbari",
      "sadalmelik",
      "sadalsuud",
      "sadatoni",
      "sadira",
      "sadlamulk",
      "sadr",
      "saiph",
      "salm",
      "sargas",
      "sarin",
      "sceptrum",
      "scheat",
      "schedar",
      "scheddi",
      "scorpii",
      "segin",
      "seginus",
      "serpentis",
      "sham",
      "shashutu",
      "shaula",
      "sheliak",
      "sheratan",
      "shurnarkabti",
      "sinistra",
      "sirius",
      "situla",
      "skat",
      "sol",
      "spica",
      "sterope",
      "sualocin",
      "subra",
      "suhail",
      "suhel",
      "sulafat",
      "superba",
      "syrma",
      "tabit",
      "talitha",
      "tania",
      "tarazed",
      "tarazet",
      "taygeta",
      "tegmen",
      "tegmine",
      "tejat",
      "terebellum",
      "thabit",
      "thaoum",
      "theemin",
      "thuban",
      "tien",
      "toliman",
      "torcularis",
      "tseen",
      "turais",
      "tyl",
      "unuk",
      "unukalhai",
      "vega",
      "vindemiatrix",
      "wasat",
      "wei",
      "wezen",
      "wezn",
      "yed",
      "yildun",
      "zaniah",
      "zaurak",
      "zavijava",
      "zawiat",
      "zedaron",
      "zelphah",
      "zibal",
      "zosma",
      "zuben",
      "zubenelgenubi",
      "zubeneschamali"
    ];
    this.fictionalLocations = [
      // Dune (Stars)
      "ophiuchi",
      "eridani",
      "boötis",
      "pavonis",
      "waiping",
      "gruis",
      "shalish",
      "niushe",
      "shaowei",
      "alangue",
      "alces",
      "thalim",
      "laoujin",
      // Dune (Planets)
      "giedi prime",
      "sikun",
      "richese",
      "ix",
      "caladan",
      "salusa",
      "anbus",
      "dhanab",
      "buzzell",
      "chusuk",
      "corrin",
      "ecaz",
      "gamont",
      "gansireed",
      "gangishree",
      "gammu",
      "ginaz",
      "grumman",
      "hagal",
      "harmonthep",
      "ipyr",
      "junction",
      "kaitain",
      "kolhar",
      "lampadas",
      "lankiveil",
      "lernaeus",
      "muritan",
      "naraj",
      "palma",
      "parmentier",
      "poritrin",
      "romo",
      "rossak",
      "synchrony",
      "tleilax",
      "tupile",
      "wallach ix",
      "zanovar",
      // Star Trek
      "cygni",
      "ursae",
      "alfin-bernard",
      "alpha ataru",
      "centauri",
      "omicron",
      "shiro",
      "amargosa",
      "amleth",
      "antede",
      "arakon",
      "argelius",
      "argos",
      "atalia",
      "avenal",
      "avery",
      "azati",
      "tauri",
      "orionis",
      "kentaurus",
      "aquilae",
      "b'hava'el",
      "barradas",
      "benthan",
      "benzite",
      "berengaria",
      "bersallis",
      "aurigae",
      "capricus",
      "cassius",
      "coupsic",
      "geminorum",
      "lankal",
      "lyrae",
      "magellan",
      "mahoga",
      "niobe",
      "portolan",
      "reilley",
      "renner",
      "simmons",
      "stromgren",
      "thoridar",
      "bilana",
      "bilaren",
      "bolarus",
      "bopak",
      "boraal",
      "borratas",
      "braslota",
      "bre'el",
      "breen",
      "bringloid",
      "browder",
      "caldos",
      "calindra",
      "callinon",
      "camor",
      "cardassia",
      "carraya",
      "carson",
      "ceti",
      "chess-wilson",
      "chin'toka",
      "clarus",
      "coltar",
      "cordannas",
      "coridan",
      "corvan",
      "dameron",
      "delb",
      "denkir",
      "detrian",
      "devidia",
      "devolin",
      "devron",
      "diomedian",
      "dopa",
      "dorala",
      "draygo",
      "dreon",
      "echevarria",
      "el-adrel",
      "eminiar",
      "endicor",
      "indi",
      "mynos",
      "silar",
      "errikang",
      "falla",
      "fima",
      "hydra",
      "trianguli",
      "ganino",
      "garth",
      "gaspar",
      "gavara",
      "goralis",
      "goren",
      "grenna",
      "groombridge",
      "hanoli",
      "hanon",
      "hemakek",
      "hayashi",
      "hoek",
      "iczerone",
      "stimson",
      "idran",
      "ilecom",
      "indri",
      "ingraham",
      "irtok",
      "itamish",
      "j-25",
      "japori",
      "kabrel",
      "kaelon",
      "kazis",
      "keloda",
      "kelsin",
      "kelvas",
      "kendi",
      "kolarus",
      "koralis",
      "kotanka",
      "krios",
      "k'ushui",
      "l-370",
      "l-374",
      "lalande",
      "lapolis",
      "ligon",
      "loval",
      "luyten",
      "maranga",
      "maxia",
      "mericor",
      "antlia",
      "moab",
      "modea",
      "monac",
      "murasaki",
      "narendra",
      "nel",
      "nelvana",
      "nequencia",
      "norcadia",
      "norpin",
      "nyria",
      "ohniaka",
      "sagitta",
      "orellius",
      "orias",
      "orion",
      "ovion",
      "pallas",
      "paradas",
      "pegos",
      "pelosa",
      "pendari",
      "pentath",
      "pernaia",
      "phylos",
      "portas",
      "prema",
      "questar",
      "ramatis",
      "romii",
      "ross 154",
      "rubicun",
      "sahndara",
      "sappora",
      "sarona",
      "sarpeid",
      "secarus",
      "shelia",
      "draconis",
      "nesterowitz",
      "solais",
      "solarion",
      "soukara",
      "stillwell",
      "strnad",
      "tambor beta-6",
      "talos",
      "tanuga",
      "tartaras",
      "cygna",
      "tavlihna",
      "tehara",
      "tellun",
      "teplan",
      "terlina",
      "tessen",
      "bowles",
      "mees",
      "t'lli",
      "topin",
      "trialas",
      "trivas",
      "tsugh",
      "kaidnn",
      "tycho",
      "tyra",
      "tyrus",
      "ufandi",
      "unefra",
      "unroth",
      "vacca",
      "vadris",
      "valo",
      "vandor",
      "vegan",
      "verath",
      "veridian",
      "veytan",
      "vico",
      "vilmoran",
      "vinri",
      "vissia",
      "volan",
      "wolf",
      "wyanti",
      "xendi",
      "kabu",
      "menkalinam",
      "carinae",
      "gemiorum",
      "canis",
      "helios",
      "bajoran",
      "c-111",
      "nyrian",
      // Foundation
      "alpha",
      "anacreon",
      "askone",
      "asperta",
      "aurora",
      "baronn",
      "bonde",
      "cil",
      "cinna",
      "comporellon",
      "daribow",
      "derowd",
      "eos",
      "erythro",
      "euterpe",
      "florina",
      "gaia",
      "andromeda",
      "getorin",
      "glyptal",
      "haven",
      "helicon",
      "hesperos",
      "horleggor",
      "ifni",
      "iss",
      "jennisek",
      "kalgan",
      "konom",
      "korell",
      "libair",
      "livia",
      "locris",
      "lyonesse",
      "lystena",
      "mandress",
      "melpomenia",
      "mnemon",
      "mores",
      "nephelos",
      "lingane",
      "rhodia",
      "tyrann",
      "neotrantor",
      "nexon",
      "nishaya",
      "ophiuchus",
      "orsha",
      "radole",
      "rhampora",
      "rhea",
      "rossem",
      "salinn",
      "santanni",
      "sarip",
      "sark",
      "sayshell",
      "siwenna",
      "smitheus",
      "smushyk",
      "smyrno",
      "solaria",
      "synnax",
      "tazenda",
      "terel",
      "terminus",
      "trantor",
      "vincetori",
      "voreg",
      "wanda",
      "wencory",
      "whassalian",
      "zoranel",
      // Cosmere
      "ashyn",
      "braize",
      "nalthis",
      "roshar",
      "scadrial",
      "sel",
      "taldain",
      "yolen",
      "threnody",
      // Honor Harrington
      "air",
      "alizon",
      "alphane",
      "ameta",
      "andermani",
      "asgard",
      "barnett",
      "basilica",
      "bassingford",
      "beowulf",
      "casimir",
      "congo",
      "dresden",
      "durandel",
      "duquesne",
      "elysia",
      "endicott",
      "enki",
      "erewhon",
      "flax",
      "grayson",
      "gregor",
      "grendelsbane",
      "gryphon",
      "hades",
      "halliman",
      "hamilton",
      "hancock",
      "hope",
      "kemal",
      "ki-rin",
      "kornati",
      "kreskin",
      "kuan yin",
      "lois",
      "lovat",
      "lynx",
      "macgregor",
      "manticore",
      "marsh",
      "masada",
      "matapan",
      "maya",
      "medusa",
      "melungeon",
      "meyerdahl",
      "mesa",
      "mfecane",
      "midgard",
      "midsummer",
      "monica",
      "montana",
      "ndebele",
      "nagasaki",
      "dijon",
      "hamburg",
      "geneva",
      "octagon",
      "parmley",
      "phoenix",
      "pontifex",
      "potsdam",
      "prague",
      "refuge",
      "rembrandt",
      "shuttlesport",
      "sidemore",
      "sphinx",
      "torch",
      "toulon",
      "zanzibar",
      "zulu"
    ];
    this.greekLetters = [
      "Alpha",
      "Beta",
      "Gamma",
      "Delta",
      "Epsilon",
      "Zeta",
      "Eta",
      "Theta",
      "Iota",
      "Kappa",
      "Lambda",
      "Mu",
      "Nu",
      "Xi",
      "Omnicron",
      "Pi",
      "Rho",
      "Sigma",
      "Tau",
      "Upsilon",
      "Phi",
      "Chi",
      "Psi",
      "Omega"
    ];
    this.decorators = [
      "Major",
      "Majoris",
      "Minor",
      "Minoris",
      "Prime",
      "Secundis",
      "System"
    ];
    this.specialLocations = [
      "Epsilon Eridani",
      "San Martin",
      "Seaford Nine",
      "Proctor Three",
      "Smoking Frog",
      "First of the Sun",
      "Xendi Sabu",
      "Bela Tegeuse"
    ];
    this.names = [
      "Trevor",
      "Yeltsin",
      "Barnard",
      "Genovese",
      "Martin",
      "Simon",
      "Rob",
      "Ed",
      "Walter",
      "Mohammed",
      "Emil",
      "Shannon",
      "Nicole",
      "Yury",
      "Coleman",
      "Deanne",
      "Rosenda",
      "Geoffrey",
      "Taryn",
      "Noreen",
      "Rita",
      "Jeanetta",
      "Stanton",
      "Alesha",
      "Mark",
      "Georgiann",
      "Modesta",
      "Lee",
      "Cyndi",
      "Raylene",
      "Ellamae",
      "Sharmaine",
      "Candra",
      "Karine",
      "Trena",
      "Tarah",
      "Dorie",
      "Kyoko",
      "Wei",
      "Cristopher",
      "Yoshie",
      "Meany",
      "Zola",
      "Corene",
      "Suzie",
      "Sherwood",
      "Monnie",
      "Savannah",
      "Amalia",
      "Lon",
      "Luetta",
      "Concetta",
      "Dani",
      "Sharen",
      "Mora",
      "Wilton",
      "Hunter",
      "Nobuko",
      "Maryellen",
      "Johnetta",
      "Eleanora",
      "Arline",
      "Rae",
      "Caprice"
    ];
    this.fantasygenGenerator = new FantasygenGenerator();
    this.fantasygenGenerator
      .addWordsToChain(this.realStarNames)
      .addWordsToChain(this.fictionalLocations);
  }

  plainMarkov() {
    return this.fantasygenGenerator.generateWord(3, 11);
  }

  withDecoration(probability, func) {
    var result = eval(func);
    if (Math.random() > probability) {
      return result;
    }

    var prefix = eval(this.weightedChoice(this._prefixStrategies)) + " ";
    var suffix = " " + eval(this.weightedChoice(this._suffixStrategies));
    var decorator = this.randomChoiceArray(this._decorationChoices);

    switch (decorator[1]) {
      case "prefix":
        return prefix + result;
      case "suffix":
        return result + suffix;
      case "both":
        return prefix + result + suffix;
      default:
        return result;
    }
  }

  namedStar() {
    return this.randomChoiceArray(this.names) + "'s Star";
  }

  normallyDistributedSingle(standardDeviation, mean, min, max) {
    var nMax = (max - mean) / standardDeviation;
    var nMin = (min - mean) / standardDeviation;
    var nRange = nMax - nMin;
    var nMaxSq = nMax * nMax;
    var nMinSq = nMin * nMin;
    var subFrom = nMinSq;
    if (nMin < 0 && 0 < nMax) {
      subFrom = 0;
    } else if (nMax < 0) {
      subFrom = nMaxSq;
    }
    var sigma = 0.0;
    var u;
    var z;
    do {
      z = nRange * Math.random() + nMin;
      sigma = Math.exp((subFrom - z * z) / 2);
      u = Math.random();
    } while (u > sigma);
    return z * standardDeviation + mean;
  }

  greek() {
    return this.randomChoiceArray(this.greekLetters);
  }

  decorator() {
    return this.randomChoiceArray(this.decorators);
  }

  romanNumeral() {
    var integer = this.normallyDistributedSingle(10, 15, 1, 200);
    var bigInteger = this.normallyDistributedSingle(400, 100, 200, 3000);
    return this.toRoman(this.randomChoice(0.8) ? integer | 0 : bigInteger | 0);
  }

  letter() {
    var idx = (Math.random() * 26) | 0;
    return String.fromCharCode("a".charCodeAt(0) + idx);
  }

  integer() {
    var number = this.normallyDistributedSingle(100, 5, 1, 1000);
    return number | 0;
  }

  decimal() {
    var number = this.normallyDistributedSingle(100, 5, 1, 1000);
    return number.toFixed(2);
  }

  randomSpecialLocation() {
    var idx = (Math.random() * this.specialLocations.length) | 0;
    return this.specialLocations[idx];
  }

  toRoman(number) {
    if (number < 1) {
      return "";
    }
    if (number >= 1000) {
      return "M" + this.toRoman(number - 1000);
    }
    if (number >= 900) {
      return "CM" + this.toRoman(number - 900);
    }
    if (number >= 500) {
      return "D" + this.toRoman(number - 500);
    }
    if (number >= 400) {
      return "CD" + this.toRoman(number - 400);
    }
    if (number >= 100) {
      return "C" + this.toRoman(number - 100);
    }
    if (number >= 90) {
      return "XC" + this.toRoman(number - 90);
    }
    if (number >= 50) {
      return "L" + this.toRoman(number - 50);
    }
    if (number >= 40) {
      return "XL" + this.toRoman(number - 40);
    }
    if (number >= 10) {
      return "X" + this.toRoman(number - 10);
    }
    if (number >= 9) {
      return "IX" + this.toRoman(number - 9);
    }
    if (number >= 5) {
      return "V" + this.toRoman(number - 5);
    }
    if (number >= 4) {
      return "IV" + this.toRoman(number - 4);
    }
    if (number >= 1) {
      return "I" + this.toRoman(number - 1);
    }
    return "Invalid Number";
  }

  randomChoice(bias = 0.5) {
    return Math.random() < bias;
  }

  randomChoiceArray(choices) {
    var idx = (Math.random() * choices.length) | 0;
    return choices[idx];
  }

  weightedChoice(choices) {
    var totalWeight = 0;
    choices.forEach(element => {
      totalWeight = (totalWeight + element[0]) | 0;
    });
    var choice = Math.random() * totalWeight;
    var result;
    choices.every(element => {
      choice = (choice - element[0]) | 0;
      if (choice <= 0) {
        result = element[1];
        return false;
      }
      return true;
    });
    return result;
  }

  generate() {
    return this.weightedChoice(this._namingStrategies);
  }
}

class EliteGalaxyGenerator {
  constructor(base0, base1, base2) {
    this.base0 = base0 || 0x5a4a;
    this.base1 = base1 || 0x0248;
    this.base2 = base2 || 0xb753;

    this.galsize = 10000;
    this.galaxy = [];
    this.seed = {};
    this.rnd_seed = {};

    this.pairs0 = Array.from(
      "ABOUSEITILETSTONLONUTHNOALLEXEGEZACEBISOUSESARMAINDIREA.ERATENBERALAVETIEDORQUANTEISRION"
    );
    this.pairs = Array.from(
      "..LEXEGEZACEBISOUSESARMAINDIREA.ERATENBERALAVETIEDORQUANTEISRION"
    );
    this.govnames = [
      "Anarchy",
      "Feudal",
      "Multi-gov",
      "Dictatorship",
      "Communist",
      "Confederacy",
      "Democracy",
      "Corporate State"
    ];
    this.econnames = [
      "Rich Ind",
      "Average Ind",
      "Poor Ind",
      "Mainly Ind",
      "Mainly Agri",
      "Rich Agri",
      "Average Agri",
      "Poor Agri"
    ];
    this.desc_list = [
      ["fabled", "notable", "well known", "famous", "noted"],
      ["very", "mildly", "most", "reasonably", ""],
      ["ancient", "\x95", "great", "vast", "pink"],
      ["\x9E \x9D plantations", "mountains", "\x9C", "\x94 forests", "oceans"],
      [
        "shyness",
        "silliness",
        "mating traditions",
        "loathing of \x86",
        "love for \x86"
      ],
      ["food blenders", "tourists", "poetry", "discos", "\x8E"],
      ["talking tree", "crab", "bat", "lobst", "\xB2"],
      ["beset", "plagued", "ravaged", "cursed", "scourged"],
      [
        "\x96 civil war",
        "\x9B \x98 \x99s",
        "a \x9B disease",
        "\x96 earthquakes",
        "\x96 solar activity"
      ],
      [
        "its \x83 \x84",
        "the \xB1 \x98 \x99",
        "its inhabitants' \x9A \x85",
        "\xA1",
        "its \x8D \x8E"
      ],
      ["juice", "brandy", "water", "brew", "gargle blasters"],
      ["\xB2", "\xB1 \x99", "\xB1 \xB2", "\xB1 \x9B", "\x9B \xB2"],
      ["fabulous", "exotic", "hoopy", "unusual", "exciting"],
      ["cuisine", "night life", "casinos", "sit coms", " \xA1 "],
      [
        "\xB0",
        "The planet \xB0",
        "The world \xB0",
        "This planet",
        "This world"
      ],
      ["n unremarkable", " boring", " dull", " tedious", " revolting"],
      ["planet", "world", "place", "little planet", "dump"],
      ["wasp", "moth", "grub", "ant", "\xB2"],
      ["poet", "arts graduate", "yak", "snail", "slug"],
      ["tropical", "dense", "rain", "impenetrable", "exuberant"],
      ["funny", "wierd", "unusual", "strange", "peculiar"],
      ["frequent", "occasional", "unpredictable", "dreadful", "deadly"],
      [
        "\x82 \x81 for \x8A",
        "\x82 \x81 for \x8A and \x8A",
        "\x88 by \x89",
        "\x82 \x81 for \x8A but \x88 by \x89",
        "a\x90 \x91"
      ],
      ["\x9B", "mountain", "edible", "tree", "spotted"],
      ["\x9F", "\xA0", "\x87oid", "\x93", "\x92"],
      ["ancient", "exceptional", "eccentric", "ingrained", "\x95"],
      ["killer", "deadly", "evil", "lethal", "vicious"],
      [
        "parking meters",
        "dust clouds",
        "ice bergs",
        "rock formations",
        "volcanoes"
      ],
      ["plant", "tulip", "banana", "corn", "\xB2weed"],
      ["\xB2", "\xB1 \xB2", "\xB1 \x9B", "inhabitant", "\xB1 \xB2"],
      ["shrew", "beast", "bison", "snake", "wolf"],
      ["leopard", "cat", "monkey", "goat", "fish"],
      [
        "\x8C \x8B",
        "\xB1 \x9F \xA2",
        "its \x8D \xA0 \xA2",
        "\xA3 \xA4",
        "\x8C \x8B"
      ],
      ["meat", "cutlet", "steak", "burgers", "soup"],
      ["ice", "mud", "Zero-G", "vacuum", "\xB1 ultra"],
      ["hockey", "cricket", "karate", "polo", "tennis"]
    ];

    this.useAlternate = true;
    this.starNameGenerator = new StarNameGenerator();
  }

  makesystem(seed) {
    var thissys = {};
    var pair1, pair2, pair3, pair4;
    var longnameflag = seed.w0 & 64;

    thissys.x = this.uint8_limit(seed.w1 >> 8);
    thissys.y = this.uint8_limit(seed.w0 >> 8);

    thissys.govtype = (seed.w1 >> 3) & 7;

    thissys.economy = (seed.w0 >> 8) & 7;
    if (thissys.govtype <= 1) {
      thissys.economy = thissys.economy | 2;
    }

    thissys.techlev = ((seed.w1 >> 8) & 3) + (thissys.economy ^ 7);
    thissys.techlev += thissys.govtype >> 1;
    if ((thissys.govtype & 1) == 1) {
      thissys.techlev += 1;
    }

    thissys.population = 4 * thissys.techlev + thissys.economy;
    thissys.population += thissys.govtype + 1;

    thissys.productivity = ((thissys.economy ^ 7) + 3) * (thissys.govtype + 4);
    thissys.productivity *= thissys.population * 8;

    thissys.radius = 256 * (((seed.w2 >> 8) & 15) + 11) + thissys.x;

    thissys.goatsoupseed = {};
    thissys.goatsoupseed.a = seed.w1 & 0xff;
    thissys.goatsoupseed.b = this.uint8_limit(seed.w1 >> 8);
    thissys.goatsoupseed.c = seed.w2 & 0xff;
    thissys.goatsoupseed.d = this.uint8_limit(seed.w2 >> 8);

    if (this.useAlternate) {
      Math.seedrandom([seed.w0, seed.w1, seed.w2]);
      //thissys.name = this.fantasygenGenerator.generateWord(3, 11).toUpperCase();
      var nameGenerator = this.starNameGenerator.generate();
      thissys.name = eval(nameGenerator).toUpperCase();
      this.tweakseed(seed);
      this.tweakseed(seed);
      this.tweakseed(seed);
      this.tweakseed(seed);
    } else {
      pair1 = 2 * ((seed.w2 >> 8) & 31);
      this.tweakseed(seed);
      pair2 = 2 * ((seed.w2 >> 8) & 31);
      this.tweakseed(seed);
      pair3 = 2 * ((seed.w2 >> 8) & 31);
      this.tweakseed(seed);
      pair4 = 2 * ((seed.w2 >> 8) & 31);
      this.tweakseed(seed);

      thissys.name = this.pairs[pair1];
      thissys.name += this.pairs[pair1 + 1];
      thissys.name += this.pairs[pair2];
      thissys.name += this.pairs[pair2 + 1];
      thissys.name += this.pairs[pair3];
      thissys.name += this.pairs[pair3 + 1];
      if (longnameflag) {
        thissys.name += this.pairs[pair4];
        thissys.name += this.pairs[pair4 + 1];
      }
      thissys.name = this.stripout(thissys.name, ".");
    }

    return thissys;
  }

  tweakseed(seed) {
    var temp = seed.w0 + seed.w1 + seed.w2;
    seed.w0 = seed.w1;
    seed.w1 = seed.w2;
    seed.w2 = this.uint16_limit(temp);
  }

  stripout(value, c) {
    // code from: https://stackoverflow.com/a/17606289
    return value.replace(
      new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
      ""
    );
  }

  nextgalaxy(seed) {
    seed.w0 = this.twist(seed.w0);
    seed.w1 = this.twist(seed.w1);
    seed.w2 = this.twist(seed.w2);
  }

  buildgalaxy(galaxynum) {
    var syscount, galcount;
    this.seed.w0 = this.base0;
    this.seed.w1 = this.base1;
    this.seed.w2 = this.base2;
    for (galcount = 1; galcount < galaxynum; ++galcount) {
      this.nextgalaxy(this.seed);
    }
    for (syscount = 0; syscount < this.galsize; ++syscount) {
      this.galaxy[syscount] = this.makesystem(this.seed);
    }
  }

  rotatel(x) {
    var temp = x & 128;
    return this.uint16_limit(2 * (x & 127) + (temp >> 7));
  }

  twist(x) {
    return this.uint16_limit(
      256 * this.rotatel(x >> 8) + this.rotatel(x & 255)
    );
  }

  gen_rnd_number() {
    var a, x;

    x = (this.rnd_seed.a * 2) & 0xff;
    a = x + this.rnd_seed.c;
    if (this.rnd_seed.a > 127) {
      a++;
    }
    this.rnd_seed.a = a & 0xff;
    this.rnd_seed.c = x;

    a = a / 256;
    x = this.rnd_seed.b;
    a = (a + x + this.rnd_seed.d) & 0xff;
    this.rnd_seed.b = a;
    this.rnd_seed.d = x;

    return a;
  }

  goat_soup(source, psy) {
    var result = "",
      c,
      i,
      idx;
    for (idx = 0; idx < source.length; idx++) {
      c = source.charCodeAt(idx);
      if (c < 0x80) {
        result += source.charAt(idx);
      } else {
        if (c <= 0xa4) {
          var rnd = this.gen_rnd_number();
          result += this.goat_soup(
            this.desc_list[c - 0x81][
              (rnd >= 0x33) + (rnd >= 0x66) + (rnd >= 0x99) + (rnd >= 0xcc)
            ],
            psy
          );
        } else {
          switch (c) {
            case 0xb0:
              /* planet name */
              i = 1;
              result += psy.name.charAt(0).toUpperCase();
              while (i < psy.name.length) {
                if (psy.name.charAt(i - 1) == " ") {
                  result += psy.name.charAt(i++).toUpperCase();
                }
                else {
                  result += psy.name.charAt(i++).toLowerCase();
                }
              }
              break;
            case 0xb1:
              /* <planet name>ian */
              i = 1;
              result += psy.name.charAt(0).toUpperCase();
              while (i < psy.name.length) {
                if (
                  i + 1 < psy.name.length ||
                  (psy.name.charAt(i) != "E" && psy.name.charAt(i) != "I")
                ) {
                  if (psy.name.charAt(i - 1) == " ") {
                    result += psy.name.charAt(i).toUpperCase();
                  }
                  else {
                    result += psy.name.charAt(i).toLowerCase();
                  }
                }
                i++;
              }
              result += "ian";
              break;
            case 0xb2:
              /* random name */
              var len = this.gen_rnd_number() & 3;
              for (i = 0; i <= len; i++) {
                var x = this.gen_rnd_number() & 0x3e;
                if (i === 0) {
                  result += this.pairs0[x];
                } else {
                  result += this.pairs0[x].toLowerCase();
                }
                result += this.pairs0[x + 1].toLowerCase();
              }
              break;
            default:
              result += "<bad char in data [" + c + "]>";
              return result;
          }
        }
      }
    }
    return result;
  }

  // HELPER FUNCTIONS - START
  uint8_limit(value) {
    return value & 0xff;
  }

  uint16_limit(value) {
    return value & 0xffff;
  }
  // HELPER FUNCTIONS - END

  prisys(planetnum, element) {
    // print Galaxy info
    var plsy = this.galaxy[planetnum];
    var systemString = "System (";
    if (this.useAlternate) {
      systemString += "Alternate";
    } else {
      systemString += "Elite original";
    }
    systemString += " name): ";
    element.appendChild(document.createTextNode(systemString + plsy.name));
    element.appendChild(document.createElement("br"));
    element.appendChild(
      document.createTextNode("Position (" + plsy.x + ", " + plsy.y + ")")
    );
    element.appendChild(document.createElement("br"));
    element.appendChild(
      document.createTextNode(
        "Economy: (" + plsy.economy + ") " + this.econnames[plsy.economy]
      )
    );
    element.appendChild(document.createElement("br"));
    element.appendChild(
      document.createTextNode(
        "Government: (" + plsy.govtype + ") " + this.govnames[plsy.govtype]
      )
    );
    element.appendChild(document.createElement("br"));
    element.appendChild(
      document.createTextNode("Tech Level: " + (plsy.techlev + 1))
    );
    element.appendChild(document.createElement("br"));
    element.appendChild(
      document.createTextNode("Turnover: " + plsy.productivity)
    );
    element.appendChild(document.createElement("br"));
    element.appendChild(document.createTextNode("Radius: " + plsy.radius));
    element.appendChild(document.createElement("br"));
    element.appendChild(
      document.createTextNode(
        "Population: " + (plsy.population >> 3) + " Billion"
      )
    );
    element.appendChild(document.createElement("br"));
    // code from: https://stackoverflow.com/a/5344074
    this.rnd_seed = JSON.parse(JSON.stringify(plsy.goatsoupseed));
    element.appendChild(
      document.createTextNode(
        "Description: " + this.goat_soup("\x8F is \x97.", plsy)
      )
    );
  }
}

// HELPER FUNCTIONS - START
// code from: https://plainjs.com/javascript/events/binding-and-unbinding-of-event-handlers-12/
var addEvent = (el, type, handler) => {
  if (el.attachEvent) {
    el.attachEvent("on" + type, handler);
  } else {
    el.addEventListener(type, handler);
  }
};

var removeEvent = (el, type, handler) => {
  if (el.detachEvent) {
    el.detachEvent("on" + type, handler);
  } else {
    el.removeEventListener(type, handler);
  }
};
// HELPER FUNCTIONS - END

function planet_change(galaxy_generator) {
  var galaxy = document.getElementById("galaxy");
  var planet = document.getElementById("planet");
  var galaxy_info = document.getElementById("galaxy_info");

  galaxy_info.innerHTML = "";
  galaxy_generator.prisys(planet.value, galaxy_info);
}

function galaxy_change(galaxy_generator) {
  var galaxy = document.getElementById("galaxy");
  var alternate = document.getElementById("alternate");
  var planet = document.getElementById("planet");
  var info = document.getElementById("info");

  var planetnum = planet.value;
  if (!planetnum) {
    planetnum = galaxy.value == 1 ? 7 : 0;
  }
  var planetFragment = document.createDocumentFragment();

  var t0 = performance.now();
  galaxy_generator.useAlternate = alternate.checked;
  galaxy_generator.buildgalaxy(galaxy.value);
  var t1 = performance.now();

  info.innerHTML = "Generated in " + ((t1 - t0) | 0) + " ms";

  galaxy_generator.galaxy.forEach((element, index) => {
    var opt = document.createElement("option");
    opt.innerHTML = index + " - " + element.name;
    opt.value = index;
    planetFragment.appendChild(opt);
  });
  planet.innerHTML = "";
  planet.appendChild(planetFragment);
  planet.value = planetnum;

  planet_change(galaxy_generator);
}


