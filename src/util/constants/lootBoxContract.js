// const address = "0x97bfC1b135455321c2BCB8046aa561A6b48F2983";
// const address = "0xB641284235C477E478AD7D0Be8273d79c13f68b0";
const address = "0xf860d80313dd5a55bdc4568b89a472ffdb2de2a1";
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
    "type": "function",
    "payable": true
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
    "type": "function",
    "payable": false
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "card",
        "type": "uint256"
      }
    ],
    "name": "BoxContent",
    "type": "event"
  }
];
export {address, ABI};
