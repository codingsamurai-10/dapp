import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";
import Token from "./artifacts/contracts/Token.sol/Token.json";

const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const tokenAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
  const [greeting, setGreetingValue] = useState("");
  const [userAccount, setUserAccount] = useState("");
  const [amount, setAmount] = useState(0);

  const getBalance = async() => {
    if (typeof window.ethereum !== "undefined") {
      const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        tokenAddress,
        Token.abi,
        provider
      );
      const balance = await contract.balanceOf(account);
      console.log(balance.toString());
    }
  }

  const sendCoins = async () => {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        tokenAddress,
        Token.abi,
        signer
      );
      const transaction = await contract.transfer(userAccount, amount);
      await transaction.wait();
      console.log('sent');
    }
  }

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );

      try {
        const data = await contract.greet();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const setGreeting = async () => {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const test = await provider.send("eth_requestAccounts", []);
      console.log(test);

      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue("");
      await transaction.wait();
      fetchGreeting();
    }
  };

  return (
    <div>
      <button onClick={fetchGreeting}>Fetch greeting</button>
      <input
        type="text"
        onChange={(e) => setGreetingValue(e.target.value)}
        value={greeting}
      />
      <button onClick={setGreeting}>Set greeting</button>

      <br />

      <button onClick={getBalance}>Get balance</button>
      <input
        type="text"
        onChange={(e) => setUserAccount(e.target.value)}
        value={userAccount}
      />
      <input
        type="text"
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
      />
      <button onClick={sendCoins}>Transfer</button>
    </div>
  );
}

export default App;
