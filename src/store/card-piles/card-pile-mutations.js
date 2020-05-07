import Vue from "vue";

function getCards (state, payload) {
  state.card_pile = payload;
}

function setCardOffering (state, payload) {
  console.log("--->", state.card_pile);
  console.log("--->", payload);

  let card_to_mutate = state.card_pile.find(card => card.card_id.toString() === payload.cardNumber)
  console.log("---", card_to_mutate);
  Vue.set(card_to_mutate, "offering", true);
}


export {
  getCards,
  setCardOffering
};
