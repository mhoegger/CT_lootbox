pragma solidity =0.5.17;
pragma experimental ABIEncoderV2;

contract LootAccount{
    address payable owner;
    uint idCount;

    constructor() public {
        owner = msg.sender;
        idCount = 0;
    }

    //structure to strore the cards hold by an Adress
    //Every Index of the Array stands for one Card. The Int at the Index for the ammount of that card owned
    struct Loot {
        uint[42] cards;
    }
    //Structure to store a sell offer
    struct Offering{
        uint offeringId;
        uint cardNumber;
        uint price ;
        address seller;
    }
    //Array of all sell offers
    Offering[] offerings;

    event generatedCard(uint cardNumber, address owner);
    event boughtCard(address owner);

    event offeringCreated(uint offeringId, uint cardNumber, uint price ,address seller);
    event offeringBought(uint offeringId, uint cardNumber, uint price ,address seller, address buyer);
    event offeringWithdrawn(uint offeringId, uint cardNumber, uint price ,address seller);

    //mapping of Account to Loot owned
    mapping (address => Loot) LootAccounts ;
    //Storage of inducidual Revel Blocknumber
    mapping (address => uint) revealBlockNumber ;

    function withdraw(uint amount) public returns (bool) {
        require(msg.sender == owner, "No Authorization.");
        require(amount <= address(this).balance, "Contract balance too low.");
        (bool success, ) = owner.call.value(amount)("");
        require(success, "Transfer failed.");
        return true;
    }

    function getContractBalance() public view returns (uint) {
        require(msg.sender == owner, "No Authorization.");
        return address(this).balance;
    }

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
    function createOffering(uint cardNumber, uint myprice ) public returns (bool) {
        require (LootAccounts[msg.sender].cards[cardNumber] > 0, "You have no Card to sell");
        Offering memory myOffering = Offering(idCount++,cardNumber, myprice, msg.sender);
        offerings.push(myOffering);
        //transfer Card out off Account
        LootAccounts[msg.sender].cards[cardNumber]--;
        emit offeringCreated(myOffering.offeringId ,myOffering.cardNumber , myOffering.price ,myOffering.seller);
        return true;
    }
    //get all the Sell Offers
    function getListings() external view returns(Offering[] memory ) {
        return offerings;
    }
    // Buy a Card that is offerd
    //in order to be sure to match the right Offering, the index in the Offeringlist and all the data of the Offering is needed to be pased
    function buyCardFromOffering(uint index ,uint myOfferingId ) public payable returns (bool) {
        //check the Offering at the index is the one we want
        require(offerings[index].offeringId == myOfferingId,"Order not availible anymore");
        require(index < offerings.length,"Order not availible anymore");
        // check that we have sent the right ammount of money
        require(msg.value == offerings[index].price,"not enogh Funds provided");
        // send the Money to the seller
        (bool success, ) = offerings[index].seller.call.value(msg.value)("");
        require(success, "Transfer failed.");
        uint mycardNumber = offerings[index].cardNumber;
        uint myprice = offerings[index].price;
        address myseller =  offerings[index].seller;
        //remove offering
        removeOffering(index);
        //add Card to Buyers Loot
        LootAccounts[msg.sender].cards[mycardNumber]++;
        emit offeringBought(myOfferingId, mycardNumber, myprice, myseller, msg.sender);
        return true;
    }
    //utility to remove an offering from the offerings
    function removeOffering(uint index) internal  {

        for (uint i = index; i<offerings.length-1; i++){
            offerings[i] = offerings[i+1];
        }
        offerings.length--;

    }
    function withdrawOffering(uint index , uint myOfferingId)  public returns (bool) {
        //check the Offering at the index is the one we want
        require(offerings[index].offeringId == myOfferingId,"Order not availible anymore");
        //remove offering
        uint mycardNumber = offerings[index].cardNumber;
        uint myprice = offerings[index].price;
        address myseller =  offerings[index].seller;
        removeOffering(index);
        //add Card back to Sellers Loot
        LootAccounts[msg.sender].cards[mycardNumber]++;
        emit offeringWithdrawn( myOfferingId, mycardNumber, myprice , myseller);
        return true;
    }
}
