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

    const Part = [
        {name: "account", type: "address"},
        {name: "value", type: "uint96"}
    ]

    const Mint1155 = [
        {name: "type", type: "string"},
        {name: "contract", type: "address"},
        {name: "tokenId", type: "uint256"},
        {name: "tokenURI", type: "string"},
        {name: "uri", type: "string"},
        {name: "supply", type: "uint256"},
        {name: "creators", type: "Part[]"},
        {name: "royalties", type: "Part[]"}
    ]

    const domainData = {
        name: "Mint1155",
        version: "1",
        chainId: "4",        
        verifyingContract: "0x1AF7A7555263F275433c6Bb0b8FdCD231F89B1D7",
    };


    const msgData = {
        type: "ERC1155",
        contract: "0x1AF7A7555263F275433c6Bb0b8FdCD231F89B1D7",
        tokenId: "52843015558434793796275726212634918399275771894259176439595597340797120282626",
        tokenURI: "/ipfs/QmQYWRaEMDYpDycNqhhcnhUPeNbqmxQ8Uqtx4grkHf8rvg",
        uri: "/ipfs/QmQYWRaEMDYpDycNqhhcnhUPeNbqmxQ8Uqtx4grkHf8rvg",
        supply: 100,
        creators: [
            { 
                account: "0x74D4163f4d5B4D435BD44FBbE03Aad92daAF240f", 
                value: "10000"
            }
        ],
        royalties: [
            { 
                account: "0x74D4163f4d5B4D435BD44FBbE03Aad92daAF240f", 
                value: 2000 
            }
        ]
     }

    const data = JSON.stringify({
        types: {
            EIP712Domain: domain,
            Mint1155: Mint1155,
            Part: Part
        },
        domain: domainData,
        primaryType: "Mint1155",
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