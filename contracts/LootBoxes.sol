pragma solidity >0.4.10;

contract LootAccount{
    
    struct Loot {
        uint[42] cards;
    }
    
    mapping (address => Loot) LootAccounts ;
    
    function buyBox() public payable returns (uint) {
        require(0.1 ether == msg.value);
        uint seed = uint(blockhash(block.number - 1)) % 1000 + 1;
        uint card = getCard(seed);
        //Loot memory loot = LootAccounts[msg.sender];
        //loot.cards[card]++;
        LootAccounts[msg.sender].cards[card]++;
        //return LootAccounts[msg.sender].cards;
        //return loot.cards;
        return card;
    }
    function getCard(uint number) private pure returns (uint){
        if ( number < 741 ) {
            return number % 22  ;
        } else if (number < 951) {
            return number % 10 +22 ;
        } else if (number < 993) {
            return number % 6 + 32 ;
        } else if (number < 999) {
            return number % 2 + 38 ;
        } else {
            return number % 2 + 40 ;
        }
    }
    
    function getCards() public view returns (uint[42]){
        return LootAccounts[msg.sender].cards;
    }
    
}