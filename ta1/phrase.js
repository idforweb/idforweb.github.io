var Phrase = Phrase || {
  stuffs : [],
  fruit : ["apple",
    "orange",
    "banana",
    "coconut",
    "garlic",
    "onion",
    "cabbage",
    "cheeseburger",
    "potato",
    "chocolate",
    "fish",
    "peach",
    "lemon",
    "pickle",
    "carrot",
    "cookie",
    "mushroom",
    "marshmallow",
    "fried chicken",
    "walnut",
    "chicken wing",
    "ginger",
    "chicken curry",
    "chicken liver",
    "muffin",
    "turkey",
    "shellfish",
    "beef noodle",
    "instant noodle",
    "fried rice",
    "pizza",
    "avocado",
    "mango",
    "squash",
    "dumpling",
    "grape",
    "cheese cake",
    "doughnut",
    "waffle",
    "oyster",
    "ice cream",
    "lobster",
    "lobster leg",
    "lobster tail",
    "crab cake",
    "sandwich",
    "meatloaf",
    "pot pie",
    "apple pie",
    "cream pie",
    "egg roll",
    "raisin",
    "tuna sandwich",
    "beef sandwich",
    "corn chowder",
    "salad",
    "pancake",
    "tomato",
    "egg salad",
    "potato salad",
    "sausage biscuit",
    "sausage",
    "fish taco",
    "beef taco"
  ],

  animals : [
    "cat",
    "dog",
    "bear",
    "tiger",
    "panda",
    "lion",
    "snake",
    "zebra",
    "horse",
    "cow",
    "duck",
    "goose",
    "monkey",
    "dinosaur",
    "donkey",
    "dolphin",
    "elephant",
    "fox",
    "giraffe",
    "pig",
    "grasshopper",
    "gorilla",
    "hamster",
    "dragon",
    "lizard",
    "mouse",
    "mosquito",
    "fly",
    "rabbit",
    "scorpion",
    "shark",
    "spider",
    "puppy",
    "kitten",
    "cockroach",
    "buffalo",
    "camel",
    "crocodile",
    "beetle",
    "chimpanzee",
    "deer",
    "cricket",
    "frog",
    "wolf",
    "sparrow",
    "goat",
    "eagle",
    "peacock",
    "hen",
    "butterfly",
    "bat",
    "penguin",
    "whale",
    "cobra",
    "copperhead",
    "rattlesnake",
    "python",
    "pigeon",
    "great white",
    "tiger shark",
    "jellyfish",
    "octopus",
    "hawk",
    "falcon"
  ],
  adj1 : [
    "large",
    "small",
    "huge",
    "tiny",
    "delicious",
    "awful",
    "bad",
    "tasty"
  ],

  adj2 : [
    "large",
    "small",
    "little",
    "giant",
    "huge",
    "tiny",
    "stupid",
    "silly"
  ],
}
function addToStuffs() {
  var adj1 = Phrase.adj1;
  var adj2 = Phrase.adj2;
  var animals = Phrase.animals;
  var fruit = Phrase.fruit;
  var stuffs = Phrase.stuffs;
  var i,j;
  for(i=0; i<adj1.length; ++i) {
    for(j=0; j<fruit.length; ++j) {
      stuffs.push(adj1[i] + ' ' + fruit[j]);
    }
  }
  for(i=0; i<adj2.length; ++i) {
    for(j=0; j<animals.length; ++j) {
      stuffs.push(adj2[i] + ' ' + animals[j]);
    }
  }
}
addToStuffs();

function generateKeyPair() {
  var encrypt = new JSEncrypt();
  localStorage['pubkey'] = encrypt.getPublicKey();
  localStorage['privkey'] = encrypt.getPrivateKey();
  return encrypt;
}

function getPublicFingerprintStrings(rsa) {
  var pubKey = rsa.getPublicKey();
  var digest = CryptoJS.SHA256(pubKey);
  var a_word = digest.words[0];
  var idx = []
  var strings = []
  for(var i=0; i<3; ++i) {
    idx.push((a_word >> (10*i)) & 0x3ff);
    strings.push(Phrase.stuffs[idx[i]]);
  }
  return strings;
}

function genKeyAndPhrase() {
  var keyPair = generateKeyPair();
  var phrases = getPublicFingerprintStrings(keyPair);
  return {
    'key' : keyPair,
    'phrases' : phrases,
  };
}

