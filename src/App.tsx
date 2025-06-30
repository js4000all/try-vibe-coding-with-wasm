import { useState, useEffect } from 'react';
import init, { factorize as factorizeWasm } from 'wasm';
import { factorize as factorizeJs } from './factorize';
import './App.css';

type Result = {
  source: 'WASM' | 'JS';
  factors: number[];
  time: number;
};

function App() {
  const [inputNumber, setInputNumber] = useState<string>('9007199254740991');
  const [results, setResults] = useState<Result[]>([]);
  const [wasmInitialized, setWasmInitialized] = useState(false);

  useEffect(() => {
    init().then(() => {
      setWasmInitialized(true);
    });
  }, []);

  const handleRun = async (source: 'WASM' | 'JS') => {
    const num = BigInt(inputNumber);
    if (num <= 1) {
      alert('Please enter a number greater than 1.');
      return;
    }

    let factors: number[];
    const startTime = performance.now();

    if (source === 'WASM') {
      const wasmFactors = factorizeWasm(num);
      factors = Array.from(wasmFactors).map(n => Number(n));
    } else {
      const jsFactors = factorizeJs(num);
      factors = jsFactors.map(n => Number(n));
    }

    const endTime = performance.now();

    setResults(prev => [{
      source,
      factors: factors,
      time: endTime - startTime,
    }, ...prev]);
  };

  return (
    <div className="App">
      <h1>WASM vs JS Prime Factorization</h1>
      <div className="card">
        <input
          type="number"
          value={inputNumber}
          onChange={(e) => setInputNumber(e.target.value)}
          placeholder="Enter a number"
        />
        <button onClick={() => handleRun('WASM')} disabled={!wasmInitialized}>
          Run (WASM)
        </button>
        <button onClick={() => handleRun('JS')}>
          Run (JS)
        </button>
      </div>

      <div className="results">
        <h2>Results</h2>
        {results.map((result, index) => (
          <div key={index} className="result-item">
            <p><strong>{result.source}</strong></p>
            <p>Number: {inputNumber}</p>
            <p>Factors: {result.factors.join(', ')}</p>
            <p>Time: {result.time.toFixed(2)} ms</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;