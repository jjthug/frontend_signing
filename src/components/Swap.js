import { useState, useEffect } from "react";
import Web3 from "web3";
import Contract from "../contracts/Router.json";
import Token from "../contracts/Token.json";

const Swap = () => {

    const [web3, setWeb3] = useState();
    const [accounts, setAccounts] = useState();
    const [BNB, setBNB] = useState();
    const [BRICKS, setBRICKS] = useState(0);
    const [BNBInput, setBNBInput] = useState("");
    const [BRICKSBT, setBRICKBT] = useState();
    const [BRICKSInput, setBRICKSInput] = useState();
    const [transactionHash, setTransactionHash] = useState();
    const [tax, setTax] = useState();
    const WBNB = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
    const WBRICKS = "0x13e1070e3a388e53ec35480ff494538f9ffc5b8d";
    const Router = "0x10ed43c718714eb63d5aa57b78b54704e256024e";

    useEffect(() => {
        loadWeb3();
        listenMMAccount();
      },[])
    
      const loadWeb3 = async() => {
        if(window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
        } if(window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
        } else {
          window.alert("Please install MetaMask!");
        }
        setWeb3(window.web3);
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        setAccounts(accounts[0]);
        fetchBalances(web3, accounts[0]);
      }

      const fetchBalances = async(web3, accounts) => {
          if(web3) {
            const balance = await web3.eth.getBalance(accounts);
            setBNB(web3.utils.fromWei(balance));
            const token = new web3.eth.Contract(Token, WBRICKS);
            const BRICKSBalance = await token.methods.balanceOf(accounts).call();
            const taxFromContract = await token.methods._enableTax().call();
            setTax(taxFromContract);
            setBRICKS(BRICKSBalance/1000000000);
          }
      }

    async function listenMMAccount() {
        window.ethereum.on("accountsChanged", async function() {
            // Time to reload your interface with accounts[0]!
            const accounts = await window.web3.eth.getAccounts();
            setAccounts(accounts[0]);
            return
        });
    }


    const setBRICKSOutput = async(e) => {
        setBNBInput(e.target.value);
    }

    useEffect(() => {
        const check = async() => {
            if(web3 && BNBInput) {
                console.log("Router address is ", Router);
                const router = new web3.eth.Contract(Contract, Router);
                console.log("router instance", router);
                const path = [WBNB, WBRICKS];
                console.log(path);
                const output = await router.methods.getAmountsOut(web3.utils.toWei(BNBInput), path).call();
                setBRICKBT((output[1]/1000000000).toString());
                let newOutput;
                if(tax) {
                    newOutput = Math.floor(output[1] - (output[1] * 0.06));
                } else {
                    newOutput = +output[1];
                }
                console.log(newOutput);
                setBRICKSInput((newOutput/1000000000).toString());
                console.log("Output from contract", output);
            } else {
                setBRICKSInput("");
            }
        }
        check();
    }, [web3, BNBInput])


    const swapHandler = async() => {
        console.log("Clicked");
        const date = Math.floor(Date.now() / 1000);
        console.log(date, date + 300);
        const router = new web3.eth.Contract(Contract, Router);
        const data = await router.methods.swapExactETHForTokens(Math.floor(BRICKSInput * 1000000000), [WBNB, WBRICKS], accounts, date + 300).send({from: accounts, value: web3.utils.toWei(BNBInput)}).on('transactionHash', function(hash){
            console.log("Transaction hash is ", hash);
            setTransactionHash(hash);
        }).on('receipt', function(receipt){
            setTransactionHash();
        });
        console.log(data);
        setBRICKSInput("");
        setBNBInput("");
        fetchBalances(web3, accounts);
    }

    
    return(
        <div className="swap">
            {BNB && <div className="bnbbalance">
                BNB balance of the user: {BNB}  <br />
                BRICKS balance of the user: {BRICKS}
                 </div> }
            Enter no of BNB to Swap: <input type="number" value = {BNBInput} onChange = {(e) => setBRICKSOutput(e)} />
            {BRICKSInput && <div className="outpur">
                Before tax: {BRICKSBT} BRICKS <br />
                Tax: 6%<br />
                Final amount: {BRICKSInput} BRICKS (approx)
                <br />
                <button onClick = {swapHandler}>Swap</button>
                {transactionHash && <div className="transactionhash"><a href={`https://bscscan.com/tx/${transactionHash}`} target = "_blank" rel="noreferrer">View transaction here</a></div> }
            </div> }
        </div>
    )
}

export default Swap;
