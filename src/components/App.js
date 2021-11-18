import React , {Component} from 'react'
import Navbar from './Navbar';
import Web3 from 'web3';
import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import Main from './Main.js'
import ParticleSettings from './ParticleSettings'

class App extends Component {
    //Our react code goes in here

    // calls our loadWeb3 function immediately before mounting
    async UNSAFE_componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        //if in our dapp window we detect ethereuem (metamask) then we inject new web3
        if(window.ethereum) {
            window.web3=new Web3(window.ethereum)  //creating a new web3
            await window.ethereum.enable()   //enabling metamask wallet

            //if metamask is already installed ,replacing the injected web3 with newer version
        }else if(window.web3){
                window.web3 = new Web3(window.web3.currentProvider)     
        }else {
              window.alert('No ethereum Browser detected.You can check out Metamask!!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        const account = await web3.eth.getAccounts() //getting ganache accounts as an array
        this.setState({account: account[0]})
        const networkId = await web3.eth.net.getId() //getting the ganache network Id


        //Load Tether Contract
        const tetherData = Tether.networks[networkId] //getting the tether data by passing the networkId
        if(tetherData) {
            //getting tether abi and address
            const tether = new web3.eth.Contract(Tether.abi , tetherData.address)
            //setting state
            this.setState({tether})
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
            //setting state of tetherbalance of given account
            this.setState({tetherBalance: tetherBalance.toString() })
        }else {
            window.alert('ERROR !! Tether contract not deployed!')
        }


        //loading Reward Contract
        const rwdData = RWD.networks[networkId]
        if(rwdData) {
            const rwd = new web3.eth.Contract(RWD.abi , rwdData.address)
            this.setState({rwd})
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call()
            this.setState({rwdBalance: rwdBalance.toString()})
        }else {

            window.alert('ERROR!! Reward contract not found!')
        }


        //loading DecentralBank Contract
        const decentralBankData = DecentralBank.networks[networkId] 
        if(decentralBankData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi , decentralBankData.address)
            this.setState({decentralBank})
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
            this.setState({stakingBalance: stakingBalance.toString() })
        }else {
            window.alert('ERROR !! DecentralBank contract not deployed!')
        }
       
        this.setState({loading: false})  //updating the loading status after contracts are loaded

    }

    //Staking Function - third-party-transfer
    stakeTokens = (amount) => {
        this.setState({loading: true})
        //getting approval for transfer
        this.state.tether.methods.approve(this.state.decentralBank._address,amount).send({from : this.state.account}).on('transactionHash',(hash)=> {
        this.state.decentralBank.methods.depositTokens(amount).send({from : this.state.account}).on('transactionHash',(hash)=> {
            this.setState({loading : false})  //setting loading state to false;
        })        
     })
    }

    
    //Unstaking Function
    unstakeTokens =(amount2) => {
        this.setState({loading : true})
        this.state.decentralBank.methods.unstakeTokens(amount2).send({from : this.state.account}).on('transationHash',(hash)=> {
            this.setState({loading : false})  //setting loading state to false;
        })    
    }

    //calculating Yield Function
    reward =() => {
        this.setState({loading : true})
        this.state.decentralBank.methods.withdrawYield().send({from : this.state.account}).on('transationHash',(hash)=> {
            this.setState({loading : false})  //setting loading state to false;
        })    
    }

    refreshPage(){
        window.location.reload();
    } 

    //getting customer account address to navbar
    constructor(props) {
        super(props)
        this.state ={
            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        }
    }
    
    //render allows us to bring in HTML , CSS in react
     render() {
         let content
         //if all the contracts have been loaded then only loading the MAIN ,so that dapp doesnt break
         {this.state.loading ? content =
         <p id='loader' className='text-center' style={{margin:'30px',color:'white'}}>
         <b>LOADING PLEASE ....</b></p>: content=
         <Main
         tetherBalance={this.state.tetherBalance}
         rwdBalance={this.state.rwdBalance}
         stakingBalance={this.state.stakingBalance}
         stakeTokens={this.stakeTokens}
         unstakeTokens={this.unstakeTokens}
         refreshPage={this.refreshPage}
         reward={this.reward}
         />}
         return (
             <div className='App' style={{position: 'relative'}}>
                 <div style={{position: 'absolute'}}>
                     <ParticleSettings />
                 </div>
                 <Navbar account={this.state.account}/>
                        <div className='container-fluid mt-5'>
                            <div className='row'>
                                <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth: '1600px',minHeight: '200px'}}>
                                    <div>
                                        {content}
                                    </div>
                                </main>
                            </div>                    
                     </div>
            </div>
         )
     }
}

export default App;