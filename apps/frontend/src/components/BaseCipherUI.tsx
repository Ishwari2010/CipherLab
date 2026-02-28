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
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">{name}</h2>
                <div className="flex items-center">
                    {!isLocalOnly && (
                        <label className="text-sm cursor-pointer flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <input type="checkbox" checked={useLocalMode} onChange={(e) => setUseLocalMode(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
                            <span className="font-medium">Run Locally</span>
                        </label>
                    )}
                    {isLocalOnly && (
                        <span className="text-sm text-green-600 dark:text-green-500 font-medium">
                            Privacy Mode (Local)
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Input Text</label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-y text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
                        rows={5}
                        placeholder="Enter text here to encrypt or decrypt..."
                    ></textarea>
                </div>

                <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                    <h3 className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Configuration Options
                    </h3>
                    {renderOptions(options, setOptions)}
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        onClick={() => handleAction('encrypt')}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Encrypt
                    </button>
                    <button
                        onClick={() => handleAction('decrypt')}
                        className="px-6 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg font-medium shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Decrypt
                    </button>
                    {result && (
                        <button
                            onClick={() => setShowSteps(!showSteps)}
                            className="mt-4 sm:mt-0 sm:ml-auto px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg font-medium"
                        >
                            {showSteps ? 'Hide Execution Steps' : 'Show Execution Steps'}
                        </button>
                    )}
                </div>
            </div>

            {result && (
                <div className="mt-8 space-y-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Output Result
                            </label>
                            <button
                                onClick={() => navigator.clipboard.writeText(result.ciphertext || result.plaintext)}
                                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-medium px-2 py-1 rounded transition-colors"
                            >
                                Copy Output
                            </button>
                        </div>
                        <div data-testid="cipher-output" className="p-4 rounded-lg bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-mono text-base break-all min-h-[4rem] border border-gray-200 dark:border-gray-800">
                            {result.ciphertext || result.plaintext}
                        </div>
                    </div>

                    {renderVisualization && renderVisualization(result)}

                    {showSteps && (
                        <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                            <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                                Execution Trace
                            </h3>
                            <ul className="space-y-1.5">
                                {result.steps.map((step, i) => (
                                    <li key={i} className="flex text-sm text-gray-600 dark:text-gray-400 font-mono">
                                        <span className="text-gray-400 dark:text-gray-500 min-w-[2rem] font-medium">{(i + 1).toString().padStart(2, '0')}</span>
                                        <span>{step}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
