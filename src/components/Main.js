import React , {Component} from 'react'
import tether from '../tether.png'

class Main extends Component {

    render() {
         return (
           <div id='content' className='mt-3'>
               <table className='table text-muted text-center'>
                   <thead>
                   <tr style={{color:'white'}}>
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
               <div className='card mb-3' style={{opacity:'.9'}}>
                   <form
                   onSubmit={(event)=> {
                       event.preventDefault()
                       let amount
                       amount = this.input.value.toString()  //staking amount
                       amount=window.web3.utils.toWei(amount,'Ether')
                       this.props.stakeTokens(amount)  //calling staking function
                   }} 
                   className='mb-3'>
                       <div style={{borderSpacing:'0 1em'}}>
                           <label className='float-left' style={{marginLeft:'15px'}}><b>Stake Tokens</b></label>
                           <span className='float-right' style={{marginRight:'8px'}}>
                               <b>Balance :</b> {window.web3.utils.fromWei(this.props.tetherBalance,'Ether')}
                           </span>
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
                           <button type='submit' className='btn btn-primary btn-lg btn-block'>STAKING</button>
                       </div>
                   </form>
                   <button 
                   type='submit'
                   onClick={(event)=> {
                       event.preventDefault(
                           this.props.unstakeTokens()
                       )
                   }}
                   className='btn btn-primary btn-lg btn-block'>UNSTAKING</button>
                   <div className='card-body text-center' style={{color:'blue'}}>
                       AIRDROP
                   </div>
               </div>
           </div>
         )
     }
}

export default Main;