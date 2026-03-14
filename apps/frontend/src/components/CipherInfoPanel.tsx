import React from 'react';

export interface CipherInfoPanelProps {
    cipherId: string;
}

interface CipherDetails {
    id: string;
    name: string;
    type: string;
    overview: string;
    history: string;
    howItWorks: string;
    example: string;
    advantages: string;
    limitations: string;
    securityLevel: string;
}

const cipherDetailsMap: Record<string, CipherDetails> = {
    caesar: {
        id: 'caesar',
        name: 'Caesar Cipher',
        type: 'Substitution',
        overview: 'A simple substitution cipher that replaces each letter in a text by a letter some fixed number of positions down the alphabet.',
        history: 'Named after Julius Caesar, who used it with a shift of three to protect messages of military significance.',
        howItWorks: '1. Choose a shift value (e.g., 3).\n2. For each letter in the plaintext, replace it with the letter that is the chosen number of positions later in the alphabet.\n3. Wrap around to the beginning of the alphabet if necessary.',
        example: 'For a shift of 3: "A" becomes "D", "B" becomes "E". "HELLO" becomes "KHOOR".',
        advantages: 'Extremely simple to use and understand. Fast to compute by hand.',
        limitations: 'Easily broken using frequency analysis or a simple brute-force attack since there are only 25 possible keys.',
        securityLevel: 'Very Weak',
    },
    vigenere: {
        id: 'vigenere',
        name: 'Vigenere Cipher',
        type: 'Polyalphabetic Substitution',
        overview: 'A method of encrypting alphabetic text by using a series of interwoven Caesar ciphers based on the letters of a keyword.',
        history: 'Described by Giovan Battista Bellaso in 1553, but misattributed to Blaise de Vigenère in the 19th century. Once known as "le chiffre indéchiffrable" (the indecipherable cipher).',
        howItWorks: '1. A keyword is repeated to match the length of the plaintext.\n2. Each letter of the plaintext is shifted along the alphabet by the alphabetical value of the corresponding letter of the keyword (A=0, B=1, etc.).',
        example: 'Plaintext: "ATTACK", Keyword: "LEMON". The keyword is repeated as "LEMONL". "A" shifted by "L" (11) is "L", etc.',
        advantages: 'Masks letter frequencies, making it resistant to simple frequency analysis. Much stronger than a simple Caesar cipher.',
        limitations: 'Can be broken using methods like Kasiski examination and the Friedman test if the key is short and the text is long enough.',
        securityLevel: 'Weak',
    },
    hill: {
        id: 'hill',
        name: 'Hill Cipher',
        type: 'Polygraphic Substitution',
        overview: 'A polygraphic substitution cipher based on linear algebra. Each block of letters is treated as a vector and multiplied by an invertible matrix (the key).',
        history: 'Invented by Lester S. Hill in 1929. It was the first polygraphic cipher in which it was practical (though barely) to operate on more than three symbols at once.',
        howItWorks: '1. The plaintext is divided into blocks of size `n` (the matrix dimension).\n2. Each block is represented as a column vector of numbers (A=0, B=1, ... Z=25).\n3. The vector is multiplied by an `n x n` key matrix modulo 26.\n4. The resulting vector is converted back to letters.',
        example: 'Using a 2x2 matrix as a key, the plaintext is processed in pairs of letters (digraphs). A digraph like "ACT" (with a 3x3 matrix) is transformed into a new 3-letter block.',
        advantages: 'Diffuses the statistics of the plaintext over the blocks, making standard frequency analysis ineffective.',
        limitations: 'Highly vulnerable to known-plaintext attacks because it relies on linear operations.',
        securityLevel: 'Weak to Moderate',
    },
    playfair: {
        id: 'playfair',
        name: 'Playfair Cipher',
        type: 'Digraphic Substitution',
        overview: 'A manual symmetric encryption technique that encrypts pairs of letters (digraphs) instead of single letters as in the simple substitution cipher.',
        history: 'Invented by Charles Wheatstone in 1854 but named after Lord Playfair, who heavily promoted its use. Used by the British in WWII.',
        howItWorks: '1. A 5x5 grid is filled with a keyword (omitting duplicates) and then the remaining letters of the alphabet (often combining I and J).\n2. The plaintext is broken into digraphs (pairs). Repeated letters in a pair are separated by an "X".\n3. Pairs in the same row are replaced by the letters to their immediate right.\n4. Pairs in the same column are replaced by the letters immediately below them.\n5. Pairs forming a rectangle are replaced by the letters on the opposite horizontal corners.',
        example: 'Using a grid, the digraph "HI" might form a rectangle whose other corners are "BM", encrypting "HI" to "BM".',
        advantages: 'Significantly harder to break than simple substitution ciphers since frequency analysis requires counting pairs (600 possible digraphs) rather than 26 single letters.',
        limitations: 'Can be broken given enough ciphertext using frequency analysis of digraphs and known patterns.',
        securityLevel: 'Weak to Moderate',
    },
    railfence: {
        id: 'railfence',
        name: 'Rail Fence Cipher',
        type: 'Transposition',
        overview: 'A transposition cipher where the plaintext is written downwards and diagonally on successive "rails" of an imaginary fence, then read off in rows.',
        history: 'A form of transposition cipher used since ancient times. Also known as a zigzag cipher.',
        howItWorks: '1. Choose a number of rails (the key).\n2. Write the plaintext letters diagonally down the rails until the bottom is reached.\n3. Direction changes to diagonally up to the top rail, continuing the zigzag pattern.\n4. Read the text row by row to form the ciphertext.',
        example: 'Plaintext "WEAREDISCOVERED", 3 rails.\nW . . . E . . . C . . . R . . .\n. E . R . D . S . O . E . E .\n. . A . . . I . . . V . . . D\nCiphertext: "WECRE ERDSOEE AIVD".',
        advantages: 'Simple to perform and visually intuitive without complex mathematics.',
        limitations: 'Very low number of practical keys. Easily broken by trying all possible reasonable rail numbers.',
        securityLevel: 'Very Weak',
    },
    columnar: {
        id: 'columnar',
        name: 'Columnar Transposition',
        type: 'Transposition',
        overview: 'A transposition cipher where the message is written out in rows of a fixed length, and then read out again column by column, where the columns are chosen in some scrambled order.',
        history: 'Transposition ciphers have been used historically for centuries. Combining them with other ciphers greatly increased difficulty of cryptoanalysis before computers.',
        howItWorks: '1. Choose a keyword which determines the number of columns and the order they are read.\n2. Write the plaintext horizontally in a grid.\n3. The columns are then read vertically, in alphabetical order of the keyword\'s letters.',
        example: 'Keyword: "ZEBRAS" (order 6 3 2 4 1 5). Plaintext "WE ARE DISCOVERED FLEE AT ONCE".\nWrite in 6 columns. Read column 5 first (under A), then column 3 (under B), etc.',
        advantages: 'Scrambles the position of letters while keeping their identities intact. Often combined with substitution ciphers to disrupt frequencies.',
        limitations: 'Can be broken using anagramming techniques if the lengths of the columns can be determined.',
        securityLevel: 'Weak to Moderate',
    },
    rsa: {
        id: 'rsa',
        name: 'RSA Algorithm',
        type: 'Public Key Cryptography',
        overview: 'One of the first public-key cryptosystems, widely used for secure data transmission. It relies on the practical difficulty of factoring the product of two large prime numbers.',
        history: 'Invented in 1977 by Ron Rivest, Adi Shamir, and Leonard Adleman at MIT. A similar system was secretly invented earlier in 1973 by Clifford Cocks at GCHQ in the UK.',
        howItWorks: '1. Select two prime numbers, p and q.\n2. Compute Modulus n = p × q.\n3. Compute Totient φ(n) = (p-1) × (q-1).\n4. Choose public exponent e such that e and φ(n) are coprime.\n5. Compute private key d as the modular multiplicative inverse of e modulo φ(n).\n6. Encrypt: c = m^e mod n.\n7. Decrypt: m = c^d mod n.',
        example: 'Let p=61, q=53. Then n=3233. Let e=17. m=65 encrypts to c = (65^17) mod 3233 = 2790. Decryption: m = (2790^2753) mod 3233 = 65.',
        advantages: 'Allows secure communication without sharing a secret key beforehand. Forms the basis of modern internet security (HTTPS, SSL, etc.).',
        limitations: 'Slower than symmetric ciphers. Requires very large prime numbers (e.g., 2048-bit) to be secure against modern factorization algorithms or quantum computers.',
        securityLevel: 'High (with large keys)',
    },
    diffieHellman: {
        id: 'diffieHellman',
        name: 'Diffie-Hellman Key Exchange',
        type: 'Key Exchange protocol',
        overview: 'A mathematical method of securely exchanging cryptographic keys over a public channel, allowing two parties to jointly establish a shared secret.',
        history: 'Published by Whitfield Diffie and Martin Hellman in 1976. This was one of the first practical examples of public key cryptography.',
        howItWorks: '1. Alice and Bob agree on a large prime modulus (p) and a generator (g).\n2. Alice chooses a secret integer (a) and sends Bob: A = g^a mod p.\n3. Bob chooses a secret integer (b) and sends Alice: B = g^b mod p.\n4. Alice computes the shared secret: s = B^a mod p.\n5. Bob computes the shared secret: s = A^b mod p.\nBoth calculations result in the same mathematical derived number.',
        example: 'Let p=23, g=5. Alice selects secret a=4. Bob selects secret b=3. Alice sends A = 5^4 mod 23 = 4. Bob sends B = 5^3 mod 23 = 10. Alice computes shared key K = 10^4 mod 23 = 18. Bob computes shared key K = 4^3 mod 23 = 18.',
        advantages: 'Perfect Forward Secrecy can be achieved. Allows establishing a shared secret over an insecure channel without any prior secrets.',
        limitations: 'Vulnerable to Man-in-the-Middle (MitM) attacks because it does not authenticate the communicating parties. Usually combined with digital signatures (like RSA) to solve this.',
        securityLevel: 'High (with large parameters)',
    }
};

export const CipherInfoPanel: React.FC<CipherInfoPanelProps> = ({ cipherId }) => {
    const details = cipherDetailsMap[cipherId];
    const [isOpen, setIsOpen] = React.useState(false);

    if (!details) return null;

    return (
        <div className="w-full mt-6 bg-white shadow-md rounded-2xl border border-purple-100 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 sm:p-5 bg-purple-50/50 hover:bg-purple-50 transition-colors duration-200 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-400"
            >
                <span className="text-lg font-semibold text-purple-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About this Cipher: {details.name}
                </span>
                <svg
                    className={`w-5 h-5 text-purple-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="p-5 border-t border-purple-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-1">Overview</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">{details.overview}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider">Type:</h4>
                                <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full font-medium">{details.type}</span>
                                <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider ml-4">Security:</h4>
                                <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${details.securityLevel.includes('Moderate') ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {details.securityLevel}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-1">Historical Background</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">{details.history}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-1">Example</h4>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-1">
                                    <p className="text-gray-700 font-mono text-sm whitespace-pre-wrap">{details.example}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-bold text-purple-900 uppercase tracking-wider mb-1">How It Works</h4>
                                <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-50">
                                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">{details.howItWorks}</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-green-900 uppercase tracking-wider mb-1">Advantages</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">{details.advantages}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-red-900 uppercase tracking-wider mb-1">Limitations / Weaknesses</h4>
                                <p className="text-gray-700 text-sm leading-relaxed">{details.limitations}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
