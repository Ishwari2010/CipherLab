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
    <div className={`min-h-screen w-full transition-colors duration-200 flex flex-col ${theme === 'dark' ? 'dark text-white bg-gray-950' : 'bg-gray-50 text-gray-900'}`}>

      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60 bg-white/95 dark:bg-gray-950/95 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                CipherLab
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8 w-full">

        {/* Left Sidebar */}
        <aside className="w-full lg:w-60 shrink-0">
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
        <main className="flex-1 min-w-0 max-w-5xl">
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
