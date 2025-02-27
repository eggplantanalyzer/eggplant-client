import { FaHistory } from 'react-icons/fa';

export default function Navbar({ onHistoryClick }) {
  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3 flex justify-between items-center">
        <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text leading-none">
          Eggplant Color Analysis
        </h1>
        <button
          onClick={onHistoryClick}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <FaHistory className="text-sm sm:text-base" />
          <span className="hidden sm:inline text-sm">History</span>
        </button>
      </div>
    </header>
  );
} 