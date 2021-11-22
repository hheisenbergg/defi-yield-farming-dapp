import React , {Component} from 'react'
import tether from '../tether.png'

class Main extends Component {

    render() {
         return (
           <div id='content' className='mt-3'>
               <table className='table text-muted text-center'>
                   <thead>
                   <tr style={{color:"orange"}}>
                       <th scope='col'>Staking Wallet Balance</th>
                       <th scope='col'>Reward Wallet Balance</th>
                   </tr>
                   </thead>
                   <tbody>
                       <tr style={{color:'white'}}>
                           <td>{window.web3.utils.fromWei(this.props.stakingBalance,'Ether')} <b>USDT</b></td>
                           <td>{window.web3.utils.fromWei(this.props.rwdBalance,'Ether')} <b>RWD</b></td>
                       </tr>
                   </tbody>
               </table>
               <div className='card mb-3' style={{opacity:'.9' , color:"black"}}>
                   <form className='mb-3' onSubmit={(event)=> {
                       event.preventDefault()
                       let amount
                       amount = this.input1.value.toString()  //staking amount
                       console.log("staked " + amount)
                       amount = window.web3.utils.toWei(amount,'Ether')
                       this.props.stakeTokens(amount)  //calling staking function
                   }} >
                       <div style={{borderSpacing:'0 1em'}}>
                           <label className='float-left' style={{marginLeft:'15px'}}><b>STAKE Tokens</b></label>
                           <span className='float-right' style={{marginRight:'8px'}}>
                               <b>Investor's Balance :</b> {window.web3.utils.fromWei(this.props.tetherBalance,'Ether')}
                           </span>
                           <div className='input-group mb-4'>
                               <input
                               ref={(input1)=>{this.input1 = input1}}  //grabbing input
                               type='text'
                               placeholder='0'
                               required />
                               <div className='input-group-open'>
                                   <div className='input-group-text'>
                                       <img src={tether} alt='tether' height='32'/>
                                       &nbsp;&nbsp;&nbsp;USDT
                                   </div>
                               </div>
                           </div>
                           <button type='submit' className='btn btn-primary btn-lg btn-block'>STAKING</button>
                       </div>
                   </form>

                   <form className='mb-3' onSubmit={(event)=> {
                       event.preventDefault()
                       let unstaked_amount
                       unstaked_amount = this.input.value.toString()  //unstaking amount
                       console.log("unstaked_amount " + unstaked_amount)
                       unstaked_amount = window.web3.utils.toWei(unstaked_amount,'Ether')
                       this.props.unstakeTokens(unstaked_amount)  //calling unstaking function
                   }} >
                       <div style={{borderSpacing:'0 1em'}}>
                           <label className='float-left' style={{marginLeft:'15px'}}><b>UNSTAKE Tokens</b></label>
                           <div className='input-group mb-4'>
                               <input
                               ref={(input)=>{this.input = input}}  //grabbing input
                               type='text'
                               placeholder='0'
                               required />
                               <div className='input-group-open'>
                                   <div className='input-group-text'>
                                       <img src={tether} alt='tether' height='32'/>
                                       &nbsp;&nbsp;&nbsp;USDT
                                   </div>
                               </div>
                           </div>
                           <button type='submit' className='btn btn-primary btn-lg btn-block'>UNSTAKING</button>
                       </div>
                   </form>

                   <div className='card-body text-center' style={{color:'blue'}}>
                       AIRDROP
                   </div>
                   <div class = "btn-group">
                   <button 
                   type='submit'
                   onClick={(event)=> {
                       event.preventDefault(
                           this.props.refreshPage()     //refreshing page to update the balances after any updations
                       )
                   }}
                   className='btn btn-primary btn-lg mr-2 '>Refresh Balance !!!</button>

                    <button 
                   type='submit'
                   onClick={(event)=> {
                       event.preventDefault(
                           this.props.reward()     //calling reward function to calculate the reward earned by the investor at any point
                       )
                   }}
                   className='btn btn-primary btn-lg mr-2'>Check Yield Earned !!!</button>
                   <button 
                   type='submit'
                   onClick={(event)=> {
                       event.preventDefault(
                           this.props.getReward()     //calling reward function to calculate the reward earned by the investor at any point
                       )
                   }}
                   className='btn btn-primary btn-lg mr-1'>Claim Yield !!!</button>
                   </div>

               </div>
           </div>
         )
     }
}

export default Main;