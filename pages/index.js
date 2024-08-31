import { useState, useEffect } from "react";
import { ethers } from "ethers";
import studentAccountAbi from "../artifacts/contracts/StudentAccount.sol/StudentAccount.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [studentAccount, setStudentAccount] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [rollNo, setRollNo] = useState(0);
  const [name, setName] = useState("");
  const [program, setProgram] = useState("");
  const [section, setSection] = useState();
  const [percent, setPercent] = useState();
  const [amountToPay, setAmountToPay] = useState(undefined);
  const [paidAmount, setPaidAmount] = useState();
  const [eCode, setECode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [status, setStatus] = useState("");
  const [studentInfo, setStudentInfo] = useState({});

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; 
  const studentAccountABI = studentAccountAbi.abi;

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
    if (account.length > 0) {
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

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getStudentAccountContract();
  };

  const getStudentAccountContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const studentAccountContract = new ethers.Contract(contractAddress, studentAccountABI, signer);

    setStudentAccount(studentAccountContract);
  };

  const verifyECode = async () => {
    if (studentAccount && eCode) {
      try {
        await studentAccount.enterECode(eCode); // Using the enterECode function to validate the eCode
        setIsVerified(true);
      } catch (error) {
        alert("eCode verification failed!");
      }
    }
  };

  const getAccountDetails = async () => {
    if (studentAccount) {
      await studentAccount.getAccountDetails(rollNo);
      const amount = await studentAccount.amountToPay(rollNo);
      setAmountToPay(ethers.utils.formatUnits(amount, 18));
      console.log("Amount to Pay: ", amountToPay);
    }
  };

  const payFee = async () => {
    if (studentAccount && paidAmount > 0) {
      let tx = await studentAccount.payFee(rollNo, ethers.utils.parseUnits(paidAmount.toString(), 18));
      await tx.wait();
      getAccountDetails();
    }
  };

  const enterStDetails = async () => {
    if (studentAccount && isVerified) {
      let tx = await studentAccount.enterStDetails(name, program, section, percent, { from: account });
      await tx.wait();
      setRollNo(rollNo + 1);
      getAccountDetails();
      fetchStudentInfo(rollNo + 1); // Fetch student info after entering details
    }
  };

  const fetchStudentInfo = async (rollNumber) => {
    if (studentAccount) {
      const info = await studentAccount.details(rollNumber);
      setStudentInfo({
        name: info.name,
        program: info.program,
        section: info.section,
        academicFees: info.academicFees.toNumber(),
      });
    }
  };

  const stRegistration = async () => {
    if (studentAccount) {
      const status = await studentAccount.stRegistration(rollNo);
      setStatus(status);
      console.log("Registration Status: ", status);
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask to use this application.</p>;
    }

    if (!account) {
      return (
        <button onClick={connectAccount}>
          Please connect your MetaMask wallet
        </button>
      );
    }

    // if (amountToPay === undefined) {
    //   getAccountDetails();
    // }
    if (!isVerified) {
      return (
        <div>
          <input
            type="text"
            value={eCode}
            onChange={(e) => setECode(e.target.value)}
            placeholder="Enter eCode"
          />
          <button onClick={verifyECode}>Verify eCode</button>
        </div>
      );
    }    

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Roll Number: {rollNo}</p>
        <p>Amount to Pay: {amountToPay}</p>
        <p>Status: {status}</p>
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Student Name"
          />
          <input
            type="text"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            placeholder="Program"
          />
          <input
            type="number"
            value={section}
            onChange={(e) => setSection(Number(e.target.value))}
            placeholder="Section"
          />
          <input
            type="number"
            value={percent}
            onChange={(e) => setPercent(Number(e.target.value))}
            placeholder="Percent"
          />
          <button onClick={enterStDetails}>Enter Student Details</button>
        </div>
        <div>
          <input
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value))}
            placeholder="Pay Amount"
          />
          <button onClick={payFee}>Pay Fee</button>
        </div>
        <div>
          <button onClick={stRegistration}>Check Registration</button>
        </div>
        {studentInfo.name && (
          <div>
            <h3>Student Info</h3>
            <p>Name: {studentInfo.name}</p>
            <p>Program: {studentInfo.program}</p>
            <p>Section: {studentInfo.section}</p>
            <p>Academic Fees: {studentInfo.academicFees}</p>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Student Account Management</h1>
      </header>
      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
          }
        `}
      </style>
    </main>
  );
}
