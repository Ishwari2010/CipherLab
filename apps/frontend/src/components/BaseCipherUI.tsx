import React, { useState } from 'react';
import type { CipherResult } from '@cipherlab/shared';

// API Client for server mode
async function callApi(endpoint: string, payload: any) {
    const res = await fetch(`http://localhost:3000/api/v1/cipher/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'API Error');
    return data;
}

export interface CipherUIProps {
    cipherId: string;
    name: string;
    renderOptions: (options: any, setOptions: (o: any) => void) => React.ReactNode;
    defaultOptions: any;
    clientEncrypt: (pt: string, opts: any) => CipherResult;
    clientDecrypt: (ct: string, opts: any) => CipherResult;
    renderVisualization?: (result: CipherResult) => React.ReactNode;
}

export function BaseCipherUI({ cipherId, name, renderOptions, defaultOptions, clientEncrypt, clientDecrypt, renderVisualization }: CipherUIProps) {
    const [inputText, setInputText] = useState('');
    const [options, setOptions] = useState(defaultOptions);
    const [result, setResult] = useState<CipherResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [useLocalMode, setUseLocalMode] = useState(true);
    const [showSteps, setShowSteps] = useState(false);

    const isLocalOnly = import.meta.env.VITE_LOCAL_ONLY === 'true';

    const handleAction = async (action: 'encrypt' | 'decrypt') => {
        setError(null);
        setResult(null);
        try {
            if (isLocalOnly || useLocalMode) {
                // Run locally
                const res = action === 'encrypt' ? clientEncrypt(inputText, options) : clientDecrypt(inputText, options);
                setResult(res);
            } else {
                // Run on server
                const payload = {
                    cipher: cipherId,
                    [action === 'encrypt' ? 'plaintext' : 'ciphertext']: inputText,
                    options
                };
                const res = await callApi(action, payload);
                setResult(res);
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during processing.');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{name}</h2>
                <div className="flex items-center space-x-2">
                    {!isLocalOnly && (
                        <label className="text-sm cursor-pointer flex items-center space-x-2">
                            <input type="checkbox" checked={useLocalMode} onChange={(e) => setUseLocalMode(e.target.checked)} className="rounded" />
                            <span>Local Mode</span>
                        </label>
                    )}
                    {isLocalOnly && (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">Privacy Mode (Local Only)</span>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Input Text</label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        rows={4}
                        placeholder="Enter text here..."
                    ></textarea>
                </div>

                <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-semibold mb-3">Options</h3>
                    {renderOptions(options, setOptions)}
                </div>

                {error && (
                    <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    <button onClick={() => handleAction('encrypt')} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition shadow-sm">Encrypt</button>
                    <button onClick={() => handleAction('decrypt')} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition rounded-md font-medium">Decrypt</button>
                    {result && (
                        <button onClick={() => setShowSteps(!showSteps)} className="px-6 py-2 bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/60 transition rounded-md font-medium ml-auto">
                            {showSteps ? 'Hide Steps' : 'Explain Steps'}
                        </button>
                    )}
                </div>
            </div>

            {result && (
                <div className="mt-8 space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">Result</h3>
                        <div className="p-4 rounded-md bg-gray-50 flex justify-between items-center dark:bg-gray-900 font-mono text-lg break-all min-h-[60px] border border-gray-200 dark:border-gray-700">
                            <span>{result.ciphertext || result.plaintext}</span>
                            <button onClick={() => navigator.clipboard.writeText(result.ciphertext || result.plaintext)} className="ml-4 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">Copy</button>
                        </div>
                    </div>

                    {renderVisualization && renderVisualization(result)}

                    {showSteps && (
                        <div className="p-4 rounded-md border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800/50">
                            <h3 className="font-semibold mb-2 text-purple-800 dark:text-purple-300">Step-by-step Execution</h3>
                            <ul className="list-decimal pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300 font-mono">
                                {result.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
