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
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{name}</h2>
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                    {!isLocalOnly && (
                        <label className="text-sm cursor-pointer flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                            <input type="checkbox" checked={useLocalMode} onChange={(e) => setUseLocalMode(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600" />
                            <span className="font-medium">Local Mode</span>
                        </label>
                    )}
                    {isLocalOnly && (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                            Privacy Mode (Local)
                        </span>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Input Text</label>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-inner"
                        rows={5}
                        placeholder="Enter text here to encrypt or decrypt..."
                    ></textarea>
                </div>

                <div className="p-5 rounded-xl bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xs uppercase tracking-wider font-bold mb-4 text-gray-500 dark:text-gray-400 flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        Configuration Options
                    </h3>
                    {renderOptions(options, setOptions)}
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-700 dark:text-red-400 rounded-lg text-sm font-medium flex items-start">
                        <svg className="w-5 h-5 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>{error}</span>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <button
                        onClick={() => handleAction('encrypt')}
                        className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-sm focus:ring-4 focus:ring-blue-500/30"
                    >
                        Encrypt
                    </button>
                    <button
                        onClick={() => handleAction('decrypt')}
                        className="flex-1 sm:flex-none px-8 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg font-semibold shadow-sm focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700"
                    >
                        Decrypt
                    </button>
                    {result && (
                        <button
                            onClick={() => setShowSteps(!showSteps)}
                            className="mt-4 sm:mt-0 sm:ml-auto px-6 py-3 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 border border-purple-200 dark:border-purple-800/50 transition-colors rounded-lg font-medium flex items-center justify-center focus:ring-4 focus:ring-purple-500/30"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {showSteps ? 'Hide Logic Steps' : 'Explain Logic Steps'}
                        </button>
                    )}
                </div>
            </div>

            {result && (
                <div className="mt-10 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                            Output Result
                            <button
                                onClick={() => navigator.clipboard.writeText(result.ciphertext || result.plaintext)}
                                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                            >
                                <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                Copy to Clipboard
                            </button>
                        </label>
                        <div className="p-4 md:p-6 rounded-xl bg-[#0f172a] text-[#38bdf8] font-mono text-lg break-all min-h-[5rem] border border-gray-800 shadow-inner overflow-x-auto leading-relaxed">
                            {result.ciphertext || result.plaintext}
                        </div>
                    </div>

                    {renderVisualization && renderVisualization(result)}

                    {showSteps && (
                        <div className="p-5 md:p-6 rounded-xl border border-purple-200 dark:border-purple-800/50 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10">
                            <h3 className="font-bold flex items-center mb-4 text-purple-900 dark:text-purple-300 uppercase tracking-wider text-xs">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                Execution Trace Log
                            </h3>
                            <ul className="space-y-2">
                                {result.steps.map((step, i) => (
                                    <li key={i} className="flex text-sm text-gray-800 dark:text-gray-200 font-mono items-baseline bg-white/60 dark:bg-gray-900/40 px-3 py-2 rounded border border-purple-100 dark:border-purple-800/30">
                                        <span className="text-purple-500 min-w-8 opacity-60 font-medium">{(i + 1).toString().padStart(2, '0')}</span>
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
