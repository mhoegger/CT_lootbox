import Web3 from "web3";

function _checkMetamask () {
  // Check for injected web3 (mist/metamask)
  return new Promise(async function (resolve, reject) {
    let web3js = window.web3;
    if (typeof web3js !== "undefined") {
      let web3 = new Web3(web3js.currentProvider);
      console.log("web3", web3);
      resolve({
        is_connected: await web3.eth.net.isListening(),
        getWeb3Provider () {
          return web3;
        }
      });
    } else {
      // web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')) GANACHE FALLBACK
      reject(new Error("Unable to connect to Metamask"));
    }
  });
}

function _getNetworkID (web3_object) {
  return new Promise(function (resolve, reject) {
    // Retrieve network ID
    let networkId = web3_object.getWeb3Provider().givenProvider.networkVersion;
    // Assign the networkId property to our result and resolve promise
    resolve(networkId);
  });
}

function _getCoinbase (web3_object) {
  // Retrieve coinbase
  return new Promise(function (resolve, reject) {
    // Retrieve coinbase
    web3_object.getWeb3Provider().eth.getCoinbase((err, coinbase) => {
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

function _getBalance (web3_object) {
  // Retrieve balance for coinbase
  return new Promise(function (resolve, reject) {
    // Retrieve balance
    web3_object.getWeb3Provider().eth.getBalance(web3_object.coinbase, (err, balance) => {
      if (err) {
        // If we can't find balance
        reject(new Error("Unable to retrieve balance for address: " + web3_object.coinbase));
      } else {
        resolve(balance);
      }
    });
  });
}

async function getWeb3 () {
  let web3_object = await _checkMetamask();
  web3_object.neworkID = await _getNetworkID(web3_object);
  web3_object.coinbase = await _getCoinbase(web3_object);
  web3_object.balance = await _getBalance(web3_object);
  return web3_object;
}

export default getWeb3;
