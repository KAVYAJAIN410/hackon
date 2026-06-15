# 🚀 ReLoop Deployment Guide

Backend → AWS EC2 · Frontend → Vercel · DB → AWS RDS (already provisioned) · Images → AWS S3 (already provisioned)

---

## Part 1 — Backend on EC2

### 1. Launch / connect to EC2
- Amazon Linux 2023 (or Ubuntu) `t2.micro` is enough for the demo.
- Security Group inbound rules:
  - SSH `22` from your IP
  - Custom TCP `5000` from `0.0.0.0/0` (the API port)
- Make sure the EC2 instance's IP is allowed in the **RDS security group** (port 5432).

### 2. Install Node + PM2 + git
```bash
# Amazon Linux 2023
sudo dnf install -y nodejs git
# (or Ubuntu) sudo apt update && sudo apt install -y nodejs npm git

sudo npm install -g pm2
```

### 3. Clone & configure
```bash
git clone https://github.com/KAVYAJAIN410/hackon.git
cd hackon/backend

# Create the .env from the template and fill in real values
cp .env.example .env
nano .env     # paste DATABASE_URL, GEMINI_API_KEY, AWS keys, S3_BUCKET, JWT_SECRET
```

### 4. Install, generate client, (optionally) seed
```bash
npm install                 # runs postinstall → prisma generate
npx prisma db push          # sync schema to RDS (skip if already in sync)
npm run seed                # OPTIONAL — only for a fresh demo database
```

### 5. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup        # follow the printed command to enable boot persistence
pm2 logs reloop-api
```

### 6. Verify
```bash
curl http://localhost:5000/api/health
# from your laptop:
curl http://<EC2-PUBLIC-IP>:5000/api/health
```

> CORS is open (`origin: '*'`), so the Vercel frontend can call the EC2 API directly.

---

## Part 2 — Frontend on Vercel

### 1. Import the repo
- Vercel → **Add New → Project** → import `hackon`.
- **Root Directory:** `frontend`
- Framework preset: **Vite** (auto-detected; `vercel.json` is already included for SPA routing).

### 2. Set environment variable
In **Project Settings → Environment Variables**:
```
VITE_API_URL = http://<EC2-PUBLIC-IP>:5000/api
```
(Set for Production + Preview.)

### 3. Deploy
- Click **Deploy**. Vercel runs `npm run build` → outputs `dist`.
- The included `vercel.json` rewrites all routes to `index.html` so React Router deep links work.

---

## Part 3 — Post-deploy checklist
- [ ] `GET /api/health` returns `{ "status": "ok" }` from the public EC2 IP
- [ ] Frontend loads and login works (hits `/api/auth/login`)
- [ ] Marketplace images load from S3 (bucket policy allows public read)
- [ ] Product images visible (S3 `*` public-read policy applied)

---

## ⚠️ Notes
- **Mixed content:** If you serve the Vercel frontend over HTTPS and the EC2 API over plain HTTP, browsers block the calls. For the demo, either:
  - put the API behind HTTPS (Nginx + Let's Encrypt or an ALB), or
  - use the Vercel preview over HTTP isn't possible — so the cleanest fix is adding a TLS reverse proxy on EC2.
- **Secrets:** never commit `.env`. Both `.env` files are gitignored; only `.env.example` is tracked.
- `prisma generate` runs automatically via the backend `postinstall` script.
