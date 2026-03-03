export interface Step {
    stepNumber: number;
    title: string;
    explanation: string;
}

export interface CipherResult {
    ciphertext: string;
    plaintext: string;
    steps: Step[];
    meta?: any;
}
