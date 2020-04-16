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
    unopened: [],
    open: []
  }
};
export default state;
