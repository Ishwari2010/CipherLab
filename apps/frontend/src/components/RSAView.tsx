import { useState } from 'react';
import type { RSAResult } from '@cryptiq/shared';
import { rsaProcess } from '@cryptiq/shared';
import { CipherInfoPanel } from './CipherInfoPanel';

export function RSAView() {
    const [p, setP] = useState<string>('61');
    const [q, setQ] = useState<string>('53');
    const [e, setE] = useState<string>('17');
    const [m, setM] = useState<string>('65');

    const [result, setResult] = useState<RSAResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        setResult(null);
        try {
            // Convert input values to BigInt before passing them to the function (as requested)
            const pBig = BigInt(p);
            const qBig = BigInt(q);
            const eBig = BigInt(e);
            const mBig = BigInt(m);

            const res = rsaProcess(pBig, qBig, eBig, mBig);
            setResult(res);
        } catch (err: any) {
            setError(err.message || 'An error occurred during calculation. Ensure all inputs are valid integers.');
        }
    };

    return (
        <div className="w-full bg-white shadow-lg rounded-2xl border border-purple-100 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-5 pb-3 border-b border-purple-50">
                <h2 className="text-2xl font-semibold text-purple-800 tracking-tight">RSA Algorithm</h2>
            </div>

            <div className="flex flex-col md:flex-row gap-6 lg:gap-8">
                {/* Left Column (Inputs & Config) */}
                <div className="flex flex-col w-full md:w-[45%] lg:w-[40%] relative min-h-full space-y-4">
                    <div className="bg-purple-50/50 p-5 rounded-lg border border-purple-100 space-y-4">
                        <h3 className="text-sm font-semibold mb-2 text-purple-800">
                            Mathematical Parameters
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prime (p)</label>
                                <input
                                    type="number"
                                    value={p}
                                    onChange={(ev) => setP(ev.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                                    placeholder="e.g. 61"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Prime (q)</label>
                                <input
                                    type="number"
                                    value={q}
                                    onChange={(ev) => setQ(ev.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                                    placeholder="e.g. 53"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Public Exponent (e)</label>
                                <input
                                    type="number"
                                    value={e}
                                    onChange={(ev) => setE(ev.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                                    placeholder="e.g. 17"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Message (m)</label>
                                <input
                                    type="number"
                                    value={m}
                                    onChange={(ev) => setM(ev.target.value)}
                                    className="w-full p-2.5 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none transition-colors"
                                    placeholder="Integer"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-6 pt-4 pb-2">
                        <button
                            onClick={handleCalculate}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Execute RSA Cycle
                        </button>
                    </div>
                </div>

                {/* Right Column (Execution Trace) */}
                <div className="flex flex-col w-full md:w-[55%] lg:w-[60%] border-t md:border-t-0 md:border-l border-purple-100 pt-6 md:pt-0 md:pl-6 lg:pl-8">
                    <h3 className="text-xl font-semibold mb-4 text-purple-800 flex items-center">
                        Execution Trace
                    </h3>

                    {result && result.steps ? (
                        <div className="p-4 sm:p-5 rounded-xl border border-purple-100 bg-purple-50/30 overflow-y-auto" style={{ maxHeight: '600px' }}>
                            <div className="space-y-4">
                                {result.steps.map((step, i) => (
                                    <div key={i} className="p-4 bg-white rounded-lg border border-purple-100 shadow-sm flex flex-col sm:flex-row gap-4 transition-all hover:shadow-md">
                                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2 border-purple-200 bg-purple-50 text-purple-700 font-bold text-sm">
                                            {step.stepNumber}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="font-semibold text-purple-900 text-base mb-2">
                                                {step.title}
                                            </h4>
                                            <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap break-words">
                                                {step.explanation}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] p-8 rounded-xl border border-dashed border-purple-200 bg-purple-50/30 text-center">
                            <div className="w-16 h-16 mb-4 rounded-full bg-purple-100 flex items-center justify-center text-purple-300">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h4 className="text-purple-800 font-medium mb-2">No Trace Available</h4>
                            <p className="text-purple-400 text-sm max-w-xs">
                                Enter parameters and execute to see the mathematical trace step-by-step.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Cipher Info Panel */}
            <CipherInfoPanel cipherId="rsa" />
        </div>
    );
}
