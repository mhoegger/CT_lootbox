import Vue from "vue";

function getListingsFromContract ({commit}, store) {
  if (store.state.contractInstance && store.state.web3.coinbase) {
    console.log("state.web3.coinbase", store.state.web3.coinbase);
    store.state.contractInstance().methods.getListings().call({
      from: store.state.web3.coinbase
    }).then(res => {
      console.log("getListings", res);
      let own_offers = [];
      let other_offers = [];
      res.forEach((offer, index) => {
        if (offer.seller.toLowerCase() === store.state.web3.coinbase.toLowerCase()) {
          console.log("addOfferToOwnOffers");
          offer.index = index;
          own_offers.push(offer);
        } else {
          console.log("addOfferToOtherOffers");
          offer.index = index;
          other_offers.push(offer);
        }
        commit("updateOfferToOwnOffers", own_offers);
        commit("updateOfferToOtherOffers", other_offers);
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
    console.log("payload.cardNumber", typeof parseInt(payload.cardNumber));
    console.log("payload.price", payload.price);
    console.log("payload.price", typeof store.state.web3.web3Instance().utils.toWei(payload.price, "ether"));

    store.state.contractInstance().methods.createOffering(parseInt(payload.cardNumber), store.state.web3.web3Instance().utils.toWei(payload.price, "ether")).send({
      from: store.state.web3.coinbase
    })
      .on("transactionHash", res => {
        console.log("transactionHash", res);
        Vue.prototype.$eventBus.$emit("closeSellCard");
        commit("setCardOffering", payload);

      })
      .on("receipt", res => {
        console.log("offeringCreated", res);
        store.dispatch("getListingsFromContract");
        store.dispatch("getCardsOpen");
      })
      .on("error", error => {
        console.log("error", error);
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
      value: payload.price
    })
      .on("transactionHash", res => {
        console.log("transactionHash", res);
        commit("setOfferBuying", payload);

      })
      .on("receipt", res => {
        console.log("offeringBought", res);
        store.dispatch("getListingsFromContract");
      })
      .on("error", error => {
        console.log("error", error);
      });
  } else {
    setTimeout(() => {
      store.dispatch("buyOfferingFromContract", payload);
    }, 500);
  }
}

function withdrawOfferingFromContract ({commit}, payload, store) {
  if (store.state.contractInstance && store.state.web3.coinbase) {
    store.state.contractInstance().methods.withdrawOffering(
      parseInt(payload.index),
      parseInt(payload.offeringId)
    ).send({
      from: store.state.web3.coinbase
    })
      .on("transactionHash", res => {
        console.log("transactionHash", res);
        commit("setOfferWidthdrawing", payload);

      })
      .on("receipt", res => {
        console.log("receipt", res);
        console.log("offeringWithdrawn", res);
        store.dispatch("getListingsFromContract");
      })
      .on("error", error => {
        console.log("error", error);
      });
  } else {
    setTimeout(() => {
      store.dispatch("withdrawOfferingFromContract", payload);
    }, 500);
  }
}

export {
  getListingsFromContract,
  createOfferingFromContract,
  buyOfferingFromContract,
  withdrawOfferingFromContract
};
