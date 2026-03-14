import { useState, useEffect } from 'react';
import { CaesarView } from './components/CaesarView';
import { VigenereView } from './components/VigenereView';
import { HillView } from './components/HillView';
import { PlayfairView } from './components/PlayfairView';
import { RailFenceView } from './components/RailFenceView';
import { ColumnarView } from './components/ColumnarView';
import { RSAView } from './components/RSAView';
import { DiffieHellmanView } from './components/DiffieHellmanView';
import { QuizView } from './components/QuizView';

type CipherTab = 'caesar' | 'vigenere' | 'hill' | 'playfair' | 'railfence' | 'columnar' | 'rsa' | 'diffieHellman' | 'quiz';

function App() {
  const [activeTab, setActiveTab] = useState<CipherTab>('caesar');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('cryptiq-theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cryptiq-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cryptiq-theme', 'light');
    }
  }, [isDarkMode]);

  const tabs: { id: CipherTab, label: string }[] = [
    { id: 'caesar', label: 'Caesar Cipher' },
    { id: 'vigenere', label: 'Vigenère Cipher' },
    { id: 'hill', label: 'Hill Cipher' },
    { id: 'playfair', label: 'Playfair Cipher' },
    { id: 'railfence', label: 'Rail Fence Cipher' },
    { id: 'columnar', label: 'Columnar Transposition' },
    { id: 'rsa', label: 'RSA Algorithm' },
    { id: 'diffieHellman', label: 'Diffie-Hellman Key Exchange' },
    { id: 'quiz', label: 'Cryptography Quiz' },
  ];

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden transition-colors duration-200 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100">

      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-30 w-full h-14 flex-shrink-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-purple-100 dark:border-gray-800 shadow-sm transition-colors duration-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-purple-800 dark:text-purple-400">
                Cryptiq
              </h1>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-150 flex items-center justify-center border border-gray-200 dark:border-gray-700 shadow-sm"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row flex-1 w-full overflow-hidden">

        {/* Left Sidebar */}
        <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-purple-100 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 backdrop-blur-md overflow-y-auto">
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row lg:flex-col gap-6 lg:gap-8">
            {/* Substitution Ciphers */}
            <div className="flex-1">
              <h2 className="text-xs uppercase tracking-wider font-bold mb-3 text-purple-400 dark:text-purple-500 ml-2">Substitution Ciphers</h2>
              <nav className="space-y-1">
                {tabs.filter(t => ['caesar', 'vigenere', 'hill', 'playfair'].includes(t.id)).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition duration-150 flex items-center justify-between
                      ${activeTab === tab.id
                        ? 'bg-purple-200 text-purple-900 dark:bg-purple-900/50 dark:text-purple-200'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-gray-800/50 hover:text-purple-900 dark:hover:text-gray-200'
                      }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400"></span>}
                  </button>
                ))}
              </nav>
            </div>

            {/* Transposition Ciphers */}
            <div className="flex-1">
              <h2 className="text-xs uppercase tracking-wider font-bold mb-3 text-purple-400 dark:text-purple-500 ml-2">Transposition Ciphers</h2>
              <nav className="space-y-1">
                {tabs.filter(t => ['railfence', 'columnar'].includes(t.id)).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition duration-150 flex items-center justify-between
                      ${activeTab === tab.id
                        ? 'bg-purple-200 text-purple-900 dark:bg-purple-900/50 dark:text-purple-200'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-gray-800/50 hover:text-purple-900 dark:hover:text-gray-200'
                      }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400"></span>}
                  </button>
                ))}
              </nav>
            </div>

            {/* Public Key Cryptography */}
            <div className="flex-1">
              <h2 className="text-xs uppercase tracking-wider font-bold mb-3 text-purple-400 dark:text-purple-500 ml-2">Public Key Cryptography</h2>
              <nav className="space-y-1">
                {tabs.filter(t => ['rsa', 'diffieHellman'].includes(t.id)).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition duration-150 flex items-center justify-between
                      ${activeTab === tab.id
                        ? 'bg-purple-200 text-purple-900 dark:bg-purple-900/50 dark:text-purple-200'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-gray-800/50 hover:text-purple-900 dark:hover:text-gray-200'
                      }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 dark:bg-purple-400"></span>}
                  </button>
                ))}
              </nav>
            </div>

            {/* Interactive Learning */}
            <div className="flex-1">
              <h2 className="text-xs uppercase tracking-wider font-bold mb-3 text-emerald-500 dark:text-emerald-400 ml-2">Interactive Learning</h2>
              <nav className="space-y-1">
                {tabs.filter(t => ['quiz'].includes(t.id)).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition duration-150 flex items-center justify-between
                      ${activeTab === tab.id
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'text-gray-500 dark:text-gray-400 hover:bg-emerald-50 dark:hover:bg-gray-800/50 hover:text-emerald-700 dark:hover:text-emerald-300'
                      }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>🎓</span> {tab.label}
                    </span>
                    {activeTab === tab.id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Selected Cipher View */}
        <main className="w-full flex-1 overflow-y-auto p-4 sm:p-5">
          {activeTab === 'caesar' && <CaesarView />}
          {activeTab === 'vigenere' && <VigenereView />}
          {activeTab === 'hill' && <HillView />}
          {activeTab === 'playfair' && <PlayfairView />}
          {activeTab === 'railfence' && <RailFenceView />}
          {activeTab === 'columnar' && <ColumnarView />}
          {activeTab === 'rsa' && <RSAView />}
          {activeTab === 'diffieHellman' && <DiffieHellmanView />}
          {activeTab === 'quiz' && <QuizView />}
        </main>
      </div>
    </div>
  );
}

export default App;
