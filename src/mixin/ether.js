import Web3Utils from "web3-utils";

export default {
  methods: {
    /**
     * converts wei to Ether
     */
    toEther (amount_in_wei) {
      return parseFloat(Web3Utils.fromWei(amount_in_wei.valueOf().toString(), "ether")).toFixed(3);
    }
  }
};
