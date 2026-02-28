export interface CipherGuess {
    cipher: string;
    confidence: number;
    notes: string[];
}
export declare function analyzeFrequency(text: string): Record<string, number>;
export declare function calculateChiSquare(actualFreqs: Record<string, number>): number;
export declare function guessCipher(ciphertext: string): CipherGuess[];
