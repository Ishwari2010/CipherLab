# CipherLab Developer Documentation

CipherLab is a modern, production-ready web application for encrypting, decrypting, and analyzing classical ciphers. It features a React+Tailwind frontend, an Express API backend, and a shared TypeScript cryptography library.

## Architecture

This project is structured as an npm monorepo (workspaces):

- `packages/shared/`: Contains all core cryptographic algorithms, validation logic, and heuristics (framework-agnostic).
- `apps/backend/`: Node.js + Express API server that exposes the shared cryptography operations via REST endpoints.
- `apps/frontend/`: React + Vite single page application that provides a rich, interactive UI.

### Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4.
- **Backend**: Node.js, Express, Cors, Helmet.
- **Shared**: TypeScript, custom matrix math utilities, letter frequency datasets.
- **Testing**: Jest (Unit & Integration) and Playwright (E2E).
- **Deployment**: Docker, Docker Compose, GitHub Actions.

## Setup & Running Locally

1. **Install Dependencies**
   From the root folder, run:
   ```bash
   npm install
   ```

2. **Build Shared Library**
   The backend and frontend depend on the shared library being built at least once:
   ```bash
   npm run build -w @cipherlab/shared
   ```

3. **Start Development Servers (Nodemon + Vite)**
   To start all applications simultaneously using local dev servers:
   ```bash
   npm run dev
   ```
   > The backend API will run on `http://localhost:3000` and the frontend UI will run on `http://localhost:5173`. Make sure the frontend `.env` is configured to point to port 3000 if not using defaults.

   **Docker Deployment**
   If you prefer using containers to simulate production:
   ```bash
   docker-compose up --build
   ```
   > Docker Compose maps the backend API to `http://localhost:3000` and the frontend Nginx server to `http://localhost:80`. When running with Docker, access the app at `http://localhost` (port 80).

## Adding a New Cipher

1. Create a new file in `packages/shared/src/ciphers/newcipher.ts`.
2. Implement `newCipherEncrypt` and `newCipherDecrypt` returning the `CipherResult` interface.
3. Export them from `packages/shared/src/index.ts`.
4. Create the corresponding view in `apps/frontend/src/components/NewCipherView.tsx`.
5. Add the cipher key to `apps/frontend/src/App.tsx` and `apps/backend/src/app.ts`.

## Privacy & Security

- **No Persistence**: Plaintexts, ciphertexts, and keys are NEVER stored by the backend. They exist only in memory during the request cycle.
- **Client-side Execution**: The app includes a "Local Mode" toggle. When checked, the cryptographic logic (from `@cipherlab/shared`) runs completely within the browser. No API requests are made, ensuring ultimate privacy for sensitive plaintexts.
- **Forced Privacy Mode**: You can force the application to never make API requests by setting `VITE_LOCAL_ONLY=true` in the frontend `.env`. This hides the toggle and enforces 100% local processing.
- **Health Check**: The API includes a `GET /health` endpoint that returns a 200 OK status to verify availability without processing data.
