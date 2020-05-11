pragma solidity =0.5.17;
pragma experimental ABIEncoderV2;

contract LootAccount{
    address payable owner;
    uint idCount;

    constructor() public {
        owner = msg.sender;
        idCount = 0;
    }

    // Structure to store the cards hold by an address
    // Every index of the array represents the id for one card.
    // The integer entry represents the amount that is owned.
    struct Loot {
        uint[42] cards;
    }

    // Structure to store a sell offer
    struct Offering{
        uint offeringId;
        uint cardNumber;
        uint price ;
        address seller;
    }

    // Array of all sell offers
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

    // Withdraw an amount from the balance of the contract.
    function withdraw(uint amount) public returns (bool) {
        // Restricted to the owner of this contract
        require(msg.sender == owner, "No Authorization.");
        require(amount <= address(this).balance, "Contract balance too low.");

        // Transfer the amount to the contract owner.
        (bool success, ) = owner.call.value(amount)("");

        require(success, "Transfer failed.");
        return true;
    }

    // Check the balance of the contract.
    function getContractBalance() public view returns (uint) {
        require(msg.sender == owner, "No Authorization.");
        return address(this).balance;
    }

    // Buy a box by storing revealBlockNumber. This will allow to revel the card after the given block number.
    function buyBox() public payable returns (bool) {
        require(0.1 ether == msg.value);

        // A box can only be bought, if there is no unrevealed box for this buyer.
        require(revealBlockNumber[msg.sender] == 0, "You Still need to claim Loot");

        // Set the revealBlockNumber at 10 blocks after a box has been bought.
        revealBlockNumber[msg.sender] = block.number + 10;
        emit boughtCard(msg.sender);
        return true;
    }

    // Get the current revealBlockNumber.
    function getRevealBlockNumber() public view returns (uint) {
        return revealBlockNumber[msg.sender];
    }

    // Indicate if the box can already be revealed.
    function isItReadyYet() public view returns (bool) {
        if (revealBlockNumber[msg.sender] == 0) {
            return false;
        }
        return block.number > revealBlockNumber[msg.sender];
    }

    // Reveal the card that has been bought.
    function revealBox() public returns (uint) {
        // Check that a box has been bought and the specified revealBlock has been reached.
        require(revealBlockNumber[msg.sender] != 0, "There has no Box been bought");
        require(block.number > revealBlockNumber[msg.sender], "Time has not come yet");

        // Use blockhash for the number generation.
        uint seed = uint(blockhash(revealBlockNumber[msg.sender])) % 1000 + 1;

        // Reset revealBlockNumber, so that the sender can buy a box again.
        revealBlockNumber[msg.sender] = 0;

        // Determine the card from the box.
        uint card = getCard(seed);

        // Add the card to LootStorage.
        LootAccounts[msg.sender].cards[card]++;

        // Emit the card number and address of the newly owned card.
        emit generatedCard(card, msg.sender);
        return card;
    }

    function getCard(uint number) private pure returns (uint){
        // First 22 cards - bottom Tier
        if (number < 741) {
            return number % 22  ;
        // Next 10 cards - low Tier
        } else if (number < 951) {
            return number % 10 +22 ;
        // Next 6 cards - mid Tier
        } else if (number < 993) {
            return number % 6 + 32 ;
        // Next 2 cards - high Tier
        } else if (number < 999) {
            return number % 2 + 38 ;
        // Last 2 cards - GOD Tier
        } else {
            return number % 2 + 40 ;
        }
    }

    // Get all cards owned by the sender.
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

    // Get all the sell offers
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
        
        // Send the eth to the seller.
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

    // Removes an offering at a specific index in the list offerings.
    function removeOffering(uint index) internal  {

        // Moves all offerings with a higher index one lower to prevent void entries in the list.
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
