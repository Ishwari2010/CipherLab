
import { BaseCipherUI } from './BaseCipherUI';
import { hillEncrypt, hillDecrypt } from '@cryptiq/shared';
import { determinant, mod, gcd } from '@cryptiq/shared/src/utils/matrix';
import type { HillOptions } from '@cryptiq/shared';

export function HillView() {
    const defaultMatrix = [[3, 3], [2, 5]];

    return (
        <BaseCipherUI
            cipherId="hill"
            name="Hill Cipher"
            defaultOptions={{ keyMatrix: defaultMatrix }}
            clientEncrypt={(pt, opts) => hillEncrypt(pt, opts as HillOptions)}
            clientDecrypt={(ct, opts) => hillDecrypt(ct, opts as HillOptions)}
            validateOptions={(opts) => {
                const matrix = opts.keyMatrix as number[][];
                const n = matrix.length;
                if (n < 2) return "Matrix must be at least 2x2.";
                if (!matrix.every(row => row.length === n)) return "Key matrix must be square.";

                // Check determinant for invertibility mod 26
                const det = mod(determinant(matrix), 26);
                if (gcd(det, 26) !== 1) {
                    return `Key matrix is not invertible modulo 26 (Determinant ${det} is not coprime with 26).`;
                }
                return null;
            }}
            renderOptions={(options, setOptions) => {
                const matrix = options.keyMatrix as number[][];
                const n = matrix.length;

                const updateMatrixSize = (newN: number) => {
                    const newMat = Array(newN).fill(0).map((_, r) => Array(newN).fill(0).map((_, c) => r < n && c < n ? matrix[r][c] : 1));
                    setOptions({ ...options, keyMatrix: newMat });
                };

                const updateCell = (r: number, c: number, val: number) => {
                    const newMat = matrix.map((row, i) => row.map((cell, j) => i === r && j === c ? val : cell));
                    setOptions({ ...options, keyMatrix: newMat });
                };

                return (
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Matrix Size (NxN)</label>
                            <input
                                type="number"
                                min="2" max="6"
                                value={n}
                                onChange={e => updateMatrixSize(parseInt(e.target.value) || 2)}
                                className="w-16 p-2 rounded border border-purple-200 bg-white/50 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Key Matrix</label>
                            <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
                                {matrix.map((row, r) => row.map((cell, c) => (
                                    <input
                                        key={`${r}-${c}`}
                                        type="number"
                                        value={cell}
                                        onChange={e => updateCell(r, c, parseInt(e.target.value) || 0)}
                                        className="w-12 h-12 text-center rounded border border-purple-200 bg-white/50 focus:ring-2 focus:ring-purple-400 outline-none transition-colors font-mono text-gray-900"
                                    />
                                )))}
                            </div>
                        </div>
                    </div>
                );
            }}
        />
    );
}
