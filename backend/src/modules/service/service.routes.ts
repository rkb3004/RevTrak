import { Router } from 'express';
// Removed authentication middleware import
import { Pool } from 'pg';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// CRUD for job cards
router.get('/job-cards', async (req, res) => {
  const result = await pool.query('SELECT * FROM job_cards');
  res.json(result.rows);
});

router.post('/job-cards', async (req, res) => {
  const { customer_id, car_model, status, technician_id } = req.body;
  const result = await pool.query(
    'INSERT INTO job_cards (customer_id, car_model, status, technician_id) VALUES ($1,$2,$3,$4) RETURNING *',
    [customer_id, car_model, status, technician_id]
  );
  res.status(201).json(result.rows[0]);
});

// ...other CRUD endpoints for repair_progress, quality_checks

export default router;
