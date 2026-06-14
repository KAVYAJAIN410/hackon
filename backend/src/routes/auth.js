const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../lib/db');
const { JWT_SECRET } = require('../middleware/auth');

const TOKEN_EXPIRY = '7d';

// POST /api/auth/register — create new account
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, city, state } = req.body;

    if (!email || !password || !name || !city || !state) {
      return res.status(400).json({ error: 'email, password, name, city, and state are required' });
    }

    // Check if email already exists
    const existing = await prisma.loginCredentials.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create login credentials + user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const login = await tx.loginCredentials.create({
        data: { email, passwordHash, role: 'CUSTOMER' },
      });

      const user = await tx.user.create({
        data: {
          name,
          email,
          city,
          state,
          loginId: login.id,
          greenCredits: 0,
          greenTier: 'SEEDLING',
        },
      });

      return { login, user };
    });

    // Generate JWT
    const token = jwt.sign(
      { id: result.user.id, email: result.user.email, role: 'CUSTOMER' },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.status(201).json({
      token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        city: result.user.city,
        state: result.user.state,
        greenCredits: result.user.greenCredits,
        greenTier: result.user.greenTier,
        role: 'CUSTOMER',
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login — authenticate and return JWT
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    // Find login credentials
    const login = await prisma.loginCredentials.findUnique({ where: { email } });
    if (!login) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const valid = await bcrypt.compare(password, login.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Find the user or admin linked to this login
    let user = await prisma.user.findFirst({
      where: { loginId: login.id },
      include: { nearestDc: true },
    });

    let responseUser;

    if (user) {
      responseUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        city: user.city,
        state: user.state,
        greenCredits: user.greenCredits,
        greenTier: user.greenTier,
        nearestDc: user.nearestDc,
        role: login.role,
      };
    } else if (login.role === 'ADMIN') {
      // Check admin table
      const admin = await prisma.admin.findFirst({ where: { loginId: login.id } });
      if (!admin) {
        return res.status(401).json({ error: 'No account linked to this login' });
      }
      responseUser = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        city: 'System',
        state: '',
        greenCredits: 0,
        greenTier: 'ADMIN',
        nearestDc: null,
        role: 'ADMIN',
      };
    } else if (login.role === 'DELIVERY_PARTNER') {
      // Check delivery associate table
      const da = await prisma.deliveryAssociate.findFirst({ where: { loginId: login.id } });
      if (!da) {
        return res.status(401).json({ error: 'No account linked to this login' });
      }
      responseUser = {
        id: da.id,
        name: da.name,
        email: da.email,
        phone: da.phone,
        city: 'Delivery',
        state: '',
        greenCredits: 0,
        greenTier: 'DELIVERY',
        nearestDc: null,
        role: 'DELIVERY_PARTNER',
      };
    } else if (login.role === 'SELLER') {
      // Check seller table
      const seller = await prisma.seller.findFirst({ where: { loginId: login.id } });
      if (!seller) {
        return res.status(401).json({ error: 'No account linked to this login' });
      }
      responseUser = {
        id: seller.id,
        name: seller.contactName || seller.businessName,
        email: seller.email,
        city: seller.city || 'Seller',
        state: seller.state || '',
        businessName: seller.businessName,
        greenCredits: 0,
        greenTier: 'SELLER',
        nearestDc: null,
        role: 'SELLER',
      };
    } else {
      return res.status(401).json({ error: 'No user account linked to this login' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: responseUser.id, email: responseUser.email, role: login.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.json({ token, user: responseUser });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/me — get current user from token
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if it's an admin
    if (decoded.role === 'ADMIN') {
      const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      return res.json({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        city: 'System',
        state: '',
        greenCredits: 0,
        greenTier: 'ADMIN',
        nearestDc: null,
        role: 'ADMIN',
      });
    }

    // Check if it's a delivery partner
    if (decoded.role === 'DELIVERY_PARTNER') {
      const da = await prisma.deliveryAssociate.findUnique({ where: { id: decoded.id } });
      if (!da) {
        return res.status(404).json({ error: 'Delivery associate not found' });
      }
      return res.json({
        id: da.id,
        name: da.name,
        email: da.email,
        phone: da.phone,
        city: 'Delivery',
        state: '',
        greenCredits: 0,
        greenTier: 'DELIVERY',
        nearestDc: null,
        role: 'DELIVERY_PARTNER',
      });
    }

    // Check if it's a seller
    if (decoded.role === 'SELLER') {
      const seller = await prisma.seller.findUnique({ where: { id: decoded.id } });
      if (!seller) {
        return res.status(404).json({ error: 'Seller not found' });
      }
      return res.json({
        id: seller.id,
        name: seller.contactName || seller.businessName,
        email: seller.email,
        city: seller.city || 'Seller',
        state: seller.state || '',
        businessName: seller.businessName,
        greenCredits: 0,
        greenTier: 'SELLER',
        nearestDc: null,
        role: 'SELLER',
      });
    }

    // Regular user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { nearestDc: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      city: user.city,
      state: user.state,
      greenCredits: user.greenCredits,
      greenTier: user.greenTier,
      nearestDc: user.nearestDc,
      role: decoded.role,
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    console.error('Me error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;
