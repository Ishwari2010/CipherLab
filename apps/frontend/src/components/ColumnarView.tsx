import { BaseCipherUI } from './BaseCipherUI';
import { ToggleOption } from './ToggleOption';
import { columnarEncrypt, columnarDecrypt } from '@cipherlab/shared';
import type { ColumnarOptions } from '@cipherlab/shared';

export function ColumnarView() {
    return (
        <BaseCipherUI
            cipherId="columnar"
            name="Columnar Transposition"
            defaultOptions={{ keyword: 'CIPHER', doubleTransposition: false, fillerChar: 'X' }}
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
                            className="w-32 p-2 rounded border border-purple-200 bg-white/50 focus:ring-2 focus:ring-purple-400 outline-none transition-colors uppercase placeholder-purple-300"
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
                            className="w-16 p-2 rounded border border-purple-200 bg-white/50 focus:ring-2 focus:ring-purple-400 outline-none transition-colors text-center uppercase"
                        />
                    </div>
                    <div className="flex flex-col space-y-3 sm:pt-1">
                        <ToggleOption
                            label="Double Transposition"
                            checked={options.doubleTransposition}
                            onChange={checked => setOptions({ ...options, doubleTransposition: checked })}
                            tooltip="Applies the transposition a second time using the same key."
                        />
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
                    <div className="mt-4 p-4 rounded-md border border-purple-200 bg-white/50 overflow-x-auto w-fit">
                        <h4 className="text-xs text-purple-600 uppercase tracking-wider mb-2 font-semibold">Columnar Grid (First Pass)</h4>
                        <div className="flex flex-col">
                            <div className="flex space-x-2 mb-1 border-b pb-1 border-purple-100 font-bold text-purple-800">
                                {keyword.split('').map((c: string, i: number) => (
                                    <div key={i} className="w-6 text-center">{c}</div>
                                ))}
                            </div>
                            <div className="flex space-x-2 mb-2 border-b pb-1 border-purple-100 text-xs text-purple-500">
                                {displayOrder.map((o: number, i: number) => (
                                    <div key={i} className="w-6 text-center">{o}</div>
                                ))}
                            </div>
                            {grid.map((row: string[], r: number) => (
                                <div key={r} className="flex space-x-2 mb-1 font-mono">
                                    {row.map((char: string, c: number) => (
                                        <div key={c} className="w-6 text-center">{char || 'X'}</div>
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
