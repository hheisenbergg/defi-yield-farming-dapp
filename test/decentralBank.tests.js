const Tether = artifacts.require('Tether');
const RWD = artifacts.require('RWD');
const DecentralBank = artifacts.require('DecentralBank');

require('chai')
.use(require('chai-as-promised'))  //extention so as to use chai with promises
.should()

contract('DecentralBank',([owner , customer]) => {       //accounts array - owner = account[0]
    //All of our code for testing is gonna be here      //                - customer = accounts[1]

    let tether, rwd , decentralBank

    //function to convert tokens from ether to Wei
    function tokens(number) {

        return web3.utils.toWei(number , 'ether')
    }

    //whatever we write in this block will run before our tests
    before(async() => {
        //loading contracts
        tether = await Tether.new()
        rwd = await RWD.new()
        decentralBank = await DecentralBank.new(rwd.address , tether.address)

        // Transfer 1 million reward tokens into the decentral Bank
        await rwd.transfer(decentralBank.address , tokens('1000000'))

        //Tranfer 100 tokens to investor account
        await tether.transfer(customer , tokens('100') , {from: owner})
    })

    describe('Mock Tether Deployement' , async() => {
        it('matches name successfully' , async() => {
            const name = await tether.name()
            assert.equal(name , 'Mock Tether Token')
        })
    })

    describe('Reward Token Deployement' , async() => {
        it('matches name successfully' , async() => {
            const name = await rwd.name()
            assert.equal(name , 'REWARD TOKEN')
        })
    })

    describe('Decentral Bank Deployement' , async() => {
        it('matches name successfully' , async() => {
            const name = await  decentralBank.name()
            assert.equal(name , 'Decentral Bank')
        })

        it('Decentral Bank has reward tokens' , async() => {
            let balance =await rwd.balanceOf(decentralBank.address)
            assert.equal(balance, tokens('1000000'))
        })

        describe('Yield Farming' , async() => {
            it('rewards customers for staking tokens', async() => {
                let result
                
                //checking customers balance
                result = await tether.balanceOf(customer)
                assert.equal(result.toString() , tokens('100'),'customers mock wallet balance before staking')
                
                //check Stacking for customers for 100 tokens

              //aproving third party transfer of tokens from customer address to bank address by customer
              await tether.approve(decentralBank.address ,tokens('100') , {from : customer})
              //deposting into decentral bank
              await decentralBank.depositTokens(tokens('100') , {from : customer})

              //check updated balance of customer
              result = await tether.balanceOf(customer)
              assert.equal(result.toString() , tokens('0'),'customers mock wallet balance after staking')
              
              //check updated balance of decentral Bank
              result = await tether.balanceOf(decentralBank.address)
              assert.equal(result.toString() , tokens('100'),'Decentral Bank balance after customer staking')
              
              //is Staking status
              result = await decentralBank.isStaking(customer);
              assert.equal(result.toString() , 'true','customer is staking')
              
              //Chceking if we can issue tokens here from the owner
              await decentralBank.issueTokens({from : owner})
              
              //Ensuring only the owner can issue tokens
              await decentralBank.issueTokens({from : customer}).should.be.rejected;

              //Unstake tokens from customers is working or not
              await decentralBank.unstakeTokens({from : customer})
              
              //check unstaking balances
              result = await tether.balanceOf(customer)
              assert.equal(result.toString() , tokens('100'),'customers mock wallet balance after unstaking')
              
              //check updated balance of decentral Bank
              result = await tether.balanceOf(decentralBank.address)
              assert.equal(result.toString() , tokens('0'),'Decentral Bank balance after customer unstaking')
              
              //is Staking status
              result = await decentralBank.isStaking(customer);
              assert.equal(result.toString() , 'false','customer has unstaked')

            })
         })

        })
    })