// Add- Remove Pending
import Vue from "vue/types/vue";

/**
 *
 * @param commit
 * @param box
 */
function addBoxPending ({commit}, box) {
  box.click = () => {
    console.log("Do Nothing");
  }

  commit("addBoxToPile",
    {
      to: "pending",
      box: box,

    }
  );
}

function removeBoxPending ({commit}, box) {
  commit("removeBoxFromPile", {from: "pending", box: box});
}

// Move cards
function moveBoxPendingBought ({commit}, box) {
  box.click = () => {
    console.log("Do Nothing");
  };

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

function addBoxReady ({commit}, box) {

  box.click = () => {
    console.log("clickEvent");
    Vue.$store.dispatch("getRevealBox");
  };

  commit("addBoxToPile", {
    to: "ready",
    box: box
  });
}

function moveBoxBoughtReady ({commit}, box) {

  box.click = () => {
    console.log("clickEvent");
    Vue.$store.dispatch("getRevealBox");
  };

  commit("moveBoxFromTo", {
    from: "bought",
    to: "ready",
    box: box
  });
}

function moveBoxReadyRevealing ({commit}, box) {
  box.click = () => {
    console.log("Do Nothing");
  };

  commit("moveBoxFromTo", {
    from: "ready",
    to: "revealing",
    box: box
  });
}

function moveBoxRevealingReady ({commit}, box) {
  box.click = () => {
    Vue.$store.dispatch("getRevealBox");
  };

  commit("moveBoxFromTo", {
    from: "ready",
    to: "revealing",
    box: box
  });
}

function moveBoxRevealingUnopened ({commit}, box) {
  box.click = () => {
    console.log("Open Bom with content:", box);
    Vue.prototype.$eventBus.$emit("openOpenBox");
    // TODO: is needed? store.dispatch("moveCardUnopenedOpen", box);
    Vue.$store.dispatch("getCardsOpen");
  };

  commit("moveBoxFromTo", {
    from: "revealing",
    to: "unopened",
    box: box
  });
}

function removeBoxUnopened ({commit}, box) {
  commit("removeBoxFromPile", {from: "unopened", box: box});
  commit("getCardsOpen");
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
  removeBoxUnopened
};
