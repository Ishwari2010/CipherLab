import request from 'supertest';
import { app } from './app';

describe('Backend API', () => {
    it('GET /health returns ok', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
    });

    describe('POST /api/v1/cipher/encrypt', () => {
        it('encrypts using caesar', async () => {
            const res = await request(app)
                .post('/api/v1/cipher/encrypt')
                .send({
                    cipher: 'caesar',
                    plaintext: 'HELLO',
                    options: { shift: 3 }
                });
            expect(res.status).toBe(200);
            expect(res.body.ciphertext).toBe('KHOOR');
            expect(res.body.steps).toBeDefined();
        });

        it('returns 400 on missing fields', async () => {
            const res = await request(app)
                .post('/api/v1/cipher/encrypt')
                .send({ cipher: 'caesar' });
            expect(res.status).toBe(400);
            expect(res.body.error).toContain('Missing required');
        });

        it('returns 500 on invalid options (e.g. Hill invalid matrix)', async () => {
            const res = await request(app)
                .post('/api/v1/cipher/encrypt')
                .send({
                    cipher: 'hill',
                    plaintext: 'TEST',
                    options: { keyMatrix: [[2, 4], [1, 2]] } // Det = 0
                });
            expect(res.status).toBe(500); // Wait, unhandled sync error in encryptFn throws, caught by try-catch
            expect(res.body.error).toContain('not coprime');
        });
    });

    describe('POST /api/v1/cipher/decrypt', () => {
        it('decrypts using caesar', async () => {
            const res = await request(app)
                .post('/api/v1/cipher/decrypt')
                .send({
                    cipher: 'caesar',
                    ciphertext: 'KHOOR',
                    options: { shift: 3 }
                });
            expect(res.status).toBe(200);
            expect(res.body.plaintext).toBe('HELLO');
        });
    });

    describe('POST /api/v1/cipher/guess', () => {
        it('returns heuristic candidates', async () => {
            const longCaesar = 'WKLV LV D ORQJ VHFUHW PHVVDJH WKDW VKRXOG EH HDVB WR JXHVV';
            const res = await request(app)
                .post('/api/v1/cipher/guess')
                .send({ ciphertext: longCaesar });
            expect(res.status).toBe(200);
            expect(res.body.candidates).toBeDefined();
            expect(res.body.candidates[0].cipher).toContain('Caesar');
        });
    });
});
