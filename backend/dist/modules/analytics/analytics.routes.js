"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../auth/auth.middleware");
const pg_1 = require("pg");
const router = (0, express_1.Router)();
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
// Example: Real-time dashboard stats
router.get('/dashboard', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRoles)('admin', 'sales', 'technician'), async (req, res) => {
    const leads = await pool.query('SELECT COUNT(*) FROM leads');
    const jobs = await pool.query('SELECT COUNT(*) FROM job_cards');
    const parts = await pool.query('SELECT COUNT(*) FROM parts');
    res.json({ leads: leads.rows[0].count, jobs: jobs.rows[0].count, parts: parts.rows[0].count });
});
// ...other analytics endpoints (predictive, satisfaction, etc.)
exports.default = router;
