import Web3 from "web3";
import {store} from "../store/";

let pollWeb3 = function () {
  let web3 = window.web3;
  web3 = new Web3(web3.currentProvider);

  setInterval(() => {
    if (web3 && store.state.web3) {
      web3.eth.getCoinbase().then(new_coinbase => {
        if (new_coinbase !== store.state.web3.coinbase) {
          web3.eth.getBalance(new_coinbase, function (err, newBalance) {
            if (err) {
              console.log(err);
            } else {
              store.dispatch("pollWeb3", {
                coinbase: new_coinbase,
                balance: parseInt(newBalance, 10)
              });
            }
          });
        } else {
          web3.eth.getBalance(store.state.web3.coinbase, (err, polledBalance) => {
            if (err) {
              console.log(err);
            } else if (parseInt(polledBalance, 10) !== store.state.web3.balance) {
              store.dispatch("pollWeb3", {
                coinbase: store.state.web3.coinbase,
                balance: parseInt(polledBalance, 10)
              });
            }
          });
        }
      });
    }
  }, 500);
};

export default pollWeb3;
