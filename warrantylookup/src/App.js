import { useState } from 'react';
import './App.css';

function App() {
  const [serialNumbers, setSerialNumbers] = useState('');
  const [manufacturer, setManufacturer] = useState('dell');
  const [darkMode, setDarkMode] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvContent = event.target.result;
        setSerialNumbers(prev => {
          const separator = prev ? '\n' : '';
          return prev + separator + csvContent;
        });
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const serials = serialNumbers
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    for (const serial of serials) {
      let url;
      switch(manufacturer) {
        case 'dell':
          url = `https://www.dell.com/support/home/en-us/product-support/servicetag/${serial}`;
          break;
        case 'lenovo':
          url = `https://pcsupport.lenovo.com/us/en/products/${serial}`;
          break;
        case 'hp':
          url = `https://support.hp.com/us-en/checkwarranty/${serial}`;
          break;
        default:
          continue;
      }
      
      window.open(
        url, 
        `warranty_${serial}`,
        'height=800,width=600,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes'
      );

      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleClear = () => {
    setSerialNumbers('');
    setManufacturer('dell');
  };

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <button 
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
      
      <header className="app-header">
        <h1>Warranty Lookup Tool</h1>
        <p className="subtitle">Check warranty status for multiple devices at once</p>
      </header>
      
      <main>
        <form onSubmit={handleSubmit} className="warranty-form">
          <div className="form-group">
            <label>Select Manufacturer</label>
            <div className="manufacturer-buttons">
              <button
                type="button"
                className={`manufacturer-btn ${manufacturer === 'dell' ? 'selected' : ''}`}
                onClick={() => setManufacturer('dell')}
              >
                Dell
              </button>
              <button
                type="button"
                className={`manufacturer-btn ${manufacturer === 'lenovo' ? 'selected' : ''}`}
                onClick={() => setManufacturer('lenovo')}
              >
                Lenovo
              </button>
              <button
                type="button"
                className={`manufacturer-btn ${manufacturer === 'hp' ? 'selected' : ''}`}
                onClick={() => setManufacturer('hp')}
              >
                HP
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="serial">Serial Numbers</label>
            <textarea
              id="serial"
              value={serialNumbers}
              onChange={(e) => setSerialNumbers(e.target.value)}
              required
              placeholder="Enter one serial number per line"
              rows={5}
            />
            <span className="helper-text">Enter each serial number on a new line or upload a CSV file</span>
          </div>

          <div className="form-group upload-group">
            <label htmlFor="csvFile" className="upload-label">
              <span className="upload-text">Upload CSV File</span>
              <input
                type="file"
                id="csvFile"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="file-input"
              />
            </label>
          </div>

          <div className="button-group">
            <button 
              type="submit" 
              className="primary"
              disabled={!serialNumbers.trim()}
            >
              Check Warranties
            </button>
            <button 
              type="button" 
              className="secondary"
              onClick={handleClear}
            >
              Clear All
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default App; 