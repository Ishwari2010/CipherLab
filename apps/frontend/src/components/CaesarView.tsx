import React from 'react';
import { BaseCipherUI } from './BaseCipherUI';
import { ToggleOption } from './ToggleOption';
import { caesarEncrypt, caesarDecrypt } from '@cipherlab/shared';
import type { CaesarOptions } from '@cipherlab/shared';

export function CaesarView() {
    return (
        <BaseCipherUI
            cipherId="caesar"
            name="Caesar Cipher"
            defaultOptions={{ shift: 3, preserveCase: true, stripPunctuation: false }}
            clientEncrypt={(pt, opts) => caesarEncrypt(pt, opts as CaesarOptions)}
            clientDecrypt={(ct, opts) => caesarDecrypt(ct, opts as CaesarOptions)}
            renderOptions={(options, setOptions) => (
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shift Amount (0-25)</label>
                        <input
                            type="number"
                            min="0" max="25"
                            value={options.shift}
                            onChange={e => setOptions({ ...options, shift: parseInt(e.target.value) || 0 })}
                            className="w-24 p-2 rounded-lg border border-purple-200 bg-white/50 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                        />
                    </div>
                    <div className="flex flex-col space-y-3 sm:pt-1">
                        <ToggleOption
                            label="Preserve Case"
                            checked={options.preserveCase}
                            onChange={checked => setOptions({ ...options, preserveCase: checked })}
                            tooltip="Keeps uppercase and lowercase letters unchanged during encryption."
                        />
                        <ToggleOption
                            label="Strip Punctuation"
                            checked={options.stripPunctuation}
                            onChange={checked => setOptions({ ...options, stripPunctuation: checked })}
                            tooltip="Removes punctuation before processing the cipher."
                        />
                    </div>
                </div>
            )}
        />
    );
}
