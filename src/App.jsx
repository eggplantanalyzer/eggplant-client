import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  FaCloudUploadAlt, 
  FaSpinner, 
  FaFileExcel, 
  FaFilePdf, 
  FaHistory,
  FaImage,
  FaPalette,
  FaPercentage,
  FaTable,
  FaDownload,
  FaTrash,
  FaTimesCircle,
  FaCheckCircle,
  FaInfoCircle
} from 'react-icons/fa';
import History from './components/History';
import Navbar from './components/Navbar';
import { parseRGBString } from './utils/colorUtils';

function App() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState(null);
  const [excelUrl, setExcelUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const resultsRef = useRef(null);

  // Load history from localStorage on component mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('analysisHistory');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        // Ensure we're loading an array
        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        }
      }
    } catch (error) {
      console.error('Error loading history:', error);
      // If there's an error, start with empty history
      setHistory([]);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('analysisHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }, [history]);

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

    const API_URL = import.meta.env.VITE_API_URL || 'https://eggplant-server.onrender.com';
    try {
      const url = `${API_URL.replace(/\/$/, '')}/api/upload`;
      const response = await axios.post(url, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*'
        }
      });

      const newResults = response.data.results;
      const newExcelUrl = `${API_URL}${response.data.excel_url}`;
      const newPdfUrl = `${API_URL}${response.data.pdf_url}`;

      setResults(newResults);
      setExcelUrl(newExcelUrl);
      setPdfUrl(newPdfUrl);

      // Create new history entry
      const historyEntry = {
        id: Date.now(), // Add unique ID for each entry
        timestamp: new Date().toISOString(),
        results: newResults,
        excelUrl: newExcelUrl,
        pdfUrl: newPdfUrl,
        fileCount: files.length,
      };

      // Update history by adding new entry to the beginning
      setHistory(prevHistory => {
        const updatedHistory = [historyEntry, ...prevHistory];
        // Optionally limit history size (e.g., keep last 50 entries)
        const maxHistorySize = 50;
        return updatedHistory.slice(0, maxHistorySize);
      });

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Error processing images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
      setHistory([]);
      localStorage.removeItem('analysisHistory'); // Also clear from localStorage
    }
  };

  const renderMobileCards = () => (
    <div className="md:hidden space-y-4">
      {results.map(result => (
        <div key={result.id} className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src={`data:image/png;base64,${result.processed_image}`}
                alt="Processed"
                className="w-16 h-16 object-contain rounded-lg bg-gray-50"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <FaImage className="text-purple-500 flex-shrink-0" />
                <h3 className="text-sm font-medium text-gray-900 break-words">
                  {result.filename}
                </h3>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <FaPalette className="text-purple-500 flex-shrink-0" />
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: parseRGBString(result.avg_color) }}
                  />
                  <span className="break-words">{result.avg_color}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPercentage className="text-purple-500 flex-shrink-0" />
                  <span>Black: {result.color_percentages.Black}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPercentage className="text-purple-500 flex-shrink-0" />
                  <span>Dark P: {result.color_percentages['Dark Purple']}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPercentage className="text-purple-500 flex-shrink-0" />
                  <span>Light P: {result.color_percentages['Light Purple']}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPercentage className="text-purple-500 flex-shrink-0" />
                  <span>Brown: {result.color_percentages.Brown}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDesktopTable = () => (
    <div className="hidden md:block overflow-x-auto -mx-6 md:-mx-8">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-purple-100 md:rounded-xl">
          <table className="min-w-full divide-y divide-purple-100">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                  <FaImage className="inline-block mr-2" />
                  Image
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                  <FaTable className="inline-block mr-2" />
                  Details
                </th>
                <th className="px-4 py-3.5 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider">
                  <FaPalette className="inline-block mr-2" />
                  Colors
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-100">
              {results.map(result => (
                <tr key={result.id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={`data:image/png;base64,${result.original_image}`} 
                          alt="Original"
                          className="h-16 w-16 object-contain rounded-lg bg-gray-50"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          <FaImage className="inline-block mr-2 text-purple-500" />
                          {result.filename}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          ID: {result.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={`data:image/png;base64,${result.processed_image}`}
                          alt="Processed"
                          className="h-16 w-16 object-contain rounded-lg bg-gray-50"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-200"
                            style={{ backgroundColor: parseRGBString(result.avg_color) }}
                          />
                          <span className="text-sm text-gray-900">{result.avg_color}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <FaPercentage className="text-purple-500" />
                        Black: {result.color_percentages.Black}%
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPercentage className="text-purple-500" />
                        Dark P: {result.color_percentages['Dark Purple']}%
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPercentage className="text-purple-500" />
                        Light P: {result.color_percentages['Light Purple']}%
                      </div>
                      <div className="flex items-center gap-2">
                        <FaPercentage className="text-purple-500" />
                        Brown: {result.color_percentages.Brown}%
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Navbar onHistoryClick={() => setShowHistory(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8">
          <label className="block">
            <div className="border-2 border-dashed border-purple-200 rounded-xl p-8 md:p-12 text-center cursor-pointer hover:border-purple-400 transition-all duration-300 group">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-300">
                  <FaCloudUploadAlt className="text-2xl md:text-3xl text-purple-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-lg md:text-xl font-medium text-purple-900">Drop your images here</p>
                  <p className="text-sm text-purple-600">or click to browse</p>
                </div>
              </div>
            </div>
          </label>

          {files.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold text-purple-900 flex items-center gap-2">
                <FaImage className="text-purple-500" />
                Selected Images ({files.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from(files).map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-purple-50">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <p className="mt-2 text-sm text-purple-700 truncate flex items-center gap-1">
                      <FaImage className="flex-shrink-0" />
                      <span>{file.name}</span>
                    </p>
                  </div>
                ))}
              </div>
              <button 
                className={`w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all duration-300 ${
                  loading ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-0.5'
                }`}
                onClick={handleUpload} 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FaCheckCircle />
                    Analyze Images
                  </span>
                )}
              </button>
            </div>
          )}
        </div>

        {results && results.length > 0 && (
          <div ref={resultsRef} className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                  <FaPalette className="text-purple-500" />
                  Analysis Results
                </h2>
                <div className="flex gap-3 w-full sm:w-auto">
                  <a 
                    href={excelUrl} 
                    download 
                    className="flex-1 sm:flex-none group relative overflow-hidden px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-purple-200/50 hover:shadow-purple-300/50 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="relative flex items-center justify-center gap-2 text-white text-sm sm:text-base">
                      <FaFileExcel className="text-lg sm:text-xl" />
                      <span className="font-medium">Excel</span>
                    </div>
                  </a>
                  <a 
                    href={pdfUrl} 
                    download 
                    className="flex-1 sm:flex-none group relative overflow-hidden px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-200/50 hover:shadow-purple-300/50 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="relative flex items-center justify-center gap-2 text-white text-sm sm:text-base">
                      <FaFilePdf className="text-lg sm:text-xl" />
                      <span className="font-medium">PDF</span>
                    </div>
                  </a>
                </div>
              </div>

              {renderMobileCards()}
              {renderDesktopTable()}
            </div>
          </div>
        )}
      </main>

      {showHistory && (
        <History
          history={history}
          onClose={() => setShowHistory(false)}
          onClear={clearHistory}
        />
      )}
    </div>
  );
}

export default App;