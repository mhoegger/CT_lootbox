import Vue from "vue";

function updateOfferToOwnOffers (state, payload) {
  Vue.set(state.market_place, "own_offers", []);
  payload.forEach(offer => {
    state.market_place.own_offers.push(offer);
  });
}

function updateOfferToOtherOffers (state, payload) {
  Vue.set(state.market_place, "others_offers", []);

  payload.forEach(offer => {
    state.market_place.others_offers.push(offer);
  });
}

function setOfferWidthdrawing (state, payload) {
  let offer_to_mutate = state.market_place.own_offers.find(offer => offer.offeringId === payload.offeringId)
  Vue.set(offer_to_mutate, "widthdrawing", true);
}

function setOfferBuying (state, payload) {
  let offer_to_mutate = state.market_place.others_offers.find(offer => offer.offeringId === payload.offeringId)
  Vue.set(offer_to_mutate, "buying", true);
}

export {
  updateOfferToOwnOffers,
  updateOfferToOtherOffers,
  setOfferWidthdrawing,
  setOfferBuying
};
