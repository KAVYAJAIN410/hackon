# ReLoop Backend API Documentation

The ReLoop API provides endpoints for the marketplace, returns processing, user management, and administrative dashboards. The base URL for all endpoints is `http://localhost:5000/api`.

---

## Table of Contents

1. [Users & Health](#1-users--health)
2. [Marketplace](#2-marketplace)
3. [Orders & Returns](#3-orders--returns)
4. [Grading & Routing](#4-grading--routing)
5. [Seller Dashboard](#5-seller-dashboard)
6. [Green Credits](#6-green-credits)
7. [Admin](#7-admin)

---

## 1. Users & Health

### 1.1 Health Check
**Endpoint:** `GET /api/health`
**Description:** Returns the current health status of the server.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-06-14T10:00:00.000Z"
}
```

### 1.2 Get All Users
**Endpoint:** `GET /api/users`
**Description:** Returns a list of all users on the platform along with their nearest delivery center.

**Response:**
```json
[
  {
    "id": "user-001",
    "name": "Ananya Sharma",
    "email": "ananya@email.com",
    "city": "New Delhi",
    "state": "Delhi",
    "greenCredits": 150,
    "greenTier": "SAPLING",
    "nearestDc": {
      "id": "dc-del-001",
      "name": "Delhi Warehouse",
      "city": "Delhi"
    }
  }
]
```

### 1.3 Platform Stats
**Endpoint:** `GET /api/stats`
**Description:** Returns top-level statistics for the landing page.

**Response:**
```json
{
  "totalReturns": 1250,
  "totalSold": 890,
  "co2SavedKg": 450.5,
  "totalGreenCredits": 15400
}
```

---

## 2. Marketplace

### 2.1 Get Marketplace Items
**Endpoint:** `GET /api/marketplace?user_id={id}`
**Description:** Fetches all available refurbished/resellable items. Passing `user_id` calculates localized shipping costs and demand signals.

**Response:**
```json
[
  {
    "id": "inv-001",
    "productId": "prod-008",
    "status": "AVAILABLE",
    "grade": "A",
    "basePrice": "9995.00",
    "sellingPrice": "7996.00",
    "source": "RETURN",
    "product": {
      "id": "prod-008",
      "name": "Nike Air Max 270 React",
      "category": "Fashion",
      "brand": "Nike",
      "imageUrl": "/images/nike_airmax.jpg"
    },
    "currentDc": {
      "id": "dc-del-001",
      "city": "Delhi"
    },
    "shipping": {
      "transferCost": 0,
      "lastMile": 65,
      "totalShipping": 65,
      "estimatedDays": 1
    },
    "isNearYou": true,
    "discountPct": 20
  }
]
```

### 2.2 Get Item Detail
**Endpoint:** `GET /api/marketplace/:id?user_id={id}`
**Description:** Fetches full details for a single marketplace listing, including the AI grading health card.

**Response:**
```json
{
  "id": "inv-001",
  "productId": "prod-008",
  "grade": "A",
  "basePrice": "9995.00",
  "sellingPrice": "7996.00",
  "product": {
    "name": "Nike Air Max 270 React",
    "description": "Nike Air Max 270 React, lightweight cushioning"
  },
  "grading": {
    "score": 85,
    "confidence": "92.5",
    "conditionSummary": "Item is in excellent condition with no visible wear.",
    "defectsFound": [],
    "missingParts": [],
    "functionalNotes": "Expected to function perfectly."
  },
  "shipping": {
    "transferCost": 0,
    "lastMile": 65,
    "totalShipping": 65,
    "estimatedDays": 1
  },
  "demandSignal": 12,
  "isNearYou": true
}
```

### 2.3 Buy Item
**Endpoint:** `POST /api/marketplace/:id/buy`
**Description:** Purchase an item from the marketplace. Awards green credits to the buyer.

**Body:**
```json
{
  "buyerId": "user-005"
}
```

**Response:**
```json
{
  "order": {
    "id": "mp-ord-002",
    "inventoryItemId": "inv-001",
    "buyerId": "user-005",
    "sellingPrice": 7996,
    "shippingCost": 65,
    "totalPrice": 8061,
    "status": "CONFIRMED"
  },
  "creditsAwarded": 25,
  "message": "Purchase successful! You earned 25 green credits."
}
```

---

## 3. Orders & Returns

### 3.1 Get User Orders
**Endpoint:** `GET /api/orders?user_id={id}`
**Description:** Lists a user's purchase history. Determines if an order is eligible for "Outgrown It" resale.

**Response:**
```json
[
  {
    "id": "ord-001",
    "productId": "prod-008",
    "status": "DELIVERED",
    "orderedAt": "2025-05-15T10:00:00.000Z",
    "product": {
      "name": "Nike Air Max 270 React",
      "mrp": "9995.00",
      "imageUrl": "/images/nike_airmax.jpg"
    },
    "hasActiveReturn": false,
    "hasActiveOutgrown": false,
    "outgrownEligible": true,
    "monthsSinceOrder": 12.5
  }
]
```

### 3.2 Initiate Return
**Endpoint:** `POST /api/returns`
**Description:** Starts the return process for an order.

**Body:**
```json
{
  "orderId": "ord-001",
  "userId": "user-001",
  "reason": "SIZE_FIT"
}
```

**Response:**
```json
{
  "id": "ret-001",
  "orderId": "ord-001",
  "status": "INITIATED",
  "reason": "SIZE_FIT"
}
```

### 3.3 Get User Returns
**Endpoint:** `GET /api/returns?user_id={id}`
**Description:** Fetches the return history and tracking statuses for a user.

**Response:**
```json
[
  {
    "id": "ret-001",
    "status": "GRADED",
    "reason": "SIZE_FIT",
    "routeDecision": "RESELL",
    "refundAmount": "9995.00",
    "createdAt": "2025-05-18T10:00:00.000Z",
    "product": {
      "name": "Nike Air Max 270 React"
    },
    "grading": {
      "grade": "A",
      "score": 85
    }
  }
]
```

---

## 4. Grading & Routing

### 4.1 Grade Return (AI)
**Endpoint:** `POST /api/grading`
**Description:** `multipart/form-data` endpoint. Uploads images to S3, grades the product via Gemini AI, determines the optimal route (Resell/Refurbish/Donate/Recycle), and awards Green Credits.

**Form-Data Fields:**
- `returnId`: The UUID of the return.
- `images`: Array of image files (max 5).

**Response:**
```json
{
  "grading": {
    "id": "ai-grad-001",
    "grade": "B",
    "score": 65,
    "confidence": 88.5,
    "conditionSummary": "Noticeable scratches on the back casing.",
    "defectsFound": [{"type": "scratch", "severity": "minor"}],
    "missingParts": [],
    "functionalNotes": "Powers on normally.",
    "gradeDiscountPct": 35
  },
  "routing": {
    "chosenRoute": "REFURBISH",
    "reason": "Grade B, profitable after refurbishment.",
    "alternatives": [
      {
        "route": "RESELL",
        "viable": false,
        "reason": "Scratches require refurbishment first"
      }
    ]
  },
  "creditsAwarded": 30,
  "inventoryItem": null,
  "imageUrls": [
    "https://reloop-hackathon-uploads.s3.amazonaws.com/returns/ret-001/img1.jpg",
    "https://reloop-hackathon-uploads.s3.amazonaws.com/returns/ret-001/img2.jpg"
  ],
  "message": "Product graded B. Amazon has routed this to: REFURBISH."
}
```

### 4.2 Outgrown It Listing
**Endpoint:** `POST /api/outgrown`
**Description:** Allows users to list a previously purchased item (that they have outgrown) directly to the ReLoop marketplace.

**Body:**
```json
{
  "orderId": "ord-019",
  "userId": "user-012"
}
```

**Response:**
```json
{
  "inventoryItem": {
    "id": "inv-009",
    "productId": "prod-025",
    "status": "AVAILABLE",
    "grade": "A",
    "sellingPrice": 1499,
    "source": "OUTGROWN"
  },
  "demandSignal": 5,
  "creditsAwarded": 75,
  "message": "Mi 360 Camera listed on ReLoop marketplace! 5 buyers near Pune are interested."
}
```

---

## 5. Seller Dashboard

### 5.1 Seller Returns & Analytics
**Endpoint:** `GET /api/seller/returns?seller_id={id}`
**Description:** Returns all returns associated with a seller, along with deep analytics (grade distribution, return reasons, recovery rate).

**Response:**
```json
{
  "returns": [
    {
      "id": "ret-001",
      "reason": "SIZE_FIT",
      "status": "LISTED",
      "grading": {
        "grade": "A",
        "routeDecision": "RESELL",
        "estimatedResaleValue": "7996.00"
      }
    }
  ],
  "analytics": {
    "totalReturns": 18,
    "totalGraded": 15,
    "resellableCount": 10,
    "totalRecovery": 145000,
    "recoveryRate": 66.6,
    "timeSavedHours": 1.5,
    "returnReasonsBreakdown": [
      { "reason": "SIZE_FIT", "count": 8, "percentage": 44.4 }
    ],
    "gradeDistribution": [
      { "grade": "A", "count": 5, "percentage": 33.3 },
      { "grade": "B", "count": 3, "percentage": 20.0 }
    ]
  }
}
```

### 5.2 Seller Batch Grade
**Endpoint:** `POST /api/seller/batch-grade`
**Description:** `multipart/form-data` endpoint. Sellers can upload up to 200 images to bulk-grade inventory.

**Form-Data Fields:**
- `sellerId`: UUID of the seller
- `images`: Array of image files.

**Response:**
```json
{
  "results": [
    {
      "filename": "shoe_front.jpg",
      "index": 0,
      "grade": "A",
      "score": 82,
      "route": "RESELL",
      "suggestedPrice": 2500,
      "status": "SUCCESS"
    }
  ],
  "summary": {
    "totalGraded": 1,
    "resellable": 1,
    "totalRecovery": 2500,
    "timeSavedHours": 0
  }
}
```

---

## 6. Green Credits

### 6.1 User Green Profile
**Endpoint:** `GET /api/green-credits?user_id={id}`
**Description:** Returns a user's total green credits, their current tier, history ledger, and overall environmental impact.

**Response:**
```json
{
  "balance": 1200,
  "tier": "SAPLING",
  "nextTier": "FOREST",
  "nextTierAt": 2000,
  "creditsNeeded": 800,
  "history": [
    {
      "id": "gcl-001",
      "amount": 25,
      "action": "PURCHASE_RELOOP",
      "description": "Purchased Sony WH-1000XM5 (Grade A) on ReLoop marketplace",
      "createdAt": "2025-05-25T10:00:00.000Z"
    }
  ],
  "impact": {
    "productsSecondLife": 3,
    "co2SavedKg": 1.35
  }
}
```

---

## 7. Admin

### 7.1 Admin Overview Dashboard
**Endpoint:** `GET /api/admin/overview`
**Description:** Fetches all platform-wide metrics: returns grouped by status and route, inventory grouped by grade, DC breakdown, cost savings analysis, and the live transaction feed.

**Response:**
```json
{
  "returnsByStatus": {
    "INITIATED": 1,
    "LISTED": 6,
    "ROUTED": 6,
    "RECEIVED_AT_DC": 2,
    "SOLD": 1
  },
  "returnsByRoute": {
    "RESELL": 8,
    "REFURBISH": 4,
    "DONATE": 2,
    "RECYCLE": 1
  },
  "inventoryByStatus": {
    "AVAILABLE": 7,
    "SOLD": 1
  },
  "inventoryByGrade": {
    "A": 5,
    "A+": 2
  },
  "dcInventory": [
    {
      "id": "dc-del-001",
      "name": "Delhi Warehouse",
      "city": "Delhi",
      "inventory": {
        "AVAILABLE": 2,
        "SOLD": 1
      }
    }
  ],
  "totalReturns": 18,
  "totalMarketplaceOrders": 1,
  "totalGreenCredits": 25,
  "co2SavedKg": 4.5,
  "costSavingsVsOldSystem": {
    "oldSystemCostPerItem": 440,
    "reloopAvgCostPerItem": 107,
    "savingsPerItem": 333,
    "totalItemsProcessed": 8,
    "totalSavings": 2664
  },
  "recentReturns": [
    {
      "id": "ret-018",
      "status": "ROUTED",
      "routeDecision": "DONATE",
      "user": { "name": "Ananya Sharma" }
    }
  ]
}
```
