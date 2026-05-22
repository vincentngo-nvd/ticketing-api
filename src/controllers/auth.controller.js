const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const prisma = require('../lib/prisma');
const AppError = require('../utils/AppError');
const { catchAsync } = require('../middlewares/error.middleware');

const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).max(100),
  role: z.enum(['ORGANIZER', 'ATTENDEE']).default('ATTENDEE'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const register = catchAsync(async (req, res) => {
  const { email, password, name, role } = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new AppError('Email already registered', 409);

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, role },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  const token = signToken(user.id);

  res.status(201).json({ status: 'success', data: { token, user } });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken(user.id);
  const { password: _, ...userWithoutPassword } = user;

  res.json({ status: 'success', data: { token, user: userWithoutPassword } });
});

const getMe = catchAsync(async (req, res) => {
  res.json({ status: 'success', data: { user: req.user } });
});

module.exports = { register, login, getMe };