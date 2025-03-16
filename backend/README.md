# Accelrate backend 

## Quick Start

### 1. Configure environment

To keep your secret key safety, you should not push any environment files into repo.

Create `.env.local` file in `backend/` and add these keys:

```
HONO_CORS_ORIGIN="http://localhost:5173/"
```

### 2. Install dependencies

```sh
bun install
```

### 3. Start

```sh
bun run dev
```
