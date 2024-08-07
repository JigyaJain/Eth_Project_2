# Eth_Project_2
The main aim of this project is to learn about deploying smart contacts and showing the same thing on the frontend of the application.

### Description
This project is the Student Account Management contract in which there is an employee(database manager) who can insert the details of new student if and only if he enters his correct ecode (employee id). The details of students entered could be seen by using their unique identifiers (roll no.) under the details mapping. The student's admission is confirmed by the database manager (if he inserted the details means student is enrolled in some course). Further more, the student can register themselves once they paid their complete academic fees. The transaction made by student will reflect in the owner's account. Functions like stRegistration, payFee are ensuring the above things and different mappings are used in this contract.

### Getting Started
The contract is deployed with frontend and can be accessed after cloning the github by using the below steps-
  1. Inside the project directory, in the terminal type: npm i
  2. Open two additional terminals in your VS code
  3. In the second terminal type: npx hardhat node
  4. In the third terminal, type: npx hardhat run --network localhost scripts/deploy.js
  5. Back in the first terminal, type npm run dev to launch the front-end.
  After this, the project will be running on your localhost. Typically at http://localhost:3000/

Make sure to connect your Metamask with your wallet.
