const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendMail } = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sanitize = (u) => ({
  id: u._id, name: u.name, email: u.email, role: u.role, phone: u.phone, avatar: u.avatar,
});

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    const token = signToken(user._id);
    res.status(201).json({ token, user: sanitize(user) });
  } catch (e) { next(e); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = signToken(user._id);
    res.json({ token, user: sanitize(user) });
  } catch (e) { next(e); }
};

exports.me = async (req, res) => res.json({ user: sanitize(req.user) });

exports.updateProfile = async (req, res, next) => {
  try {
    const allowed = ['name', 'phone', 'avatar', 'addresses'];
    const updates = {};
    for (const k of allowed) if (req.body[k] !== undefined) updates[k] = req.body[k];
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user: sanitize(user) });
  } catch (e) { next(e); }
};

// POST /api/auth/forgot-password — generates a reset token and emails it.
// In dev (no SMTP) the token is also returned in the response so it can be tested.
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findOne({ email });
    // Don't reveal whether a user exists; respond with success either way.
    if (!user) return res.json({ message: 'If that account exists, a reset link has been sent.' });

    const raw = crypto.randomBytes(24).toString('hex');
    const hashed = crypto.createHash('sha256').update(raw).digest('hex');
    user.resetToken = hashed;
    user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${raw}&email=${encodeURIComponent(email)}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
        <h2 style="color:#db2777">Reset your Mayank Fashion password</h2>
        <p>Click the button below to set a new password. This link expires in 1 hour.</p>
        <p><a href="${url}" style="background:#db2777;color:#fff;padding:12px 24px;border-radius:9999px;text-decoration:none">Reset Password</a></p>
        <p style="color:#666;font-size:12px">If you didn't request this, ignore this email.</p>
      </div>`;
    const result = await sendMail({ to: email, subject: 'Reset your password', html });

    const payload = { message: 'If that account exists, a reset link has been sent.' };
    // Surface the token for dev / when SMTP isn't configured so password reset is testable.
    if (result?.skipped || process.env.NODE_ENV !== 'production') payload.devToken = raw;
    res.json(payload);
  } catch (e) { next(e); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { email, token, password } = req.body;
    if (!email || !token || !password) return res.status(400).json({ message: 'Missing fields' });
    if (password.length < 6) return res.status(400).json({ message: 'Password too short' });
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      email,
      resetToken: hashed,
      resetTokenExpires: { $gt: new Date() },
    }).select('+resetToken +resetTokenExpires');
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();
    res.json({ message: 'Password updated. Please login.' });
  } catch (e) { next(e); }
};

exports.subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Valid email required' });
    }
    // If a user exists, mark them as subscribed; otherwise just acknowledge.
    await User.updateOne({ email }, { $set: { newsletter: true } });
    res.json({ message: "You're subscribed! Use code WELCOME10 for 10% off." });
  } catch (e) { next(e); }
};
