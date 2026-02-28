import React from 'react';
import { BaseCipherUI } from './BaseCipherUI';
import { caesarEncrypt, caesarDecrypt, CaesarOptions } from '@cipherlab/shared';

export function CaesarView() {
    return (
        <BaseCipherUI
            cipherId="caesar"
            name="Caesar Cipher"
            defaultOptions={{ shift: 3, preserveCase: true, stripPunctuation: false }}
            clientEncrypt={(pt, opts) => caesarEncrypt(pt, opts as CaesarOptions)}
            clientDecrypt={(ct, opts) => caesarDecrypt(ct, opts as CaesarOptions)}
            renderOptions={(options, setOptions) => (
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-6">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Shift Amount (0-25)</label>
                        <input
                            type="number"
                            min="0" max="25"
                            value={options.shift}
                            onChange={e => setOptions({ ...options, shift: parseInt(e.target.value) || 0 })}
                            className="w-24 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        />
                    </div>
                    <div className="flex space-x-4 pt-4">
                        <label className="flex items-center space-x-2 text-sm">
                            <input
                                type="checkbox"
                                checked={options.preserveCase}
                                onChange={e => setOptions({ ...options, preserveCase: e.target.checked })}
                            />
                            <span>Preserve Case</span>
                        </label>
                        <label className="flex items-center space-x-2 text-sm">
                            <input
                                type="checkbox"
                                checked={options.stripPunctuation}
                                onChange={e => setOptions({ ...options, stripPunctuation: e.target.checked })}
                            />
                            <span>Strip Punctuation</span>
                        </label>
                    </div>
                </div>
            )}
        />
    );
}
