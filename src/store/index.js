import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import getWeb3 from "../util/getWeb3";
import pollWeb3 from "../util/pollWeb3";
import getContract from "../util/getContract";

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

      web3Copy.balance = parseInt(result.balance, 10);

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
      console.log("Casino contract instance: ", payload);
      state.contractInstance = payload;
      console.log("Casino done: ");
    },

    addCardPendingInstance (state, payload) {
      console.log("Add Card to pending pile: ", payload);
      state.cardDeck.pending.push(payload);
    },

    moveCardPendingUnopenedInstance (state, payload) {
      console.log("Remove Card from pending pile: ", payload.tx, payload.card_id);
      let cards_to_move = state.cardDeck.pending.filter(obj => {
        return obj.tx === payload.tx;
      });
      cards_to_move.forEach(card => {
        card.card_id = payload.card_id;
        state.cardDeck.unopened.push(card);
      });
      state.cardDeck.pending = state.cardDeck.pending.filter(obj => {
        return obj.tx !== payload.tx;
      });
    },

    getCardsOpenInstance (state, payload) {
      Vue.set(state.cardDeck, "open", state.cardDeck.open.concat(payload));
    }
  },
  actions: {
    registerWeb3 ({commit}) {
      console.log("registerWeb3 Action being executed");
      getWeb3().then(result => {
        console.log("committing result to registerWeb3Instance mutation", result);
        commit("registerWeb3Instance", result);
      }).catch(e => {
        console.log("error in action registerWeb3", e);
        Vue.prototype.$eventBus.$emit("openMetaMaskModal", "open");
      });
    },

    pollWeb3 ({commit}, payload) {
      console.log("pollWeb3 action being executed");
      commit("pollWeb3Instance", payload);
    },

    getContractInstance ({commit}) {
      commit("registerContractInstance", getContract());
    },

    addCardPending ({commit}, payload) {
      commit("addCardPendingInstance", payload);
    },

    moveCardPendingUnopened ({commit}, payload) {
      commit("moveCardPendingUnopenedInstance", payload);
    },

    getCardsOpen ({commit}) {
      let interval = setInterval(() => {
        if (state.contractInstance) {
          state.contractInstance().getCards.call({
            from: state.web3.coinbase
          }, function (err, res) {
            if (err) {
              console.log(err);
            } else {
              commit("getCardsOpenInstance", res);
            }
          });
          clearInterval(interval);
        } else {
          store.dispatch("getCardsOpen");
        }
      }, 500);
    }
  }
});
