import Vue from "vue";

function getListingsFromContract ({commit}, store) {
  if (store.state.contractInstance && store.state.web3.coinbase) {
    console.log("state.web3.coinbase", store.state.web3.coinbase);
    store.state.contractInstance().methods.getListings().call({
      from: store.state.web3.coinbase
    }).then(res => {
      console.log("getListings", res);
      res.forEach((offer, index) => {
        if (offer.seller.toLowerCase() === store.state.web3.coinbase.toLowerCase()) {
          console.log("addOfferToOwnOffers");
          offer.index = index;
          commit("addOfferToOwnOffers", offer);
        } else {
          console.log("addOfferToOtherOffers");
          offer.index = index;
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
}

function createOfferingFromContract ({commit}, payload, store) {
  if (store.state.contractInstance && store.state.web3.coinbase) {
    console.log("state.web3.coinbase", store.state.web3.coinbase);
    console.log("payload.cardNumber", payload.cardNumber);
    console.log("payload.cardNumber", typeof payload.cardNumber);
    console.log("payload.cardNumber", typeof parseInt(payload.cardNumber - 1));
    console.log("payload.price", payload.price);
    console.log("payload.price", typeof store.state.web3.web3Instance().utils.toWei(payload.price, "ether"));

    store.state.contractInstance().methods.createOffering(parseInt(payload.cardNumber), store.state.web3.web3Instance().utils.toWei(payload.price, "ether")).send({
      from: store.state.web3.coinbase
    }).then(res => {
      console.log("createOfferingFromContract", res);
      Vue.prototype.$eventBus.$emit("closeSellCard");

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

function buyOfferingFromContract ({commit}, payload, store) {
  if (store.state.contractInstance && store.state.web3.coinbase) {
    store.state.contractInstance().methods.buyCardFromOffering(
      parseInt(payload.index),
      parseInt(payload.offeringId)
    ).send({
      from: store.state.web3.coinbase,
      value: payload.price,

    }).then(res => {
      console.log("Card Bougth", res);
      store.state.contractInstance().events.offeringBought()
        .on("data", (result) => {
          console.log("offeringBought", result);
        })
        .on("error", (err) => {
          console.log("1112", err);
        });
    }).catch(err => {
      console.log(err);
    });
  } else {
    setTimeout(() => {
      store.dispatch("buyOfferingFromContract", payload);
    }, 500);
  }
}

export {
  getListingsFromContract,
  createOfferingFromContract,
  buyOfferingFromContract
};
