import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [excelUrl, setExcelUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  const handleUpload = async () => {
    if (!files || !files.length) return;
    
    setLoading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    const API_URL = import.meta.env.VITE_API_URL || 'https://eggplant-server-b95y.onrender.com';
    console.log(API_URL);
    try {
      const url = `${API_URL.replace(/\/$/, '')}/api/upload`;
      const response = await axios.post(url, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*'
        }
      });

      setResults(response.data.results);
      setExcelUrl(`${API_URL}${response.data.excel_url}`);
      setPdfUrl(`${API_URL}${response.data.pdf_url}`);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Error processing images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Eggplant Color Analysis</h1>
      </header>

      <main className="main-content">
        <div className="upload-container">
          <label className="upload-area">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
              className="file-input"
            />
            <div className="upload-text">
              <i className="fas fa-cloud-upload-alt"></i>
              <span>Drag & drop images or click to browse</span>
            </div>
          </label>

          {files.length > 0 && (
            <div className="selected-files">
              <h3>Selected Images ({files.length})</h3>
              <div className="file-preview-grid">
                {Array.from(files).map((file, index) => (
                  <div key={index} className="file-preview">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                    <span className="file-name">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            className={`upload-button ${loading ? 'loading' : ''}`}
            onClick={handleUpload} 
            disabled={loading || !files.length}
          >
            {loading ? 'Processing...' : 'Analyze Images'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="results-container">
            <div className="actions-bar">
              <h2>Analysis Results</h2>
              <div className="download-buttons">
                <a href={excelUrl} download className="download-btn excel">
                  <i className="fas fa-file-excel"></i>
                  Excel Report
                </a>
                <a href={pdfUrl} download className="download-btn pdf">
                  <i className="fas fa-file-pdf"></i>
                  PDF Report
                </a>
              </div>
            </div>

            <div className="results-table-container">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Image #</th>
                    <th>Filename</th>
                    <th>Original</th>
                    <th>Processed</th>
                    <th>Avg Color</th>
                    <th>Black</th>
                    <th>Dark Purple</th>
                    <th>Light Purple</th>
                    <th>Brown</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(result => (
                    <tr key={result.id}>
                      <td>{result.id}</td>
                      <td className="filename">{result.filename}</td>
                      <td>
                        <img 
                          src={`data:image/png;base64,${result.original_image}`} 
                          alt="Original"
                          className="result-image"
                        />
                      </td>
                      <td>
                        <img
                          src={`data:image/png;base64,${result.processed_image}`}
                          alt="Processed"
                          className="result-image"
                        />
                      </td>
                      <td>{result.avg_color}</td>
                      <td>{result.color_percentages.Black}%</td>
                      <td>{result.color_percentages['Dark Purple']}%</td>
                      <td>{result.color_percentages['Light Purple']}%</td>
                      <td>{result.color_percentages.Brown}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;