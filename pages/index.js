import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [userName, setUserName] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [newUserName, setNewUserName] = useState("");
  const [itemsForSale, setItemsForSale] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [itemIndex, setItemIndex] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const name = prompt("Please enter your name:");
    setNewUserName(name);

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract(name);
  };

  const getATMContract = async (name) => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);

    if (name) {
      await atmContract.setName(name);
      setUserName(name);
    }

    getBalance();
    getInventory();
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const getItemsForSale = async () => {
    if (atm) {
      const items = await atm.getItemForSale();
      setItemsForSale(items);
    }
  };

  const getInventory = async () => {
    if (atm) {
      const inv = await atm.getInventory();
      setInventory(inv);
    }
  };

  const buyItem = async () => {
    if (atm && itemIndex) {
      const tx = await atm.buyItem(itemIndex);
      await tx.wait();
      getBalance();
      getInventory();
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(depositAmount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(withdrawAmount);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return (
        <button
          onClick={connectAccount}
          style={styles.button}
        >
          Please connect your Metamask wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div style={styles.container}>
        <div style={styles.accountInfo}>
          <p><b>Your Name: </b>{userName}</p>
          <p><b>Your Account: </b>{account}</p>
          <p><b>Your Balance:</b> {balance} ETH</p>
          <p><b>Your Inventory:</b></p>
          <ul>
            {Array.isArray(inventory) && inventory.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={styles.section}>
          <h3>Deposit</h3>
          <input
            type="number"
            placeholder="Amount to Deposit"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
            style={styles.input}
          />
          <button onClick={deposit} style={styles.button}>Deposit</button>
        </div>
        <div style={styles.section}>
          <h3>Withdraw</h3>
          <input
            type="number"
            placeholder="Amount to Withdraw"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
            style={styles.input}
          />
          <button onClick={withdraw} style={styles.button}>Withdraw</button>
        </div>
        <div style={styles.section}>
          <h3>Items for Sale</h3>
          <button onClick={getItemsForSale} style={styles.button}>Show Items for Sale</button>
          <ul>
            {Array.isArray(itemsForSale) && itemsForSale.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        <div style={styles.section}>
          <h3>Buy Item</h3>
          <input
            type="number"
            placeholder="Item Index"
            value={itemIndex}
            onChange={(e) => setItemIndex(Number(e.target.value))}
            style={styles.input}
          />
          <button onClick={buyItem} style={styles.button}>Buy Item</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  const styles = {
    container: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      textAlign: 'center',
      width: '50%',
      margin: 'auto',
      marginTop: '4%',
    },
    accountInfo: {
      backgroundColor: '#f0f0f0',
      borderRadius: '10px',
      padding: '10px',
      margin: '10px 0',
    },
    section: {
      margin: '20px 0',
    },
    input: {
      padding: '10px',
      margin: '10px 0',
      borderRadius: '5px',
      border: '1px solid #ccc',
      width: '80%',
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      backgroundColor: 'red',
      color: 'white',
      cursor: 'pointer',
    },
    header: {
      textAlign: 'center',
      margin: '20px 0',
      borderRadius: '15px',
      backgroundColor: 'red',
      width: '30%',
      margin: 'auto',
      marginTop: '10%',
    }
  };

  return (
    <main style={styles.main}>
      <header style={styles.header}><h1>Welcome to the Store</h1></header>
        
      {initUser()}
    </main>
  );
}
