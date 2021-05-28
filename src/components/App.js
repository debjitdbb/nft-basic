import React, { useState, useEffect } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3';
import Color from '../abis/Color.json';
import {useStateWithLabel} from '../utils/utils';
import Navbar from './Navbar';

function App(){
  const [account,setAccount] = useStateWithLabel('','account');
  const [contract, setContract] = useStateWithLabel(null, "contract");
  const [totalSupply, setTotalSupply] = useStateWithLabel(0, "totalSupply");
  const [colors, setColors] = useStateWithLabel([], "colors");

  let colorValue = null;

  const loadWeb3 = async() =>{
    if (window.ethereum){
      window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
      await window.ethereum.enable();
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else{
      window.alert('Non ethereum browser detected. You should consider tryign metamask!!');
    }
  };

  const loadBlockchainData = async() =>{
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    console.log(account);
    const networkId = await web3.eth.net.getId();
    const networkData = Color.networks[networkId];
    if(networkData){
      const abi = Color.abi;
      const address = networkData.address;
      const contract = new web3.eth.Contract(abi,address);
      setContract(contract);

      let totalSupplyOfTokens = 0;
      try{
        while(true){
          const color = await contract.methods.colors(totalSupplyOfTokens)
          .call();
          setColors((oldArray) => [...oldArray, color]);
          totalSupplyOfTokens++;
        }
      }
      catch (e){
        console.log('ended');
        setTotalSupply(totalSupplyOfTokens);
      }
    }
    else{
      window.alert('Smart contract not deployed to detected network!!');
    }
  };

  function mint(color){
    if(contract) {
      contract.methods
      .mint(color)
      .send({from: account, gas:1000000})
      .once('receipt', (receipt) => {
        setColors((oldArray) => [...oldArray, color]);
      });
    }
  }

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  return (
  <div>
    {/* <Navbar account = {account} /> */}
    <h1>Color Token</h1>
    <b>Issue Tokens to </b> {account}
    <hr />
    Total Tokens issued till now: {totalSupply}
    <hr />
    <form
      onSubmit = {(event) => {
        event.preventDefault();
        mint(colorValue.value); 
      }}
      >
        <input 
        type='text'
        placeholder = 'e.g. #FFFFFF'
        ref={(input)=>{
          colorValue=input;
        }}
        />
        <input type='submit' value='MINT' />
      </form>
      <div>
        {colors.map((color,key) =>{
          return (
            <div key={key} className='token' style = {{backgroundColor: color}}>
              {color}
              </div>
          );
        })}
      </div>
      <hr />
  </div>
  );


}

// class App extends Component {
//   render() {
//     return (
//       <div>
//         <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
//           <a
//             className="navbar-brand col-sm-3 col-md-2 mr-0"
//             href="http://www.dappuniversity.com/bootcamp"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Color Tokens
//           </a>
//           <ul className="navbar-nav px-3">
//             <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
//               <small className="text-white"><span id="account">{this.state.account}</span></small>
//             </li>
//           </ul>
//         </nav>
//         <div className="container-fluid mt-5">
//           <div className="row">
//             <main role="main" className="col-lg-12 d-flex text-center">
//               <div className="content mr-auto ml-auto">
//                 <h1>Issue Token</h1>
//                 <form onSubmit={(event) => {
//                   event.preventDefault()
//                   const color = this.color.value
//                   this.mint(color)
//                 }}>
//                   <input
//                     type='text'
//                     className='form-control mb-1'
//                     placeholder='e.g. #FFFFFF'
//                     ref={(input) => { this.color = input }}
//                   />
//                   <input
//                     type='submit'
//                     className='btn btn-block btn-primary'
//                     value='MINT'
//                   />
//                 </form>
//               </div>
//             </main>
//           </div>
//           <hr/>
//           <div className="row text-center">
//             { this.state.colors.map((color, key) => {
//               return(
//                 <div key={key} className="col-md-3 mb-3">
//                   <div className="token" style={{ backgroundColor: color }}></div>
//                   <div>{color}</div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

export default App;
