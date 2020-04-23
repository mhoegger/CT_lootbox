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

    addCardInstance (state, payload) {
      let pile = payload.to;
      delete payload.to;
      console.log("Add Card to ", pile ," pile: ", payload);
      state.cardDeck[pile].push(payload);
    },

    removeCardPendingInstance (state, payload) {
      console.log("Remove Card to pending pile: ", payload);
      Vue.set(state.cardDeck, "pending", state.cardDeck.pending.filter(obj => {
        return obj.tx !== payload.tx;
      }));
    },

    moveCardInstance (state, payload) {
      console.log("Move card from ", payload.from, "to ", payload.to, ": ", payload.tx);
      let cards_to_move = state.cardDeck[payload.from].filter(obj => {
        return obj.tx === payload.tx;
      });
      cards_to_move.forEach(card => {
        Object.assign(card, payload);
        delete card.from;
        delete card.to;
        state.cardDeck[payload.to].push(card);
      });
      Vue.set(state.cardDeck, [payload.from], state.cardDeck[payload.from].filter(obj => {
        return obj.tx !== payload.tx;
      }));
    },

    getCardsOpenInstance (state, payload) {
      Vue.set(state.cardDeck, "open", payload);
    },

    getRevealBlockNumberInstance (state, payload) {
      state.cardDeck.bought[state.cardDeck.bought.length - 1].revealblock = payload;
    }

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
          reject(e);
        });
      })

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
    addCardPending ({commit}, payload) {
      payload.to = "pending";
      commit("addCardInstance", payload);
      payload.click = () => {
        console.log("Do Nothing");
      };
    },

    removeCardPending ({commit}, payload) {
      commit("removeCardPendingInstance", payload);
    },

    // Move cards
    moveCardPendingBought ({commit}, payload) {
      payload.from = "pending";
      payload.to = "bought";
      payload.click = () => {
        console.log("Do Nothing");
      };
      commit("moveCardInstance", payload);
    },

    addCardReady ({commit}, payload) {
      payload.to = "ready";
      payload.click = () => {
        console.log("clickEvent");
        store.dispatch("getRevealBox");
      };
      commit("addCardInstance", payload);
    },

    moveCardBoughtReady ({commit}, payload) {
      payload.from = "bought";
      payload.to = "ready";
      payload.click = () => {
        store.dispatch("getRevealBox");
      };
      commit("moveCardInstance", payload);
    },

    moveCardReadyRevealing ({commit}, payload) {
      payload.from = "ready";
      payload.to = "revealing";
      commit("moveCardInstance", payload);
    },

    moveCardRevealingReady ({commit}, payload) {
      payload.from = "revealing";
      payload.to = "bought";
      commit("moveCardInstance", payload);
    },

    moveCardRevealingUnopened ({commit}, payload) {
      payload.from = "revealing";
      payload.to = "unopened";
      commit("moveCardInstance", payload);
    },

    getCardsOpen ({commit}) {
      if (state.contractInstance && state.web3.coinbase) {
        console.log("state.web3.coinbase", state.web3.coinbase);
        state.contractInstance().methods.getCards().call({
          from: state.web3.coinbase
        }).then(res => {
          console.log("res", res)
          commit("getCardsOpenInstance", res);
        }).catch(err => {
          console.log(err);
        });
      } else {
        setTimeout(() => {
          store.dispatch("getCardsOpen");
        }, 500);
      }
    },

    getRevealBlockNumber ({commit}) {
      return new Promise((resolve, reject) => {
        if (state.contractInstance) {
          state.contractInstance().methods.getRevealBlockNumber().call({
            from: state.web3.coinbase
          }, function (err, res) {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        } else {
          resolve(setTimeout(() => {
            store.dispatch("getRevealBlockNumber");
          }, 500));
        }
      });
    },

    getIsReady ({commit}) {
      return new Promise((resolve, reject) => {
        if (state.contractInstance) {
          state.contractInstance().methods.isItReadyYet().call({
            from: state.web3.coinbase
          }, function (err, res) {
            if (err) {
              reject(console.log(err));
            } else {
              console.log("getIsReady", res)
              resolve(res);
            }
          });
        } else {
          setTimeout(() => {
            resolve(store.dispatch("getIsReady"));
          }, 500);
        }
      });

    },

    getRevealBox ({commit}) {
      store.dispatch("getIsReady").then(res => {
        if (res) {
          let transaction = null;
          state.contractInstance().methods.revealBox().send({
            from: state.web3.coinbase
          }).on("transactionHash", (tx) => {
            transaction = tx;
            console.log("TX", tx);
            let card_to_move = state.cardDeck.ready[state.cardDeck.ready.length - 1];
            console.log(card_to_move)
            // Add to pending
            store.dispatch("moveCardReadyRevealing", {
              tx: card_to_move.tx,
              time_issued: Date.now()
            });
            // subscribe to event
            store.state.contractInstance().events.generatedCard()
              .on("data", (result) => {
                console.log("result.args", result.args);
                store.dispatch("moveCardRevealingUnopened", {
                  tx: card_to_move.tx
                });
              })
              .on("error", (err) => {
                // Add to pending
                store.dispatch("moveCardBoughtRevealing", {
                  tx: transaction
                });
              });
          }).on("error", (error) => {
            console.log("error", error);
          });
        } else {
          console.log("NOT Ready");
        }
      })
    },

    checkBoxReveal({commit}, payload) {
      let reveal_reached = state.cardDeck.bought.filter(card => card.revealblock < payload);
      console.log("Cards to Reveal:", reveal_reached);
      reveal_reached.forEach(card => {
        let card_to_move = state.cardDeck.bought[state.cardDeck.bought.length - 1];
        store.dispatch("moveCardBoughtReady", {
          tx: card_to_move.tx
        });
      });
      store.dispatch("getIsReady").then(res => {
        console.log("checkBoxReveal", "getIsReady", res, reveal_reached.length <= 0, reveal_reached)
        if (res && reveal_reached.length <= 0 && state.cardDeck.ready.length <= 0 && state.cardDeck.revealing.length <= 0) {
          const id = Math.floor((1 + Math.random()) * 0x10000)
            .toString(16);
          console.log("Box is ready, but on Bought-pile, adding new card with id: ", id)
          // card is ready but no in store
          store.dispatch("addCardReady", {
            tx: id,
            revealblock: payload
          });
        }
      });
    }
  }
});
