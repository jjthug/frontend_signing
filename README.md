
- Token contract address of WBNB = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
- Token contract address of BRICKS = "0x13e1070e3a388e53ec35480ff494538f9ffc5b8d";
- Token contract address of PancakeSwap Router = "0x10ed43c718714eb63d5aa57b78b54704e256024e";

- Pre-requisites => Metamask required and connected to BSC Mainnet

- Steps for BNB to BRICKS conversion using the interface:

1. As soon as the webapp loads, Metamask connection is initiated by the app and the user is required to connect with the accounts that has BNB.
2. Once the account is connected, the user balances of BNB and Bricks are populated on the web app.
3. User can now enter the amount of BNB in the field and the live conversion based on the current conversion rates of Pancakeswap will be populated on the app.
4. Since the Bricks token contract has tax system, the estimated output amount of Bricks will be shown to the user.
5. User can now use the "Swap" button to initiate the transaction and has to confirm on the Metamask popup.
6. In future, if the tax system is removed from the Bricks token, the web app will be updated accordingly.

- Process:


1. This webapp currently uses PancakeSwap Router contract for determining the current conversion prices of BNB and Bricks using the "getAmountsOut" function and returns the live data to the user.
Once the user confirms and clicks on Swap, app invokes the "swapExactETHForTokens" function with deadline of 5mins for the transaction and returns the transaction hash on Metamask confirmation.

2. The current version of webapp will also work for any clone of PancakeSwap V2 platforms and the addressess of the tokens can be changed to use any new set of tokens that have an active pair on the DEX.
