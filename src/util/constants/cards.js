
function getCard (id) {
  const cards = {};

  cards["1"] =
    {
      "text": "this is some cool ass dino",
      "name": "bulbasaur",
      "image": require("@/assets/dinos/card_01.png"),
      "rarity": require("@/assets/cards/card_design_common.png"),
      "offer": require("@/assets/cards/offer_design_common.png")

    };
  cards["2"] =
    {
      "text": "even cooler dino",
      "name": "paul",
      "image": require("@/assets/dinos/card_02.png"),
      "rarity": require("@/assets/cards/card_design_uncommon.png"),
      "offer": require("@/assets/cards/offer_design_uncommon.png")
    };
  cards["3"] =
    {
      "text": "even derpier dino",
      "name": "longnek",
      "image": require("@/assets/dinos/card_03.png"),
      "rarity": require("@/assets/cards/card_design_rare.png"),
      "offer": require("@/assets/cards/offer_design_rare.png")
    };
  cards["4"] =
    {
      "text": "even derpierer dino",
      "name": "bluedude",
      "image": require("@/assets/dinos/card_04.png"),
      "rarity": require("@/assets/cards/card_design_epic.png"),
      "offer": require("@/assets/cards/offer_design_epic.png")
    };
  cards["5"] =
    {
      "text": "even derpierer dino 2",
      "name": "bluedude",
      "image": require("@/assets/dinos/card_05.png"),
      "rarity": require("@/assets/cards/card_design_legendary.png"),
      "offer": require("@/assets/cards/offer_design_legendary.png")
    };
  return cards[id];
}
export default getCard;
