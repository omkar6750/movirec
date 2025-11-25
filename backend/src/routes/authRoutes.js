import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = Router();

const generateToken = (id) => {
        return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// 1. Trigger Google Login
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Google Callback
router.get('/auth/google/callback',
        passport.authenticate('google', { session: false, failureRedirect: '/' }),
        (req, res) => {
                const token = generateToken(req.user._id);

                res.cookie('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                });

                res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`);
        }
);

// 3. Verify User (Frontend calls this)
router.get('/api/me', async (req, res) => {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ authenticated: false });

        try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id).select('-googleId');
                if (!user) return res.status(401).json({ authenticated: false });

                res.json({ authenticated: true, user });
        } catch (err) {
                res.status(401).json({ authenticated: false });
        }
});

// 4. Logout
router.post('/api/logout', (req, res) => {
        res.clearCookie('token');
        res.json({ message: 'Logged out' });
});

export default router;