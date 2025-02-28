import { FaFileExcel, FaFilePdf, FaTimes } from 'react-icons/fa';
import { parseRGBString } from '../utils/colorUtils';

export default function History({ history, onClose, onClear }) {
  const renderDesktopTable = (results) => (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Filename</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Average Color</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Black</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dark Purple</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Light Purple</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brown</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result, idx) => (
            <tr key={idx}>
              <td className="px-4 py-3">
                <img
                  src={`data:image/png;base64,${result.processed_image}`}
                  alt="Processed"
                  className="w-16 h-16 object-contain rounded-lg bg-gray-50"
                />
              </td>
              <td className="px-4 py-3 max-w-[160px] truncate text-sm text-gray-900">{result.filename}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: parseRGBString(result.avg_color) }}
                  />
                  <span className="text-sm text-gray-700">{result.avg_color}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">{result.color_percentages.Black}%</td>
              <td className="px-4 py-3 text-sm text-gray-900">{result.color_percentages['Dark Purple']}%</td>
              <td className="px-4 py-3 text-sm text-gray-900">{result.color_percentages['Light Purple']}%</td>
              <td className="px-4 py-3 text-sm text-gray-900">{result.color_percentages.Brown}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMobileCards = (results) => (
    <div className="md:hidden space-y-4">
      {results.map((result, idx) => (
        <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start gap-4">
            <img
              src={`data:image/png;base64,${result.processed_image}`}
              alt="Processed"
              className="w-16 h-16 object-contain rounded-lg bg-gray-50"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{result.filename}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: parseRGBString(result.avg_color) }}
                  />
                  <span>{result.avg_color}</span>
                </div>
                <div>Black: {result.color_percentages.Black}%</div>
                <div>Dark P: {result.color_percentages['Dark Purple']}%</div>
                <div>Light P: {result.color_percentages['Light Purple']}%</div>
                <div>Brown: {result.color_percentages.Brown}%</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 ">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
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
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
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
                      {entry.results.length} images analyzed
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

                <div className="space-y-4 ">
                  {renderMobileCards(entry.results)}
                  {renderDesktopTable(entry.results)}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-gray-100 p-4 text-center text-sm text-gray-500">
          Scroll to view more history
        </div>
      </div>
    </div>
  );
}