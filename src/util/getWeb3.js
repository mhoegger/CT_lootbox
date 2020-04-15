import Web3 from "web3";
import Vue from "vue";

function checkMetamask () {
  // Check for injected web3 (mist/metamask)
  return new Promise(function (resolve, reject) {
    var web3js = window.web3;
    if (typeof web3js !== "undefined") {
      let web3 = new Web3(web3js.currentProvider);
      resolve({
        is_connected: web3.isConnected(),
        web3 () {
          return web3;
        }
      });
    } else {
      // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
      reject(new Error("Unable to connect to Metamask"));
    }
  });
}

function getNetworkID (web3_object) {
  return new Promise(function (resolve, reject) {
    // Retrieve network ID
    web3_object.web3().version.getNetwork((err, networkId) => {
      if (err) {
        // If we can't find a networkId keep result the same and reject the promise
        reject(new Error("Unable to retrieve network ID"));
      } else {
        console.log("networkId", networkId);
        // Assign the networkId property to our result and resolve promise
        resolve(networkId);
      }
    });
  });
}

function getCoinbase (web3_object) {
  // Retrieve coinbase
  return new Promise(function (resolve, reject) {
    // Retrieve coinbase
    web3_object.web3().eth.getCoinbase((err, coinbase) => {
      if (err) {
        // If we can't find coindbase
        reject(new Error("Unable to retrieve coinbase"));
      } else {
        console.log("coinbase", coinbase);
        resolve(coinbase);
      }
    });
  });
}

function getBalance (web3_object) {
  // Retrieve balance for coinbase
  return new Promise(function (resolve, reject) {
    // Retrieve balance
    web3_object.web3().eth.getBalance(web3_object.coinbase, (err, balance) => {
      if (err) {
        // If we can't find balance
        reject(new Error("Unable to retrieve balance for address: " + web3_object.coinbase));
      } else {
        console.log("balance", balance);
        resolve(balance);
      }
    });
  });
}

async function getWeb3 () {
  let web3_object = await checkMetamask();
  web3_object.neworkID = await getNetworkID(web3_object);
  web3_object.coinbase = await getCoinbase(web3_object);
  web3_object.balance = await getBalance(web3_object);
  return web3_object;
}

export default getWeb3;
