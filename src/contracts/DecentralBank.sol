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
    mapping(address => uint256) public stakingBalance;

    mapping(address => bool) public hasStaked;

    //stores the status of staking for every customer
    mapping(address => bool) public isStaking;
    
    //stores the start time for every customer whenever the customer stakes or unstakes tokens
    mapping(address => uint256) public startTime;

    //keeps track of the total yield earned till any point by the different customers
    mapping(address => uint256) public  totalYield;



    constructor(RWD _rwd ,Tether _tether) public {
        rwd= _rwd;
        tether= _tether;
        owner = msg.sender;
    }

//third party transfer
function depositTokens(uint256 _amount) public {

  //require staking amount to be greater than 0
  require(_amount > 0 ,'amount cannot be 0');

  //if the customer has tokens staked at the point , then calculating and updating the yield
  if(isStaking[msg.sender] == true) {

      uint toTransfer = calculateYieldTotal(msg.sender);
      totalYield[msg.sender] += toTransfer;
  }

 //Transfer the tether tokens to this contract address for lending
  tether.transferFrom(msg.sender, address(this), _amount);

  //update staking balance
  stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

  //noting the time for staking token of the customer
  startTime[msg.sender] = block.timestamp;

  //checking if this is there firt time staking and so adding int the array accordingly
  if(!hasStaked[msg.sender]) {
      stakers.push(msg.sender);
  }
 
 isStaking[msg.sender]=true;
 hasStaked[msg.sender]=true;

}


//Unstake tokens
function unstakeTokens(uint256 _amount) public{

    uint balance=stakingBalance[msg.sender];

    require(
        isStaking[msg.sender] = true &&
        balance > 0,
        'staking balance cannot be less than 0'
        );

    //calculating the yield earned by the customer before unstaking tokens and updating it 
    uint yieldTransfer = calculateYieldTotal(msg.sender);
    totalYield[msg.sender] += yieldTransfer;
    startTime[msg.sender] = block.timestamp;
    uint balTransfer = _amount;
    _amount = 0;

    //transferring the staked tokens back into the msg.senders account from the decentral bank
     tether.transfer(msg.sender,balTransfer);

    //updating staking features
    stakingBalance[msg.sender]-= balTransfer;
    if(stakingBalance[msg.sender] == 0) {

    isStaking[msg.sender]=false;

    }
}

    //function to calculate the time period for whcih the yield is to be calculated
    function calculateYieldTime(address user) public view returns(uint256){
        uint256 end = block.timestamp;
        uint256 totalTime = end - startTime[user];
        return totalTime;
    }

    
    //function to calculate the total yield
    function calculateYieldTotal(address user) public view returns(uint256) {
        uint256 time = calculateYieldTime(user) * 10**18;
        uint256 rate = 86400;
        uint256 timeRate = time / rate;
        uint256 rawYield = (stakingBalance[user] * timeRate) / 10**18;
        return rawYield;
    }

      
      //function to withdraw the yield earned by the customer into the customers reward wallet as per customer's wish
      function withdrawYield() public {
        uint256 toTransfer = calculateYieldTotal(msg.sender);

        require(
            toTransfer > 0 ||
            totalYield[msg.sender] > 0,
            "Nothing to withdraw"
            );
            
        if(totalYield[msg.sender] != 0){
            uint256 oldBalance = totalYield[msg.sender];
            totalYield[msg.sender] = 0;
            toTransfer += oldBalance;
        }

        startTime[msg.sender] = block.timestamp;
        rwd.transfer(msg.sender, toTransfer);
    }

}
