"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../auth/auth.middleware");
const pg_1 = require("pg");
const router = (0, express_1.Router)();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
// CRUD for leads
router.get('/leads', auth_middleware_1.authenticateJWT, async (req, res) => {
    const result = await pool.query('SELECT * FROM leads');
    res.json(result.rows);
});
router.post('/leads', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRoles)('sales', 'admin'), async (req, res) => {
    const { customer_id, name, email, phone, status, assigned_to } = req.body;
    const result = await pool.query('INSERT INTO leads (customer_id, name, email, phone, status, assigned_to) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *', [customer_id, name, email, phone, status, assigned_to]);
    res.status(201).json(result.rows[0]);
});
// ...other CRUD endpoints for test_drives, financing, deliveries
exports.default = router;
