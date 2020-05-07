// Add- Remove Pending
import Vue from "vue";

/**
 *
 * @param commit
 * @param box
 */
function addBoxPending ({commit}, box) {
  box.click = () => {
    console.log("Do Nothing");
  };

  commit("addBoxToPile",
    {
      to: "pending",
      box: box

    }
  );
}

function removeBoxPending ({commit}, box) {
  commit("removeBoxFromPile", {from: "pending", box: box});
}

// Move cards
function moveBoxPendingBought ({commit}, box) {
  Vue.set(box, "click", () => {
    console.log("Do Nothing in Bought");
  });
  commit("moveBoxFromTo", {
    from: "pending",
    to: "bought",
    box: box
  });
}

function addBoxBought ({commit}, box) {
  box.click = () => {
    console.log("Do Nothing");
  };

  commit("addBoxToPile", {
    to: "bought",
    box: box
  });
}

function addBoxReady ({commit}, box, store) {
  box.click = () => {
    store.dispatch("getRevealBox");
  };

  commit("addBoxToPile", {
    to: "ready",
    box: box
  });
}
function moveBoxBoughtReady ({commit}, box, store) {
  Vue.set(box, "click", () => {
    store.dispatch("getRevealBox");
  });

  commit("moveBoxFromTo", {
    from: "bought",
    to: "ready",
    box: box
  });
}

function moveBoxReadyRevealing ({commit}, box) {
  Vue.set(box, "click", () => {
    console.log("Do Nothing");
  });

  commit("moveBoxFromTo", {
    from: "ready",
    to: "revealing",
    box: box
  });
}

function moveBoxRevealingReady ({commit}, box, store) {
  Vue.set(box, "click", () => {
    store.dispatch("getRevealBox");
  });

  commit("moveBoxFromTo", {
    from: "ready",
    to: "revealing",
    box: box
  });
}

function moveBoxRevealingUnopened ({commit}, box, store) {
  Vue.set(box, "click", () => {
    Vue.prototype.$eventBus.$emit("openOpenBox");
    removeBoxUnopened({commit}, box);
    store.dispatch("getCardsOpen");
  });

  commit("moveBoxFromTo", {
    from: "revealing",
    to: "unopened",
    box: box
  });
}

function removeBoxUnopened ({commit}, box) {
  commit("removeBoxFromPile", {from: "unopened", box: box});
}

function getRevealBlockNumber ({commit}, store) {
  return new Promise((resolve, reject) => {
    if (store.state.contractInstance) {
      store.state.contractInstance().methods.getRevealBlockNumber().call({
        from: store.state.web3.coinbase
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
}

function getIsReady ({commit}, store) {
  return new Promise((resolve, reject) => {
    if (store.state.contractInstance) {
      store.state.contractInstance().methods.isItReadyYet().call({
        from: store.state.web3.coinbase
      }, function (err, res) {
        if (err) {
          reject(console.log(err));
        } else {
          resolve(res);
        }
      });
    } else {
      setTimeout(() => {
        resolve(store.dispatch("getIsReady"));
      }, 500);
    }
  });
}

function getRevealBox ({commit}, store) {
  store.dispatch("getIsReady").then(res => {
    if (res) {
      let transaction = null;
      store.state.contractInstance().methods.revealBox().send({
        from: store.state.web3.coinbase
      }).on("transactionHash", (tx) => {
        transaction = tx;
        let card_to_move = store.state.box_pile.ready[store.state.box_pile.ready.length - 1];
        // Add to pending
        store.dispatch("moveBoxReadyRevealing", {
          tx: card_to_move.tx,
          time_issued: Date.now()
        });
        // subscribe to event
        store.state.contractInstance().events.generatedCard()
          .on("data", (result) => {
            store.dispatch("moveBoxRevealingUnopened", {
              tx: card_to_move.tx,
              content: result.returnValues.cardNumber
            });
          })
          .on("error", () => {
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
}

function checkBoxReveal ({commit}, payload, store) {
  let reveal_reached = store.state.box_pile.bought.filter(card => card.revealblock < payload);
  reveal_reached.forEach(card => {
    let card_to_move = store.state.box_pile.bought[store.state.box_pile.bought.length - 1];
    store.dispatch("moveBoxBoughtReady", {
      tx: card_to_move.tx
    });
  });
  store.dispatch("getIsReady").then(res => {
    if (res && reveal_reached.length <= 0 && store.state.box_pile.ready.length <= 0 && store.state.box_pile.revealing.length <= 0) {
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
      if (!res && block_nr !== "0" && store.state.box_pile.bought.length <= 0 && store.state.box_pile.pending.length <= 0) {
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
}

export {
  addBoxPending,
  removeBoxPending,
  moveBoxPendingBought,
  addBoxBought,
  addBoxReady,
  moveBoxBoughtReady,
  moveBoxReadyRevealing,
  moveBoxRevealingReady,
  moveBoxRevealingUnopened,
  removeBoxUnopened,
  getRevealBlockNumber,
  getIsReady,
  getRevealBox,
  checkBoxReveal
};
