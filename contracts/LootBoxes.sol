pragma solidity >0.4.10;

contract LootAccount{

    struct Loot {
        uint[42] cards;
    }

    event generatedCard(uint cardNumber, address owner);

    mapping (address => Loot) LootAccounts ;

    mapping (address => uint) revealBlockNumber ;


    function buyBox() public payable returns (bool) {
        require(0.1 ether == msg.value);
        require(revealBlockNumber[msg.sender] == 0, "You Still" need to claim Loot");
        revealBlockNumber[msg.sender] = block.number + 10;
        return true;
    }

    function getRevealBlockNumber() public view returns (uint) {
        return revealBlockNumber[msg.sender];
    }

    function isItReadyYet() public view returns (bool) {
        if ( revealBlockNumber[msg.sender] == 0 ) {
            return false;
        }
        return block.number > revealBlockNumber[msg.sender];
    }


    function revealBox() public returns (uint) {
        require(revealBlockNumber[msg.sender] != 0, "There has no Box been bought");
        require(block.number > revealBlockNumber[msg.sender], "Time has not come yet");
        uint seed = uint(blockhash(revealBlockNumber[msg.sender])) % 1000 + 1;
        revealBlockNumber[msg.sender] = 0;
        uint card = getCard(seed);
        LootAccounts[msg.sender].cards[card]++;
        emit generatedCard(card, msg.sender);
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

    function getCards() public view returns (uint[42] memory) {
        Loot memory loot = LootAccounts[msg.sender];
        return loot.cards;
    }

}
