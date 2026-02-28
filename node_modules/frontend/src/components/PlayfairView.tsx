import React from 'react';
import { BaseCipherUI } from './BaseCipherUI';
import { playfairEncrypt, playfairDecrypt } from '@cipherlab/shared';
import type { PlayfairOptions } from '@cipherlab/shared';

export function PlayfairView() {
    return (
        <BaseCipherUI
            cipherId="playfair"
            name="Playfair Cipher"
            defaultOptions={{ key: 'PLAYFAIR', fillerChar: 'X' }}
            clientEncrypt={(pt, opts) => playfairEncrypt(pt, opts as PlayfairOptions)}
            clientDecrypt={(ct, opts) => playfairDecrypt(ct, opts as PlayfairOptions)}
            renderOptions={(options, setOptions) => (
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-6">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Keyword</label>
                        <input
                            type="text"
                            value={options.key}
                            onChange={e => setOptions({ ...options, key: e.target.value })}
                            className="w-48 p-2 rounded border border-purple-200 bg-white/50 focus:ring-2 focus:ring-purple-400 outline-none transition-colors uppercase placeholder-purple-300"
                            placeholder="e.g. SECRETS"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Filler Char</label>
                        <input
                            type="text"
                            maxLength={1}
                            value={options.fillerChar}
                            onChange={e => setOptions({ ...options, fillerChar: e.target.value.toUpperCase() })}
                            className="w-16 p-2 rounded border border-purple-200 bg-white/50 focus:ring-2 focus:ring-purple-400 outline-none transition-colors text-center uppercase"
                        />
                    </div>
                </div>
            )}
            renderVisualization={(result) => {
                const grid = result.meta?.grid;
                if (!grid) return null;

                return (
                    <div className="mt-4 p-4 rounded-md border border-purple-200 bg-white/50 w-fit">
                        <h4 className="text-xs text-purple-600 uppercase tracking-wider mb-2 font-semibold">Generated 5x5 Grid</h4>
                        <div className="inline-grid grid-cols-5 gap-1">
                            {grid.map((row: string[], r: number) => row.map((char: string, c: number) => (
                                <div key={`${r}-${c}`} className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded font-mono font-bold text-purple-800">
                                    {char}
                                </div>
                            )))}
                        </div>
                    </div>
                );
            }}
        />
    );
}
