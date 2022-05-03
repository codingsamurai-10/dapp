import { useState } from "react";
import { ethers } from "ethers";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

const greeterAddress = "0x15d87af420b9f2f44C435026a9339B47F286138d";

function App() {
  const [greeting, setGreetingValue] = useState("");

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

      await provider.send("eth_requestAccounts", []);

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
    </div>
  );
}

export default App;
