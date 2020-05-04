import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import getWeb3 from "../util/getWeb3";
import pollWeb3 from "../util/pollWeb3";
import getContract from "../util/getContract";
import * as box_pile_actions from "./box-piles/box-pile-actions";
import * as box_pile_mutations from "./box-piles/box-pile-mutations";
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
      console.log("Add Card to ", pile, " pile: ", payload);
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
    },

    addOfferToOwnOffers (state, payload) {
      state.market.own_offers.push(payload);
    },
    addOfferToOtherOffers (state, payload) {
      state.market.others_offers.push(payload);
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

    addBoxReady: box_pile_actions.addBoxReady,

    moveBoxBoughtReady: box_pile_actions.moveBoxBoughtReady,

    moveBoxReadyRevealing: box_pile_actions.moveBoxReadyRevealing,

    moveBoxRevealingReady: box_pile_actions.moveBoxRevealingReady,

    moveBoxRevealingUnopened: box_pile_actions.moveBoxRevealingUnopened,

    getCardsOpen ({commit}) {
      if (state.contractInstance && state.web3.coinbase) {
        console.log("state.web3.coinbase", state.web3.coinbase);
        state.contractInstance().methods.getCards().call({
          from: state.web3.coinbase
        }).then(res => {
          console.log("res", res);
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
              console.log("getIsReady", res);
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
            console.log(card_to_move);
            // Add to pending
            store.dispatch("moveBoxReadyRevealing", {
              tx: card_to_move.tx,
              time_issued: Date.now()
            });
            // subscribe to event
            store.state.contractInstance().events.generatedCard()
              .on("data", (result) => {
                console.log("result.args", result.returnValues.cardNumber);
                store.dispatch("moveBoxRevealingUnopened", {
                  tx: card_to_move.tx,
                  content: result.returnValues.cardNumber
                });
              })
              .on("error", (err) => {
                // Add to pending
                store.dispatch("moveBoxRevealingReady", {
                  tx: transaction
                });
              });
          }).on("error", (error) => {
            console.log("error", error);
          });
        } else {
          console.log("NOT Ready");
        }
      });
    },

    checkBoxReveal ({commit}, payload) {
      let reveal_reached = state.cardDeck.bought.filter(card => card.revealblock < payload);
      console.log("Cards to Reveal:", reveal_reached);
      reveal_reached.forEach(card => {
        let card_to_move = state.cardDeck.bought[state.cardDeck.bought.length - 1];
        store.dispatch("moveBoxBoughtReady", {
          tx: card_to_move.tx
        });
      });
      store.dispatch("getIsReady").then(res => {
        console.log("checkBoxReveal", "getIsReady", res, reveal_reached.length <= 0, reveal_reached);
        if (res && reveal_reached.length <= 0 && state.cardDeck.ready.length <= 0 && state.cardDeck.revealing.length <= 0) {
          const id = Math.floor((1 + Math.random()) * 0x10000)
            .toString(16);
          console.log("Box is ready, but not on Ready-pile, adding new card with id: ", id);
          // card is ready but no in store
          store.dispatch("addBoxReady", {
            tx: id,
            revealblock: payload
          });
        }
        store.dispatch("getRevealBlockNumber").then(block_nr => {
          console.log("block_nr", block_nr);
          if (!res && block_nr !== "0" && state.cardDeck.bought.length <= 0 && state.cardDeck.pending.length <= 0) {
            const id = Math.floor((1 + Math.random()) * 0x10000)
              .toString(16);
            console.log("Box is ready, but not on Ready-pile, adding new card with id: ", id);
            // card is ready but no in store
            store.dispatch("addBoxBought", {
              tx: id,
              revealblock: block_nr
            });
          }
        });
      });
    },

    getListingsFromContract ({commit}) {
      if (state.contractInstance && state.web3.coinbase) {
        console.log("state.web3.coinbase", state.web3.coinbase);
        state.contractInstance().methods.getListings().call({
          from: state.web3.coinbase
        }).then(res => {
          console.log("getListings", res);
          res.forEach(offer => {
            if (offer.seller.toLowerCase() === state.web3.coinbase.toLowerCase()) {
              console.log("addOfferToOwnOffers");
              commit("addOfferToOwnOffers", offer);
            } else {
              console.log("addOfferToOwnOffers");
              commit("addOfferToOtherOffers", offer);
            }
          });
        }).catch(err => {
          console.log(err);
        });
      } else {
        setTimeout(() => {
          store.dispatch("getListingsFromContract");
        }, 500);
      }
    },

    createOfferingFromContract ({commit}, payload) {
      if (state.contractInstance && state.web3.coinbase) {
        console.log("state.web3.coinbase", state.web3.coinbase);
        console.log("payload.cardNumber", payload.cardNumber);
        console.log("payload.cardNumber", typeof payload.cardNumber);
        console.log("payload.cardNumber", typeof parseInt(payload.cardNumber - 1));
        console.log("payload.price", payload.price);
        console.log("payload.price", typeof state.web3.web3Instance().utils.toWei(payload.price, "ether"));

        state.contractInstance().methods.createOffering(parseInt(payload.cardNumber), parseInt(state.web3.web3Instance().utils.toWei(payload.price, "ether"))).send({
          from: state.web3.coinbase
        }).then(res => {
          console.log("createOfferingFromContract", res);
          store.state.contractInstance().events.offeringCreated()
            .on("data", (result) => {
              console.log("offeringCreated", result.args);
              console.log("offeringCreated", result);
            })
            .on("error", (err) => {
              console.log("1112", err);
            });
        }).catch(err => {
          console.log(err);
        });
      } else {
        setTimeout(() => {
          store.dispatch("createOfferingFromContract", payload);
        }, 500);
      }
    }
  }
});
