
import { BaseCipherUI } from './BaseCipherUI';
import { railFenceEncrypt, railFenceDecrypt } from '@cipherlab/shared';
import type { RailFenceOptions } from '@cipherlab/shared';

export function RailFenceView() {
    return (
        <BaseCipherUI
            cipherId="railfence"
            name="Rail Fence Cipher"
            defaultOptions={{ rails: 3, offset: 0 }}
            clientEncrypt={(pt, opts) => railFenceEncrypt(pt, opts as RailFenceOptions)}
            clientDecrypt={(ct, opts) => railFenceDecrypt(ct, opts as RailFenceOptions)}
            renderOptions={(options, setOptions) => (
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-6">
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Rails</label>
                        <input
                            type="number"
                            min="2" max="20"
                            value={options.rails}
                            onChange={e => setOptions({ ...options, rails: parseInt(e.target.value) || 2 })}
                            className="w-24 p-2 rounded border border-purple-200 bg-white/50 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Offset</label>
                        <input
                            type="number"
                            min="0"
                            value={options.offset}
                            onChange={e => setOptions({ ...options, offset: parseInt(e.target.value) || 0 })}
                            className="w-24 p-2 rounded border border-purple-200 bg-white/50 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                        />
                    </div>
                </div>
            )}
            renderVisualization={(result, mode) => {
                const textLength = result.plaintext?.length || result.ciphertext?.length || 0;
                if (!textLength) return null;

                const rails = result.meta?.rails || 2;
                const offset = result.meta?.offset || 0;
                const cycle = 2 * rails - 2;

                if (mode === 'encrypt') {
                    // Build zig-zag grid by placing plaintext diagonally
                    let tableGrid: string[][] = Array(rails).fill(null).map(() => Array(textLength).fill(''));
                    const pt = result.plaintext || '';
                    for (let i = 0; i < textLength; i++) {
                        const eff = (i + offset) % cycle;
                        const belongsToRow = eff < rails ? eff : cycle - eff;
                        tableGrid[belongsToRow][i] = pt[i] || '';
                    }

                    return (
                        <div className="mt-4 p-4 rounded-md border border-purple-200 bg-white/50 overflow-x-auto">
                            <h4 className="text-xs text-purple-600 uppercase tracking-wider mb-2 font-semibold">
                                Rail Fence Zig-Zag Grid (Encryption)
                            </h4>
                            <table className="border-collapse">
                                <tbody>
                                    {tableGrid.map((row: string[], r: number) => (
                                        <tr key={r}>
                                            {row.map((char: string, i: number) => (
                                                <td
                                                    key={i}
                                                    className={`border border-gray-300 text-center align-middle w-8 h-8 font-semibold font-mono ${char ? 'bg-gray-50 text-purple-800 text-base' : ''}`}
                                                >
                                                    {char}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );

                } else {
                    // mode === 'decrypt'
                    const ct = result.ciphertext || '';

                    // 1. Calculate rail lengths internally
                    const railLengths = Array(rails).fill(0);
                    for (let i = 0; i < textLength; i++) {
                        const eff = (i + offset) % cycle;
                        const belongsToRow = eff < rails ? eff : cycle - eff;
                        railLengths[belongsToRow]++;
                    }

                    // 2. Slice ciphertext horizontally per rail (internal reconstruction step)
                    const horizontalSlices: string[][] = [];
                    let ctIndex = 0;
                    for (let r = 0; r < rails; r++) {
                        const segment = ct.substring(ctIndex, ctIndex + railLengths[r]);
                        horizontalSlices.push(segment.split(''));
                        ctIndex += railLengths[r];
                    }

                    // 3. Reconstruct full zig-zag matrix for render output
                    let finalGrid: string[][] = Array(rails).fill(null).map(() => Array(textLength).fill(''));
                    const railPointers = Array(rails).fill(0);

                    for (let i = 0; i < textLength; i++) {
                        const eff = (i + offset) % cycle;
                        const belongsToRow = eff < rails ? eff : cycle - eff;

                        // Shift next character from the respective horizontal row back into zig-zag topology
                        finalGrid[belongsToRow][i] = horizontalSlices[belongsToRow][railPointers[belongsToRow]] || '';
                        railPointers[belongsToRow]++;
                    }

                    return (
                        <div className="mt-4 p-4 rounded-md border border-purple-200 bg-white/50 overflow-x-auto">
                            <h4 className="text-xs text-purple-600 uppercase tracking-wider mb-2 font-semibold">
                                Rail Fence Reconstructed Grid (Decryption)
                            </h4>
                            <table className="border-collapse">
                                <tbody>
                                    {finalGrid.map((row, r) => (
                                        <tr key={r}>
                                            {row.map((char, i) => (
                                                <td
                                                    key={`fin-${r}-${i}`}
                                                    className={`border border-gray-300 text-center align-middle w-8 h-8 font-semibold font-mono ${char ? 'bg-gray-50 text-purple-800 text-base' : ''}`}
                                                >
                                                    {char}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }
            }}
        />
    );
}
