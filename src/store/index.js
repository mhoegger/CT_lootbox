import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import getWeb3 from "../util/getWeb3";
import pollWeb3 from "../util/pollWeb3";
import getContract from "../util/getContract";
import * as box_pile_actions from "./box-piles/box-pile-actions";
import * as box_pile_mutations from "./box-piles/box-pile-mutations";
import * as card_pile_actions from "./card-piles/card-pile-actions";
import * as card_pile_mutations from "./card-piles/card-pile-mutations";
import * as market_place_actions from "./market-place/market-place-actions";
import * as market_place_mutations from "./market-place/market-place-mutations";
Vue.use(Vuex);
export const store = new Vuex.Store({
  strict: true,
  state,
  mutations: {
    registerWeb3Instance (state, payload) {
      console.log("registerWeb3instance Mutation being executed", payload);
      let result = payload;
      let web3Copy = state.web3;
      web3Copy.coinbase = result.coinbase;
      web3Copy.networkId = result.networkId;

      web3Copy.balance = result.balance;

      web3Copy.is_connected = result.is_connected;

      web3Copy.web3Instance = result.getWeb3Provider;
      state.web3 = web3Copy;
      pollWeb3();
    },

    pollWeb3Instance (state, payload) {
      console.log("pollWeb3Instance mutation being executed", payload);
      Object.assign(state.web3, payload);
    },

    registerContractInstance (state, payload) {
      state.contractInstance = payload;
    },

    // Box
    addBoxToPile: box_pile_mutations.addBoxToPile,
    removeBoxFromPile: box_pile_mutations.removeBoxFromPile,
    moveBoxFromTo: box_pile_mutations.moveBoxFromTo,
    changeBlockBoxesState: box_pile_mutations.changeBlockBoxesState,

    getCards: card_pile_mutations.getCards,
    setCardOffering: card_pile_mutations.setCardOffering,

    getRevealBlockNumberInstance (state, payload) {
      state.cardDeck.bought[state.cardDeck.bought.length - 1].revealblock = payload;
    },

    updateOfferToOwnOffers: market_place_mutations.updateOfferToOwnOffers,
    updateOfferToOtherOffers: market_place_mutations.updateOfferToOtherOffers,
    setOfferWidthdrawing: market_place_mutations.setOfferWidthdrawing,
    setOfferBuying: market_place_mutations.setOfferBuying

  },

  actions: {
    /**
     *
     * @param commit
     * @return {Promise<unknown>}
     */
    registerWeb3 ({commit}) {
      return new Promise((resolve, reject) => {
        console.log("registerWeb3 Action being executed");
        getWeb3().then(result => {
          console.log("committing result to registerWeb3Instance mutation", result);
          commit("registerWeb3Instance", result);
          resolve(true);
        }).catch(e => {
          console.log("error in action registerWeb3", e);
          Vue.prototype.$eventBus.$emit("openMetaMaskModal", "open");
          resolve(false);
        });
      });
    },

    /**
     *
     * @param commit
     * @param payload
     */
    pollWeb3 ({commit}, payload) {
      console.log("pollWeb3 action being executed");
      commit("pollWeb3Instance", payload);
    },

    /**
     *
     * @param commit
     */
    getContractInstance ({commit}) {
      commit("registerContractInstance", getContract());
    },

    // Add- Remove Pending
    /**
     *
     * @param commit
     * @param payload
     */
    addBoxPending: box_pile_actions.addBoxPending,

    removeBoxPending: box_pile_actions.removeBoxPending,

    moveBoxPendingBought: box_pile_actions.moveBoxPendingBought,

    addBoxBought: box_pile_actions.addBoxBought,

    addBoxReady ({commit}, box) {
      return box_pile_actions.addBoxReady({commit}, box, store);
    },

    moveBoxBoughtReady ({commit}, box) {
      return box_pile_actions.moveBoxBoughtReady({commit}, box, store);
    },

    moveBoxReadyRevealing: box_pile_actions.moveBoxReadyRevealing,

    moveBoxRevealingReady ({commit}, box) {
      return box_pile_actions.moveBoxRevealingReady({commit}, box, store);
    },

    moveBoxRevealingUnopened ({commit}, box) {
      return box_pile_actions.moveBoxRevealingUnopened({commit}, box, store);
    },

    removeBoxUnopened: box_pile_actions.removeBoxUnopened,


    getCardsOpen ({commit}) {
      card_pile_actions.getCardsOpen({commit}, store);
    },

    getRevealBlockNumber ({commit}) {
      return box_pile_actions.getRevealBlockNumber({commit}, store);
    },

    getIsReady ({commit}) {
      return box_pile_actions.getIsReady({commit}, store);
    },

    getRevealBox ({commit}) {
      return box_pile_actions.getRevealBox({commit}, store);
    },

    checkBoxReveal ({commit}, payload) {
      return box_pile_actions.checkBoxReveal({commit}, payload, store);
    },

    changeBlockBoxesStateAction: box_pile_actions.changeBlockBoxesStateAction,

    getListingsFromContract ({commit}) {
      return market_place_actions.getListingsFromContract({commit}, store);
    },

    createOfferingFromContract ({commit}, payload) {
      return market_place_actions.createOfferingFromContract({commit}, payload, store);
    },

    buyOfferingFromContract ({commit}, payload) {
      return market_place_actions.buyOfferingFromContract({commit}, payload, store);
    },

    withdrawOfferingFromContract ({commit}, payload) {
      return market_place_actions.withdrawOfferingFromContract({commit}, payload, store);
    }
  }
});
