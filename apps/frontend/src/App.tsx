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
    <div className={`min-h-screen w-full transition-colors duration-200 ${theme === 'dark' ? 'dark text-white bg-gray-900' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8 border-b pb-4 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
                CipherLab
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Educational Cryptography Toolkit</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition shadow-sm"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <aside className="lg:col-span-1 rounded-xl bg-white shadow-sm dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700 h-fit">
            <h2 className="text-sm uppercase tracking-wider font-bold mb-4 text-gray-500 dark:text-gray-400">Available Ciphers</h2>
            <ul className="space-y-1">
              {tabs.map(tab => (
                <li
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-3 cursor-pointer rounded-lg font-medium transition ${activeTab === tab.id ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'}`}
                >
                  {tab.label}
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-4 border-t dark:border-gray-700">
              <h2 className="text-sm uppercase tracking-wider font-bold mb-4 text-gray-500 dark:text-gray-400">Analysis Tools</h2>
              <button className="w-full text-left p-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition">
                Auto-Detect Cipher
              </button>
              <button className="w-full text-left p-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition">
                Frequency Analysis
              </button>
            </div>
          </aside>

          <section className="lg:col-span-4">
            {activeTab === 'caesar' && <CaesarView />}
            {activeTab === 'vigenere' && <VigenereView />}
            {activeTab === 'hill' && <HillView />}
            {activeTab === 'playfair' && <PlayfairView />}
            {activeTab === 'railfence' && <RailFenceView />}
            {activeTab === 'columnar' && <ColumnarView />}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
