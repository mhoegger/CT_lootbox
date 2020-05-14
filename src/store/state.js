import box_pile from "./box-piles/box-pile-state";
import card_pile from "./card-piles/card-pile-state";
import market_place from "./market-place/market-place-state";

let state = {
  web3: {
    isInjected: false,
    web3Instance: null,
    networkId: null,
    coinbase: null,
    balance: null,
    error: null,
    is_connected: false
  },
  contractInstance: null,
  box_pile: box_pile,
  card_pile: card_pile,
  market_place: market_place,
  box_blocked: false
};
export default state;
