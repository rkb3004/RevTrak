"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../auth/auth.middleware");
const pg_1 = require("pg");
const router = (0, express_1.Router)();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
// Get current user profile
router.get('/me', auth_middleware_1.authenticateJWT, async (req, res) => {
    if (!req.user)
        return res.status(401).json({ message: 'Unauthorized' });
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    res.json(result.rows[0]);
});
// Admin: list all users
router.get('/', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRoles)('admin'), async (req, res) => {
    const result = await pool.query('SELECT id, name, email, role FROM users');
    res.json(result.rows);
});
exports.default = router;
