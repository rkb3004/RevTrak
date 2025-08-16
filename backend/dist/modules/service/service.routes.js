"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../auth/auth.middleware");
const pg_1 = require("pg");
const router = (0, express_1.Router)();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
// CRUD for job cards
router.get('/job-cards', auth_middleware_1.authenticateJWT, async (req, res) => {
    const result = await pool.query('SELECT * FROM job_cards');
    res.json(result.rows);
});
router.post('/job-cards', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRoles)('technician', 'admin'), async (req, res) => {
    const { customer_id, car_model, status, technician_id } = req.body;
    const result = await pool.query('INSERT INTO job_cards (customer_id, car_model, status, technician_id) VALUES ($1,$2,$3,$4) RETURNING *', [customer_id, car_model, status, technician_id]);
    res.status(201).json(result.rows[0]);
});
// ...other CRUD endpoints for repair_progress, quality_checks
exports.default = router;
