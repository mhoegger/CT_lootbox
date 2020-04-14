const address = "0x97bfC1b135455321c2BCB8046aa561A6b48F2983";
const ABI = [
  {
    "inputs": [],
    "name": "buyBox",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCards",
    "outputs": [
      {
        "internalType": "uint256[42]",
        "name": "",
        "type": "uint256[42]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
export {address, ABI};
