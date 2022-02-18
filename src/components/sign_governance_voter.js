import { useState, useEffect } from "react";
import Web3 from "web3";

const Sign = () => {
    const [web3, setWeb3] = useState();
    const [accounts, setAccounts] = useState();

    useEffect(() => {
        loadWeb3();
      },[accounts])

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
    }

    const domain = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
    ];

    const vote = [
        {name: "voter", type: "address"},
        {name: "pollId", type: "uint256"},
        {name: "choice", type: "uint256"}
    ]

    const domainData = {
        name: "MoviecoinGovernance",
        version: "1",
        chainId: "4",        
        verifyingContract: '0xd2a5bC10698FD955D1Fe6cb468a17809A08fd005',
    };

    const msgData = {
        voter: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
        pollId: "100",
        choice: "1"
    };

    const data = JSON.stringify({
        types: {
            EIP712Domain: domain,
            vote: vote
        },
        domain: domainData,
        primaryType: "vote",
        message: msgData
    });

    const sign = async() => {
        web3.currentProvider.sendAsync(
            {
                method: "eth_signTypedData_v4",
                params: [accounts, data],
                from: accounts
            },
            function(err, result) {
                if (err) {
                    return console.error(err);
                }
                console.log(result);
                const signature = result.result.substring(2);
                console.log("singature", signature);
                const r = "0x" + signature.substring(0, 64);
                const s = "0x" + signature.substring(64, 128);
                const v = parseInt(signature.substring(128, 130), 16);
                // The signature is now comprised of r, s, and v.
                }
            );
    }

    return(
        <div className="home">
            <h2>Hey</h2>
            <button onClick={sign} >Click </button>
        </div>
    )
}

export default Sign;