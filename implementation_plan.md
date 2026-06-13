# 🏗️ 5-Day Implementation Plan — ReLoop
> Amazon Hackathon · 3 Developers · Vite + React (JSX) · Express.js · PostgreSQL · Gemini AI
> **Like a LEGO instruction manual — follow step by step.**

---

## What ReLoop Solves

> "The system works for premium. For the long tail — it breaks."

| Persona | Problem | ReLoop Fix |
|---------|---------|-----------|
| **Priya** | Rs.500 shoes travel 600km to be scrapped | Return Interception → Local-First Routing → Smart Donate |
| **Rahul** | Baby monitor in a drawer, 50 parents nearby want it | "Outgrown It" — 1-click resell with demand signal |
| **Small Seller** | 200 returns/month, manual inspection, guesses price | Seller Batch Console — AI grades 200 in 42 seconds |

The customer ALWAYS gets full refund. ReLoop decides what happens to the **product** after the refund.

---

## Return Interception (The Killer Feature)

When Priya tries to return her Rs.499 shoes, BEFORE standard return is processed:

```
You're returning Bata Walking Shoes (Rs.499).

Choose how you'd like to return:

┌─────────────────────────────────────────────┐
│ 📦 STANDARD RETURN                          │
│ Refund: Rs.499 (7-10 business days)         │
│ No green credits.                           │
│ [Select]                                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ⚡ EXPRESS RETURN + DONATE  ← recommended   │
│ Refund: Rs.499 (INSTANT to Amazon Pay)      │
│ + 100 Green Credits (Rs.25 bonus value!)    │
│ Your shoes go directly to a local NGO       │
│ [Select]                                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 🔄 RETURN & RESELL ON RELOOP               │
│ Refund: Rs.499 (INSTANT to Amazon Pay)      │
│ + 50 Green Credits                          │
│ Your shoes are in great condition!          │
│ 3 buyers near Jaipur want these shoes!      │
│ [Select]                                    │
└─────────────────────────────────────────────┘
```

**Customer always gets Rs.499.** The incentive is faster refund + green credits.
**Amazon saves Rs.440** in pointless reverse logistics.

---

## ✅ Finalized Tech Stack

### Core Decisions (confirmed via grilling interview)

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Frontend** | Vite + React (JSX) + Tailwind CSS v3 | `.jsx` files — no TypeScript |
| **Backend** | Node.js + Express.js | REST API, CORS-enabled |
| **Language** | JavaScript (both frontend + backend) | No TypeScript anywhere |
| **Database** | PostgreSQL 16 | AWS RDS free tier |
| **ORM** | Prisma | Type-safe queries, easy migrations |
| **AI** | Google Gemini 2.0 Flash API | Free tier: 15 RPM, 1M tokens/day |
| **Routing** | React Router v6 | Standard, well-documented |
| **State** | React Context + localStorage | No extra libraries |
| **Charts** | Recharts | React-native charting |
| **Icons** | Lucide React | Clean, tree-shakeable |
| **Font** | Inter (Google Fonts) | Professional, readable |
| **Auth** | User switcher dropdown (no real auth) | Hackathon demo pattern |
| **UI Theme** | Light mode | Amazon-adjacent white/gray + green/orange |

### AWS Free-Tier Stack (Amazon Hackathon!)

| AWS Service | Free Tier | Usage |
|------------|-----------|-------|
| **AWS RDS PostgreSQL** | db.t3.micro, 750 hrs/month | Main database |
| **AWS S3** | 5GB storage, 20k GET, 2k PUT/month | Return image storage |
| **AWS EC2 t2.micro** | 750 hrs/month | Express.js backend host |
| **AWS Amplify** | Free frontend hosting + CI/CD | Vite React frontend |

### External APIs

| API | Purpose | Setup |
|-----|---------|-------|
| **Google Gemini 2.0 Flash** | AI image grading | Get key at aistudio.google.com |

### Environment Variables

**Backend (`backend/.env`)**
```env
DATABASE_URL="postgresql://user:pass@your-rds-endpoint.amazonaws.com:5432/reloop"
GEMINI_API_KEY="your-gemini-api-key"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="ap-south-1"
S3_BUCKET_NAME="reloop-hackathon-uploads"
PORT=5000
```

**Frontend (`frontend/.env`)**
```env
VITE_API_URL="http://your-ec2-public-ip:5000/api"
```

---

## Monorepo Project Structure

```
reloop/                              <- Monorepo root
├── frontend/                        <- Vite + React (JSX) + Tailwind v3
│   ├── public/
│   │   └── images/                  <- Product images (seeded)
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx                  <- React Router setup
│   │   ├── index.css                <- Tailwind directives + design tokens
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Marketplace.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── ReturnFlow.jsx
│   │   │   ├── ReturnInterception.jsx
│   │   │   ├── OutgrownIt.jsx       <- /orders page — Rahul's fix
│   │   │   ├── SellerDashboard.jsx
│   │   │   ├── MyReturns.jsx
│   │   │   ├── GreenProfile.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── UserSwitcher.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── HealthCard.jsx
│   │   │   ├── CostBreakdown.jsx
│   │   │   ├── RouteVisualization.jsx
│   │   │   ├── GradeBadge.jsx
│   │   │   ├── GreenCreditsWidget.jsx
│   │   │   ├── StepIndicator.jsx
│   │   │   ├── ImageUpload.jsx
│   │   │   └── StatCard.jsx
│   │   ├── context/
│   │   │   └── UserContext.jsx
│   │   └── lib/
│   │       └── api.js               <- fetch/axios wrappers
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env
│
├── backend/                         <- Node.js + Express.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── src/
│   │   ├── index.js                 <- Express app entry
│   │   ├── routes/
│   │   │   ├── users.js
│   │   │   ├── marketplace.js
│   │   │   ├── orders.js
│   │   │   ├── returns.js
│   │   │   ├── grading.js
│   │   │   ├── seller.js
│   │   │   ├── batchGrade.js
│   │   │   ├── greenCredits.js
│   │   │   ├── admin.js
│   │   │   ├── stats.js
│   │   │   └── outgrown.js
│   │   └── lib/
│   │       ├── db.js                <- Prisma client singleton
│   │       ├── gemini.js            <- Gemini API wrapper
│   │       ├── routing.js           <- Smart routing algorithm
│   │       ├── costing.js           <- Cost calculation functions
│   │       ├── s3.js                <- AWS S3 upload helper
│   │       └── constants.js
│   ├── package.json
│   └── .env
│
├── package.json                     <- Root (workspace scripts)
└── README.md
```

---

## Prisma Schema (Complete)

Dev 3 creates this on Day 1.

```prisma
// backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id            String   @id @default(uuid())
  name          String
  category      String
  subcategory   String?
  brand         String?
  mrp           Decimal  @db.Decimal(10, 2)
  weightGrams   Int?     @map("weight_grams")
  description   String?
  imageUrl      String?  @map("image_url")
  avgReturnRate Decimal? @default(0) @map("avg_return_rate") @db.Decimal(5, 4)
  createdAt     DateTime @default(now()) @map("created_at")

  orders         Order[]
  inventoryItems InventoryItem[]

  @@index([category, subcategory])
  @@index([brand])
  @@map("products")
}

model User {
  id           String  @id @default(uuid())
  name         String
  email        String  @unique
  phone        String?
  latitude     Decimal @db.Decimal(10, 7)
  longitude    Decimal @db.Decimal(10, 7)
  pincode      String
  city         String?
  state        String?
  nearestDcId  String? @map("nearest_dc_id")
  nearestDc    DeliveryCenter? @relation(fields: [nearestDcId], references: [id])
  greenCredits Int     @default(0) @map("green_credits")
  greenTier    String  @default("SEEDLING") @map("green_tier")
  role         String  @default("CUSTOMER")
  createdAt    DateTime @default(now()) @map("created_at")

  orders            Order[]
  returns           Return[]
  marketplaceOrders MarketplaceOrder[]
  creditLedger      GreenCreditLedger[]

  @@index([pincode])
  @@index([city])
  @@index([nearestDcId])
  @@map("users")
}

model DeliveryCenter {
  id            String  @id @default(uuid())
  name          String
  code          String  @unique
  city          String
  state         String
  latitude      Decimal @db.Decimal(10, 7)
  longitude     Decimal @db.Decimal(10, 7)
  pincode       String?
  type          String
  canInspect    Boolean @default(true)  @map("can_inspect")
  canRefurbish  Boolean @default(false) @map("can_refurbish")
  canRepackage  Boolean @default(true)  @map("can_repackage")
  capacity      Int     @default(10000)
  currentLoad   Int     @default(0)     @map("current_load")
  handlingCost  Decimal @default(25.00) @map("handling_cost") @db.Decimal(6, 2)
  isActive      Boolean @default(true)  @map("is_active")

  users              User[]
  returns            Return[]
  inventoryItems     InventoryItem[]
  fulfilledOrders    Order[]
  sourceRoutes       DcRoute[]          @relation("SourceDc")
  destRoutes         DcRoute[]          @relation("DestDc")
  sourceMarketOrders MarketplaceOrder[] @relation("SourceDcOrder")
  destMarketOrders   MarketplaceOrder[] @relation("DestDcOrder")

  @@map("delivery_centers")
}

model DcRoute {
  sourceDcId    String  @map("source_dc_id")
  destDcId      String  @map("dest_dc_id")
  distanceKm    Decimal @map("distance_km")   @db.Decimal(8, 2)
  transferCost  Decimal @map("transfer_cost") @db.Decimal(8, 2)
  estimatedDays Int     @default(1)           @map("estimated_days")

  sourceDc DeliveryCenter @relation("SourceDc", fields: [sourceDcId], references: [id])
  destDc   DeliveryCenter @relation("DestDc",   fields: [destDcId],   references: [id])

  @@id([sourceDcId, destDcId])
  @@map("dc_routes")
}

model Order {
  id              String    @id @default(uuid())
  userId          String    @map("user_id")
  productId       String    @map("product_id")
  quantity        Int       @default(1)
  unitPrice       Decimal   @map("unit_price")  @db.Decimal(10, 2)
  totalPrice      Decimal   @map("total_price") @db.Decimal(10, 2)
  status          String    @default("DELIVERED")
  fulfilledFromDc String?   @map("fulfilled_from_dc")
  orderedAt       DateTime  @default(now()) @map("ordered_at")
  deliveredAt     DateTime? @map("delivered_at")

  user          User            @relation(fields: [userId],          references: [id])
  product       Product         @relation(fields: [productId],       references: [id])
  fulfilledFrom DeliveryCenter? @relation(fields: [fulfilledFromDc], references: [id])
  returns       Return[]

  @@index([userId])
  @@index([productId])
  @@index([status])
  @@map("orders")
}

model Return {
  id           String    @id @default(uuid())
  orderId      String    @map("order_id")
  userId       String    @map("user_id")
  reason       String
  reasonDetail String?   @map("reason_detail")
  refundAmount Decimal   @map("refund_amount") @db.Decimal(10, 2)
  status       String    @default("INITIATED")
  returnMethod String?   @map("return_method")
  currentDcId  String?   @map("current_dc_id")
  pickupCost   Decimal?  @map("pickup_cost")   @db.Decimal(8, 2)
  pickedUpAt   DateTime? @map("picked_up_at")
  receivedAt   DateTime? @map("received_at")
  createdAt    DateTime  @default(now()) @map("created_at")

  order         Order           @relation(fields: [orderId],     references: [id])
  user          User            @relation(fields: [userId],      references: [id])
  currentDc     DeliveryCenter? @relation(fields: [currentDcId], references: [id])
  images        ReturnImage[]
  grading       AiGrading?
  inventoryItem InventoryItem?

  @@index([orderId])
  @@index([userId])
  @@index([status])
  @@map("returns")
}

model ReturnImage {
  id         String   @id @default(uuid())
  returnId   String   @map("return_id")
  imageUrl   String   @map("image_url")
  uploadedBy String   @map("uploaded_by")
  imageType  String?  @map("image_type")
  uploadedAt DateTime @default(now()) @map("uploaded_at")

  return Return @relation(fields: [returnId], references: [id])

  @@index([returnId])
  @@map("return_images")
}

model AiGrading {
  id                   String   @id @default(uuid())
  returnId             String   @unique @map("return_id")
  grade                String
  score                Int
  confidence           Decimal  @db.Decimal(5, 4)
  exteriorScore        Int?     @map("exterior_score")
  functionalNotes      String?  @map("functional_notes")
  defectsFound         Json?    @map("defects_found")
  missingParts         String[] @map("missing_parts")
  routeDecision        String   @map("route_decision")
  estimatedResaleValue Decimal? @map("estimated_resale_value") @db.Decimal(10, 2)
  gradeDiscountPct     Decimal? @map("grade_discount_pct")     @db.Decimal(5, 2)
  gradedAt             DateTime @default(now()) @map("graded_at")

  return        Return         @relation(fields: [returnId], references: [id])
  inventoryItem InventoryItem?

  @@index([grade])
  @@map("ai_gradings")
}

model InventoryItem {
  id             String    @id @default(uuid())
  productId      String    @map("product_id")
  returnId       String?   @unique @map("return_id")
  gradingId      String?   @unique @map("grading_id")
  currentDcId    String    @map("current_dc_id")
  grade          String
  conditionLabel String    @map("condition_label")
  basePrice      Decimal   @map("base_price") @db.Decimal(10, 2)
  status         String    @default("AVAILABLE")
  source         String    @default("RETURN")
  listedAt       DateTime  @default(now()) @map("listed_at")
  soldAt         DateTime? @map("sold_at")

  product          Product          @relation(fields: [productId],   references: [id])
  return           Return?          @relation(fields: [returnId],    references: [id])
  grading          AiGrading?       @relation(fields: [gradingId],   references: [id])
  currentDc        DeliveryCenter   @relation(fields: [currentDcId], references: [id])
  marketplaceOrder MarketplaceOrder?

  @@index([productId])
  @@index([currentDcId])
  @@index([status])
  @@index([grade])
  @@map("inventory_items")
}

model MarketplaceOrder {
  id                 String    @id @default(uuid())
  buyerId            String    @map("buyer_id")
  inventoryItemId    String    @unique @map("inventory_item_id")
  itemBasePrice      Decimal   @map("item_base_price") @db.Decimal(10, 2)
  shippingCost       Decimal   @map("shipping_cost")   @db.Decimal(10, 2)
  platformFee        Decimal   @map("platform_fee")    @db.Decimal(10, 2)
  totalPrice         Decimal   @map("total_price")     @db.Decimal(10, 2)
  discountPct        Decimal?  @map("discount_pct")    @db.Decimal(5, 2)
  sourceDcId         String    @map("source_dc_id")
  destDcId           String    @map("dest_dc_id")
  greenCreditsEarned Int       @default(0) @map("green_credits_earned")
  status             String    @default("PLACED")
  orderedAt          DateTime  @default(now()) @map("ordered_at")
  deliveredAt        DateTime? @map("delivered_at")

  buyer         User           @relation(fields: [buyerId],         references: [id])
  inventoryItem InventoryItem  @relation(fields: [inventoryItemId], references: [id])
  sourceDc      DeliveryCenter @relation("SourceDcOrder", fields: [sourceDcId], references: [id])
  destDc        DeliveryCenter @relation("DestDcOrder",   fields: [destDcId],   references: [id])

  @@index([buyerId])
  @@map("marketplace_orders")
}

model GradeConfig {
  grade                String   @id
  conditionLabel       String   @map("condition_label")
  discountPct          Decimal  @map("discount_pct") @db.Decimal(5, 2)
  route                String
  minMrpForMarketplace Decimal? @map("min_mrp_for_marketplace") @db.Decimal(10, 2)

  @@map("grade_config")
}

model GreenCreditLedger {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  amount       Int
  balanceAfter Int      @map("balance_after")
  action       String
  referenceId  String?  @map("reference_id")
  description  String?
  createdAt    DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@index([userId, createdAt(sort: Desc)])
  @@map("green_credits_ledger")
}
```

---

## Fixed Cost Constants

```javascript
// backend/src/lib/constants.js

const COSTS = {
  LAST_MILE_PICKUP: 65,
  LAST_MILE_DELIVERY: 65,
  HANDLING_INSPECTION: 25,
  HANDLING_REPACKAGE: 15,
  AI_GRADING: 2,
  HANDLING_TOTAL: 42,
  MIN_MARGIN: 20,
  PLATFORM_COMMISSION_PCT: 12,
  DONATION_COST: 17,
  WAREHOUSE_STORAGE_PER_DAY: 2,
};

const GRADE_CONFIG = {
  'A+': { label: 'Like New',  discountPct: 10, route: 'RESELL',    minMrp: 100  },
  'A':  { label: 'Excellent', discountPct: 20, route: 'RESELL',    minMrp: 150  },
  'B':  { label: 'Good',      discountPct: 35, route: 'RESELL',    minMrp: 3000 },
  'C':  { label: 'Fair',      discountPct: 50, route: 'REFURBISH', minMrp: null },
  'D':  { label: 'Poor',      discountPct: 0,  route: 'DONATE',    minMrp: null },
  'F':  { label: 'Broken',    discountPct: 0,  route: 'RECYCLE',   minMrp: null },
};

const GREEN_CREDITS = {
  BUY_RENEWED: 20,
  RETURN_RELOOP_RESELL: 50,
  RETURN_EXPRESS_DONATE: 100,
  RETURN_STANDARD: 0,
  SELL_OUTGROWN: 75,
};

module.exports = { COSTS, GRADE_CONFIG, GREEN_CREDITS };
```

---

## Gemini API Integration

```javascript
// backend/src/lib/gemini.js

const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function gradeProduct(images, category, returnReason, productName, mrp) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are an expert product condition assessor for Amazon's reverse logistics team.

Product: ${productName}
Category: ${category}
MRP: Rs.${mrp}
Customer return reason: "${returnReason}"

Analyze the product images and return ONLY this JSON (no markdown):
{
  "grade": "A+" | "A" | "B" | "C" | "D" | "F",
  "score": <0-100>,
  "confidence": <0.00-1.00>,
  "exteriorScore": <0-100>,
  "functionalNotes": "<assessment string>",
  "defectsFound": [{"type": "scratch|dent|stain|crack|tear|none", "severity": "none|minor|moderate|major|critical", "location": "<where>"}],
  "missingParts": [] or ["<part>"],
  "conditionSummary": "<2-3 sentence summary>"
}

Grading: A+=sealed/perfect, A=minimal use, B=minor cosmetic, C=noticeable wear, D=damaged, F=broken/hazard`;

  const imageParts = images.map(img => ({
    inlineData: { data: img.base64, mimeType: img.mimeType }
  }));

  const result = await model.generateContent([prompt, ...imageParts]);
  const text = result.response.text();
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { gradeProduct };
```

---

## AWS S3 Integration

```javascript
// backend/src/lib/s3.js

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadToS3(buffer, mimeType, folder = 'returns') {
  const ext = mimeType.split('/')[1];
  const key = `${folder}/${uuidv4()}.${ext}`;
  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
  }));
  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

module.exports = { uploadToS3 };
```

---

## Express Backend Entry Point

```javascript
// backend/src/index.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/users',         require('./routes/users'));
app.use('/api/marketplace',   require('./routes/marketplace'));
app.use('/api/orders',        require('./routes/orders'));
app.use('/api/returns',       require('./routes/returns'));
app.use('/api/grading',       require('./routes/grading'));
app.use('/api/seller',        require('./routes/seller'));
app.use('/api/green-credits', require('./routes/greenCredits'));
app.use('/api/admin',         require('./routes/admin'));
app.use('/api/stats',         require('./routes/stats'));
app.use('/api/outgrown',      require('./routes/outgrown'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'ReLoop API' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ReLoop API on port ${PORT}`));
```

---

## Frontend App Entry

```jsx
// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import ReturnFlow from './pages/ReturnFlow';
import ReturnInterception from './pages/ReturnInterception';
import OutgrownIt from './pages/OutgrownIt';
import SellerDashboard from './pages/SellerDashboard';
import MyReturns from './pages/MyReturns';
import GreenProfile from './pages/GreenProfile';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"                          element={<Landing />} />
          <Route path="/marketplace"               element={<Marketplace />} />
          <Route path="/marketplace/:id"           element={<ProductDetail />} />
          <Route path="/return"                    element={<ReturnFlow />} />
          <Route path="/return/intercept/:orderId" element={<ReturnInterception />} />
          <Route path="/orders"                    element={<OutgrownIt />} />
          <Route path="/seller"                    element={<SellerDashboard />} />
          <Route path="/returns"                   element={<MyReturns />} />
          <Route path="/green-profile"             element={<GreenProfile />} />
          <Route path="/admin"                     element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
export default App;
```

```jsx
// frontend/src/context/UserContext.jsx
import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('reloop_user')) || null
  );
  const selectUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem('reloop_user', JSON.stringify(user));
  };
  return (
    <UserContext.Provider value={{ currentUser, selectUser }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
```

---

## Costing + Routing Logic

```javascript
// backend/src/lib/costing.js
const { COSTS } = require('./constants');

function calculateDeliveryCost(sourceDcId, destDcId, dcRoutes) {
  const route = dcRoutes.find(r => r.sourceDcId === sourceDcId && r.destDcId === destDcId);
  const transferCost = route ? Number(route.transferCost) : 50;
  const lastMile = COSTS.LAST_MILE_DELIVERY;
  return {
    transferCost,
    lastMile,
    totalShipping: transferCost + lastMile,
    estimatedDays: (route?.estimatedDays || 3) + 1,
  };
}

function calculateViability(mrp, gradeDiscountPct, shippingCost) {
  const sellingPrice = Math.round(mrp * (1 - gradeDiscountPct / 100));
  const totalCost = COSTS.HANDLING_TOTAL + shippingCost + COSTS.MIN_MARGIN;
  const profit = sellingPrice - totalCost;
  return { viable: profit > 0, sellingPrice, totalCost, profit };
}

module.exports = { calculateDeliveryCost, calculateViability };
```

---

## Tailwind Config + Design Tokens

```js
// frontend/tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { inter: ['Inter', 'sans-serif'] },
      colors: {
        brand: {
          green: '#16a34a',
          greenLight: '#4ade80',
          orange: '#ea580c',
          orangeLight: '#f97316',
        },
        grade: {
          aplus: '#059669',
          a: '#16a34a',
          b: '#d97706',
          c: '#c2410c',
          d: '#b91c1c',
          f: '#7f1d1d',
        }
      }
    }
  },
  plugins: []
}
```

```css
/* frontend/src/index.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
  color: #111827;
}
```

---

## 5-Day Plan — Developer-by-Developer

### Team Roles

| Dev | Focus | Works On |
|-----|-------|----------|
| **Dev 1** | Frontend — all 10 pages + Tailwind components | `frontend/src/pages/`, `frontend/src/components/` |
| **Dev 2** | Backend — all Express API routes | `backend/src/routes/`, `backend/src/index.js` |
| **Dev 3** | DB + AI — Prisma, seed data, Gemini, routing algorithm | `backend/prisma/`, `backend/src/lib/` |

---

## DAY 1: Foundation

### Dev 1 — Frontend Scaffolding + Tailwind + Layout (8 hrs)

**Morning: Project setup**
```bash
mkdir reloop && cd reloop
mkdir frontend backend

cd frontend
npm create vite@latest . -- --template react
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
npm install react-router-dom axios lucide-react recharts
```

Set up `tailwind.config.js`, `index.css`, `App.jsx`, `UserContext.jsx` (see code above).
Create stub files for all 10 pages.

**Afternoon: Navbar + Landing Page**

Navbar (white, `border-b`, sticky):
- Left: ReLoop logo (leaf + green text)
- Center: Marketplace / My Orders / My Returns / Green Profile
- Right: User switcher dropdown + city badge + green credits chip

Landing Page (light, premium):
- Hero: tagline + 2 CTAs
- 4-step "How It Works"
- Live impact stats from `/api/stats`
- 3 persona cards (Priya / Rahul / Small Seller)
- Footer with AWS badges

### Dev 2 — Backend Express Setup (8 hrs)

**Morning:**
```bash
cd backend
npm init -y
npm install express cors dotenv multer @aws-sdk/client-s3 uuid @google/generative-ai
npm install @prisma/client
npm install -D nodemon prisma
```

Create `src/index.js`. Create all route stubs.

**Afternoon: Users + Stats APIs**
- `GET /api/users` — all users with city/DC (for user switcher)
- `GET /api/stats` — counts by status, CO2, credits

### Dev 3 — Prisma Schema + Seed Data (8 hrs)

**Morning:**
```bash
cd backend
npx prisma init
# Write schema.prisma (see above)
npx prisma migrate dev --name init
```

**Afternoon: Seed data**

`prisma/seed.js` with ALL data:
- 6 DCs + 36 DC routes
- 27 products (20 original + 7 cheap ones from persona_fixes.md)
- 14 users (Priya in Jaipur, Rahul in Pune, local buyers)
- 19 orders, 18 returns, 13 gradings (5 ungraded for live demo)
- 8 inventory items, grade config, green credits ledger

`package.json`: `"prisma": { "seed": "node prisma/seed.js" }`
Run: `npx prisma db seed`

---

## DAY 2: Marketplace + Product Detail

### Dev 1

**Marketplace** (`pages/Marketplace.jsx`):
- "Browsing as: [User] • [City]" header
- Filter bar: category, sort, grade
- Product grid with `ProductCard` component
- Cost transparency footer
- Switch User to show different prices

**ProductCard** (`components/ProductCard.jsx`):
- Image, grade badge, MRP crossed → ReLoop price
- Shipping cost, "Near you!" badge, discount %, green credits

**ProductDetail** (`pages/ProductDetail.jsx`):
- Image gallery, HealthCard, full cost breakdown, route map, Buy button

### Dev 2

`GET /api/marketplace?user_id=&category=&sort=`:
- All AVAILABLE inventory items
- Calculate per-user shipping via DC routes
- Filter non-viable (sellingPrice < totalCost)
- Tag `isNearYou` when at buyer's own DC

`GET /api/marketplace/:id?user_id=`:
- Full detail with health card + per-user cost breakdown

### Dev 3

Implement `costing.js` (see above) + `routing.js`:
- `decideRoute()` — returns chosen route + reason + ALL alternatives evaluated

---

## DAY 3: Return Flow + AI Grading

### Dev 1

**ReturnFlow** (`pages/ReturnFlow.jsx`):
Step 1: Select item → Step 2: Reason → Step 3: Check interception → Step 4: Upload → Step 5: AI grade LIVE → Step 6: Route decision

**ReturnInterception** (`pages/ReturnInterception.jsx`):
3-option modal — Standard / Express+Donate / Resell on ReLoop

**ImageUpload** (`components/ImageUpload.jsx`):
Drag-drop zone, preview thumbnails, max 5 images

### Dev 2

`POST /api/returns` — create return, check interception eligibility
`POST /api/grading` — images + metadata → Gemini → save → return grade + route
`POST /api/returns/:id/method` — save return method choice

### Dev 3

Wire `gemini.js` + `s3.js` (see code above).
Connect grading route: multer → S3 → Gemini → DB → response.

---

## DAY 4: Seller Dashboard + Outgrown It + Admin

### Dev 1

**SellerDashboard** (`pages/SellerDashboard.jsx`):
- Batch upload zone + animated 42-second counter
- Results table: grade / count / route / recovery
- Individual rows: expand for AI detail + override

**OutgrownIt** (`pages/OutgrownIt.jsx`):
- Past DELIVERED orders
- "Outgrown It?" button → demand signal + AI price
- "47 parents near Pune want this!"
- 1-click listing flow

**AdminDashboard** (`pages/AdminDashboard.jsx`):
- Stats cards + Recharts charts (pie routes, bar grades)
- All returns table + DC list + cost savings

### Dev 2

`POST /api/seller/batch-grade` — batch Gemini grading
`GET /api/seller/returns?seller_id=` — returns + analytics
`GET /api/orders?user_id=` — orders with outgrown flag
`POST /api/outgrown` — list idle product
`GET /api/admin/overview` — full system stats

### Dev 3

Demand signal:
```javascript
async function getDemandSignal(productId, dcId) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  return prisma.user.count({
    where: {
      nearestDcId: dcId,
      orders: { some: { product: { category: product.category } } }
    }
  });
}
```

---

## DAY 5: Polish + My Returns + Green Profile + Deploy

### Dev 1

**MyReturns** — timeline view of return lifecycle
**GreenProfile** — credits balance, tier, history, CO2 impact, progress bar
**Polish**: skeleton loaders, error/empty states, mobile responsive

### Dev 2

`GET /api/green-credits?user_id=` — balance, tier, ledger
`POST /api/marketplace/:id/buy` — order + credits + mark SOLD
`POST /api/green-credits/award` — award for return method

### Dev 3 — AWS Deployment

**EC2 Backend:**
```bash
# On EC2 t2.micro (Amazon Linux 2)
sudo yum update -y
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs && npm install -g pm2
git clone your-repo && cd reloop/backend && npm install
npx prisma migrate deploy && node prisma/seed.js
pm2 start src/index.js --name reloop-api && pm2 startup
```

**AWS Amplify Frontend:**
- Connect GitHub → Amplify Console
- Build: `cd frontend && npm install && npm run build`
- Output: `frontend/dist`
- Add `VITE_API_URL` env var

**AWS RDS:** Create db.t3.micro in ap-south-1, set DATABASE_URL in EC2, migrate + seed.

---

## 10 Pages Summary

| # | Page | Route | Persona Fix | Priority |
|---|------|-------|------------|----------|
| 1 | Landing Page | `/` | — | HIGH |
| 2 | **Marketplace** | `/marketplace` | Priya (buyer side) | MUST |
| 3 | **Product Detail** | `/marketplace/:id` | Trust + transparency | MUST |
| 4 | **Return Flow** | `/return` | Core AI demo | MUST |
| 5 | **Return Interception** | `/return/intercept/:id` | Priya's fix | MUST |
| 6 | **Admin Dashboard** | `/admin` | Judges love this | MUST |
| 7 | **Seller Dashboard** | `/seller` | Small Seller's fix | HIGH |
| 8 | **Outgrown It** | `/orders` | Rahul's fix | HIGH |
| 9 | Green Profile | `/green-profile` | Gamification | MEDIUM |
| 10 | My Returns | `/returns` | Completeness | MEDIUM |

---

## Demo Script (3:30 minutes)

| Time | What | Script |
|------|------|--------|
| 0:00-0:20 | Problem | "Rs.500 shoes travel 600km to be scrapped. Baby monitor in drawer while 50 parents want it. 16 hours inspecting 200 returns. The system works for premium. For the long tail — it breaks. ReLoop fixes the long tail." |
| 0:20-0:50 | Return Interception | "Priya returns Rs.499 shoes. ReLoop intercepts: '3 buyers near Jaipur want these. Instant refund + 50 credits if you sell, or donate for 100 credits, or standard return.' Shoes travel 8km not 600km." |
| 0:50-1:20 | Marketplace (switch users) | "Rs.299 phone case → Rs.269 + Rs.65 to Mumbai. But this Rs.99 pop socket? Smart-donated. Old system spends Rs.440 scrapping it. We donate it for Rs.17." |
| 1:20-1:50 | Product Detail + Health Card | "Every product has a Health Card: AI-verified grade, defects, cost breakdown. Transfer DEL to MUM: Rs.30. Last mile: Rs.65. Total: Rs.95. Full transparency." |
| 1:50-2:20 | Return Flow (AI LIVE) | "AI grades in 2 seconds. Grade B, 78/100, scratch on case. Route: Refurbish. See all alternatives evaluated — resell, refurbish, donate, recycle." |
| 2:20-2:50 | Seller Dashboard | "200 returns, 42 seconds. 170 resellable. Auto-priced. Time saved: 10 hours. Plus: 'Fix your kurti size chart — 45% of returns are size issues.'" |
| 2:50-3:15 | Outgrown It | "Rahul's baby monitor. 'Outgrown It?' AI prices Rs.1,200-1,500. '47 parents near Pune want this.' Amazon handles everything." |
| 3:15-3:30 | Admin + AWS | "Powered by AWS EC2 + RDS + S3 + Amplify — free tier only. 7 products graded, 6 on marketplace, 3 refurbishing, 1 donated, 1 recycled." |

---

> [!IMPORTANT]
> **Summary of changes from the original Next.js plan:**
> 1. **Framework**: Next.js -> **Vite + React (JSX)** — no SSR needed for hackathon
> 2. **Language**: TypeScript -> **JavaScript** (`.jsx`/`.js`) — faster, no type errors
> 3. **Structure**: Monorepo -> **`frontend/` + `backend/` monofolder** — clean separation
> 4. **Backend**: Next.js API routes -> **Node.js + Express.js** — standalone REST API
> 5. **Hosting**: Vercel -> **AWS Amplify (frontend) + AWS EC2 (backend)** — Amazon judges
> 6. **Database**: Local PostgreSQL -> **AWS RDS PostgreSQL free tier** — showcases AWS
> 7. **Images**: Local uploads -> **AWS S3** — proper cloud storage
> 8. **Styling**: Vanilla CSS -> **Tailwind CSS v3** — utility-first, faster dev
> 9. **Theme**: Dark mode -> **Light mode** — Amazon-adjacent, familiar to judges
> 10. **State**: Next.js context -> **React Context + localStorage** — no extra libs
> 11. **All 10 pages** from persona_fixes.md included
> 12. **3-dev split**: Frontend / Backend API / DB+AI
