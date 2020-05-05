import Web3 from "web3";
import {address, ABI} from "./constants/lootBoxContract";

function getContract () {
  let web3 = new Web3(window.web3.currentProvider);
  let ContractInstance = new web3.eth.Contract(ABI, address);
  // let ContractInstance = casinoContract.at(address);
  function casinoContractInstance () {
    return ContractInstance;
  };
  return casinoContractInstance;
}
export default getContract;
