/**
 * server/authService.js
 * Cryptographic Authentication & Session Management for Agent Travel.
 * Provides secure password hashing (PBKDF2-SHA512), role-based session tokens (HMAC-SHA256),
 * and preloaded credentials for travelers and reviewers.
 */

import crypto from 'crypto';

// Secret for HMAC-SHA256 token signing
const JWT_SECRET = process.env.SESSION_SECRET || 'agent_travel_secret_key_prod_hmac_2026';

// Helper: Hash password with salt
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

// Helper: Verify password
function verifyPassword(password, hash, salt) {
  const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verifyHash, 'hex'));
}

// In-memory user registry initialized with default demo credentials
const users = new Map();

// Helper to register initial users
function initUser(user) {
  const { hash, salt } = hashPassword(user.password);
  users.set(user.email.toLowerCase(), {
    id: user.id,
    email: user.email.toLowerCase(),
    name: user.name,
    phone: user.phone || '',
    role: user.role || 'traveler',
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  });
}

// Default Seed Users (1 Traveler, 2 Reviewers)
initUser({
  id: 'usr_aarav_sharma',
  email: 'aarav.sharma@example.com',
  name: 'Aarav Sharma',
  password: 'Password@123',
  phone: '+91 98765 43210',
  role: 'traveler',
});

initUser({
  id: 'usr_meera_iyer',
  email: 'reviewer@agenttravel.com',
  name: 'Meera Iyer',
  password: 'Reviewer@123',
  phone: '+91 91234 56789',
  role: 'reviewer',
});

initUser({
  id: 'usr_julian_hayes',
  email: 'julian.hayes@agenttravel.com',
  name: 'Julian Hayes',
  password: 'Auditor@123',
  phone: '+91 98111 22334',
  role: 'reviewer',
});

export const authService = {
  // Generate signed HMAC-SHA256 session token
  generateToken(user) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(
      JSON.stringify({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 3600, // 7 days
      })
    ).toString('base64url');

    const signature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    return `${header}.${payload}.${signature}`;
  },

  // Verify signed token
  verifyToken(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    try {
      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature, 'utf-8'),
        Buffer.from(expectedSignature, 'utf-8')
      );
      if (!isValid) return null;

      const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
      if (data.exp && data.exp < Math.floor(Date.now() / 1000)) {
        return null; // Expired
      }
      return data;
    } catch {
      return null;
    }
  },

  // Login handler
  login(email, password) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = users.get(email.toLowerCase().trim());
    if (!user) {
      // Prevent timing attacks
      hashPassword(password);
      throw new Error('Invalid email or password');
    }

    const isMatch = verifyPassword(password, user.passwordHash, user.salt);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
      },
    };
  },

  // Registration handler
  register({ email, password, name, phone, role = 'traveler' }) {
    if (!email || !password || !name) {
      throw new Error('Name, email, and password are required');
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (users.has(normalizedEmail)) {
      throw new Error('An account with this email already exists');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const { hash, salt } = hashPassword(password);
    const newUser = {
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      email: normalizedEmail,
      name: name.trim(),
      phone: phone?.trim() || '',
      role: role === 'reviewer' ? 'reviewer' : 'traveler',
      passwordHash: hash,
      salt,
      createdAt: new Date().toISOString(),
    };

    users.set(normalizedEmail, newUser);
    const token = this.generateToken(newUser);
    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
      },
    };
  },

  getUserByEmail(email) {
    const user = users.get(email.toLowerCase().trim());
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
    };
  },
};

export default authService;
