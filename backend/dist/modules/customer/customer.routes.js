"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../auth/auth.middleware");
const pg_1 = require("pg");
const router = (0, express_1.Router)();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
// CRUD for customers
router.get('/', auth_middleware_1.authenticateJWT, async (req, res) => {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
});
router.post('/', auth_middleware_1.authenticateJWT, async (req, res) => {
    const { name, email, phone, address } = req.body;
    const result = await pool.query('INSERT INTO customers (name, email, phone, address) VALUES ($1,$2,$3,$4) RETURNING *', [name, email, phone, address]);
    res.status(201).json(result.rows[0]);
});
exports.default = router;
