pragma solidity =0.5.17;
pragma experimental ABIEncoderV2;

contract LootAccount{
    address payable owner;

    constructor() public {
        owner = msg.sender;
    }

    // Structure to store the cards hold by an address
    // Every index of the array represents the id for one card.
    // The integer entry represents the amount that is owned.
    struct Loot {
        uint[42] cards;
    }

    // Structure to store a sell offer
    struct Offering{
        uint cardNumber;
        uint price ;
        address seller;
    }

    // Array of all sell offers
    Offering[] offerings;

    event generatedCard(uint cardNumber, address owner);
    event boughtCard(address owner);

    // Storage of individual owned loot collection
    mapping (address => Loot) lootAccounts ;

    // Storage of individual revealBlockNumber
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
        lootAccounts[msg.sender].cards[card]++;

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
        Loot memory loot = lootAccounts[msg.sender];
        return loot.cards;
    }

    // Create an offering to sell a card.
    function createListing(uint cardNumber, uint myprice ) public returns (bool) {
        require (lootAccounts[msg.sender].cards[cardNumber] > 0, "You have no Card to sell");
        Offering memory myOffering = Offering(cardNumber, myprice, msg.sender);
        offerings.push(myOffering);
        
        // Remove card from account
        lootAccounts[msg.sender].cards[cardNumber]--;
        return true;
    }

    // Get all the sell offers
    function getListings() external view returns(Offering[] memory ) {
        return offerings;
    }

    // Buy a card that is offered.
    // In order to be sure to match the right offering, the index in the offering list and all the data of the offering is needed to be passed as parameters.
    function buyCard(uint index ,uint mycardNumber, uint myprice, address myseller) public payable returns (bool) {
        // Check that the offering at the index is the correct one.
        require(offerings[index].cardNumber == mycardNumber, "Order not availible anymore");
        require(offerings[index].price == myprice, "Order not availible anymore");
        require(offerings[index].seller == myseller, "Order not availible anymore");
        require(index < offerings.length, "Order not availible anymore");
        
        // Check that the right amount of eth is set.
        require(msg.value == offerings[index].price,"not enogh Funds provided");
        
        // Send the eth to the seller.
        (bool success, ) = offerings[index].seller.call.value(msg.value)("");
        require(success, "Transfer failed.");
        
        // Remove offering
        removeOffering(index);
        
        // Add Card to buyers loot
        lootAccounts[msg.sender].cards[mycardNumber]++;
    }

    // Removes an offering at a specific index in the list offerings.
    function removeOffering(uint index) internal  {

        // Moves all offerings with a higher index one lower to prevent void entries in the list.
        for (uint i = index; i<offerings.length-1; i++){
            offerings[i] = offerings[i+1];
        }
        offerings.length--;
    }

    // Cancels an open offering
    function withdrawOffering(uint index ,uint mycardNumber, uint myprice) public  {
        
        // Check that the offering at the index is the correct one.
        require(offerings[index].cardNumber == mycardNumber,"Order not available anymore");
        require(offerings[index].price == myprice,"Order not available anymore");
        require(offerings[index].seller == msg.sender,"Order not available anymore");
        
        // Remove offering
        removeOffering(index);

        // Add card back to sellers loot
        lootAccounts[msg.sender].cards[mycardNumber]++;
    }
}
