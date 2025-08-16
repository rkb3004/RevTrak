import { Router } from 'express';
import { Pool } from 'pg';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Get all customers
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM customers');
  res.json(result.rows);
});

// Add a new customer
router.post('/', async (req, res) => {
  const { name, email, phone, address } = req.body;
  const result = await pool.query(
    'INSERT INTO customers (name, email, phone, address) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, email, phone, address]
  );
  res.status(201).json(result.rows[0]);
});

export default router;
