import Web3Utils from "web3-utils";

export default {
  methods: {
    /**
     * converts wei to Ether
     */
    toEther (amount_in_wei) {
      console.log("amount_in_wei", amount_in_wei, typeof amount_in_wei, amount_in_wei.toString());
      return parseFloat(Web3Utils.fromWei(amount_in_wei.toString(), 'ether')).toFixed(3);
    }
  }
};
