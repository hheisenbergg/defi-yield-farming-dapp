const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');


//async allows us to run our javascript asynchroniously
//await will ask the function to wait till the code is executed

module.exports =async function (deployer ,networks ,accounts) {
   //Deploy mock Tether contract
   await deployer.deploy(Tether)
   const tether = await Tether.deployed()

   //Deploy RWD contract
   await deployer.deploy(RWD)
   const rwd = await RWD.deployed()

   //Deploy Decentralbank contract  
   await deployer.deploy(DecentralBank , rwd.address , tether.address)
   const decentralBank = await DecentralBank.deployed()

   //Transfer all reward tokens to the decentral bank
   await rwd.transfer(decentralBank.address , '1000000000000000000000000')

   //distributing 100 Tether tokens to the investor from our decentral bank for them to start
   await tether.transfer(accounts[1] , '100000000000000000000')
};
