pragma solidity =0.5.17;
pragma experimental ABIEncoderV2;

contract LootAccount{

    //structure to strore the cards hold by an Adress
    //Every Index of the Array stands for one Card. The Int at the Index for the ammount of that card owned
    struct Loot {
        uint[42] cards;
    }
    //Structure to store a sell offer
    struct Offering{
        uint cardNumber;
        uint price ;
        address seller;
    }
    //Array of all sell offers
    Offering[] offerings;

    event generatedCard(uint cardNumber, address owner);
    event boughtCard(address owner);

    //mapping of Account to Loot owned
    mapping (address => Loot) LootAccounts ;
    //Storage of inducidual Revel Blocknumber
    mapping (address => uint) revealBlockNumber ;

    //buy Box by storing revealBlockNumber. Will allow to revel the card after the given Blocknumber
    function buyBox() public payable returns (bool) {
        require(0.1 ether == msg.value);
        require(revealBlockNumber[msg.sender] == 0, "You Still need to claim Loot");
        revealBlockNumber[msg.sender] = block.number + 10;
        emit boughtCard(msg.sender);
        return true;
    }

    //return the current revealBlockNumber
    function getRevealBlockNumber() public view returns (uint) {
        return revealBlockNumber[msg.sender];
    }
    // indicate, if the box can already be revealed
    function isItReadyYet() public view returns (bool) {
        if ( revealBlockNumber[msg.sender] == 0 ) {
            return false;
        }
        return block.number > revealBlockNumber[msg.sender];
    }

    // reveal the Card that has been bought in Box
    function revealBox() public returns (uint) {
        //Check that a box has been bouhght and the specified reveal Block has been reached
        require(revealBlockNumber[msg.sender] != 0, "There has no Box been bought");
        require(block.number > revealBlockNumber[msg.sender], "Time has not come yet");
        //use Blockhash for Number generation
        uint seed = uint(blockhash(revealBlockNumber[msg.sender])) % 1000 + 1;
        // reset revealBlockNumber so Adress can buy a Box again
        revealBlockNumber[msg.sender] = 0;
        // determine the card from the Box
        uint card = getCard(seed);
        //Add card to LootStorage
        LootAccounts[msg.sender].cards[card]++;
        //Emitt Card Number and Adress of new card
        emit generatedCard(card, msg.sender);
        return card;
    }

    function getCard(uint number) private pure returns (uint){
        //first 22 Card bottom Tier
        if ( number < 741 ) {
            return number % 22  ;
        //next 10 Cards low Tier
        } else if (number < 951) {
            return number % 10 +22 ;
        // next 6 Cards mid Tier
        } else if (number < 993) {
            return number % 6 + 32 ;
        // next 2 Cards high Tier
        } else if (number < 999) {
            return number % 2 + 38 ;
        // last 2 Cards GOOD Tier
        } else {
            return number % 2 + 40 ;
        }
    }
    // get all Cards owned by the Adress
    function getCards() public view returns (uint[42] memory) {
        Loot memory loot = LootAccounts[msg.sender];
        return loot.cards;
    }
    //create an offering to sell a card. Whenever it is created, the Card is transferd aout of the Loot of the Adress.
    function createListing(uint cardNumber, uint myprice ) public returns (bool) {
        require (LootAccounts[msg.sender].cards[cardNumber] > 0, "You have no Card to sell");
        Offering memory myOffering = Offering(cardNumber, myprice, msg.sender);
        offerings.push(myOffering);
        //transfer Card out off Account
        LootAccounts[msg.sender].cards[cardNumber]--;
        return true;
    }
    //get all the Sell Offers
    function getListings() external view returns(Offering[] memory ) {
        return offerings;
    }
    // Buy a Card that is offerd
    //in order to be sure to match the right Offering, the index in the Offeringlist and all the data of the Offering is needed to be pased
    function buyCard(uint index ,uint mycardNumber, uint myprice, address myseller) public payable returns (bool) {
        //check the Offering at the index is the one we want
        require(offerings[index].cardNumber == mycardNumber,"Order not availible anymore");
        require(offerings[index].price == myprice,"Order not availible anymore");
        require(offerings[index].seller == myseller,"Order not availible anymore");
        require(index < offerings.length,"Order not availible anymore");
        // check that we have sent the right ammount of money
        require(msg.value == offerings[index].price,"not enogh Funds provided");
        // send the Money to the seller
        (bool success, ) = offerings[index].seller.call.value(msg.value)("");
        require(success, "Transfer failed.");
        //remove offering
        removeOffering(index);
        //add Card to Buyers Loot
        LootAccounts[msg.sender].cards[mycardNumber]++;
    }
    //utility to remove an offering from the offerings
    function removeOffering(uint index) internal  {

        for (uint i = index; i<offerings.length-1; i++){
            offerings[i] = offerings[i+1];
        }
        offerings.length--;

    }
    function withdrawOffering(uint index ,uint mycardNumber, uint myprice) public  {
        //check the Offering at the index is the one we want
        require(offerings[index].cardNumber == mycardNumber,"Order not availible anymore");
        require(offerings[index].price == myprice,"Order not availible anymore");
        require(offerings[index].seller == msg.sender,"Order not availible anymore");
        //remove offering
        removeOffering(index);
        //add Card back to Sellers Loot
        LootAccounts[msg.sender].cards[mycardNumber]++;
    }
}
