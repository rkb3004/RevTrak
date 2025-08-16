"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../auth/auth.middleware");
const pg_1 = require("pg");
const router = (0, express_1.Router)();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
// CRUD for parts
router.get('/parts', auth_middleware_1.authenticateJWT, async (req, res) => {
    const result = await pool.query('SELECT * FROM parts');
    res.json(result.rows);
});
router.post('/parts', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRoles)('admin'), async (req, res) => {
    const { name, part_number, supplier_id, stock, reorder_level } = req.body;
    const result = await pool.query('INSERT INTO parts (name, part_number, supplier_id, stock, reorder_level) VALUES ($1,$2,$3,$4,$5) RETURNING *', [name, part_number, supplier_id, stock, reorder_level]);
    res.status(201).json(result.rows[0]);
});
// ...other CRUD endpoints for suppliers, inventory_usage
exports.default = router;
