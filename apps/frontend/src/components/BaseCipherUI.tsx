import { useState } from 'react';
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
    renderVisualization?: (result: CipherResult, mode: 'encrypt' | 'decrypt') => React.ReactNode;
}

export function BaseCipherUI({ cipherId, name, renderOptions, defaultOptions, clientEncrypt, clientDecrypt, renderVisualization }: CipherUIProps) {
    const [inputText, setInputText] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [options, setOptions] = useState(defaultOptions);
    const [result, setResult] = useState<CipherResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [useLocalMode] = useState(true);
    const [showSteps, setShowSteps] = useState(false);

    const [outputText, setOutputText] = useState('');
    const [lastAction, setLastAction] = useState<'encrypt' | 'decrypt' | null>(null);
    const [isInputModified, setIsInputModified] = useState(false);

    const isLocalOnly = import.meta.env.VITE_LOCAL_ONLY === 'true';

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInputText(value);
        setIsInputModified(true);
        if (value.trim() === '') {
            setValidationError(null);
        } else if (!/^[A-Za-z\s]*$/.test(value)) {
            setValidationError("Only alphabetic characters are allowed for classical ciphers.");
        } else {
            setValidationError(null);
        }
    };

    const handleAction = async (action: 'encrypt' | 'decrypt') => {
        let textToProcess = inputText;

        if (action === 'decrypt') {
            if (lastAction === 'encrypt' && outputText !== '' && !isInputModified) {
                textToProcess = outputText;
                setInputText(outputText);
            }
        }

        if (textToProcess.trim() === '') {
            setValidationError('Please enter text before processing.');
            return;
        }
        if (validationError && isInputModified) {
            return;
        }

        setError(null);
        setResult(null);
        try {
            let res: CipherResult;
            if (isLocalOnly || useLocalMode) {
                // Run locally
                res = action === 'encrypt' ? clientEncrypt(textToProcess, options) : clientDecrypt(textToProcess, options);
            } else {
                // Run on server
                const payload = {
                    cipher: cipherId,
                    [action === 'encrypt' ? 'plaintext' : 'ciphertext']: textToProcess,
                    options
                };
                res = await callApi(action, payload);
            }
            setResult(res);
            setLastAction(action);
            setIsInputModified(false);

            if (action === 'encrypt') {
                setOutputText(res.ciphertext || res.plaintext || '');
            } else {
                setOutputText(res.plaintext || res.ciphertext || '');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during processing.');
        }
    };

    return (
        <div className="w-full bg-white shadow-lg rounded-2xl border border-purple-100 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-3 pb-3 border-b border-purple-50">
                <h2 className="text-2xl font-semibold text-purple-800 tracking-tight">{name}</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-purple-800 mb-2">Input Text</label>
                    <textarea
                        value={inputText}
                        onChange={handleInputChange}
                        className={`w-full min-h-[120px] p-4 rounded-xl border ${validationError ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-purple-200 focus:ring-purple-400 focus:border-purple-400'} bg-white/50 backdrop-blur-sm focus:ring-2 outline-none transition-all duration-200 resize-y text-gray-800 placeholder-purple-300 shadow-inner`}
                        rows={6}
                        placeholder="Enter text here to encrypt or decrypt..."
                    ></textarea>
                    {validationError && (
                        <p className="text-red-500 text-sm mt-2">{validationError}</p>
                    )}
                </div>

                <div className="p-5 rounded-lg bg-purple-50/50 border border-purple-100">
                    <h3 className="text-sm font-semibold mb-4 text-purple-800">
                        Configuration Options
                    </h3>
                    {renderOptions(options, setOptions)}
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        onClick={() => handleAction('encrypt')}
                        className={`flex-1 py-3 bg-purple-400 text-white rounded-lg font-medium transition-all duration-200 shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${(inputText.trim() === '' || !!validationError) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500'}`}
                    >
                        Encrypt
                    </button>
                    <button
                        onClick={() => handleAction('decrypt')}
                        className={`flex-1 py-3 bg-blue-300 text-white border-none transition-all duration-200 rounded-lg font-medium shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${(inputText.trim() === '' || !!validationError) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400'}`}
                    >
                        Decrypt
                    </button>
                    {result && (
                        <button
                            onClick={() => setShowSteps(!showSteps)}
                            className="px-4 py-3 text-sm text-purple-600 hover:text-purple-800 bg-transparent transition-colors rounded-lg font-medium"
                        >
                            {showSteps ? 'Hide Execution Steps' : 'Show Execution Steps'}
                        </button>
                    )}
                </div>
            </div>

            {result && (
                <div className="mt-5 space-y-5 pt-6 border-t border-purple-50">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-purple-800">
                                Output Result
                            </label>
                            <button
                                onClick={() => navigator.clipboard.writeText(outputText)}
                                className="text-xs text-blue-500 hover:text-blue-700 font-medium px-2 py-1 rounded transition-colors"
                            >
                                Copy Output
                            </button>
                        </div>
                        <div data-testid="cipher-output" className="p-5 rounded-xl bg-white border border-purple-100 text-purple-900 shadow-inner font-mono text-base break-all min-h-[5rem] transition-all duration-200">
                            {outputText}
                        </div>
                    </div>

                    {renderVisualization && renderVisualization(result, lastAction || 'encrypt')}

                    {showSteps && (
                        <div className="p-4 rounded-lg border border-purple-100 bg-white/50">
                            <h3 className="text-sm font-semibold mb-3 text-purple-800">
                                Execution Trace
                            </h3>
                            <ul className="space-y-1.5">
                                {result.steps.map((step, i) => (
                                    <li key={i} className="flex text-sm text-gray-600 font-mono">
                                        <span className="text-purple-300 min-w-[2rem] font-medium">{(i + 1).toString().padStart(2, '0')}</span>
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
