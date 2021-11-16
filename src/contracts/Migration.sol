pragma solidity ^0.5.0;

//Migrations, generally speaking, are ways for developers to automate the deployment
// of data and its supporting structures.

contract Migrations {

    address public owner;
    uint public last_completed_migration; //last successful migration number

    constructor() public {

        owner=msg.sender;     //making sure person cureently contacting the contract is the owner
    }


    modifier restricted() {

        if(msg.sender == owner) _;    //if the statement is true , continue
    }

    //every time a migration step is completed successfully , this function is triggered
    //to update last_completed_migration number
    function setCompleted(uint completed) public restricted {

        last_completed_migration=completed;
    }

    function upgrade(address new_address) public restricted {

        Migrations upgraded = Migrations(new_address);
        upgraded.setCompleted(last_completed_migration);
    }
}