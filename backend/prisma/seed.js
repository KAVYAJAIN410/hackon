const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Clean existing data (order matters for FK constraints) ───
  await prisma.greenCreditLedger.deleteMany();
  await prisma.marketplaceOrder.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.gradeConfig.deleteMany();
  await prisma.aiGrading.deleteMany();
  await prisma.returnImage.deleteMany();
  await prisma.return.deleteMany();
  await prisma.order.deleteMany();
  await prisma.dcRoute.deleteMany();
  await prisma.user.deleteMany();
  await prisma.loginCredentials.deleteMany();
  await prisma.product.deleteMany();
  await prisma.deliveryCenter.deleteMany();

  console.log('  ✓ Cleared existing data');

  // ─── 6 Delivery Centers ───
  const deliveryCenters = [
    { id: 'dc-del-001', name: 'Delhi Warehouse',            city: 'Delhi',     type: 'WAREHOUSE' },
    { id: 'dc-mum-001', name: 'Mumbai Fulfillment Center',  city: 'Mumbai',    type: 'WAREHOUSE' },
    { id: 'dc-blr-001', name: 'Bangalore Fulfillment Center', city: 'Bangalore', type: 'WAREHOUSE' },
    { id: 'dc-kol-001', name: 'Kolkata Warehouse',          city: 'Kolkata',   type: 'WAREHOUSE' },
    { id: 'dc-hyd-001', name: 'Hyderabad Fulfillment Center', city: 'Hyderabad', type: 'WAREHOUSE' },
    { id: 'dc-jai-001', name: 'Jaipur Delivery Station',    city: 'Jaipur',    type: 'DELIVERY_STATION' },
  ];

  await prisma.deliveryCenter.createMany({ data: deliveryCenters });
  console.log(`  ✓ Created ${deliveryCenters.length} delivery centers`);

  // ─── 36 DC Routes (6×6 matrix including self-routes) ───
  // Distance in km, transferCost in INR, estimatedDays
  const dcIds = ['dc-del-001', 'dc-mum-001', 'dc-blr-001', 'dc-kol-001', 'dc-hyd-001', 'dc-jai-001'];

  // Distance matrix (km) — realistic Indian city distances
  //              DEL    MUM    BLR    KOL    HYD    JAI
  const distances = [
    /* DEL */ [    0,  1400,  2150,  1530,  1550,   280 ],
    /* MUM */ [ 1400,     0,   980,  2050,   710,  1150 ],
    /* BLR */ [ 2150,   980,     0,  1870,   570,  1850 ],
    /* KOL */ [ 1530,  2050,  1870,     0,  1500,  1500 ],
    /* HYD */ [ 1550,   710,   570,  1500,     0,  1350 ],
    /* JAI */ [  280,  1150,  1850,  1500,  1350,     0 ],
  ];

  // Transfer cost tiers based on distance
  function getTransferCost(distanceKm) {
    if (distanceKm === 0) return 0;
    if (distanceKm <= 300) return 15;
    if (distanceKm <= 800) return 30;
    if (distanceKm <= 1200) return 40;
    if (distanceKm <= 1600) return 50;
    return 60;
  }

  // Estimated days based on distance
  function getEstimatedDays(distanceKm) {
    if (distanceKm === 0) return 0;
    if (distanceKm <= 300) return 1;
    if (distanceKm <= 800) return 1;
    if (distanceKm <= 1500) return 2;
    return 3;
  }

  const dcRoutes = [];

  for (let i = 0; i < dcIds.length; i++) {
    for (let j = 0; j < dcIds.length; j++) {
      const dist = distances[i][j];
      dcRoutes.push({
        sourceDcId: dcIds[i],
        destDcId: dcIds[j],
        distance: dist,
        transferCost: getTransferCost(dist),
        estimatedDays: getEstimatedDays(dist),
      });
    }
  }

  await prisma.dcRoute.createMany({ data: dcRoutes });
  console.log(`  ✓ Created ${dcRoutes.length} DC routes (6×6 matrix)`);

  // ─── 27 Products ───
  const products = [
    // ELECTRONICS (7 products)
    { id: 'prod-001', name: 'Samsung Galaxy M34 5G (128GB, Midnight Blue)',          category: 'Electronics', brand: 'Samsung',    mrp: 18999.00, imageUrl: '/images/samsung_m34.jpg',       description: 'Samsung Galaxy M34 5G with 6000mAh battery, 50MP camera' },
    { id: 'prod-002', name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones', category: 'Electronics', brand: 'Sony',       mrp: 24990.00, imageUrl: '/images/sony_xm5.jpg',          description: 'Industry leading noise cancellation, 30hr battery' },
    { id: 'prod-003', name: 'boAt Airdopes 141 TWS Earbuds',                        category: 'Electronics', brand: 'boAt',       mrp: 1299.00,  imageUrl: '/images/boat_airdopes.jpg',     description: 'boAt Airdopes 141 with 42H playtime, ENx tech' },
    { id: 'prod-004', name: 'JBL Flip 6 Portable Bluetooth Speaker',                category: 'Electronics', brand: 'JBL',        mrp: 9999.00,  imageUrl: '/images/jbl_flip6.jpg',         description: 'JBL Flip 6 with IP67 waterproof, 12hr playtime' },
    { id: 'prod-005', name: 'Apple AirPods Pro (2nd Gen) with USB-C',               category: 'Electronics', brand: 'Apple',      mrp: 24900.00, imageUrl: '/images/airpods_pro.jpg',       description: 'Active Noise Cancellation, Adaptive Transparency, USB-C' },
    { id: 'prod-006', name: 'Redmi 27" Full HD IPS Monitor',                        category: 'Electronics', brand: 'Redmi',      mrp: 11999.00, imageUrl: '/images/redmi_monitor.jpg',     description: '27 inch FHD IPS, 75Hz, low blue light' },
    { id: 'prod-007', name: 'Ambrane 20000mAh Power Bank',                          category: 'Electronics', brand: 'Ambrane',    mrp: 1099.00,  imageUrl: '/images/ambrane_powerbank.jpg', description: '20000mAh, 20W fast charging, Type-C input' },

    // FASHION (6 products)
    { id: 'prod-008', name: 'Nike Air Max 270 React (Size 8, Black/White)',          category: 'Fashion',     brand: 'Nike',       mrp: 9995.00,  imageUrl: '/images/nike_airmax.jpg',       description: 'Nike Air Max 270 React, lightweight cushioning' },
    { id: 'prod-009', name: "Levi's 511 Slim Fit Jeans (32W, Dark Indigo)",         category: 'Fashion',     brand: "Levi's",     mrp: 2999.00,  imageUrl: '/images/levis_511.jpg',         description: "Levi's 511 slim fit, premium stretch denim" },
    { id: 'prod-010', name: 'Allen Solly Formal Shirt (Size 40, White)',             category: 'Fashion',     brand: 'Allen Solly', mrp: 1499.00, imageUrl: '/images/allen_solly.jpg',       description: 'Allen Solly cotton formal shirt, regular fit' },
    { id: 'prod-011', name: 'Wildcraft 45L Trekking Backpack (Grey)',                category: 'Fashion',     brand: 'Wildcraft',  mrp: 3499.00,  imageUrl: '/images/wildcraft_bag.jpg',     description: '45L capacity, rain cover, laptop compartment' },
    { id: 'prod-012', name: 'Casio G-Shock GA-2100 Watch (Carbon Core)',             category: 'Fashion',     brand: 'Casio',      mrp: 9995.00,  imageUrl: '/images/casio_gshock.jpg',      description: 'Carbon Core Guard, 200m water resistance' },
    { id: 'prod-013', name: 'U.S. Polo T-Shirt (Size L, Navy)',                     category: 'Fashion',     brand: 'U.S. Polo',  mrp: 899.00,   imageUrl: '/images/uspolo_tshirt.jpg',     description: 'Classic polo t-shirt, 100% cotton' },

    // HOME & KITCHEN (4 products)
    { id: 'prod-014', name: 'Prestige IRIS 750W Mixer Grinder (3 Jars)',             category: 'Home',        brand: 'Prestige',   mrp: 3295.00,  imageUrl: '/images/prestige_mixer.jpg',    description: 'IRIS 750W with 3 stainless steel jars' },
    { id: 'prod-015', name: 'Pigeon 12L OTG Oven',                                  category: 'Home',        brand: 'Pigeon',     mrp: 3190.00,  imageUrl: '/images/pigeon_otg.jpg',        description: '12L capacity, 60min timer, 3 cooking modes' },
    { id: 'prod-016', name: 'Milton Thermosteel Flask 1L (Steel)',                   category: 'Home',        brand: 'Milton',     mrp: 899.00,   imageUrl: '/images/milton_flask.jpg',      description: '1L capacity, 24hr hot & cold retention' },

    // BOOKS & OTHERS (3 products)
    { id: 'prod-017', name: 'Atomic Habits by James Clear (Paperback)',              category: 'Books',       brand: 'Penguin',    mrp: 499.00,   imageUrl: '/images/atomic_habits.jpg',     description: 'Bestselling book on building good habits' },
    { id: 'prod-018', name: 'Logitech MK270r Wireless Keyboard + Mouse Combo',      category: 'Electronics', brand: 'Logitech',   mrp: 1595.00,  imageUrl: '/images/logitech_mk270.jpg',    description: 'Full-size keyboard, ambidextrous mouse, 2.4GHz' },
    { id: 'prod-019', name: 'Fire-Boltt Phoenix Smart Watch',                       category: 'Electronics', brand: 'Fire-Boltt', mrp: 1499.00,  imageUrl: '/images/fireboltt_phoenix.jpg', description: '1.3" display, SpO2, heart rate, 7-day battery' },
    { id: 'prod-020', name: 'Cello Signature Carbon Gift Set (Ball Pen + Roller Pen)', category: 'Stationery', brand: 'Cello',     mrp: 850.00,   imageUrl: '/images/cello_pens.jpg',        description: 'Premium ball pen + roller pen gift set' },

    // ─── LONG TAIL — cheap products that demonstrate the hard cases (7 products) ───
    { id: 'prod-021', name: "Bata Comfit Women's Walking Shoes (Size 6, Grey)",      category: 'Fashion',     brand: 'Bata',       mrp: 499.00,   imageUrl: '/images/bata_shoes.jpg',        description: 'Lightweight walking shoes, memory foam insole' },
    { id: 'prod-022', name: 'Spigen Rugged Armor Case for Samsung M34',             category: 'Electronics', brand: 'Spigen',     mrp: 299.00,   imageUrl: '/images/spigen_case.jpg',       description: 'Military grade protection, matte black TPU' },
    { id: 'prod-023', name: 'Set of 6 Cotton Handkerchiefs (White)',                 category: 'Fashion',     brand: 'Solimo',     mrp: 199.00,   imageUrl: '/images/handkerchiefs.jpg',     description: 'Pack of 6, 100% cotton, machine washable' },
    { id: 'prod-024', name: 'Mobile Pop Socket Grip Stand',                          category: 'Electronics', brand: 'Generic',    mrp: 99.00,    imageUrl: '/images/popsocket.jpg',         description: 'Phone grip and stand, repositionable' },
    { id: 'prod-025', name: 'Mi 360° Home Security Camera 2K',                      category: 'Electronics', brand: 'Xiaomi',     mrp: 2499.00,  imageUrl: '/images/mi_camera.jpg',         description: '360° panoramic view, 2K resolution, 2-way audio, night vision' },
    { id: 'prod-026', name: 'Ethnic Printed Cotton Kurti (Size M, Blue)',            category: 'Fashion',     brand: 'Aurelia',    mrp: 599.00,   imageUrl: '/images/kurti_blue.jpg',        description: 'A-line printed kurti, 100% cotton, below knee length' },
    { id: 'prod-027', name: "Women's Chiffon Dupatta (Red, Embroidered)",            category: 'Fashion',     brand: 'FabIndia',   mrp: 349.00,   imageUrl: '/images/dupatta_red.jpg',       description: 'Lightweight chiffon dupatta with border embroidery' },
  ];

  await prisma.product.createMany({ data: products });
  console.log(`  ✓ Created ${products.length} products`);

  // ─── 14 Users ───
  const users = [
    // Delhi area
    { id: 'user-001', name: 'Ananya Sharma',   email: 'ananya@email.com',   city: 'New Delhi',  state: 'Delhi',          nearestDcId: 'dc-del-001', greenCredits: 0,    greenTier: 'SEEDLING' },
    { id: 'user-002', name: 'Rohan Mehta',     email: 'rohan@email.com',    city: 'Gurgaon',    state: 'Haryana',        nearestDcId: 'dc-del-001', greenCredits: 350,  greenTier: 'SEEDLING' },
    { id: 'user-008', name: 'Meera Kapoor',    email: 'meera@email.com',    city: 'Noida',      state: 'Uttar Pradesh',  nearestDcId: 'dc-del-001', greenCredits: 0,    greenTier: 'SEEDLING' },

    // Mumbai area
    { id: 'user-003', name: 'Vikram Patel',    email: 'vikram@email.com',   city: 'Mumbai',     state: 'Maharashtra',    nearestDcId: 'dc-mum-001', greenCredits: 520,  greenTier: 'SAPLING' },
    { id: 'user-004', name: 'Priya Nair',      email: 'priya@email.com',    city: 'Pune',       state: 'Maharashtra',    nearestDcId: 'dc-mum-001', greenCredits: 100,  greenTier: 'SEEDLING' },

    // Bangalore area
    { id: 'user-005', name: 'Karthik Reddy',   email: 'karthik@email.com',  city: 'Bangalore',  state: 'Karnataka',      nearestDcId: 'dc-blr-001', greenCredits: 1200, greenTier: 'SAPLING' },

    // Kolkata area
    { id: 'user-006', name: 'Sneha Banerjee',  email: 'sneha@email.com',    city: 'Kolkata',    state: 'West Bengal',    nearestDcId: 'dc-kol-001', greenCredits: 80,   greenTier: 'SEEDLING' },

    // Hyderabad area
    { id: 'user-007', name: 'Arjun Rao',       email: 'arjun@email.com',    city: 'Hyderabad',  state: 'Telangana',      nearestDcId: 'dc-hyd-001', greenCredits: 2100, greenTier: 'TREE' },

    // Jaipur area (Priya's persona — shoes scenario)
    { id: 'user-009', name: 'Priya Verma',     email: 'priya.v@email.com',  city: 'Jaipur',     state: 'Rajasthan',      nearestDcId: 'dc-jai-001', greenCredits: 0,    greenTier: 'SEEDLING' },
    { id: 'user-010', name: 'Kavita Singh',    email: 'kavita@email.com',   city: 'Jaipur',     state: 'Rajasthan',      nearestDcId: 'dc-jai-001', greenCredits: 50,   greenTier: 'SEEDLING' },
    { id: 'user-011', name: 'Deepa Rathore',   email: 'deepa@email.com',    city: 'Jaipur',     state: 'Rajasthan',      nearestDcId: 'dc-jai-001', greenCredits: 0,    greenTier: 'SEEDLING' },

    // Pune area (Rahul's persona — baby monitor scenario)
    { id: 'user-012', name: 'Rahul Deshmukh',  email: 'rahul.d@email.com',  city: 'Pune',       state: 'Maharashtra',    nearestDcId: 'dc-mum-001', greenCredits: 0,    greenTier: 'SEEDLING' },
    { id: 'user-013', name: 'Neha Patil',      email: 'neha@email.com',     city: 'Pune',       state: 'Maharashtra',    nearestDcId: 'dc-mum-001', greenCredits: 120,  greenTier: 'SEEDLING' },
    { id: 'user-014', name: 'Aarti Joshi',     email: 'aarti@email.com',    city: 'Pune',       state: 'Maharashtra',    nearestDcId: 'dc-mum-001', greenCredits: 0,    greenTier: 'SEEDLING' },
  ];

  await prisma.user.createMany({ data: users });
  console.log(`  ✓ Created ${users.length} users`);

  // ─── Login Credentials (password: "password123" for all demo users) ───
  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash('password123', 10);

  const loginCredentials = users.map(u => ({
    id: `login-${u.id}`,
    email: u.email,
    passwordHash,
    role: 'CUSTOMER',
  }));

  await prisma.loginCredentials.createMany({ data: loginCredentials });

  // Link users to their login credentials
  for (const u of users) {
    await prisma.user.update({
      where: { id: u.id },
      data: { loginId: `login-${u.id}` },
    });
  }
  console.log(`  ✓ Created ${loginCredentials.length} login credentials (password: password123)`);

  // ─── 19 Orders ───
  const orders = [
    // Ananya's orders (Delhi)
    { id: 'ord-001', userId: 'user-001', productId: 'prod-008', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-15') },  // Nike shoes
    { id: 'ord-002', userId: 'user-001', productId: 'prod-002', status: 'DELIVERED',        orderedAt: new Date('2025-05-20') },  // Sony headphones

    // Rohan's orders (Gurgaon → Delhi DC)
    { id: 'ord-003', userId: 'user-002', productId: 'prod-001', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-10') },  // Samsung phone
    { id: 'ord-004', userId: 'user-002', productId: 'prod-003', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-22') },  // boAt earbuds
    { id: 'ord-005', userId: 'user-002', productId: 'prod-007', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-25') },  // Ambrane power bank

    // Vikram's orders (Mumbai)
    { id: 'ord-006', userId: 'user-003', productId: 'prod-004', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-12') },  // JBL speaker
    { id: 'ord-007', userId: 'user-003', productId: 'prod-009', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-18') },  // Levi's jeans

    // Priya Nair's orders (Pune → Mumbai DC)
    { id: 'ord-008', userId: 'user-004', productId: 'prod-010', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-20') },  // Allen Solly shirt

    // Karthik's orders (Bangalore)
    { id: 'ord-009', userId: 'user-005', productId: 'prod-005', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-08') },  // AirPods Pro
    { id: 'ord-010', userId: 'user-005', productId: 'prod-014', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-14') },  // Prestige mixer

    // Sneha's orders (Kolkata)
    { id: 'ord-011', userId: 'user-006', productId: 'prod-013', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-19') },  // US Polo T-shirt
    { id: 'ord-012', userId: 'user-006', productId: 'prod-017', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-21') },  // Atomic Habits book

    // Arjun's orders (Hyderabad)
    { id: 'ord-013', userId: 'user-007', productId: 'prod-006', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-16') },  // Redmi monitor
    { id: 'ord-014', userId: 'user-007', productId: 'prod-012', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-22') },  // Casio G-Shock

    // Meera's orders (Noida → Delhi DC)
    { id: 'ord-015', userId: 'user-008', productId: 'prod-018', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-05-23') },  // Logitech combo

    // ─── Persona-specific orders ───

    // Priya Verma's Bata shoes (Jaipur) — DELIVERED, interception demo
    { id: 'ord-016', userId: 'user-009', productId: 'prod-021', status: 'DELIVERED',        orderedAt: new Date('2025-06-01') },  // Bata shoes ₹499

    // Vikram's Spigen case (Mumbai) — RETURN_REQUESTED
    { id: 'ord-017', userId: 'user-003', productId: 'prod-022', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-06-02') },  // Spigen case ₹299

    // Ananya's Pop Socket (Delhi) — RETURN_REQUESTED
    { id: 'ord-018', userId: 'user-001', productId: 'prod-024', status: 'RETURN_REQUESTED', orderedAt: new Date('2025-06-03') },  // Pop Socket ₹99

    // Rahul's baby monitor (Pune) — DELIVERED, "Outgrown It" scenario (not a return)
    { id: 'ord-019', userId: 'user-012', productId: 'prod-025', status: 'DELIVERED',        orderedAt: new Date('2024-01-15') },  // Mi Camera ₹2499
  ];

  await prisma.order.createMany({ data: orders });
  console.log(`  ✓ Created ${orders.length} orders`);

  // ─── 18 Returns ───
  const returns = [
    // ══════ GRADE A — Listed on marketplace ══════

    // ret-001: Ananya's Nike shoes → Grade A → LISTED
    { id: 'ret-001', orderId: 'ord-001', userId: 'user-001', reason: 'SIZE_FIT', status: 'LISTED', returnMethod: 'STANDARD', refundAmount: 9995.00, currentDcId: 'dc-del-001', routeDecision: 'RESELL', createdAt: new Date('2025-05-18') },

    // ret-002: Rohan's Samsung phone → Grade A → LISTED
    { id: 'ret-002', orderId: 'ord-003', userId: 'user-002', reason: 'CHANGED_MIND', status: 'LISTED', returnMethod: 'STANDARD', refundAmount: 18999.00, currentDcId: 'dc-del-001', routeDecision: 'RESELL', createdAt: new Date('2025-05-13') },

    // ret-003: Karthik's AirPods Pro → Grade A+ → LISTED
    { id: 'ret-003', orderId: 'ord-009', userId: 'user-005', reason: 'CHANGED_MIND', status: 'LISTED', returnMethod: 'STANDARD', refundAmount: 24900.00, currentDcId: 'dc-blr-001', routeDecision: 'RESELL', createdAt: new Date('2025-05-11') },

    // ret-004: Arjun's Casio G-Shock → Grade A → LISTED
    { id: 'ret-004', orderId: 'ord-014', userId: 'user-007', reason: 'NOT_AS_DESCRIBED', status: 'LISTED', returnMethod: 'STANDARD', refundAmount: 9995.00, currentDcId: 'dc-hyd-001', routeDecision: 'RESELL', createdAt: new Date('2025-05-25') },

    // ret-005: Priya Nair's Allen Solly shirt → Grade A → LISTED
    { id: 'ret-005', orderId: 'ord-008', userId: 'user-004', reason: 'SIZE_FIT', status: 'LISTED', returnMethod: 'STANDARD', refundAmount: 1499.00, currentDcId: 'dc-mum-001', routeDecision: 'RESELL', createdAt: new Date('2025-05-23') },

    // ret-006: Arjun's Redmi Monitor → Grade A → LISTED
    { id: 'ret-006', orderId: 'ord-013', userId: 'user-007', reason: 'CHANGED_MIND', status: 'LISTED', returnMethod: 'STANDARD', refundAmount: 11999.00, currentDcId: 'dc-hyd-001', routeDecision: 'RESELL', createdAt: new Date('2025-05-19') },

    // ══════ GRADE B — Routed to REFURBISH ══════

    // ret-007: Vikram's JBL speaker → Grade B → ROUTED
    { id: 'ret-007', orderId: 'ord-006', userId: 'user-003', reason: 'QUALITY', status: 'ROUTED', returnMethod: 'STANDARD', refundAmount: 9999.00, currentDcId: 'dc-mum-001', routeDecision: 'REFURBISH', createdAt: new Date('2025-05-15') },

    // ret-008: Vikram's Levi's jeans → Grade B → ROUTED
    { id: 'ret-008', orderId: 'ord-007', userId: 'user-003', reason: 'SIZE_FIT', status: 'ROUTED', returnMethod: 'STANDARD', refundAmount: 2999.00, currentDcId: 'dc-mum-001', routeDecision: 'REFURBISH', createdAt: new Date('2025-05-20') },

    // ret-009: Karthik's Prestige mixer → Grade B → ROUTED
    { id: 'ret-009', orderId: 'ord-010', userId: 'user-005', reason: 'QUALITY', status: 'ROUTED', returnMethod: 'STANDARD', refundAmount: 3295.00, currentDcId: 'dc-blr-001', routeDecision: 'REFURBISH', createdAt: new Date('2025-05-17') },

    // ══════ GRADE C — Routed to REFURBISH ══════

    // ret-010: Meera's Logitech combo → Grade C → ROUTED (missing mouse receiver)
    { id: 'ret-010', orderId: 'ord-015', userId: 'user-008', reason: 'DEFECTIVE', status: 'ROUTED', returnMethod: 'STANDARD', refundAmount: 1595.00, currentDcId: 'dc-del-001', routeDecision: 'REFURBISH', createdAt: new Date('2025-05-25') },

    // ══════ GRADE D — Routed to DONATE ══════

    // ret-011: Sneha's US Polo T-shirt → Grade D → ROUTED
    { id: 'ret-011', orderId: 'ord-011', userId: 'user-006', reason: 'QUALITY', status: 'ROUTED', returnMethod: 'STANDARD', refundAmount: 899.00, currentDcId: 'dc-kol-001', routeDecision: 'DONATE', createdAt: new Date('2025-05-22') },

    // ══════ GRADE F — Routed to RECYCLE ══════

    // ret-012: Rohan's Ambrane power bank → Grade F → ROUTED (swollen battery)
    { id: 'ret-012', orderId: 'ord-005', userId: 'user-002', reason: 'DEFECTIVE', status: 'ROUTED', returnMethod: 'STANDARD', refundAmount: 1099.00, currentDcId: 'dc-del-001', routeDecision: 'RECYCLE', createdAt: new Date('2025-05-27') },

    // ══════ AWAITING GRADING — for live demo ══════

    // ret-013: Rohan's boAt earbuds → RECEIVED_AT_DC, not yet graded
    { id: 'ret-013', orderId: 'ord-004', userId: 'user-002', reason: 'NOT_AS_DESCRIBED', status: 'RECEIVED_AT_DC', returnMethod: 'STANDARD', refundAmount: 1299.00, currentDcId: 'dc-del-001', routeDecision: null, createdAt: new Date('2025-05-24') },

    // ret-014: Sneha's Atomic Habits → RECEIVED_AT_DC, not yet graded
    { id: 'ret-014', orderId: 'ord-012', userId: 'user-006', reason: 'CHANGED_MIND', status: 'RECEIVED_AT_DC', returnMethod: 'STANDARD', refundAmount: 499.00, currentDcId: 'dc-kol-001', routeDecision: null, createdAt: new Date('2025-05-23') },

    // ret-015: Ananya's Sony headphones → SOLD (complete lifecycle)
    { id: 'ret-015', orderId: 'ord-002', userId: 'user-001', reason: 'CHANGED_MIND', status: 'SOLD', returnMethod: 'STANDARD', refundAmount: 24990.00, currentDcId: 'dc-del-001', routeDecision: 'RESELL', createdAt: new Date('2025-05-23') },

    // ══════ PERSONA-SPECIFIC RETURNS ══════

    // ret-016: Priya Verma's Bata shoes ₹499 → INITIATED (interception triggers here!)
    { id: 'ret-016', orderId: 'ord-016', userId: 'user-009', reason: 'SIZE_FIT', status: 'INITIATED', returnMethod: null, refundAmount: 499.00, currentDcId: null, routeDecision: null, createdAt: new Date('2025-06-06') },

    // ret-017: Vikram's Spigen case ₹299 → LISTED (graded A+, on marketplace)
    { id: 'ret-017', orderId: 'ord-017', userId: 'user-003', reason: 'CHANGED_MIND', status: 'LISTED', returnMethod: 'STANDARD', refundAmount: 299.00, currentDcId: 'dc-mum-001', routeDecision: 'RESELL', createdAt: new Date('2025-06-04') },

    // ret-018: Ananya's Pop Socket ₹99 → ROUTED to DONATE (too cheap to resell)
    { id: 'ret-018', orderId: 'ord-018', userId: 'user-001', reason: 'NOT_AS_DESCRIBED', status: 'ROUTED', returnMethod: 'STANDARD', refundAmount: 99.00, currentDcId: 'dc-del-001', routeDecision: 'DONATE', createdAt: new Date('2025-06-05') },
  ];

  await prisma.return.createMany({ data: returns });
  console.log(`  ✓ Created ${returns.length} returns`);

  // ─── 8 Inventory Items ───
  const inventoryItems = [
    // Available on marketplace (from LISTED returns)
    { id: 'inv-001', returnId: 'ret-001', productId: 'prod-008', currentDcId: 'dc-del-001', status: 'AVAILABLE', grade: 'A',  basePrice: 9995.00,  sellingPrice: 7996.00,  source: 'RETURN' },  // Nike shoes @ Delhi
    { id: 'inv-002', returnId: 'ret-002', productId: 'prod-001', currentDcId: 'dc-del-001', status: 'AVAILABLE', grade: 'A',  basePrice: 18999.00, sellingPrice: 15199.00, source: 'RETURN' },  // Samsung phone @ Delhi
    { id: 'inv-003', returnId: 'ret-003', productId: 'prod-005', currentDcId: 'dc-blr-001', status: 'AVAILABLE', grade: 'A+', basePrice: 24900.00, sellingPrice: 22410.00, source: 'RETURN' },  // AirPods Pro @ Bangalore
    { id: 'inv-004', returnId: 'ret-004', productId: 'prod-012', currentDcId: 'dc-hyd-001', status: 'AVAILABLE', grade: 'A',  basePrice: 9995.00,  sellingPrice: 7996.00,  source: 'RETURN' },  // Casio G-Shock @ Hyderabad
    { id: 'inv-005', returnId: 'ret-005', productId: 'prod-010', currentDcId: 'dc-mum-001', status: 'AVAILABLE', grade: 'A',  basePrice: 1499.00,  sellingPrice: 1199.00,  source: 'RETURN' },  // Allen Solly shirt @ Mumbai
    { id: 'inv-006', returnId: 'ret-006', productId: 'prod-006', currentDcId: 'dc-hyd-001', status: 'AVAILABLE', grade: 'A',  basePrice: 11999.00, sellingPrice: 9599.00,  source: 'RETURN' },  // Redmi Monitor @ Hyderabad

    // Already sold (complete lifecycle)
    { id: 'inv-007', returnId: 'ret-015', productId: 'prod-002', currentDcId: 'dc-del-001', status: 'SOLD',      grade: 'A',  basePrice: 24990.00, sellingPrice: 19992.00, source: 'RETURN' },  // Sony headphones (SOLD)

    // Spigen case (from ret-017) — on marketplace
    { id: 'inv-008', returnId: 'ret-017', productId: 'prod-022', currentDcId: 'dc-mum-001', status: 'AVAILABLE', grade: 'A+', basePrice: 299.00,   sellingPrice: 269.00,   source: 'RETURN' },  // Spigen case @ Mumbai
  ];

  await prisma.inventoryItem.createMany({ data: inventoryItems });
  console.log(`  ✓ Created ${inventoryItems.length} inventory items`);

  // ─── 1 Marketplace Order (Karthik bought Sony headphones) ───
  const marketplaceOrders = [
    {
      id: 'mp-ord-001',
      inventoryItemId: 'inv-007',
      buyerId: 'user-005',          // Karthik in Bangalore
      sellingPrice: 19992.00,       // 20% off ₹24,990
      shippingCost: 115.00,         // ₹50 (DEL→BLR) + ₹65 (last mile)
      totalPrice: 20107.00,         // selling + shipping
      status: 'DELIVERED',
      createdAt: new Date('2025-05-25'),
    },
  ];

  await prisma.marketplaceOrder.createMany({ data: marketplaceOrders });
  console.log(`  ✓ Created ${marketplaceOrders.length} marketplace orders`);

  // ─── Grade Config (6 grades) ───
  const gradeConfigs = [
    { id: 'gc-aplus', grade: 'A+', label: 'Like New',      discountPct: 10, defaultRoute: 'RESELL',    minMrp: 100 },
    { id: 'gc-a',     grade: 'A',  label: 'Excellent',     discountPct: 20, defaultRoute: 'RESELL',    minMrp: 150 },
    { id: 'gc-b',     grade: 'B',  label: 'Good',          discountPct: 35, defaultRoute: 'RESELL',    minMrp: 3000 },
    { id: 'gc-c',     grade: 'C',  label: 'Fair',          discountPct: 50, defaultRoute: 'REFURBISH', minMrp: null },
    { id: 'gc-d',     grade: 'D',  label: 'Poor',          discountPct: 0,  defaultRoute: 'DONATE',    minMrp: null },
    { id: 'gc-f',     grade: 'F',  label: 'Unsalvageable', discountPct: 0,  defaultRoute: 'RECYCLE',   minMrp: null },
  ];

  await prisma.gradeConfig.createMany({ data: gradeConfigs });
  console.log(`  ✓ Created ${gradeConfigs.length} grade configs`);

  // ─── Green Credits Ledger (Karthik earned credits from purchase) ───
  const greenCreditEntries = [
    {
      id: 'gcl-001',
      userId: 'user-005',       // Karthik
      amount: 25,
      action: 'PURCHASE_RELOOP',
      referenceId: 'mp-ord-001',
      description: 'Purchased Sony WH-1000XM5 (Grade A) on ReLoop marketplace',
      createdAt: new Date('2025-05-25'),
    },
  ];

  await prisma.greenCreditLedger.createMany({ data: greenCreditEntries });
  console.log(`  ✓ Created ${greenCreditEntries.length} green credit ledger entries`);

  console.log('\n✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
