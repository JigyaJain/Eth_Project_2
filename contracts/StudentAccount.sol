// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract StudentAccount{

    address private owner;
    string private eCode;
    constructor() {
        owner = msg.sender;
        eCode = "E0352";
    }

    uint public rollNo;
    struct info{
        string name;
        string program;
        uint section;
        uint academicFees;
    }

    mapping (uint => info) public details;
    mapping (uint => uint) public amountToPay;
    mapping (address => uint) public receivedAmount;

    modifier admin(){
        require (owner == msg.sender, "Only admin can access this page");
        _;
    }

   string neweCode;
    function enterECode (string memory _ecode) public admin{
        neweCode = _ecode;

    }
    modifier checkOwnerId(string memory _ecode){
        require (keccak256(abi.encodePacked(_ecode)) == keccak256(abi.encodePacked(eCode)), "Incorrect eCode");
        _;
    }    

    // Function to set details (only accessible by owner)
    function enterStDetails(string memory _name, string memory _program, uint _section, uint _percent) public checkOwnerId(neweCode) returns (info memory){
        uint scholarShip;
        uint academicFees = 106000;

        if (_percent >= 95 )
        {
            scholarShip = 75;
        }
        else if (_percent >= 90 && _percent < 95)
        {
            scholarShip = 50;
        }
        else if ( _percent>= 80 && _percent < 90)
        {
            scholarShip = 35;
        }
        else if ( _percent>= 70 && _percent < 80)
        {
            scholarShip = 15;
        }

        academicFees -= academicFees*scholarShip/100;
        
        details[++rollNo] = info(_name, _program, _section, academicFees);
        return info(_name, _program, _section, academicFees);
        
    }

    function getAccountDetails(uint _id) public {
        amountToPay[_id] = details[_id].academicFees;
    }

    function payFee(uint _id, uint _amount) public returns (uint){
        require(amountToPay[_id] >= _amount);
        amountToPay[_id] -= _amount;
        receivedAmount[msg.sender] += _amount;

        return amountToPay[_id];
    }

    function stRegistration( uint _id) public view returns (string memory){
        string memory status = "Registered";
        if (amountToPay[_id] == 0){
            return status;
        }

        else {
            status = "Not Registered first pay complete fee";
        }
        return status;
    }
    
}

