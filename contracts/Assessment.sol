// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    string public userName;
    string[] public ItemForSale = ["1. Yellow Shirt (300)","2. M416 Skin (400)","3. Shotgun Skin (500)","4. Legendery Marrine Outfit (350)"]; 
    string[] public MyInventory;
 
    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event NameSet(string name);
    event GetItemForSale();
    event GetInventory();
    event GetItem(uint256 _value, string name);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function setName(string memory _name) public {
        require(msg.sender == owner, "You are not the owner of this account");
        userName = _name;
        emit NameSet(_name);
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;
        require(msg.sender == owner, "You are not the owner of this account");
        balance += _amount;
        assert(balance == _previousBalance + _amount);
        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }
        balance -= _withdrawAmount;
        assert(balance == (_previousBalance - _withdrawAmount));
        emit Withdraw(_withdrawAmount);
    }

    function getItemForSale() public view returns(string[] memory) {
        return ItemForSale;
    }

    function getInventory() public view returns(string[] memory){
        return MyInventory;
    }

    function buyItem(uint _value) public returns(string memory){
        if (_value == 1) {
            balance -= 300;
            MyInventory.push("Yellow Dress");
            emit GetItem(_value, "Yellow Dress");
            return "You now have 1 yellow dress.";
        } else if (_value == 2) {
            balance -= 400;
            MyInventory.push("M416 skin");
            emit GetItem(_value, "M416 skin");
            return "You now have M416 skin";
        } else if (_value == 3) {
            balance -= 500;
            MyInventory.push("Shotgun Skin");
            emit GetItem(_value, "Shotgun Skin");
            return "You now have Shotgun skin";
        } else if (_value == 4) {
            balance -= 350;
            MyInventory.push("Marine Outfit");
            emit GetItem(_value, "Marine Outfit");
            return "You now have a Legendary Marine Outfit";
        } else {
            emit GetItem(_value, "Wrong index position");
            return "There is no item at such index for sale";
        }
    }
}
