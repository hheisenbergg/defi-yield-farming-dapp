pragma solidity ^0.5.0;

//you can come to our bank , take some tether and deposit into our decentralsed bank , and
//for doing so you are rewarded by reward tokens

contract Tether{
   string public name = "Mock Tether Token";
   string public symbol = "mUSDT";
   uint256 public totalSupply = 1000000000000000000000000;  //1  million tokens
   uint8 public decimals = 18;

   //returns true if transfer was possible   
   event Transfer (
     
     address indexed_from,
     address indexed_to,
     uint _value

   );

   //returns true if the allowance was set successfully
   event Approval (
        
        address indexed _owner,
        address indexed _spender,
        uint _value

   );

   //key-pair mapping for balance of each address
   mapping (address => uint256) public balanceOf ;


   //allowance saves the amount that the spender can spend on behalf of account owner
   mapping(address => mapping (address => uint256)) public allowance ;


   constructor() public{

      balanceOf[msg.sender] = totalSupply ;
   }
   

   //one on one transfer from one address to another
   function transfer(address _to,  uint256 _value) public returns (bool success) {

     //amount sending should be grater or equal to the senders balance
       require(balanceOf[msg.sender] >= _value);
       balanceOf[msg.sender] -= _value; 
      
       balanceOf[_to] += _value;
       emit Transfer(msg.sender , _to , _value);
       return true;
   }


   //to approve the third party transfer
   //sets the amount allowance the spender(third - party) is allowed transfer from the 
   //(msg.sender) balance
   function approve(address _spender , uint256 _value)public returns(bool success) {

      allowance[msg.sender][_spender] = _value;
      emit Approval(msg.sender, _spender, _value);
      return true;
   }



   //giving allowance to another address to retrieve tokens from a certain address for third party 
   //transfer
   //moves the tokens from the sender to the recipient using allowance , amount is then 
   //deducted from the caller's(third - party) allowance

   //from - account from which money is being sent
   //msg.sender - third party 
   function transferFrom(address _from , address _to , uint256 _value) public returns (bool success) {
         require(_value <= balanceOf[_from]);
         require(_value <= allowance[_from][msg.sender]);
         balanceOf[_to] += _value;

         balanceOf[_from] -= _value;
         allowance[_from][msg.sender] -= _value;
         emit Transfer(_from , _to , _value);
         return true;   
   }


}