pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';



contract DecentralBank {
    string public name = "Decentral Bank";
    address public owner;
    Tether public tether;  //bringing in the smart contract
    RWD public rwd;

    address[] public stakers;

    //keepint track of amount the customers are staking
    mapping(address => uint) public stakingBalance;

    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;



    constructor(RWD _rwd ,Tether _tether) public {
        rwd= _rwd;
        tether= _tether;
        owner = msg.sender;
    }

//third party transfer
function depositTokens(uint _amount) public {

  //require staking amount to be greater than 0
  require(_amount > 0 ,'amount cannot be 0');

 //Transfer the tether tokens to this contract address for lending
  tether.transferFrom(msg.sender, address(this), _amount);

  //update staking balance
  stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

  //checking if this is there firt time staking and so adding int the array accordingly
  if(!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
  }
 
 isStaking[msg.sender]=true;
 hasStaked[msg.sender]=true;

}


//Unstake tokens
function unstakeTokens() public{
    uint balance=stakingBalance[msg.sender];
    require(balance > 0,'staking balance cannot be less than 0');

    //transferring the staked tokens back into the msg.senders account from the decentral bank
     tether.transfer(msg.sender,balance);

    //updating staking features
    stakingBalance[msg.sender]=0;
    isStaking[msg.sender]=false;
}

 //issue token for deposting in the bank

//the owner can call the function accordingly to their wish and issue tokens to customers staking 
 function issueTokens() public {
  //only the owner can issue tokens 
  require(msg.sender == owner,'The caller must be the owner');

  for(uint i=0;i<stakers.length;i++) {
       address recipient = stakers[i];
       uint staked_amount = stakingBalance[recipient] / 9;   //creating percentage incentivs for stakers
       if(staked_amount > 0) {
           rwd.transfer(recipient , staked_amount); //using transfer function from reward contract , as reward tokens are transferred
       }
    }  
 
  }

}
