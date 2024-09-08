# Et_Project_2
This solidity program is a smart contract of creating some functions and show there values on the frontend. It is designed to provide a secure way for a user to connect to a store, made transactions and purchase items. It is done so with the help of react to create a frontend so that user can use the application easily.

## Description
This solidity smart contract serves as a decentralized application's interface such that users are able to interact with etherum blockchain. The contract has the feature that allows only to the intended owner to use the application. The user is able to set their name associated with their address.
The application requires a connection to the blockchain wallet that allows the transactions of tokens at one click from users account.

### Frontend
The index.js file provided in this repository serves as the frontend component of the application, allowing users to interact with the deployed smart contract using a web interface. Here are the key functionalities of index.js:

 • Connect Metamask Wallet: Users can connect their MetaMask wallets to the dApp.
 • Set User Name: Users can set their names associated with their Ethereum addresses.
 • Deposit Ether: Users can deposit Ether into their accounts via the frontend interface.
 • Withdraw Funds: Users can initiate fund withdrawals directly from the frontend.
 • Item For Sale: Users can check which type of item are for sale.
 • Buy Item: Users can spend their balance to buy item from the store.
 • Check Inventory: Users are now able to see thier inventory item.
The index.js file uses ethers.js library to interact with the Ethereum blockchain, providing a seamless user experience for managing balances and transactions.

## Getting Started
### Executing Program
After cloning the github, you will want to do the following to get the code running on your computer.

1. Inside the project directory, in the terminal type: npm i
2. Open two additional terminals in your VS code
3. In the second terminal type: npx hardhat node
4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
5. Back in the first terminal, type npm run dev to launch the front-end.
After this, the project will be running on your localhost. Typically at http://localhost:3000/

## Authors

Jigya Jain

## License

This project is licensed under the MIT License - see the LICENSE.md file for details
