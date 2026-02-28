import { useState } from 'react';
import { CaesarView } from './components/CaesarView';
import { VigenereView } from './components/VigenereView';
import { HillView } from './components/HillView';
import { PlayfairView } from './components/PlayfairView';
import { RailFenceView } from './components/RailFenceView';
import { ColumnarView } from './components/ColumnarView';

type CipherTab = 'caesar' | 'vigenere' | 'hill' | 'playfair' | 'railfence' | 'columnar';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeTab, setActiveTab] = useState<CipherTab>('caesar');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const tabs: { id: CipherTab, label: string }[] = [
    { id: 'caesar', label: 'Caesar Cipher' },
    { id: 'vigenere', label: 'Vigenère Cipher' },
    { id: 'hill', label: 'Hill Cipher' },
    { id: 'playfair', label: 'Playfair Cipher' },
    { id: 'railfence', label: 'Rail Fence Cipher' },
    { id: 'columnar', label: 'Columnar Transposition' },
  ];

  return (
    <div className={`min-h-screen w-full transition-colors duration-200 flex flex-col ${theme === 'dark' ? 'dark text-white bg-gray-900' : 'bg-gray-50 text-gray-900'}`}>

      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60 bg-white/95 dark:bg-gray-900/95 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
        <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                CipherLab
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
              Educational Cryptography Toolkit
            </span>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700 mx-2 hidden sm:block"></div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8">

        {/* Left Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-8">
            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold mb-3 text-gray-500 dark:text-gray-400 ml-2">Available Ciphers</h2>
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition duration-150 flex items-center justify-between
                      ${activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold mb-3 text-gray-500 dark:text-gray-400 ml-2 border-t border-gray-200 dark:border-gray-800 pt-6">Analysis Tools</h2>
              <nav className="space-y-1 block opacity-50 cursor-not-allowed">
                <button disabled className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-gray-500 dark:text-gray-500 transition duration-150 flex items-center">
                  Auto-Detect Cipher
                  <span className="ml-auto text-[10px] uppercase tracking-wider bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">Soon</span>
                </button>
                <button disabled className="w-full text-left px-4 py-2.5 rounded-lg font-medium text-gray-500 dark:text-gray-500 transition duration-150 flex items-center">
                  Frequency Analysis
                  <span className="ml-auto text-[10px] uppercase tracking-wider bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded-full">Soon</span>
                </button>
              </nav>
            </div>
          </div>
        </aside>

        {/* Selected Cipher View */}
        <main className="flex-1 min-w-0">
          {activeTab === 'caesar' && <CaesarView />}
          {activeTab === 'vigenere' && <VigenereView />}
          {activeTab === 'hill' && <HillView />}
          {activeTab === 'playfair' && <PlayfairView />}
          {activeTab === 'railfence' && <RailFenceView />}
          {activeTab === 'columnar' && <ColumnarView />}
        </main>
      </div>
    </div>
  );
}

export default App;
