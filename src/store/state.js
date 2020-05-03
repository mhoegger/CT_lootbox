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
  cardDeck: {
    pending: [],
    bought: [],
    ready: [],
    revealing: [],
    unopened: [],
    open: []
  },
  market: {
    own_offers: [],
    others_offers: [],
  }
};
export default state;
