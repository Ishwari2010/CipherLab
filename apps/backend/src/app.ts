import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {
    caesarEncrypt, caesarDecrypt,
    vigenereEncrypt, vigenereDecrypt,
    hillEncrypt, hillDecrypt,
    playfairEncrypt, playfairDecrypt,
    railFenceEncrypt, railFenceDecrypt,
    columnarEncrypt, columnarDecrypt
} from '@cipherlab/shared';
import { guessCipher } from '@cipherlab/shared/src/utils/heuristics';

import rateLimit from 'express-rate-limit';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '100kb' })); // Request size limits to prevent abuse

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false,
});

const guessLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20, // Stricter limit for CPU intensive heuristics
    message: { error: 'Too many analysis requests from this IP, please try again after 15 minutes' },
});

app.use('/api/', apiLimiter);

app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

type CipherType = 'caesar' | 'vigenere' | 'hill' | 'playfair' | 'railfence' | 'columnar';

function getEncryptFn(cipher: CipherType) {
    switch (cipher) {
        case 'caesar': return caesarEncrypt;
        case 'vigenere': return vigenereEncrypt;
        case 'hill': return hillEncrypt;
        case 'playfair': return playfairEncrypt;
        case 'railfence': return railFenceEncrypt;
        case 'columnar': return columnarEncrypt;
        default: return null;
    }
}

function getDecryptFn(cipher: CipherType) {
    switch (cipher) {
        case 'caesar': return caesarDecrypt;
        case 'vigenere': return vigenereDecrypt;
        case 'hill': return hillDecrypt;
        case 'playfair': return playfairDecrypt;
        case 'railfence': return railFenceDecrypt;
        case 'columnar': return columnarDecrypt;
        default: return null;
    }
}

app.post('/api/v1/cipher/encrypt', (req: Request, res: Response) => {
    try {
        const { cipher, plaintext, options } = req.body;
        if (!cipher || typeof plaintext !== 'string' || !options) {
            return res.status(400).json({ error: 'Missing required fields: cipher, plaintext, options' });
        }

        const encryptFn = getEncryptFn(cipher as CipherType);
        if (!encryptFn) {
            return res.status(400).json({ error: `Unsupported cipher type: ${cipher}` });
        }

        const result = encryptFn(plaintext, options as any);
        return res.json(result);
    } catch (err: any) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

app.post('/api/v1/cipher/decrypt', (req: Request, res: Response) => {
    try {
        const { cipher, ciphertext, options } = req.body;
        if (!cipher || typeof ciphertext !== 'string' || !options) {
            return res.status(400).json({ error: 'Missing required fields: cipher, ciphertext, options' });
        }

        const decryptFn = getDecryptFn(cipher as CipherType);
        if (!decryptFn) {
            return res.status(400).json({ error: `Unsupported cipher type: ${cipher}` });
        }

        const result = decryptFn(ciphertext, options as any);
        return res.json(result);
    } catch (err: any) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});

app.post('/api/v1/cipher/guess', guessLimiter, (req: Request, res: Response) => {
    try {
        const { ciphertext } = req.body;
        if (typeof ciphertext !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid field: ciphertext' });
        }

        const candidates = guessCipher(ciphertext);
        return res.json({ candidates });
    } catch (err: any) {
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
});
