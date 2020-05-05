function addOfferToOwnOffers (state, payload) {
  state.market_place.own_offers.push(payload);
}

function addOfferToOtherOffers (state, payload) {
  state.market_place.others_offers.push(payload);
}

export {
  addOfferToOwnOffers,
  addOfferToOtherOffers
};
