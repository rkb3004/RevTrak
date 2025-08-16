import { Router } from 'express';
// ...existing code...
import { Pool } from 'pg';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// CRUD for leads

router.get('/leads', async (req, res) => {
  const result = await pool.query('SELECT * FROM leads');
  res.json(result.rows);
});


router.post('/leads', async (req, res) => {
  const { customer_id, name, email, phone, status, assigned_to } = req.body;
  const result = await pool.query(
    'INSERT INTO leads (customer_id, name, email, phone, status, assigned_to) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [customer_id, name, email, phone, status, assigned_to]
  );
  res.status(201).json(result.rows[0]);
});

// ...other CRUD endpoints for test_drives, financing, deliveries

export default router;
