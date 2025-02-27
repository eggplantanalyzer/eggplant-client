import { useState, useRef } from 'react';
import axios from 'axios';
// Import icons
import { FaCloudUploadAlt, FaSpinner, FaFileExcel, FaFilePdf } from 'react-icons/fa';

// Helper function to convert RGB string to CSS color
const parseRGBString = (rgbString) => {
  // Handle both formats: "RGB(r,g,b)" and "[r,g,b]"
  const matches = rgbString.match(/\d+/g);
  if (matches && matches.length === 3) {
    return `rgb(${matches[0]}, ${matches[1]}, ${matches[2]})`;
  }
  return 'rgb(0, 0, 0)'; // fallback color
};

function App() {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState(null);
  const [excelUrl, setExcelUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const resultsRef = useRef(null);

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

      setResults(response.data.results);
      setExcelUrl(`${API_URL}${response.data.excel_url}`);
      setPdfUrl(`${API_URL}${response.data.pdf_url}`);

      // Add small delay to ensure the results are rendered
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

  const renderDesktopTable = () => (
    <div className="hidden md:block overflow-x-auto -mx-6 md:-mx-8">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden border border-purple-100 md:rounded-xl">
          <table className="min-w-full divide-y divide-purple-100">
            <thead className="bg-purple-50">
              <tr>
                {["ID", "File", "Original", "Processed", "Average Color", "Black", "Dark P", "Light P", "Brown"].map((header) => (
                  <th 
                    key={header}
                    scope="col" 
                    className="px-4 py-3.5 text-left text-xs font-semibold text-purple-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-purple-100">
              {results.map(result => (
                <tr key={result.id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-4 py-4">{result.id}</td>
                  <td className="px-4 py-4 max-w-[200px] truncate">{result.filename}</td>
                  <td className="px-4 py-4">
                    <img 
                      src={`data:image/png;base64,${result.original_image}`} 
                      alt="Original"
                      className="h-24 w-24 object-contain rounded-lg bg-gray-50"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <img
                      src={`data:image/png;base64,${result.processed_image}`}
                      alt="Processed"
                      className="h-24 w-24 object-contain rounded-lg bg-gray-50"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-lg border border-gray-200 shadow-sm"
                        style={{ backgroundColor: parseRGBString(result.avg_color) }}
                      />
                      <span>{result.avg_color}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">{result.color_percentages.Black}%</td>
                  <td className="px-4 py-4">{result.color_percentages['Dark Purple']}%</td>
                  <td className="px-4 py-4">{result.color_percentages['Light Purple']}%</td>
                  <td className="px-4 py-4">{result.color_percentages.Brown}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMobileCards = () => (
    <div className="md:hidden space-y-4">
      {results.map(result => (
        <div key={result.id} className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-sm text-purple-600">ID: {result.id}</span>
              <h3 className="text-sm font-medium text-gray-900 mt-1 truncate max-w-[200px]">
                {result.filename}
              </h3>
            </div>
          </div>
          
          <div className="space-y-2">
            <span className="text-xs text-purple-600">Processed Image</span>
            <img
              src={`data:image/png;base64,${result.processed_image}`}
              alt="Processed"
              className="w-full aspect-square object-contain rounded-lg shadow-sm bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div>
                <span className="text-purple-600">Average Color:</span>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                    style={{ backgroundColor: parseRGBString(result.avg_color) }}
                  />
                  <p className="font-medium">{result.avg_color}</p>
                </div>
              </div>
              <div>
                <span className="text-purple-600">Black:</span>
                <p className="font-medium">{result.color_percentages.Black}%</p>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-purple-600">Dark Purple:</span>
                <p className="font-medium">{result.color_percentages['Dark Purple']}%</p>
              </div>
              <div>
                <span className="text-purple-600">Light Purple:</span>
                <p className="font-medium">{result.color_percentages['Light Purple']}%</p>
              </div>
              <div>
                <span className="text-purple-600">Brown:</span>
                <p className="font-medium">{result.color_percentages.Brown}%</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text text-center">
            Eggplant Color Analysis
          </h1>
        </div>
      </header>

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
              <h3 className="text-lg font-semibold text-purple-900">Selected Images ({files.length})</h3>
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
                    <p className="mt-2 text-sm text-purple-700 truncate">{file.name}</p>
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
                  'Analyze Images'
                )}
              </button>
            </div>
          )}
        </div>

        {results && results.length > 0 && (
          <div ref={resultsRef} className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-bold text-purple-900">Analysis Results</h2>
                <div className="flex gap-3 w-full sm:w-auto">
                  <a 
                    href={excelUrl} 
                    download 
                    className="flex-1 sm:flex-none group relative overflow-hidden px-6 py-3 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg shadow-purple-200/50 hover:shadow-purple-300/50 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="relative flex items-center justify-center gap-2 text-white">
                      <FaFileExcel className="text-xl text-white" />
                      <span className="font-medium text-white">Download Excel</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  </a>
                  <a 
                    href={pdfUrl} 
                    download 
                    className="flex-1 sm:flex-none group relative overflow-hidden px-6 py-3 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-purple-200/50 hover:shadow-purple-300/50 hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <div className="relative flex items-center justify-center gap-2 text-white">
                      <FaFilePdf className="text-xl text-white" />
                      <span className="font-medium text-white">Download PDF</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                  </a>
                </div>
              </div>

              {renderMobileCards()}
              {renderDesktopTable()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;