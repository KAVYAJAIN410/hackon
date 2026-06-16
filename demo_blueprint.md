# 🎬 Hackathon Demo Blueprint: Scenario, Seed Data & Pages

---

## Part 1: The Demo Scenario — A Story That Shows Everything

### The Story We're Telling

We follow **3 real scenarios** that map directly to the hackathon's 3 personas (Priya, Rahul, Small Seller). Each scenario demonstrates different parts of the system:

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEMO STORYLINE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  SCENARIO 1: "The Return Journey"                                │
│  Ananya in Delhi returns Nike shoes (₹4,500)                     │
│  → Uploads photos → AI grades A → Listed on marketplace          │
│  → Vikram in Delhi sees it (same DC = ₹0 transfer, fast!)       │
│  → Priya in Mumbai also sees it (but with higher shipping)       │
│  → Cost breakdown shown to both                                  │
│  Shows: AI Grading, Smart Routing, Location-based pricing        │
│                                                                   │
│  SCENARIO 2: "The Marketplace Buyer"                             │
│  Vikram in Mumbai browses marketplace                            │
│  → Sees products from nearby DCs with great discounts            │
│  → Doesn't see a cheap phone case sitting in Kolkata (not viable)│
│  → Buys Sony headphones at 20% off, earns green credits          │
│  Shows: Marketplace filtering, cost transparency, green credits  │
│                                                                   │
│  SCENARIO 3: "The Full Spectrum"                                 │
│  A batch of returns at Delhi DC:                                  │
│  → Samsung phone (Grade A) → Marketplace ✅                      │
│  → JBL speaker (Grade B) → Refurbish at Mumbai center ⚙️        │
│  → Broken charger (Grade F) → Recycle ♻️                         │
│  Shows: Different grades, different routes, routing intelligence │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### What This Scenario Covers

| Feature | Where It Shows Up |
|---------|-------------------|
| AI Grading (image upload → grade) | Scenario 1: Ananya returns shoes |
| Smart Routing (grade → route decision) | Scenario 3: Different grades, different paths |
| Marketplace with location filtering | Scenario 2: Vikram sees different items than Priya |
| Cost breakdown transparency | Every product detail page |
| Product Health Card | Product detail page for any listed item |
| Green Credits | When Vikram buys, he earns credits |
| Admin view / analytics | Overview of all returns, routes, DC status |

---

## Part 2: Seed Data

### 2.1 Delivery Centers (5 DCs)

Keeping it to 5 — enough to show routing variety, small enough to explain in a demo.

```sql
INSERT INTO delivery_centers (id, name, code, city, state, latitude, longitude, pincode, type, can_inspect, can_refurbish, can_repackage, capacity, handling_cost) VALUES
('dc-del-001', 'Delhi Hub (Manesar)',       'DEL1', 'Delhi',     'Haryana',       28.3670,  76.9531, '122413', 'FULFILLMENT',       true, false, true, 50000, 25.00),
('dc-mum-001', 'Mumbai Hub (Bhiwandi)',     'MUM1', 'Mumbai',    'Maharashtra',   19.2965,  73.0591, '421302', 'FULFILLMENT',       true, true,  true, 45000, 25.00),
('dc-blr-001', 'Bangalore Hub (Devanahalli)','BLR1', 'Bangalore', 'Karnataka',     13.2468,  77.7130, '562110', 'FULFILLMENT',       true, true,  true, 40000, 25.00),
('dc-kol-001', 'Kolkata Hub (Howrah)',       'KOL1', 'Kolkata',   'West Bengal',   22.5868,  88.2463, '711101', 'DELIVERY_STATION',  true, false, true, 25000, 25.00),
('dc-hyd-001', 'Hyderabad Hub (Shamshabad)','HYD1', 'Hyderabad', 'Telangana',     17.2403,  78.4294, '500018', 'FULFILLMENT',       true, false, true, 30000, 25.00);
```

### 2.2 DC Routes (5×5 = 25 pre-computed routes)

```sql
-- Cost tiers based on real Indian trunk logistics:
-- Same DC: ₹0 | Same zone (<300km): ₹15 | Adjacent (300-800km): ₹30 | Far (800+km): ₹50

INSERT INTO dc_routes (source_dc_id, dest_dc_id, distance_km, transfer_cost, estimated_days) VALUES
-- From Delhi
('dc-del-001', 'dc-del-001',   0,     0.00, 0),  -- Same DC
('dc-del-001', 'dc-mum-001', 1400,   30.00, 2),  -- Delhi → Mumbai (adjacent)
('dc-del-001', 'dc-blr-001', 2150,   50.00, 3),  -- Delhi → Bangalore (far)
('dc-del-001', 'dc-kol-001', 1530,   50.00, 3),  -- Delhi → Kolkata (far)
('dc-del-001', 'dc-hyd-001', 1550,   50.00, 3),  -- Delhi → Hyderabad (far)

-- From Mumbai
('dc-mum-001', 'dc-del-001', 1400,   30.00, 2),
('dc-mum-001', 'dc-mum-001',   0,     0.00, 0),
('dc-mum-001', 'dc-blr-001',  980,   30.00, 2),  -- Mumbai → Bangalore (adjacent)
('dc-mum-001', 'dc-kol-001', 1960,   50.00, 3),  -- Mumbai → Kolkata (far)
('dc-mum-001', 'dc-hyd-001',  710,   30.00, 2),  -- Mumbai → Hyderabad (adjacent)

-- From Bangalore
('dc-blr-001', 'dc-del-001', 2150,   50.00, 3),
('dc-blr-001', 'dc-mum-001',  980,   30.00, 2),
('dc-blr-001', 'dc-blr-001',   0,     0.00, 0),
('dc-blr-001', 'dc-kol-001', 1870,   50.00, 3),
('dc-blr-001', 'dc-hyd-001',  570,   15.00, 1),  -- Bangalore → Hyderabad (same zone)

-- From Kolkata
('dc-kol-001', 'dc-del-001', 1530,   50.00, 3),
('dc-kol-001', 'dc-mum-001', 1960,   50.00, 3),
('dc-kol-001', 'dc-blr-001', 1870,   50.00, 3),
('dc-kol-001', 'dc-kol-001',   0,     0.00, 0),
('dc-kol-001', 'dc-hyd-001', 1490,   50.00, 3),

-- From Hyderabad
('dc-hyd-001', 'dc-del-001', 1550,   50.00, 3),
('dc-hyd-001', 'dc-mum-001',  710,   30.00, 2),
('dc-hyd-001', 'dc-blr-001',  570,   15.00, 1),
('dc-hyd-001', 'dc-kol-001', 1490,   50.00, 3),
('dc-hyd-001', 'dc-hyd-001',   0,     0.00, 0);
```

### 2.3 Products (20 real Indian products across 4 categories)

```sql
INSERT INTO products (id, name, category, subcategory, brand, mrp, weight_grams, image_url, description) VALUES
-- ELECTRONICS (7 products)
('prod-001', 'Samsung Galaxy M34 5G (128GB, Midnight Blue)',           'Electronics', 'Smartphones',  'Samsung',   18999.00, 208,  '/images/samsung_m34.jpg',       'Samsung Galaxy M34 5G with 6000mAh battery, 50MP camera'),
('prod-002', 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',  'Electronics', 'Headphones',   'Sony',      24990.00, 250,  '/images/sony_xm5.jpg',          'Industry leading noise cancellation, 30hr battery'),
('prod-003', 'boAt Airdopes 141 TWS Earbuds',                         'Electronics', 'Earbuds',      'boAt',        1299.00, 45,   '/images/boat_airdopes.jpg',     'boAt Airdopes 141 with 42H playtime, ENx tech'),
('prod-004', 'JBL Flip 6 Portable Bluetooth Speaker',                 'Electronics', 'Speakers',     'JBL',         9999.00, 550,  '/images/jbl_flip6.jpg',         'JBL Flip 6 with IP67 waterproof, 12hr playtime'),
('prod-005', 'Apple AirPods Pro (2nd Gen) with USB-C',                'Electronics', 'Earbuds',      'Apple',      24900.00, 51,   '/images/airpods_pro.jpg',       'Active Noise Cancellation, Adaptive Transparency, USB-C'),
('prod-006', 'Redmi 27" Full HD IPS Monitor',                         'Electronics', 'Monitors',     'Redmi',      11999.00, 4200, '/images/redmi_monitor.jpg',     '27 inch FHD IPS, 75Hz, low blue light'),
('prod-007', 'Ambrane 20000mAh Power Bank',                           'Electronics', 'Accessories',  'Ambrane',     1099.00, 420,  '/images/ambrane_powerbank.jpg', '20000mAh, 20W fast charging, Type-C input'),

-- FASHION (6 products)
('prod-008', 'Nike Air Max 270 React (Size 8, Black/White)',           'Fashion',     'Shoes',        'Nike',        9995.00, 350,  '/images/nike_airmax.jpg',       'Nike Air Max 270 React, lightweight cushioning'),
('prod-009', 'Levi''s 511 Slim Fit Jeans (32W, Dark Indigo)',          'Fashion',     'Jeans',        'Levi''s',     2999.00, 650,  '/images/levis_511.jpg',         'Levi''s 511 slim fit, premium stretch denim'),
('prod-010', 'Allen Solly Formal Shirt (Size 40, White)',              'Fashion',     'Shirts',       'Allen Solly', 1499.00, 200,  '/images/allen_solly.jpg',       'Allen Solly cotton formal shirt, regular fit'),
('prod-011', 'Wildcraft 45L Trekking Backpack (Grey)',                 'Fashion',     'Bags',         'Wildcraft',   3499.00, 900,  '/images/wildcraft_bag.jpg',     '45L capacity, rain cover, laptop compartment'),
('prod-012', 'Casio G-Shock GA-2100 Watch (Carbon Core)',              'Fashion',     'Watches',      'Casio',       9995.00, 72,   '/images/casio_gshock.jpg',      'Carbon Core Guard, 200m water resistance'),
('prod-013', 'U.S. Polo T-Shirt (Size L, Navy)',                       'Fashion',     'T-Shirts',     'U.S. Polo',    899.00, 180,  '/images/uspolo_tshirt.jpg',     'Classic polo t-shirt, 100% cotton'),

-- HOME & KITCHEN (4 products)
('prod-014', 'Prestige IRIS 750W Mixer Grinder (3 Jars)',              'Home',        'Kitchen',      'Prestige',    3295.00, 3200, '/images/prestige_mixer.jpg',    'IRIS 750W with 3 stainless steel jars'),
('prod-015', 'Pigeon 12L OTG Oven',                                   'Home',        'Kitchen',      'Pigeon',      3190.00, 4800, '/images/pigeon_otg.jpg',        '12L capacity, 60min timer, 3 cooking modes'),
('prod-016', 'Milton Thermosteel Flask 1L (Steel)',                    'Home',        'Kitchen',      'Milton',       899.00, 380,  '/images/milton_flask.jpg',      '1L capacity, 24hr hot & cold retention'),

-- BOOKS & OTHERS (3 products)
('prod-017', 'Atomic Habits by James Clear (Paperback)',               'Books',       'Self-Help',    'Penguin',      499.00, 320,  '/images/atomic_habits.jpg',     'Bestselling book on building good habits'),
('prod-018', 'Logitech MK270r Wireless Keyboard + Mouse Combo',       'Electronics', 'Peripherals',  'Logitech',    1595.00, 560,  '/images/logitech_mk270.jpg',    'Full-size keyboard, ambidextrous mouse, 2.4GHz'),
('prod-019', 'Fire-Boltt Phoenix Smart Watch',                        'Electronics', 'Smartwatches', 'Fire-Boltt',  1499.00, 55,   '/images/fireboltt_phoenix.jpg', '1.3" display, SpO2, heart rate, 7-day battery'),
('prod-020', 'Cello Signature Carbon Gift Set (Ball Pen + Roller Pen)','Stationery',  'Pens',         'Cello',        850.00, 120,  '/images/cello_pens.jpg',        'Premium ball pen + roller pen gift set');
```

### 2.4 Users (8 users across 5 cities)

```sql
INSERT INTO users (id, name, email, phone, latitude, longitude, pincode, city, state, nearest_dc_id, green_credits, green_tier) VALUES
-- Delhi area
('user-001', 'Ananya Sharma',    'ananya@email.com',    '9876543210', 28.6139, 77.2090, '110001', 'New Delhi',  'Delhi',        'dc-del-001', 0,    'SEEDLING'),
('user-002', 'Rohan Mehta',      'rohan@email.com',     '9876543211', 28.4595, 77.0266, '122002', 'Gurgaon',   'Haryana',      'dc-del-001', 350,  'SEEDLING'),

-- Mumbai area
('user-003', 'Vikram Patel',     'vikram@email.com',    '9876543212', 19.0760, 72.8777, '400001', 'Mumbai',    'Maharashtra',  'dc-mum-001', 520,  'SAPLING'),
('user-004', 'Priya Nair',       'priya@email.com',     '9876543213', 18.5204, 73.8567, '411001', 'Pune',      'Maharashtra',  'dc-mum-001', 100,  'SEEDLING'),

-- Bangalore area
('user-005', 'Karthik Reddy',    'karthik@email.com',   '9876543214', 12.9716, 77.5946, '560001', 'Bangalore', 'Karnataka',    'dc-blr-001', 1200, 'SAPLING'),

-- Kolkata area
('user-006', 'Sneha Banerjee',   'sneha@email.com',     '9876543215', 22.5726, 88.3639, '700001', 'Kolkata',   'West Bengal',  'dc-kol-001', 80,   'SEEDLING'),

-- Hyderabad area
('user-007', 'Arjun Rao',        'arjun@email.com',     '9876543216', 17.3850, 78.4867, '500001', 'Hyderabad', 'Telangana',    'dc-hyd-001', 2100, 'TREE'),

-- Another Delhi user (to show same-city matching)
('user-008', 'Meera Kapoor',     'meera@email.com',     '9876543217', 28.5355, 77.3910, '110096', 'Noida',     'Uttar Pradesh','dc-del-001', 0,    'SEEDLING');
```

### 2.5 Orders (15 original orders — these are what get returned)

```sql
INSERT INTO orders (id, user_id, product_id, quantity, unit_price, total_price, status, fulfilled_from_dc, ordered_at, delivered_at) VALUES
-- Ananya's orders (Delhi)
('ord-001', 'user-001', 'prod-008', 1,  9995.00,  9995.00, 'RETURN_REQUESTED', 'dc-del-001', '2025-05-15', '2025-05-18'),  -- Nike shoes
('ord-002', 'user-001', 'prod-002', 1, 24990.00, 24990.00, 'DELIVERED',        'dc-del-001', '2025-05-20', '2025-05-23'),  -- Sony headphones

-- Rohan's orders (Gurgaon → Delhi DC)
('ord-003', 'user-002', 'prod-001', 1, 18999.00, 18999.00, 'RETURN_REQUESTED', 'dc-del-001', '2025-05-10', '2025-05-13'),  -- Samsung phone
('ord-004', 'user-002', 'prod-003', 1,  1299.00,  1299.00, 'RETURN_REQUESTED', 'dc-del-001', '2025-05-22', '2025-05-24'),  -- boAt earbuds
('ord-005', 'user-002', 'prod-007', 1,  1099.00,  1099.00, 'RETURN_REQUESTED', 'dc-del-001', '2025-05-25', '2025-05-27'),  -- Ambrane power bank

-- Vikram's orders (Mumbai)
('ord-006', 'user-003', 'prod-004', 1,  9999.00,  9999.00, 'RETURN_REQUESTED', 'dc-mum-001', '2025-05-12', '2025-05-15'),  -- JBL speaker
('ord-007', 'user-003', 'prod-009', 1,  2999.00,  2999.00, 'RETURN_REQUESTED', 'dc-mum-001', '2025-05-18', '2025-05-20'),  -- Levi's jeans

-- Priya's orders (Pune → Mumbai DC)
('ord-008', 'user-004', 'prod-010', 1,  1499.00,  1499.00, 'RETURN_REQUESTED', 'dc-mum-001', '2025-05-20', '2025-05-23'),  -- Allen Solly shirt

-- Karthik's orders (Bangalore)
('ord-009', 'user-005', 'prod-005', 1, 24900.00, 24900.00, 'RETURN_REQUESTED', 'dc-blr-001', '2025-05-08', '2025-05-11'),  -- AirPods Pro
('ord-010', 'user-005', 'prod-014', 1,  3295.00,  3295.00, 'RETURN_REQUESTED', 'dc-blr-001', '2025-05-14', '2025-05-17'),  -- Prestige mixer

-- Sneha's orders (Kolkata)
('ord-011', 'user-006', 'prod-013', 1,   899.00,   899.00, 'RETURN_REQUESTED', 'dc-kol-001', '2025-05-19', '2025-05-22'),  -- US Polo T-shirt
('ord-012', 'user-006', 'prod-017', 1,   499.00,   499.00, 'RETURN_REQUESTED', 'dc-kol-001', '2025-05-21', '2025-05-23'),  -- Atomic Habits book

-- Arjun's orders (Hyderabad)
('ord-013', 'user-007', 'prod-006', 1, 11999.00, 11999.00, 'RETURN_REQUESTED', 'dc-hyd-001', '2025-05-16', '2025-05-19'),  -- Redmi monitor
('ord-014', 'user-007', 'prod-012', 1,  9995.00,  9995.00, 'RETURN_REQUESTED', 'dc-hyd-001', '2025-05-22', '2025-05-25'),  -- Casio G-Shock

-- Meera's orders (Noida → Delhi DC)
('ord-015', 'user-008', 'prod-018', 1,  1595.00,  1595.00, 'RETURN_REQUESTED', 'dc-del-001', '2025-05-23', '2025-05-25');  -- Logitech combo
```

### 2.6 Returns (15 returns — spread across all grades and statuses)

This is where we carefully craft the demo. Different stages, different grades, different routes:

```sql
INSERT INTO returns (id, order_id, reason, reason_detail, refund_amount, status, current_dc_id, pickup_cost, picked_up_at, received_at, created_at) VALUES

-- ============ GRADE A — Will appear on marketplace ============

-- Ananya's Nike shoes → GRADE A → Marketplace (the demo hero!)
('ret-001', 'ord-001', 'SIZE_FIT',
 'Ordered size 8 but need size 7. Product is perfect, unused.',
 9995.00, 'LISTED', 'dc-del-001', 65.00,
 '2025-05-19 10:00:00', '2025-05-19 14:00:00', '2025-05-18 20:00:00'),

-- Rohan's Samsung phone → GRADE A → Marketplace
('ret-002', 'ord-003', 'CHANGED_MIND',
 'Decided to go with iPhone instead. Phone is brand new, opened box only.',
 18999.00, 'LISTED', 'dc-del-001', 65.00,
 '2025-05-14 09:00:00', '2025-05-14 13:00:00', '2025-05-13 18:00:00'),

-- Karthik's AirPods Pro → GRADE A+ → Marketplace
('ret-003', 'ord-009', 'CHANGED_MIND',
 'Got them as a gift, already have a pair. Sealed box, never opened.',
 24900.00, 'LISTED', 'dc-blr-001', 65.00,
 '2025-05-12 11:00:00', '2025-05-12 15:00:00', '2025-05-11 19:00:00'),

-- Arjun's Casio G-Shock → GRADE A → Marketplace
('ret-004', 'ord-014', 'NOT_AS_DESCRIBED',
 'Color looks different from listing photos. Watch works perfectly fine.',
 9995.00, 'LISTED', 'dc-hyd-001', 65.00,
 '2025-05-26 08:00:00', '2025-05-26 12:00:00', '2025-05-25 21:00:00'),

-- Priya's Allen Solly shirt → GRADE A → Marketplace
('ret-005', 'ord-008', 'SIZE_FIT',
 'Size 40 is too tight. Shirt is unworn with all tags intact.',
 1499.00, 'LISTED', 'dc-mum-001', 65.00,
 '2025-05-24 10:00:00', '2025-05-24 14:00:00', '2025-05-23 17:00:00'),

-- Arjun's Redmi Monitor → GRADE A → Marketplace
('ret-006', 'ord-013', 'CHANGED_MIND',
 'Bought a bigger 32" monitor instead. This one was opened, tested, repacked.',
 11999.00, 'LISTED', 'dc-hyd-001', 65.00,
 '2025-05-20 09:00:00', '2025-05-20 16:00:00', '2025-05-19 22:00:00'),


-- ============ GRADE B — Refurbish route ============

-- Vikram's JBL speaker → GRADE B → Refurbish (minor scratch on body)
('ret-007', 'ord-006', 'QUALITY',
 'Small scratch on the bottom. Sound quality is fine.',
 9999.00, 'ROUTED', 'dc-mum-001', 65.00,
 '2025-05-16 10:00:00', '2025-05-16 15:00:00', '2025-05-15 20:00:00'),

-- Vikram's Levi's jeans → GRADE B → Refurbish (tags removed, tried on)
('ret-008', 'ord-007', 'SIZE_FIT',
 'Waist is fine but length is too long. Tried on once, tags removed.',
 2999.00, 'ROUTED', 'dc-mum-001', 65.00,
 '2025-05-21 11:00:00', '2025-05-21 14:00:00', '2025-05-20 19:00:00'),

-- Karthik's Prestige mixer → GRADE B → Refurbish (used once, minor marks)
('ret-009', 'ord-010', 'QUALITY',
 'Motor makes slight noise. Used once for grinding. Minor marks on base.',
 3295.00, 'ROUTED', 'dc-blr-001', 65.00,
 '2025-05-18 08:00:00', '2025-05-18 12:00:00', '2025-05-17 16:00:00'),


-- ============ GRADE C — Also refurbish (deeper issues) ============

-- Meera's Logitech combo → GRADE C → Refurbish (missing mouse dongle)
('ret-010', 'ord-015', 'DEFECTIVE',
 'Mouse receiver was missing from the box. Keyboard works fine.',
 1595.00, 'ROUTED', 'dc-del-001', 65.00,
 '2025-05-26 09:00:00', '2025-05-26 13:00:00', '2025-05-25 18:00:00'),


-- ============ GRADE D — Donate ============

-- Sneha's US Polo T-shirt → GRADE D → Donate (stain, stretched)
('ret-011', 'ord-011', 'QUALITY',
 'Has a noticeable stain on front. Fabric slightly stretched.',
 899.00, 'ROUTED', 'dc-kol-001', 65.00,
 '2025-05-23 10:00:00', '2025-05-23 14:00:00', '2025-05-22 20:00:00'),


-- ============ GRADE F — Recycle ============

-- Rohan's Ambrane power bank → GRADE F → Recycle (swollen battery)
('ret-012', 'ord-005', 'DEFECTIVE',
 'Battery is swollen, device doesn''t charge. Possible safety hazard.',
 1099.00, 'ROUTED', 'dc-del-001', 65.00,
 '2025-05-28 09:00:00', '2025-05-28 11:00:00', '2025-05-27 14:00:00'),


-- ============ RECENTLY RETURNED — Awaiting grading (for live demo) ============

-- Rohan's boAt earbuds → Just received, NOT yet graded (demo this live!)
('ret-013', 'ord-004', 'NOT_AS_DESCRIBED',
 'Sound quality doesn''t match what reviews said. One earbud slightly quieter.',
 1299.00, 'RECEIVED_AT_DC', 'dc-del-001', 65.00,
 '2025-05-25 10:00:00', '2025-05-25 14:00:00', '2025-05-24 21:00:00'),

-- Sneha's Atomic Habits → Just received, NOT yet graded
('ret-014', 'ord-012', 'CHANGED_MIND',
 'Already read it digitally. Book is in perfect condition, unread.',
 499.00, 'RECEIVED_AT_DC', 'dc-kol-001', 65.00,
 '2025-05-24 11:00:00', '2025-05-24 15:00:00', '2025-05-23 18:00:00'),

-- SOLD item (shows complete lifecycle)
-- We'll add this as an already-sold marketplace order later
('ret-015', 'ord-002', 'CHANGED_MIND',
 'Switching to Bose. Sony headphones work perfectly, minimal use.',
 24990.00, 'SOLD', 'dc-del-001', 65.00,
 '2025-05-24 08:00:00', '2025-05-24 12:00:00', '2025-05-23 15:00:00');
```

### 2.7 Return Images

```sql
INSERT INTO return_images (id, return_id, image_url, uploaded_by, image_type) VALUES
-- Nike shoes (Grade A)
('img-001', 'ret-001', '/uploads/ret-001/front.jpg',     'CUSTOMER',        'FRONT'),
('img-002', 'ret-001', '/uploads/ret-001/back.jpg',      'CUSTOMER',        'BACK'),
('img-003', 'ret-001', '/uploads/ret-001/sole.jpg',      'CUSTOMER',        'DEFECT_CLOSEUP'),
('img-004', 'ret-001', '/uploads/ret-001/box.jpg',       'DELIVERY_AGENT',  'PACKAGING'),

-- Samsung phone (Grade A)
('img-005', 'ret-002', '/uploads/ret-002/front.jpg',     'CUSTOMER',        'FRONT'),
('img-006', 'ret-002', '/uploads/ret-002/back.jpg',      'CUSTOMER',        'BACK'),
('img-007', 'ret-002', '/uploads/ret-002/screen.jpg',    'DC_STAFF',        'DEFECT_CLOSEUP'),

-- JBL speaker (Grade B — scratch visible)
('img-008', 'ret-007', '/uploads/ret-007/front.jpg',     'CUSTOMER',        'FRONT'),
('img-009', 'ret-007', '/uploads/ret-007/scratch.jpg',   'DC_STAFF',        'DEFECT_CLOSEUP'),

-- boAt earbuds (pending grading — for live demo)
('img-010', 'ret-013', '/uploads/ret-013/front.jpg',     'CUSTOMER',        'FRONT'),
('img-011', 'ret-013', '/uploads/ret-013/case.jpg',      'CUSTOMER',        'BACK'),
('img-012', 'ret-013', '/uploads/ret-013/earbuds.jpg',   'DELIVERY_AGENT',  'DEFECT_CLOSEUP');
```

### 2.8 AI Gradings

```sql
INSERT INTO ai_gradings (id, return_id, grade, score, confidence, exterior_score, functional_notes, defects_found, missing_parts, route_decision, estimated_resale_value, grade_discount_pct, graded_at) VALUES

-- GRADE A+ : AirPods Pro (sealed, never opened)
('grade-003', 'ret-003', 'A+', 98, 0.9700,
 99, 'Sealed box. Never opened. All accessories present.',
 '[]', '{}',
 'RESELL', 22410.00, 10.00, '2025-05-12 15:30:00'),

-- GRADE A : Nike shoes (unused, perfect condition)
('grade-001', 'ret-001', 'A', 92, 0.9400,
 95, 'Shoes appear unworn. Sole has no wear marks. Laces intact.',
 '[{"type": "none", "severity": "none", "location": "N/A"}]',
 '{}',
 'RESELL', 7996.00, 20.00, '2025-05-19 14:30:00'),

-- GRADE A : Samsung phone (opened, brand new condition)
('grade-002', 'ret-002', 'A', 94, 0.9600,
 96, 'Screen pristine. No scratches on body. Battery at 100%.',
 '[]', '{}',
 'RESELL', 15199.00, 20.00, '2025-05-14 13:45:00'),

-- GRADE A : Casio G-Shock (perfect condition)
('grade-004', 'ret-004', 'A', 91, 0.9200,
 93, 'Watch in excellent condition. All functions working. Box included.',
 '[]', '{}',
 'RESELL', 7996.00, 20.00, '2025-05-26 12:30:00'),

-- GRADE A : Allen Solly shirt (unworn, tags intact)
('grade-005', 'ret-005', 'A', 93, 0.9500,
 97, 'Shirt has all tags. No wrinkles or stains. Packaging intact.',
 '[]', '{}',
 'RESELL', 1199.00, 20.00, '2025-05-24 14:20:00'),

-- GRADE A : Redmi Monitor (opened, tested, repacked)
('grade-006', 'ret-006', 'A', 90, 0.9100,
 91, 'Screen has zero dead pixels. Stand has minor fingerprints only. All cables present.',
 '[{"type": "fingerprints", "severity": "negligible", "location": "stand"}]',
 '{}',
 'RESELL', 9599.00, 20.00, '2025-05-20 16:30:00'),

-- GRADE B : JBL speaker (minor scratch)
('grade-007', 'ret-007', 'B', 78, 0.8800,
 72, 'Sound output excellent. Waterproofing intact. Cosmetic scratch on bottom.',
 '[{"type": "scratch", "severity": "minor", "location": "bottom_panel"}]',
 '{}',
 'REFURBISH', 6499.00, 35.00, '2025-05-16 15:30:00'),

-- GRADE B : Levi's jeans (tried on, tags removed)
('grade-008', 'ret-008', 'B', 75, 0.8500,
 80, 'Jeans tried on. Tags removed. No stains or damage. Slight crease at knees.',
 '[{"type": "crease", "severity": "minor", "location": "knees"}]',
 '{}',
 'REFURBISH', 1949.00, 35.00, '2025-05-21 14:30:00'),

-- GRADE B : Prestige mixer (used once, minor marks)
('grade-009', 'ret-009', 'B', 72, 0.8200,
 68, 'Motor functions but slightly noisy. Base has usage marks. Jars have minor scratches.',
 '[{"type": "scratch", "severity": "minor", "location": "jars"}, {"type": "noise", "severity": "minor", "location": "motor"}]',
 '{}',
 'REFURBISH', 2141.00, 35.00, '2025-05-18 12:30:00'),

-- GRADE C : Logitech combo (missing part)
('grade-010', 'ret-010', 'C', 55, 0.8000,
 70, 'Keyboard fully functional. Mouse works but receiver is missing — needs replacement.',
 '[{"type": "missing_component", "severity": "major", "location": "mouse_receiver"}]',
 '{"mouse_receiver"}',
 'REFURBISH', 798.00, 50.00, '2025-05-26 13:30:00'),

-- GRADE D : US Polo T-shirt (stained, stretched)
('grade-011', 'ret-011', 'D', 30, 0.8700,
 25, 'Visible stain on chest area. Collar stretched. Not resellable.',
 '[{"type": "stain", "severity": "major", "location": "chest"}, {"type": "stretch", "severity": "moderate", "location": "collar"}]',
 '{}',
 'DONATE', 0, 0, '2025-05-23 14:30:00'),

-- GRADE F : Ambrane power bank (swollen battery)
('grade-012', 'ret-012', 'F', 5, 0.9500,
 10, 'Battery swollen. Safety hazard. Must be sent to certified e-waste recycler.',
 '[{"type": "battery_swell", "severity": "critical", "location": "internal"}]',
 '{}',
 'RECYCLE', 0, 0, '2025-05-28 11:30:00'),

-- Sony headphones (SOLD — complete lifecycle)
('grade-015', 'ret-015', 'A', 91, 0.9300,
 90, 'Headphones in great condition. Minor wear on headband padding. ANC working perfectly.',
 '[{"type": "wear", "severity": "minor", "location": "headband"}]',
 '{}',
 'RESELL', 19992.00, 20.00, '2025-05-24 12:30:00');

-- NOTE: ret-013 (boAt earbuds) and ret-014 (Atomic Habits) have NO grading yet
-- These are the ones we grade LIVE during the demo!
```

### 2.9 Inventory Items (Only A-grade items that passed routing to marketplace)

```sql
INSERT INTO inventory_items (id, product_id, return_id, grading_id, current_dc_id, grade, condition_label, base_price, status) VALUES

-- Available on marketplace
('inv-001', 'prod-008', 'ret-001', 'grade-001', 'dc-del-001', 'A',  'Excellent',  7996.00, 'AVAILABLE'),  -- Nike shoes @ Delhi
('inv-002', 'prod-001', 'ret-002', 'grade-002', 'dc-del-001', 'A',  'Excellent', 15199.00, 'AVAILABLE'),  -- Samsung phone @ Delhi
('inv-003', 'prod-005', 'ret-003', 'grade-003', 'dc-blr-001', 'A+', 'Like New',  22410.00, 'AVAILABLE'),  -- AirPods Pro @ Bangalore
('inv-004', 'prod-012', 'ret-004', 'grade-004', 'dc-hyd-001', 'A',  'Excellent',  7996.00, 'AVAILABLE'),  -- Casio G-Shock @ Hyderabad
('inv-005', 'prod-010', 'ret-005', 'grade-005', 'dc-mum-001', 'A',  'Excellent',  1199.00, 'AVAILABLE'),  -- Allen Solly shirt @ Mumbai
('inv-006', 'prod-006', 'ret-006', 'grade-006', 'dc-hyd-001', 'A',  'Excellent',  9599.00, 'AVAILABLE'),  -- Redmi Monitor @ Hyderabad

-- Already sold (completed lifecycle)
('inv-007', 'prod-002', 'ret-015', 'grade-015', 'dc-del-001', 'A',  'Excellent', 19992.00, 'SOLD');       -- Sony headphones (SOLD)
```

### 2.10 Marketplace Order (One completed sale to show full lifecycle)

```sql
-- Karthik in Bangalore bought the Sony headphones from Delhi DC
INSERT INTO marketplace_orders (id, buyer_id, inventory_item_id, item_base_price, shipping_cost, platform_fee, total_price, discount_pct, source_dc_id, dest_dc_id, green_credits_earned, status, ordered_at, delivered_at) VALUES
('mp-ord-001', 'user-005', 'inv-007',
 19992.00,                          -- Base price (MRP ₹24,990 × 0.80)
 115.00,                            -- Shipping: ₹50 (DEL→BLR) + ₹65 (last mile)
 2399.00,                           -- Platform fee (12%)
 22506.00,                          -- Total buyer pays
 20.00,                             -- 20% off MRP
 'dc-del-001', 'dc-blr-001',
 20,                                -- Green credits earned
 'DELIVERED',
 '2025-05-25 09:00:00', '2025-05-28 14:00:00');
```

### 2.11 Green Credits Ledger (Karthik earned credits from the purchase)

```sql
INSERT INTO green_credits_ledger (id, user_id, amount, balance_after, action, reference_id, description) VALUES
('gc-001', 'user-005', 20, 1220, 'BOUGHT_RENEWED', 'mp-ord-001',
 'Purchased Sony WH-1000XM5 (Grade A) — saved 0.25 kg CO₂');
```

### 2.12 Grade Config (Business rules)

```sql
INSERT INTO grade_config (grade, condition_label, discount_pct, route, min_mrp_for_marketplace) VALUES
('A+', 'Like New',   10.00, 'RESELL',    100.00),
('A',  'Excellent',  20.00, 'RESELL',    150.00),
('B',  'Good',       35.00, 'REFURBISH', 3000.00),  -- B-grade only listed if MRP > ₹3000
('C',  'Fair',       50.00, 'REFURBISH', NULL),      -- C goes to refurbish, not marketplace
('D',  'Poor',        0,    'DONATE',    NULL),
('F',  'Broken',      0,    'RECYCLE',   NULL);
```

---

## Part 3: What Each Buyer Sees — The Demo Money Shot

This table shows exactly how location-based filtering works with our seed data:

### Vikram in Mumbai (nearest DC: MUM1)

| Product | At DC | Transfer | Last Mile | Total Cost | Selling Price | Viable? | Discount |
|---------|-------|----------|-----------|------------|---------------|---------|----------|
| Nike Air Max ₹9,995 | DEL1 | ₹30 | ₹65 | ₹157 | ₹7,996 | ✅ YES | 20% off |
| Samsung M34 ₹18,999 | DEL1 | ₹30 | ₹65 | ₹157 | ₹15,199 | ✅ YES | 20% off |
| AirPods Pro ₹24,900 | BLR1 | ₹30 | ₹65 | ₹157 | ₹22,410 | ✅ YES | 10% off |
| Casio G-Shock ₹9,995 | HYD1 | ₹30 | ₹65 | ₹157 | ₹7,996 | ✅ YES | 20% off |
| Allen Solly ₹1,499 | MUM1 | **₹0** | ₹65 | ₹127 | ₹1,199 | ✅ YES 🚀 | 20% off |
| Redmi Monitor ₹11,999 | HYD1 | ₹30 | ₹65 | ₹157 | ₹9,599 | ✅ YES | 20% off |

**Vikram sees all 6 items.** Allen Solly is at his own DC — tagged "Near you!"

### Sneha in Kolkata (nearest DC: KOL1)

| Product | At DC | Transfer | Last Mile | Total Cost | Selling Price | Viable? | Discount |
|---------|-------|----------|-----------|------------|---------------|---------|----------|
| Nike Air Max ₹9,995 | DEL1 | ₹50 | ₹65 | ₹177 | ₹7,996 | ✅ YES | 20% off |
| Samsung M34 ₹18,999 | DEL1 | ₹50 | ₹65 | ₹177 | ₹15,199 | ✅ YES | 20% off |
| AirPods Pro ₹24,900 | BLR1 | ₹50 | ₹65 | ₹177 | ₹22,410 | ✅ YES | 10% off |
| Casio G-Shock ₹9,995 | HYD1 | ₹50 | ₹65 | ₹177 | ₹7,996 | ✅ YES | 20% off |
| Allen Solly ₹1,499 | MUM1 | ₹50 | ₹65 | ₹177 | ₹1,199 | ✅ YES | 20% off |
| Redmi Monitor ₹11,999 | HYD1 | ₹50 | ₹65 | ₹177 | ₹9,599 | ✅ YES | 20% off |

**Sneha also sees all 6.** But notice her shipping costs are higher because Kolkata is far from all source DCs. The items still pass viability because even ₹1,199 > ₹177.

> [!NOTE]
> With our current product mix (all MRP > ₹850), most items are viable for most users. In a real system with items like ₹100-200 phone cases, the filtering becomes much more dramatic. For the demo, I recommend you verbally explain: *"With a ₹150 phone case at the Kolkata DC, a buyer in Mumbai would NOT see it because ₹127 selling price < ₹177 cost. But a buyer IN Kolkata would see it because cost is only ₹127."* Judges will love that you thought about this even though the demo data doesn't trigger it — or we can add one cheap product to force it.

---

## Part 4: Pages We Need to Build

### Overview — 7 Pages

```
┌─────────────────────────────────────────────────────────────┐
│                       SITEMAP                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. LANDING PAGE        → What is ReLoop? Value proposition  │
│  2. MARKETPLACE         → Browse viable products (hero page) │
│  3. PRODUCT DETAIL      → Health card + cost breakdown + buy │
│  4. RETURN FLOW         → Initiate return → AI grades it     │
│  5. MY RETURNS          → Track all your returns + statuses  │
│  6. GREEN PROFILE       → Credits, tier, impact dashboard    │
│  7. ADMIN DASHBOARD     → All returns, routing, DC overview  │
│                                                               │
│  Shared: Navbar with user selector + location indicator      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

### PAGE 1: Landing Page (`/`)

**Purpose**: Hook the judges in 10 seconds. Explain what ReLoop is.

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR: [ReLoop Logo] [Marketplace] [Return Item]       │
│          [My Returns] [Green Profile]   [User: Vikram ▾] │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  HERO SECTION:                                            │
│  ┌───────────────────────────────────────────────────┐   │
│  │  "Every returned product deserves a second life"   │   │
│  │                                                    │   │
│  │  ReLoop is Amazon's intelligent bridge that        │   │
│  │  connects returned products with their next        │   │
│  │  best owner — instantly, affordably, sustainably.  │   │
│  │                                                    │   │
│  │  [Browse Marketplace]  [Return an Item]            │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  HOW IT WORKS (4 steps with icons):                      │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                │
│  │  📸  │  │  🤖  │  │  🛣️  │  │  🏥  │                │
│  │Upload│→ │  AI  │→ │Smart │→ │Health│                 │
│  │Photos│  │Grade │  │Route │  │Card  │                 │
│  │      │  │<2sec │  │      │  │      │                 │
│  └──────┘  └──────┘  └──────┘  └──────┘                │
│                                                           │
│  IMPACT COUNTER (live from DB):                          │
│  ┌──────────────────────────────────────────┐            │
│  │ 🔄 7 Products Saved  │ 🌿 3.2kg CO₂     │            │
│  │ 💚 1 Item Sold       │ ♻️ 1 Recycled     │            │
│  └──────────────────────────────────────────┘            │
│                                                           │
│  LIVE STATS (real from seed data):                       │
│  "7 products graded • 6 on marketplace • 1 sold         │
│   3 sent for refurbishment • 1 donated • 1 recycled"    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Data needed from API:**
- `GET /api/stats/overview` — counts of items by status, total CO₂ saved, total credits issued

---

### PAGE 2: Marketplace (`/marketplace`) — ⭐ THE HERO PAGE

**Purpose**: Show location-aware product listing with cost transparency. This is the page judges will scrutinize most.

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  HEADER:                                                  │
│  ┌───────────────────────────────────────────────────┐   │
│  │ 🔄 ReLoop Marketplace                             │   │
│  │ Browsing as: Vikram Patel • 📍 Mumbai (MUM1)      │   │
│  │ [Switch User ▾]     ← For demo: switch between    │   │
│  │                       users to show different      │   │
│  │                       products/pricing             │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  FILTERS BAR:                                             │
│  [All Categories ▾] [Sort by: Best Discount ▾]           │
│  [Grade: A+ | A] [Price Range ▾]                         │
│                                                           │
│  PRODUCT GRID (cards):                                    │
│  ┌──────────────────────┐ ┌──────────────────────┐       │
│  │ [Product Image]       │ │ [Product Image]       │       │
│  │                       │ │                       │       │
│  │ Allen Solly Shirt     │ │ Samsung Galaxy M34    │       │
│  │ Grade A • Excellent   │ │ Grade A • Excellent   │       │
│  │                       │ │                       │       │
│  │ MRP: ₹1,499 ────     │ │ MRP: ₹18,999 ────    │       │
│  │ ReLoop: ₹1,199       │ │ ReLoop: ₹15,199      │       │
│  │ Shipping: ₹65        │ │ Shipping: ₹95        │       │
│  │ ──────────────        │ │ ──────────────        │       │
│  │ You Pay: ₹1,264      │ │ You Pay: ₹15,294     │       │
│  │ 💚 Save 20%          │ │ 💚 Save 20%          │       │
│  │ 🚀 Near you! (MUM1)  │ │ 📦 From Delhi (2d)   │       │
│  │ 🌿 +20 Green Credits │ │ 🌿 +20 Green Credits │       │
│  │                       │ │                       │       │
│  │ [View Details]        │ │ [View Details]        │       │
│  └──────────────────────┘ └──────────────────────┘       │
│                                                           │
│  ┌──────────────────────┐ ┌──────────────────────┐       │
│  │ [Product Image]       │ │ [Product Image]       │       │
│  │                       │ │                       │       │
│  │ Nike Air Max 270      │ │ AirPods Pro (2nd Gen) │       │
│  │ Grade A • Excellent   │ │ Grade A+ • Like New   │       │
│  │                       │ │                       │       │
│  │ MRP: ₹9,995 ────     │ │ MRP: ₹24,900 ────    │       │
│  │ ReLoop: ₹7,996       │ │ ReLoop: ₹22,410      │       │
│  │ Shipping: ₹95        │ │ Shipping: ₹95        │       │
│  │ ──────────────        │ │ ──────────────        │       │
│  │ You Pay: ₹8,091      │ │ You Pay: ₹22,505     │       │
│  │ 💚 Save 20%          │ │ 💚 Save 10%          │       │
│  │ 📦 From Delhi (2d)   │ │ 📦 From Bangalore(2d)│       │
│  │ 🌿 +20 Green Credits │ │ 🌿 +20 Green Credits │       │
│  │                       │ │                       │       │
│  │ [View Details]        │ │ [View Details]        │       │
│  └──────────────────────┘ └──────────────────────┘       │
│                                                           │
│  COST TRANSPARENCY FOOTER:                                │
│  ┌───────────────────────────────────────────────────┐   │
│  │ 💡 Why are prices different for different users?   │   │
│  │ ReLoop calculates real logistics costs based on    │   │
│  │ the product's current location and YOUR nearest    │   │
│  │ delivery center. Items are only shown if they      │   │
│  │ can be delivered to you at a genuine discount.     │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Key interactions:**
- **Switch User dropdown**: Lets you switch between Vikram (Mumbai), Sneha (Kolkata), Ananya (Delhi) — shipping costs change, items may appear/disappear
- **"Near you" badge**: Shows when item is at buyer's own DC (₹0 transfer)
- **Shipping breakdown**: Always visible, not hidden

**Data needed:**
- `GET /api/marketplace?user_id={id}&category={cat}&sort={sort}` — returns viable items with per-buyer pricing

---

### PAGE 3: Product Detail (`/marketplace/:id`) 

**Purpose**: Health Card + Full cost breakdown + Purchase. This is where trust is built.

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ← Back to Marketplace                                   │
│                                                           │
│  ┌─────────────────┬────────────────────────────────┐    │
│  │                 │                                 │    │
│  │  [Product       │  Samsung Galaxy M34 5G          │    │
│  │   Image]        │  (128GB, Midnight Blue)         │    │
│  │                 │                                 │    │
│  │  [Thumbnail 1]  │  Grade: A • Excellent           │    │
│  │  [Thumbnail 2]  │  Condition: Opened box only,    │    │
│  │  [Thumbnail 3]  │  brand new condition             │    │
│  │                 │                                 │    │
│  │                 │  ┌────────────────────────────┐ │    │
│  │                 │  │ PRICE BREAKDOWN            │ │    │
│  │                 │  │                            │ │    │
│  │                 │  │ Original MRP:   ₹18,999 ── │ │    │
│  │                 │  │ ReLoop Price:   ₹15,199    │ │    │
│  │                 │  │                            │ │    │
│  │                 │  │ Shipping:                  │ │    │
│  │                 │  │  DC Transfer (DEL→MUM): ₹30│ │    │
│  │                 │  │  Last Mile (to you):    ₹65│ │    │
│  │                 │  │  ─────────────────────     │ │    │
│  │                 │  │  Total Shipping:        ₹95│ │    │
│  │                 │  │                            │ │    │
│  │                 │  │ ═══════════════════════    │ │    │
│  │                 │  │ You Pay:          ₹15,294  │ │    │
│  │                 │  │ You Save:          ₹3,705  │ │    │
│  │                 │  │ (20% off!)                 │ │    │
│  │                 │  │                            │ │    │
│  │                 │  │ 🌿 Earn 20 Green Credits   │ │    │
│  │                 │  │ 📦 Est. Delivery: 3 days   │ │    │
│  │                 │  │                            │ │    │
│  │                 │  │ [Add to Cart]              │ │    │
│  │                 │  └────────────────────────────┘ │    │
│  └─────────────────┴────────────────────────────────┘    │
│                                                           │
│  ──── PRODUCT HEALTH CARD ────                           │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │ 🏥 PRODUCT HEALTH CARD         Verified ✓ by AI   │   │
│  │                                                    │   │
│  │ Overall Health Score: ████████████████░░ 94/100    │   │
│  │                                                    │   │
│  │ ┌──────────────┬──────────────┬──────────────┐    │   │
│  │ │ Exterior     │ Functional   │ Completeness │    │   │
│  │ │ ⬛⬛⬛⬛⬛⬜ │ ⬛⬛⬛⬛⬛⬛ │ ⬛⬛⬛⬛⬛⬛ │    │   │
│  │ │ 96/100       │ 100/100      │ 100/100      │    │   │
│  │ │ Pristine     │ Fully works  │ All included │    │   │
│  │ └──────────────┴──────────────┴──────────────┘    │   │
│  │                                                    │   │
│  │ Defects Found: None                                │   │
│  │ Missing Parts: None                                │   │
│  │                                                    │   │
│  │ AI Notes: "Screen pristine. No scratches on body.  │   │
│  │ Battery at 100%. Device appears unused."            │   │
│  │                                                    │   │
│  │ ─── Return History ───                             │   │
│  │ 📅 Originally purchased: May 10, 2025              │   │
│  │ 📦 Returned: May 13, 2025 (3 days of ownership)   │   │
│  │ 💬 Return reason: "Decided to go with iPhone"      │   │
│  │ 🔍 Graded by AI: May 14, 2025 (Confidence: 96%)   │   │
│  │                                                    │   │
│  │ ─── Sustainability Impact ───                      │   │
│  │ 🌿 CO₂ saved: 0.21 kg                              │   │
│  │ ♻️ Waste prevented: 0.21 kg from landfill           │   │
│  │ 🌳 Equivalent: Powering a light bulb for 8 hours   │   │
│  │                                                    │   │
│  │ AI Confidence: 96% │ Grading Model: ReLoop v3.2    │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ──── LOGISTICS ROUTE VISUALIZATION ────                 │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │ 📍Route: Delhi DC → Mumbai DC → You                │   │
│  │                                                    │   │
│  │ [DEL1] ──₹30──→ [MUM1] ──₹65──→ 📍Vikram         │   │
│  │ Delhi         Mumbai            Mumbai             │   │
│  │ (Source)      (Your DC)         (You)              │   │
│  │                                                    │   │
│  │ Total distance: ~1,415 km                          │   │
│  │ Est. transit: 2 days DC→DC + 1 day last mile       │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Data needed:**
- `GET /api/marketplace/:inventoryId?user_id={id}` — product details + per-buyer cost breakdown + health card + route

---

### PAGE 4: Return Flow (`/return`) — ⭐ AI GRADING DEMO

**Purpose**: This is where we demo the AI grading live. Upload images → Watch AI grade → See route decision.

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  STEP INDICATOR:                                          │
│  [1. Select Order] → [2. Upload Photos] → [3. AI Grade]  │
│       → [4. Route Decision]                               │
│                                                           │
│  ──── STEP 1: Select Order to Return ────                │
│  ┌───────────────────────────────────────────────────┐   │
│  │ Select the order you want to return:               │   │
│  │                                                    │   │
│  │ ○ boAt Airdopes 141 (₹1,299) — May 24             │   │
│  │   Reason: [Not as described ▾]                     │   │
│  │   Details: [________________]                      │   │
│  │                                                    │   │
│  │ [Next →]                                           │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ──── STEP 2: Upload Photos ────                         │
│  ┌───────────────────────────────────────────────────┐   │
│  │ Upload product photos for AI assessment:           │   │
│  │                                                    │   │
│  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │   │
│  │ │ 📸   │ │ 📸   │ │ 📸   │ │  +   │              │   │
│  │ │Front │ │ Back │ │Close │ │ Add  │              │   │
│  │ │      │ │      │ │ -up  │ │ More │              │   │
│  │ └──────┘ └──────┘ └──────┘ └──────┘              │   │
│  │                                                    │   │
│  │ [⬅ Back]                [Analyze with AI →]        │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ──── STEP 3: AI Grading Result (the wow moment) ────    │
│  ┌───────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  │ ⏳ Analyzing... (animated spinner, 1-2 seconds)    │   │
│  │                                                    │   │
│  │ ✅ GRADING COMPLETE                                │   │
│  │                                                    │   │
│  │ ┌────────────────────────────────────────────┐    │   │
│  │ │ Grade: B          Score: 75/100             │    │   │
│  │ │ Condition: Good   Confidence: 88%           │    │   │
│  │ │                                             │    │   │
│  │ │ Findings:                                   │    │   │
│  │ │ • Exterior: 80/100 — Minor scratches on     │    │   │
│  │ │   charging case                              │    │   │
│  │ │ • Audio: Cannot verify via image — flagged   │    │   │
│  │ │   for manual check                           │    │   │
│  │ │ • Completeness: All parts present ✓          │    │   │
│  │ │                                             │    │   │
│  │ │ Defects detected:                           │    │   │
│  │ │ [Image with bounding box highlighting       │    │   │
│  │ │  scratch on charging case]                   │    │   │
│  │ └────────────────────────────────────────────┘    │   │
│  │                                                    │   │
│  │ [⬅ Back]               [See Route Decision →]     │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ──── STEP 4: Smart Route Decision ────                  │
│  ┌───────────────────────────────────────────────────┐   │
│  │                                                    │   │
│  │ ROUTE: REFURBISH ⚙️                                │   │
│  │                                                    │   │
│  │ "Based on the Grade B assessment, this item will   │   │
│  │  be sent for refurbishment. After repair, it will  │   │
│  │  be sold on ReLoop at a 35% discount."              │   │
│  │                                                    │   │
│  │ ┌─── Why not marketplace directly? ───────────┐   │   │
│  │ │ Grade B items have cosmetic defects that      │   │   │
│  │ │ need professional attention before resale.    │   │   │
│  │ │ After refurbishment, this item will be        │   │   │
│  │ │ listed as "Refurbished - Good" with a new     │   │   │
│  │ │ Health Card.                                  │   │   │
│  │ └────────────────────────────────────────────┘   │   │
│  │                                                    │   │
│  │ ┌─── Route Comparison (all options evaluated) ─┐  │   │
│  │ │                                               │  │   │
│  │ │ Route         │ Feasible │ Reason             │  │   │
│  │ │ ──────────────┼──────────┼──────────────────  │  │   │
│  │ │ Resell As-Is  │ ❌       │ Grade B: cosmetic  │  │   │
│  │ │               │          │ issues present      │  │   │
│  │ │ Refurbish ✅  │ ✅       │ Repair cost ₹200   │  │   │
│  │ │               │          │ < recovery ₹645     │  │   │
│  │ │ Donate        │ ⏸️       │ Item has resale     │  │   │
│  │ │               │          │ value, refurb first │  │   │
│  │ │ Recycle       │ ❌       │ Item is functional  │  │   │
│  │ └──────────────────────────────────────────────┘  │   │
│  │                                                    │   │
│  │ Your refund: ₹1,299 (already processed)            │   │
│  │ 🌿 You earned: 30 Green Credits                    │   │
│  │                                                    │   │
│  │ [Done — Return to Home]                            │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Data needed:**
- `GET /api/orders?user_id={id}&status=DELIVERED` — orders eligible for return
- `POST /api/returns` — initiate return
- `POST /api/grading/analyze` — upload images, get AI grade (calls Gemini API)
- `POST /api/routing/decide` — get route decision based on grade

---

### PAGE 5: My Returns (`/my-returns`)

**Purpose**: Track all returns and their statuses. Shows the full lifecycle.

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  My Returns (as Rohan Mehta)                              │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │ Samsung Galaxy M34          Grade A • Excellent    │   │
│  │ Returned: May 13            Route: RESELL          │   │
│  │ Status: ●──●──●──●──◐──○                          │   │
│  │         Init Pick Grade Route Listed Sold          │   │
│  │ 📍 Currently: Listed on Marketplace @ Delhi DC     │   │
│  │ 💰 Resale price: ₹15,199                          │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │ boAt Airdopes 141           ⏳ Awaiting Grading    │   │
│  │ Returned: May 24                                   │   │
│  │ Status: ●──●──◐──○──○──○                          │   │
│  │         Init Pick Grade Route Listed Sold          │   │
│  │ 📍 Currently: At Delhi DC, pending AI grading      │   │
│  │ [Grade Now →]  ← Links to return flow page         │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │ Ambrane Power Bank          Grade F • Broken       │   │
│  │ Returned: May 27            Route: RECYCLE ♻️      │   │
│  │ Status: ●──●──●──●──○                              │   │
│  │         Init Pick Grade Route Complete             │   │
│  │ 📍 Sent to certified e-waste recycler              │   │
│  │ 🌿 You earned: 25 Green Credits                    │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Data needed:**
- `GET /api/returns?user_id={id}` — all returns for this user with status, grade, route

---

### PAGE 6: Green Profile (`/green-profile`)

**Purpose**: Gamification + impact. Makes the user feel good.

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  🌿 Green Profile — Arjun Rao                            │
│                                                           │
│  ┌───────────────────────────────────────────────────┐   │
│  │         🌳                                         │   │
│  │     TREE TIER                                      │   │
│  │    2,100 credits                                   │   │
│  │                                                    │   │
│  │  Progress to Forest (🌍):                          │   │
│  │  ████████████████████░░░░░ 2,100 / 5,000           │   │
│  └───────────────────────────────────────────────────┘   │
│                                                           │
│  ┌────── YOUR IMPACT ──────┐                             │
│  │                          │                             │
│  │  🔄 2 Items Given        │                             │
│  │     Second Life          │                             │
│  │                          │                             │
│  │  🌿 0.46 kg CO₂         │                             │
│  │     Saved                │                             │
│  │                          │                             │
│  │  ♻️ 0.46 kg Waste        │                             │
│  │     Prevented            │                             │
│  │                          │                             │
│  └──────────────────────────┘                             │
│                                                           │
│  ┌────── CREDIT HISTORY ──────┐                          │
│  │ +20  Bought Sony WH-1000XM5  May 25  │                │
│  │      (Renewed, Grade A)               │                │
│  └───────────────────────────────────────┘                │
│                                                           │
│  ┌────── REDEEM CREDITS ──────┐                          │
│  │ 🎫 ₹50 Amazon Coupon    200 credits  [Redeem]│        │
│  │ 📦 Free Delivery        100 credits  [Redeem]│        │
│  │ 🌳 Plant a Tree         300 credits  [Redeem]│        │
│  └──────────────────────────────────────────────┘        │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Data needed:**
- `GET /api/green-profile/:userId` — credits, tier, impact stats
- `GET /api/credits/history/:userId` — ledger entries
- `POST /api/credits/redeem` — redeem credits

---

### PAGE 7: Admin Dashboard (`/admin`)

**Purpose**: Show judges the system-level intelligence. Overview of all returns, routes, DC status.

```
┌─────────────────────────────────────────────────────────┐
│  NAVBAR                                                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  📊 ReLoop Admin Dashboard                               │
│                                                           │
│  ┌────── KEY METRICS (cards) ──────┐                     │
│  │ Total Returns │ On Marketplace │ Refurbishing │ Sold  │
│  │     15        │      6         │      3       │   1   │
│  │               │                │              │       │
│  │ Donated │ Recycled │ Pending Grade │ Revenue    │     │
│  │    1    │    1     │      2       │ ₹22,506    │     │
│  └──────────────────────────────────────────────┘       │
│                                                           │
│  ┌────── ROUTE DISTRIBUTION (pie chart) ──────┐         │
│  │                                              │         │
│  │   Resell: 46%  (6+1 items)                   │         │
│  │   Refurbish: 23%  (3 items)                  │         │
│  │   Donate: 8%  (1 item)                       │         │
│  │   Recycle: 8%  (1 item)                      │         │
│  │   Pending: 15%  (2 items)                    │         │
│  │                                              │         │
│  └──────────────────────────────────────────────┘         │
│                                                           │
│  ┌────── DC STATUS (table) ──────┐                       │
│  │ DC    │ Items │ Available │ Capacity │ Load %  │       │
│  │ DEL1  │  5    │  2        │ 50,000   │  0.01%  │       │
│  │ MUM1  │  3    │  1        │ 45,000   │  0.007% │       │
│  │ BLR1  │  2    │  1        │ 40,000   │  0.005% │       │
│  │ KOL1  │  2    │  0        │ 25,000   │  0.008% │       │
│  │ HYD1  │  2    │  2        │ 30,000   │  0.007% │       │
│  └───────────────────────────────────────────────┘       │
│                                                           │
│  ┌────── ALL RETURNS (table with full detail) ──────┐    │
│  │ ID    │ Product         │ Grade │ Route    │Status│    │
│  │ R-001 │ Nike Air Max    │ A     │ RESELL   │Listed│    │
│  │ R-002 │ Samsung M34     │ A     │ RESELL   │Listed│    │
│  │ R-003 │ AirPods Pro     │ A+    │ RESELL   │Listed│    │
│  │ R-007 │ JBL Flip 6      │ B     │ REFURB   │Routed│    │
│  │ R-011 │ US Polo Tee     │ D     │ DONATE   │Routed│    │
│  │ R-012 │ Ambrane PwrBank │ F     │ RECYCLE  │Routed│    │
│  │ R-013 │ boAt Airdopes   │ —     │ —        │⏳Pend│    │
│  │ R-014 │ Atomic Habits   │ —     │ —        │⏳Pend│    │
│  │ ... (all 15 returns)                               │    │
│  └───────────────────────────────────────────────────┘    │
│                                                           │
│  ┌────── GRADE DISTRIBUTION (bar chart) ──────┐          │
│  │ A+: ██ 1                                     │          │
│  │ A:  ██████████ 6                             │          │
│  │ B:  ██████ 3                                 │          │
│  │ C:  ██ 1                                     │          │
│  │ D:  ██ 1                                     │          │
│  │ F:  ██ 1                                     │          │
│  │ Pending: ████ 2                              │          │
│  └──────────────────────────────────────────────┘          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Data needed:**
- `GET /api/admin/dashboard` — all aggregate stats
- `GET /api/admin/returns` — all returns with full detail
- `GET /api/admin/dcs` — DC status

---

## Part 5: 3-Minute Demo Script

For when you present to judges:

| Time | What You Show | What You Say |
|------|-------------|-------------|
| 0:00-0:30 | Landing page | "Millions of products are returned and wasted. ReLoop is Amazon's intelligent bridge. Let me show you." |
| 0:30-1:00 | Return Flow — grade the boAt earbuds LIVE | "When a product is returned, our AI grades it in under 2 seconds. Watch — I upload these 3 photos... and we get Grade B, 75/100 confidence, with a scratch detected." |
| 1:00-1:30 | Route Decision page | "The smart routing engine evaluates ALL options — resell, refurbish, donate, recycle — and picks the best path based on real costs. This B-grade item goes to refurbishment because repair cost ₹200 < recovery value ₹645." |
| 1:30-2:15 | Marketplace as Vikram (Mumbai) → Switch to Sneha (Kolkata) | "Now let me show you the marketplace. As Vikram in Mumbai, I see 6 products. Notice the Allen Solly shirt shows '🚀 Near you' — it's at his local DC, so ₹0 transfer. Now watch when I switch to Sneha in Kolkata — shipping costs change because products are farther. A ₹150 phone case from Kolkata wouldn't even show to a Mumbai buyer because shipping exceeds the discount." |
| 2:15-2:45 | Product Detail — Samsung phone with Health Card | "Every product has a Health Card — AI-verified condition, return history, cost transparency. The buyer sees EXACTLY what they're getting. DC transfer ₹30, last mile ₹65, total shipping ₹95. Full transparency." |
| 2:45-3:00 | Admin Dashboard + Green Profile | "The admin sees all routes, DC status, and analytics. And every customer builds a Green Profile — Arjun here is Tree tier with 2,100 credits from buying renewed products." |

---

## Part 6: API Endpoints Summary

| # | Method | Endpoint | Purpose | Page |
|---|--------|----------|---------|------|
| 1 | GET | `/api/stats/overview` | Global stats (items saved, CO₂, etc.) | Landing |
| 2 | GET | `/api/marketplace` | Viable items for a buyer (with cost calc) | Marketplace |
| 3 | GET | `/api/marketplace/:inventoryId` | Product detail + health card + route | Product Detail |
| 4 | GET | `/api/orders` | User's orders eligible for return | Return Flow |
| 5 | POST | `/api/returns` | Initiate a return | Return Flow |
| 6 | POST | `/api/returns/:id/images` | Upload return images | Return Flow |
| 7 | POST | `/api/grading/analyze` | AI grade images (calls Gemini) | Return Flow |
| 8 | POST | `/api/routing/decide` | Smart route decision | Return Flow |
| 9 | GET | `/api/returns/user/:userId` | All returns for a user | My Returns |
| 10 | GET | `/api/green-profile/:userId` | Green profile + impact | Green Profile |
| 11 | GET | `/api/credits/history/:userId` | Credit ledger | Green Profile |
| 12 | POST | `/api/credits/redeem` | Redeem credits | Green Profile |
| 13 | GET | `/api/admin/dashboard` | Admin aggregate stats | Admin |
| 14 | GET | `/api/admin/returns` | All returns (admin view) | Admin |
| 15 | GET | `/api/admin/dcs` | DC status | Admin |
| 16 | GET | `/api/users` | List users (for demo switcher) | Navbar |

---

> [!IMPORTANT]
> **Ready to build?** Once you approve this, my next step is to create the implementation plan with:
> - Tech stack (I'm thinking **Next.js + PostgreSQL + Prisma ORM + Gemini API**)
> - File/folder structure
> - Build order (which page first)
> - Estimated time per component
>
> Let me know if you want to adjust anything — add/remove a page, change the seed data, modify the demo flow.