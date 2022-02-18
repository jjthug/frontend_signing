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

    const freeMint = [
        {name: "buyer", type: "address"},
        {name: "limit", type: "uint256"}
    ]

    const domainData = {
        name: "CryptoQueenz",
        version: "1",
        chainId: 4,        
        verifyingContract: '0x44f3e98E86F0b6E6F91EE0665ebB273DDC1E2d26',
    };

    const msgData = {
        buyer: '0xc0A0aEa4f8457Caa8C47ED5B5DA410E40EFCbf3c',
        limit: 100,
     };

    const data = JSON.stringify({
        types: {
            EIP712Domain: domain,
            freeMint: freeMint
        },
        domain: domainData,
        primaryType: "freeMint",
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