import { FaFileExcel, FaFilePdf, FaTimes } from 'react-icons/fa';
import { parseRGBString } from '../utils/colorUtils';

export default function History({ history, onClose, onClear }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Fixed header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-purple-900">Analysis History</h2>
            <p className="text-sm text-gray-500 mt-1">
              {history.length} {history.length === 1 ? 'record' : 'records'} found
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClear}
              className="text-sm px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear History
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p>No history available</p>
              <p className="text-sm mt-2">Analyzed results will appear here</p>
            </div>
          ) : (
            history.map((entry, index) => (
              <div key={entry.id || index} className="bg-gray-50 rounded-xl p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Files analyzed: {entry.results.length}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={entry.excelUrl}
                      download
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <FaFileExcel />
                      <span>Excel</span>
                    </a>
                    <a
                      href={entry.pdfUrl}
                      download
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <FaFilePdf />
                      <span>PDF</span>
                    </a>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {entry.results.map((result, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 shadow-sm">
                      <img
                        src={`data:image/png;base64,${result.processed_image}`}
                        alt="Processed"
                        className="w-full aspect-square object-contain rounded-lg bg-gray-50"
                      />
                      <div className="mt-2 text-sm">
                        <p className="truncate text-gray-600">{result.filename}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: parseRGBString(result.avg_color) }}
                          />
                          <p className="text-xs text-gray-500">{result.avg_color}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Optional: Add a subtle scroll indicator */}
        <div className="border-t border-gray-100 p-4 text-center text-sm text-gray-500">
          Scroll to see more history
        </div>
      </div>
    </div>
  );
} 