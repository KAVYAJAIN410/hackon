# ReLoop × Amazon — Comprehensive Project Report

> **Reverse Logistics, Reimagined.** An AI-driven circular-commerce platform that intercepts returns, grades them with computer vision, and routes every product to its most economically and environmentally optimal second life.

---

## 1. Executive Summary

E-commerce returns are a trillion-rupee problem. The current system is built for premium goods — but for the **long tail** (a ₹499 pair of shoes, a ₹99 phone grip, a baby monitor sitting in a drawer) it breaks down completely. A ₹500 product routinely travels 600 km back to a central warehouse, costing ₹440 in reverse logistics, only to be liquidated for pennies or scrapped.

**ReLoop** is a full-stack platform that fixes the long tail. When a customer initiates a return, ReLoop **intercepts** it, uses **Google Gemini multimodal AI** to grade the product's condition from photographs, and runs a **cost-vs-value routing engine** that decides — in real time — whether the item should be resold locally, refurbished, donated, or recycled. The customer always gets their full refund; ReLoop optimizes what happens to the *product* afterward.

The platform serves **four distinct user roles** (Customer, Delivery Associate, Seller, Admin), runs a **location-aware certified-refurbished marketplace**, and includes a **Cashify-style trade-in flow** for idle products. It is fully deployed: **React/Vite frontend on Vercel**, **Node/Express backend on AWS EC2**, **PostgreSQL on AWS RDS**, **images on AWS S3**, with a **GitHub Actions CI/CD pipeline** delivering zero-downtime deployments.

---

## 2. The Problem (Persona-Driven)

| Persona | Real-World Pain | Old-System Outcome |
|---------|-----------------|--------------------|
| **Priya** — returns ₹499 shoes in Jaipur | Nearest warehouse is 600 km away in Delhi | ₹440 reverse-logistics cost > ₹400 resale value → **written off at a loss** |
| **Rahul** — baby monitor idle in a drawer in Pune | 50 nearby parents want one, but no trusted resale channel exists | Product wasted; OLX means strangers, haggling, no trust |
| **Small Seller** — 200 returns/month | Manual inspection (~16 hrs), guesses prices, re-photographs on a phone | Lost time, mispriced stock, low buyer trust |

The unifying insight: **for low-value items, the cost of moving and processing the return exceeds the product's worth.** ReLoop attacks this with local-first routing, AI grading at the doorstep, and an economic viability engine.

---

## 3. Core Innovation & Novelty

### 3.1 Return Interception (₹ cost-vs-value at the moment of return)
Before a return is ever scheduled, ReLoop presents the customer with smarter options (Standard Return / Express + Donate / Resell on ReLoop). This is a **net-new interaction pattern** — no major marketplace intercepts the return decision with a real-time economic + sustainability calculation.

### 3.2 Dual-Stage AI Grading with LLM Consensus
This is the most technically novel element:
- **Stage 1 (Customer):** the customer uploads photos; Gemini 2.5 Flash grades the item (`USER` grading).
- **Stage 2 (Delivery Associate):** at pickup, the associate re-photographs the product; Gemini grades again (`DELIVERY_ASSOCIATE` grading).
- **Stage 3 (Consensus):** a third LLM pass **fuses both gradings** into a `FinalGrading`, weighting the in-person associate assessment at 60% and the customer's at 40%, merging detected defects and missing parts.

This mirrors a real reverse-logistics trust model (self-reported vs. verified inspection) and produces a defensible, auditable final grade. Every stage has a **deterministic fallback** so the pipeline never hard-fails if the LLM is unavailable.

### 3.3 Economic Routing Engine
`decideRoute()` evaluates **all four disposition paths** (RESELL, REFURBISH, DONATE, RECYCLE) for every item and returns not just the winner but the full reasoning and the rejected alternatives:
- RESELL requires grade ∈ {A+, A, B}, `sellingPrice > totalCost + margin`, and `MRP ≥ grade-specific minimum`.
- Sub-₹150 items that can't cover even local shipping are **Smart-Donated** for ₹17 instead of being scrapped after ₹440 of pointless logistics.
- Grade F (hazardous, e.g. swollen battery) is force-routed to certified RECYCLE.

### 3.4 Location-Aware Marketplace
Pricing is computed **per buyer** using a 6×6 Delivery-Center distance matrix. The same item shows different shipping/total to a Mumbai buyer vs. a Kolkata buyer, and "Near You" items at the buyer's own DC ship with zero transfer cost. Non-viable listings are filtered out per-user.

### 3.5 Cashify-Style Trade-In ("Outgrown It")
For idle delivered products, an LLM **generates 5 product-specific condition questions** from the product description, combines the answers + uploaded photos + product age (derived from order date) into an AI grade, computes a price via `MRP × ageFactor × gradeMultiplier`, and lists it as a clearly-badged **"Pre-Loved / Resold by Owner"** item — distinct from returns-sourced refurbished stock.

### 3.6 Demand Signals
"47 parents near Pune want this" is computed live from users near the relevant DC who have purchased in the same category — turning latent local demand into a resale nudge.

### 3.7 Predictive Return Prevention (Green Pledge)
At checkout, buyers can take a **Green Pledge** (commit to keeping the item) for bonus Green Credits. Pledged orders are permanently ineligible for return — a behavioral-economics lever that reduces avoidable reverse logistics.

---

## 4. Functionality by Role

### Customer
- Browse the location-aware certified-refurbished marketplace with per-grade selection (A+/A/B…), live shipping, and health cards.
- Buy refurbished items (earns Green Credits); optional Green Pledge for bonus credits.
- Initiate returns with a guided flow (item → reason → photos → live AI grade → outcome), with a confirm/cancel two-phase commit.
- Trade in idle products via the AI-questionnaire "Outgrown It" flow.
- Track returns, orders (original + refurbished), Green Credits, tier, and CO₂ impact.

### Delivery Associate
- Dedicated dashboard of assigned pickups (auto-assigned by nearest DC + availability).
- Photograph products at pickup to trigger the second AI grading stage, which finalizes the consensus grade and lists eligible items.

### Seller
- Batch AI grading console (upload many return photos → grades + routes + recovery estimate).
- Return analytics: grade distribution, recovery rate, return-reason intelligence, estimated time saved.

### Admin
- System-wide dashboard: returns, routes, DC status, cost savings, and impact metrics.

---

## 5. System Architecture

```
┌─────────────────────┐      HTTPS       ┌──────────────────────────┐
│  React + Vite (SPA)  │  ───────────────▶│  Node.js + Express API    │
│  Vercel (CDN/HTTPS)  │   JWT Bearer     │  AWS EC2 + PM2 (cluster)  │
└─────────────────────┘                  │  Caddy reverse proxy/TLS  │
                                          └──────────┬───────────────┘
                                                     │ Prisma ORM
                              ┌──────────────────────┼───────────────────────┐
                              ▼                       ▼                       ▼
                   ┌──────────────────┐   ┌────────────────────┐   ┌──────────────────┐
                   │ PostgreSQL (RDS) │   │  AWS S3 (images)   │   │ Gemini 2.5 Flash │
                   │  16 data models  │   │ products/returns/  │   │  multimodal LLM  │
                   └──────────────────┘   │  outgrown blobs    │   └──────────────────┘
                                          └────────────────────┘
```

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router 7, Tailwind, Recharts, Lucide |
| Backend | Node.js, Express 5, Prisma ORM |
| Database | PostgreSQL 16 (AWS RDS) |
| AI | Google Gemini 2.5 Flash (multimodal) |
| Storage | AWS S3 |
| Auth | JWT (bcrypt-hashed credentials), role-based |
| Hosting | Vercel (frontend) · AWS EC2 + PM2 + Caddy (backend) |
| CI/CD | GitHub Actions (self-hosted runner, zero-downtime PM2 reload) |

### Data Model (16 entities)
`Product, User, DeliveryCenter, DcRoute, Order, Return, ReturnImage, AiGrading, FinalGrading, InventoryItem, MarketplaceOrder, GradeConfig, GreenCreditLedger, LoginCredentials, Admin, DeliveryAssociate, Seller` — modeling the full reverse-logistics lifecycle, multi-role auth, a credit ledger, and a DC routing graph.

---

## 6. Security & Reliability Engineering

- **JWT auth** with bcrypt-hashed credentials; identity is taken from the token (never client-supplied IDs) across all protected endpoints.
- **Role-based access** — separate auth resolution for Customer/Admin/Delivery/Seller; frontend route guards block unauthorized pages.
- **Atomicity via DB transactions** — multi-write operations (grading, purchase, listing, credit award) run inside `prisma.$transaction`.
- **Saga / compensating actions for S3** — if a DB commit fails after images are uploaded, the orphaned S3 objects are deleted automatically, preventing storage bloat (addresses the cross-system atomicity gap between S3 and Postgres).
- **Temporal business rules** — a **30-day return window** is enforced both in the eligibility API and server-side on return creation.
- **Graceful AI degradation** — every Gemini call (grading, consensus, question generation) has a deterministic fallback so the system stays functional during API outages or rate limits.
- **HTTPS everywhere** — Caddy provides automatic Let's Encrypt TLS for the EC2 API, eliminating mixed-content issues with the HTTPS frontend.

---

## 7. Scalability

- **Stateless API + JWT** → horizontally scalable; runs in **PM2 cluster mode** (multiple workers) today and is ready for an Auto Scaling Group / load balancer.
- **Pre-computed DC routing matrix** → routing decisions are O(1) lookups, not live distance computations.
- **Indexed Postgres schema** (status, DC, grade, user indexes) for fast marketplace and dashboard queries.
- **Object storage offload** → all binary assets live in S3, keeping the DB lean and the API horizontally scalable.
- **Rate-limited batch grading** respects Gemini's free-tier RPM, and the architecture supports swapping to a queue/worker model for high-volume sellers.
- **Zero-downtime deploys** → cluster-mode `pm2 reload` restarts workers one at a time; the old worker serves traffic until the new one is live.

---

## 8. Sustainability Impact (Quantified by the Engine)

- **Local-first routing** turns a 600 km round trip into an 8 km local handoff.
- **Smart Donate** saves ~₹423/item versus the old "ship-then-liquidate" path for sub-₹150 goods.
- **Green Credits + tiers** (Seedling → Sapling → Tree → Forest) gamify sustainable choices, awarded only for genuinely circular actions (buying refurbished, trading in) — **not** for returns.
- **CO₂ savings** are tracked per user and surfaced on product and profile pages.

---

## 9. CI/CD & DevOps

- **Frontend:** Vercel auto-builds and deploys on every push (SPA rewrites via `vercel.json`; CSS build hardened for Linux).
- **Backend:** GitHub Actions workflow triggers on `backend/**` changes → a **self-hosted runner on EC2** pulls the code, installs deps, runs `prisma generate` + `prisma db push`, and performs a **zero-downtime PM2 reload**. No SSH keys or open ports required.
- **Process management:** PM2 in cluster mode with boot persistence and auto-restart.

---

## 10. Engineering Challenges Solved

| Challenge | Resolution |
|-----------|-----------|
| ESM-only `uuid` crashed on EC2 Node 18 | Replaced with built-in `crypto.randomUUID()` |
| `lightningcss` native binary missing on Vercel | Disabled CSS minification (cross-platform-safe build) |
| HTTPS frontend ↔ HTTP backend mixed content | Caddy + Let's Encrypt via `nip.io` wildcard DNS |
| SSH-based CI fighting key parsing + dynamic runner IPs | Pivoted to a self-hosted EC2 runner |
| S3/DB orphaned blobs on partial failure | Compensating-delete saga pattern |
| Returning years-old items | 30-day temporal constraint, enforced server-side |
| Double-listing / double-return of the same order | `sourceOrderId` linkage + eligibility flags |

---

## 11. Future Roadmap

- Move batch grading to an async queue (SQS + worker) for true seller scale.
- Real geocoding + dynamic DC assignment instead of a static matrix.
- S3 lifecycle rules as a second-line orphan sweep.
- Payment gateway + Amazon Pay escrow for real settlements.
- Fine-tuned/distilled grading model to cut LLM latency and cost.
- Observability stack (structured logs, metrics, alerting).

---

## 12. Conclusion

ReLoop is a production-deployed, full-stack circular-commerce platform that turns the economically broken long tail of e-commerce returns into a profitable, sustainable, trust-first second-life marketplace. Its standout contributions — **return interception, dual-stage AI grading with LLM consensus, an explainable economic routing engine, and location-aware resale** — combine genuine technical novelty with measurable financial and environmental impact, all delivered on a scalable, secured, continuously-deployed AWS + Vercel stack.
