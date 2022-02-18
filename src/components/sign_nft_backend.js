import { useState, useEffect } from "react";
import Web3 from "web3";
import { ethers } from 'ethers';

const Sign = () => {
    let privateKey = "0xd7cf1f0e6a8f85844e74c04a02d9b0e740a081ba4f9fd18f8ce6b8f9a5f5e75e";
    let wallet = new ethers.Wallet(privateKey);
    
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

    const presale = [
        {name: "buyer", type: "address"},
        {name: "limit", type: "uint256"}
    ]

    const types = {
        domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
        ],    
        presale: [
            {name: "buyer", type: "address"},
            {name: "limit", type: "uint256"}
        ]
    };

    const domainData = {
        name: "BoyGeorge",
        version: "1",
        chainId: 4,        
        verifyingContract: '0xd9145CCE52D386f254917e481eB44e9943F39138',
    };

    const msgData = {
        buyer: '0x74D4163f4d5B4D435BD44FBbE03Aad92daAF240f',
        limit: 2,
     };

    const data = JSON.stringify({
        types: {
            EIP712Domain: domain,
            presale: presale
        },
        domain: domainData,
        primaryType: "presale",
        message: msgData
    });

    const sign = async() => {

        const signature1 = await wallet._signTypedData(data);
        console.log("singature", signature1);

        const provider = new Web3.providers.HttpProvider('https://speedy-nodes-nyc.moralis.io/2d09b38798d257a333ac3bad/eth/rinkeby');
        const web31 = new Web3(provider);
        web31.currentProvider.send(
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