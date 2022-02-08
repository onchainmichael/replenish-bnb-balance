import React from "react";
import "./App.css";

function App() {
  const [address, setAddress] = React.useState('');
  const [tokenAmount, setTokenAmount] = React.useState(0);

 async function replenish() {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replenishAddress: address, tokenAmount: tokenAmount })
    };

    if(tokenAmount <= 0) {
      alert('Tokens amount must be more than 0');
      return;
    }

    await fetch('/replenish-balance', requestOptions)
      .then(response => response.text())
      .then(res => alert(res));
  }

  return (
    <div className="App">
        <label>Address</label>
        <input type="text" value={address} onChange={e => setAddress(e.target.value)} />

        <label>Tokens</label>
        <input type="text" value={tokenAmount} onChange={e => setTokenAmount(e.target.value)} />

        <button onClick={replenish}>Get tokens</button>
    </div>
  );
}

export default App;
