// aka addCardInstance
import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

/**
 * Add a card to a specific pile
 * @param state
 * @param payload = {box: Box, to: *pilename*}
 */
function addBoxToPile (state, payload) {
  let pile = payload.to;
  console.log("Add Card to ", pile, " pile: ", payload);
  state.box_pile[pile].push(payload.box);
}

// aka removeCardPendingInstance
/**
 * Remove a card from a specific pile
 * @param state
 * @param payload = {box: Box, from: *pilename*}
 */
function removeBoxFromPile (state, payload) {
  console.log("Remove Box ", payload.box, " from pile ", payload.from);
  Vue.set(state.box_pile, payload.from, state.box_pile[payload.from].filter(obj => {
    return obj.tx !== payload.box.tx;
  }));
}
// aka moveCardInstance
/**
 * Move card from one pile to another if it is located on the first one
 * @param state
 * @param payload = {box: Box, from: *pilename*, to: *pilename*}
 */
function moveBoxFromTo (state, payload) {
  console.log("Move card from ", payload.from, "to ", payload.to, ": ", payload.box.tx);
  let boxes_to_move = state.box_pile[payload.from].filter(obj => {
    return obj.tx === payload.box.tx;
  });
  boxes_to_move.forEach(box => {
    addBoxToPile(state, {to: payload.to, box: payload.box});
    removeBoxFromPile(state, {from: payload.from, box: box});
  });
}

export {
  addBoxToPile,
  removeBoxFromPile,
  moveBoxFromTo
};
