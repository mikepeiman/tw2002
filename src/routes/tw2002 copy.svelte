<svelte:head>
	<title>About</title>
</svelte:head>


<script>
  import { onMount } from "svelte";
  import seedrandom from "seedrandom";
// import '../components/galaxy-generator.js'

let universe = [] // || [{id: 0, name: 'Mike'},{id: 1, name: 'Matt'},{id: 2, name: 'Max'},]
let numberOfSectors = 10

function generateGalaxy(numberOfSectors) {
  
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

      this.galsize = 256;
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

    makesystem(seed, id) {
      var thissys = {};
      var pair1, pair2, pair3, pair4;
      var longnameflag = seed.w0 & 64;

      thissys.id = id;
      thissys.warpsQuota = 0
      thissys.outlinks = []
      thissys.inlinks = []


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

      thissys.numOutlinks = getRandomInt(1, 6)

      thissys.warps = {
        twoWay: [],
        out: [],
        in: []
      }

      thissys.radius = 256 * (((seed.w2 >> 8) & 15) + 11) + thissys.x;

      thissys.goatsoupseed = {};
      thissys.goatsoupseed.a = seed.w1 & 0xff;
      thissys.goatsoupseed.b = this.uint8_limit(seed.w1 >> 8);
      thissys.goatsoupseed.c = seed.w2 & 0xff;
      thissys.goatsoupseed.d = this.uint8_limit(seed.w2 >> 8);

      if (this.useAlternate) {
        seedrandom([seed.w0, seed.w1, seed.w2]);
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
        this.galaxy[syscount] = this.makesystem(this.seed, syscount);
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
      // console.log(`this.galaxy ${this.galaxy}`)
      // console.log(`planetnum ${planetnum}`)
      // console.log(planetnum)
      var plsy = this.galaxy[planetnum] || this.galaxy[0];
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
    
    console.log(planet)
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


    // galaxy_generator.galaxy.forEach((element, index) => {
    //   console.log(`galaxy_generator.galaxy.forEach((element, index) => ${element}`)
    //   console.log(element)
    // })
    galaxy_generator.galaxy.forEach((element, index) => {
      var opt = document.createElement("option");
      opt.innerHTML = index + " - " + element.name;
      opt.value = index;
      planetFragment.appendChild(opt);
      element.id = index
      element.complete = false;
      
      // console.log(`galaxy_generator.galaxy.forEach((element, index) => element ${element}`)
      // console.log(element)
      // warpMaker(galaxy_generator.galaxy, element)
      // let sector = new Sector(element.id, element.name, element.numOutlinks, element.outlinks, element.inlinks)
      universe.push(element)
    });
    localStorage.setItem("universe", JSON.stringify(universe))
    // warpMaker(universe)
    planet.innerHTML = "";
    planet.appendChild(planetFragment);
    planet.value = planetnum;

    planet_change(galaxy_generator);
  }

  var galaxy_generator = new EliteGalaxyGenerator(base0, base1, base2);
  galaxy_generator.galsize = numberOfSectors
  var galaxy = document.getElementById("galaxy");
  var alternate = document.getElementById("alternate");
  var planet = document.getElementById("planet");

  galaxy_change(galaxy_generator);
  addEvent(galaxy, "change", () => {
    galaxy_change(galaxy_generator);
  });
  addEvent(alternate, "click", () => {
    galaxy_change(galaxy_generator);
  });
  addEvent(planet, "change", () => {
    planet_change(galaxy_generator);
  });
}

async function getValidSectorToWarpTo(sector, galaxy) {
  let getRandomPromise = new Promise((resolve, reject) => {
    resolve(getRandomInt(0,galaxy.length-1))
  })
  let randomId = await getRandomPromise
  let randomSector = await galaxy[randomId]
  // I set the "newSector" variable to the return value of a recursive function
  // that function begins by choosing a randomSector, 
  console.log('%%%%%%%%%%%%%%%%%%%% getValidSectorToWarpTo(sector) head %%%%%%%%%%%%%%%%%%%%%%')
  console.log(`sector.warpsQuota ${sector.warpsQuota}`)
  console.log(`sector.outlinks [${sector.outlinks}]`)
  console.log(`sector.inlinks [${sector.inlinks}]`)
  console.log(`randomSector.id ${randomSector.id}`)
  console.log(`randomInt: ${randomId}`)

  // console.log(`randomSector: `)
  // console.log(randomSector)
  // and then checks against violations:
  if(randomSector.id !== sector.id
  && !sector.outlinks.includes(randomSector.id)
  && !sector.inlinks.includes(randomSector.id)
  ) {
    // return the current value
    console.log('%%%%%%%%%%%%%%%%%%%% We passed all the conditions for an acceptable warp! %%%%%%%%%%%%%%%%%%%%%%')
    console.log(`[[[${randomSector.id}]]]\n\n\n`)
    return randomSector.id
  } else {
    // run me again with current value adjusted (change parameter values) 
    // --> this is done automatically by the random function at head of function
    console.log("@@@@@@@@@@@@@@@!!! We failed some condition, so we're going again....@@@@@@@@@@@@@@@@@@@@@@@@@!!!")
    console.log(`sector[${sector.id}].warpsQuota ${sector.warpsQuota}`)
    console.log(`sector[${sector.id}].outlinks [${sector.outlinks}]`)
    console.log(`sector[${sector.id}].inlinks [${sector.inlinks}]`)
    console.log(`randomSector.id ${randomSector.id}`)
    console.log(randomSector)
    console.log(`.\n.\n.`)
    return await getValidSectorToWarpTo(sector, galaxy)
  }
  return "ERROR!"
  // return getValidSectorToWarpTo(sector, galaxy)
}

function getRandomSector(galaxy) {
  return galaxy[Math.floor(Math.random()*galaxy.length)];
}

function setWarpsQuotas(galaxy) {
  galaxy.forEach(sector => {
    let warpsQuota = getRandomInt(1,6)
    sector.warpsQuota = warpsQuota
  })
}

async function setWarps(galaxy) {
  galaxy.forEach(sector => {
    // let warpsIn = sector.inlinks
    // let warpsOut = sector.outlinks
    let quota = sector.warpsQuota
    let needsMoreWarps = quota - sector.outlinks.length
    console.log(`*******************************     sector[${sector.id}] ******************************`)
    console.log(`*******************************     sector[${sector.id}] ******************************`)
    console.log(`*******************************     sector[${sector.id}] ******************************`)
    console.log(sector)
    console.log(` needsMoreWarps ${needsMoreWarps} = quota ${quota} - sector.outlinks.length ${sector.outlinks.length}`)
    console.log(` outlinks ${sector.outlinks} inlinks ${sector.inlinks} of active sector`)

    console.log(`.\n.\n.`)

    if(needsMoreWarps > 0) {
      for(let i = 0; i < needsMoreWarps; i++) {
        console.log(`#######===>    ITER ${i}    <===############# before getValidSectorToWarpTo: current sector ${sector.id} with outlinks [${sector.outlinks}]`)
      // var randomSector = galaxy[Math.floor(Math.random()*galaxy.length)];
      // let validWarp = new Promise((resolve,reject) => {
      //   resolve(getValidSectorToWarpTo(sector, galaxy))
      // })
      let newSectorId = getValidSectorToWarpTo(sector, galaxy);//validWarp()
      // getValidSectorToWarpTo(sector, galaxy).then(value => {
      //   console.log(`Returning the warp promise as thenable: ${value}`)
      // return value
      // })
      newSectorId.then(id => {
        console.log(`*******************************     sector[${sector.id}] ******************************`)
        console.log(` needsMoreWarps ${needsMoreWarps} = quota ${quota} - sector.outlinks.length ${sector.outlinks.length}`)
        console.log(`newSectorId variable assigned the return value of getValidSectorToWarpTo`)
        console.log(id)
        let newSector = galaxy[id]
        console.log(newSector)
        console.log(`.\n.\n.`)
        // var randomSector = galaxy[Math.floor(Math.random()*galaxy.length)];
        sector.outlinks.push(id)
        sector.inlinks.push(id)

// For 9/12/2019: refactor this so I set all the links on each sector, running a check of array.length against warpsQuota with
// each link added, and flagging "full" on the sector when it is; using this as the end condition for recursion

        setTimeout(() => {
        newSector.inlinks.push(sector.id)
        newSector.outlinks.push(sector.id)
        }, 500);
      })


      console.log(`sector.warpsQuota ${sector.warpsQuota}`)
      console.log(`sector.outlinks [${sector.outlinks}]`)
      console.log(`sector.inlinks [${sector.inlinks}]`)
      console.log(`*******************************     sector[${sector.id}] ******************************`)
      }
    } else if(needsMoreWarps === 0) {
      console.log(`||||||||||||||||||||||||||||||||    We have PRECISELY the correct amount of warps: needs ${needsMoreWarps} more or less   |||||||||||||||||||||||||||||`)
    } else {
      console.log(`||||||||||||||||||||||||||||||||    apparently we have too many warps! ${needsMoreWarps} 
      |||||||||||||||||||||||||||||`)
    }
    console.log(`AFTER setWarps: sector: outlinks ${sector.outlinks} inlinks ${sector.inlinks}`)
  })
  localStorage.setItem("universe", JSON.stringify(galaxy))
}

function pruneLinks(sector, type) {
  if(type === "inlinks") {
    console.log(`prune inlinks for ${sector.id}`)
  } else {
    console.log(`prune outlinks for ${sector.id}`)
  }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    let prng = seedrandom();
    let randomInRange = Math.floor(prng() * (max - min + 1)) + min;
    // console.log(`getRandomInt prng: ${prng()}, in range ${randomInRange}`)
    return randomInRange
}

function getSector(id) {
  return galaxy[id]
}

onMount(() => {
let galaxy = JSON.parse(localStorage.getItem("universe"))
console.log(`galaxy from ls`)
console.log(galaxy)
// warpMaker(galaxy)
setWarpsQuotas(galaxy)
setWarps(galaxy)
universe = JSON.parse(localStorage.getItem("universe"))
})

class Sector {
  constructor(id, name, numOutlinks, outlinks, inlinks) {
    this.id = id
    this.name = name
    this.numOutlinks = numOutlinks
    this.outlinks = outlinks
    this.inlinks = inlinks
  }

  getWarps() {
    return `Warps from this sector are ${this.warps}`
  }
}

class Ship {
  constructor(id, name, baseCost, holds, moves) {
    this.id = id
    this.name = name
    this.baseCost = baseCost
    this.holds = holds
    this.moves = moves
  }

  getCost() {
    return `Today's price is $${baseCost * 1.5}}`
  }
}

</script>

<section class="tw2002">
  <h1>TW2002: Redux</h1>
  
  <p>Because I'm not done playing yet.</p>
<div class="game-menu">
    <button id="generate-game" on:click="{generateGalaxy(numberOfSectors)}">Generate New Universe</button>
    <button id="generate-links" on:click="">Generate Sector Links</button>
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
    <input type="checkbox" id="alternate" name="alternate" value="1" checked>
  </div>
  <div class="col">
    <label for="planet">Planet:</label>
    <select id="planet" name="planet" value="0">0
    </select>
  </div>
  <div id="info" class="col">
  </div>
</div>

</div>
  
  <div class="sector-list"> 
  <div id="galaxy_info"></div>
  </div>
    <div class="sector-list"> 
  {#each universe as sector}
  <div class="svelte-universe">
  <span class="sector-details">Sector {sector.id}: {sector.name} ||| </span>
  <span class="sector-warps:">
    warps quota: 
    <span class="warp">{sector.warpsQuota}</span>
    warps: {#each sector.outlinks as warp}
    <span class="warp">{warp}</span>
    {/each} 
  </span>
  </div>
  {/each}
  </div>
</section> 

<style lang="scss" >
.tw2002 {
  background: rgba(0,0,0,0.15);
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
  background: rgba(0,0,255,0.25);
  outline: none;
  border: 1px solid rgba(155,25,255,1);
  padding: .5rem;
  margin: 0 1rem 1rem 0;
  box-shadow: none;
  transition: all .25s;
  &:hover {
    background: rgba(255,255,255,0.25);
    border-radius: 5px;
  }
}
#start-game {

}

.sector-list {
  width: 100vw;
  height: auto;
  padding: 1rem;
  background: rgba(55,155,175,0.35);
}

.svelte-universe {
  display: grid;
  grid-template-columns: 20% 1fr;
}
.warp {
  padding: .25rem;
  margin-right: .25rem;
  width: 5ch;
  background: rgba(0,0,0,0.1);
  border-radius: 3px;
  border-bottom: 1px solid rgba(0,50,250,1);
  &:after {
    content: " - ";
  }
  &:last-child:after {
    content: "";
  }
}
</style>

