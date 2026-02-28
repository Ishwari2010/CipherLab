import React from 'react';
import { BaseCipherUI } from './BaseCipherUI';
import { columnarEncrypt, columnarDecrypt, ColumnarOptions } from '@cipherlab/shared';

export function ColumnarView() {
    return (
        <BaseCipherUI
            cipherId="columnar"
            name="Columnar Transposition"
            defaultOptions={{ keyword: 'CIPHER', doubleTransposition: false, fillerChar: '' }}
            clientEncrypt={(pt, opts) => columnarEncrypt(pt, opts as ColumnarOptions)}
            clientDecrypt={(ct, opts) => columnarDecrypt(ct, opts as ColumnarOptions)}
            renderOptions={(options, setOptions) => (
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-6">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Keyword</label>
                        <input
                            type="text"
                            value={options.keyword}
                            onChange={e => setOptions({ ...options, keyword: e.target.value.toUpperCase() })}
                            className="w-32 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 uppercase"
                            placeholder="e.g. SECRET"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Filler Char</label>
                        <input
                            type="text"
                            maxLength={1}
                            value={options.fillerChar}
                            onChange={e => setOptions({ ...options, fillerChar: e.target.value.toUpperCase() })}
                            className="w-16 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-center uppercase"
                        />
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                        <input
                            type="checkbox"
                            checked={options.doubleTransposition}
                            onChange={e => setOptions({ ...options, doubleTransposition: e.target.checked })}
                        />
                        <span className="text-sm">Double Transposition</span>
                    </div>
                </div>
            )}
            renderVisualization={(result) => {
                const grid = result.meta?.grid;
                const keyword = result.meta?.keyword;
                if (!grid || !keyword) return null;

                const order = keyword.split('').map((char: string, originalIndex: number) => ({ char, originalIndex }))
                    .sort((a: any, b: any) => a.char === b.char ? a.originalIndex - b.originalIndex : a.char.localeCompare(b.char))
                    .map((c: any) => c.originalIndex);

                const displayOrder = Array(keyword.length).fill(0);
                order.forEach((origIdx: number, readSeq: number) => {
                    displayOrder[origIdx] = readSeq + 1;
                });

                return (
                    <div className="mt-4 p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-x-auto w-fit">
                        <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Columnar Grid (First Pass)</h4>
                        <div className="flex flex-col">
                            <div className="flex space-x-2 mb-1 border-b pb-1 dark:border-gray-700 font-bold text-purple-600 dark:text-purple-400">
                                {keyword.split('').map((c: string, i: number) => (
                                    <div key={i} className="w-6 text-center">{c}</div>
                                ))}
                            </div>
                            <div className="flex space-x-2 mb-2 border-b pb-1 dark:border-gray-700 text-xs text-gray-500">
                                {displayOrder.map((o: number, i: number) => (
                                    <div key={i} className="w-6 text-center">{o}</div>
                                ))}
                            </div>
                            {grid.map((row: string[], r: number) => (
                                <div key={r} className="flex space-x-2 mb-1 font-mono">
                                    {row.map((char: string, c: number) => (
                                        <div key={c} className="w-6 text-center">{char || '-'}</div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }}
        />
    );
}
