import React from 'react';
import { BaseCipherUI } from './BaseCipherUI';
import { vigenereEncrypt, vigenereDecrypt, VigenereOptions } from '@cipherlab/shared';

export function VigenereView() {
    return (
        <BaseCipherUI
            cipherId="vigenere"
            name="Vigenère Cipher"
            defaultOptions={{ key: 'LEMON', variant: 'classic', preserveCase: true, stripPunctuation: false }}
            clientEncrypt={(pt, opts) => vigenereEncrypt(pt, opts as VigenereOptions)}
            clientDecrypt={(ct, opts) => vigenereDecrypt(ct, opts as VigenereOptions)}
            renderOptions={(options, setOptions) => (
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-6">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Keyword</label>
                        <input
                            type="text"
                            value={options.key}
                            onChange={e => setOptions({ ...options, key: e.target.value })}
                            className="w-32 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 uppercase"
                            placeholder="e.g. KEYWORDS"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Variant</label>
                        <select
                            value={options.variant}
                            onChange={e => setOptions({ ...options, variant: e.target.value })}
                            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                        >
                            <option value="classic">Classic (Repeating)</option>
                            <option value="autokey">Autokey</option>
                        </select>
                    </div>
                </div>
            )}
        />
    );
}
