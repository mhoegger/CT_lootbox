import Vue from "vue";

function getCardsOpen ({commit}, store) {
  if (store.state.contractInstance && store.state.web3.coinbase) {
    console.log("state.web3.coinbase", store.state.web3.coinbase);
    store.state.contractInstance().methods.getCards().call({
      from: store.state.web3.coinbase
    }).then(res => {
      console.log("res", res);
      const cards = [];
      res.forEach((card_amount, index) => {
        cards.push({card_id: index + 1, amount: card_amount});
      });

      commit("getCards", cards);
    }).catch(err => {
      console.log(err);
    });
  } else {
    setTimeout(() => {
      store.dispatch("getCardsOpen");
    }, 500);
  }
}



export {
  getCardsOpen
};
