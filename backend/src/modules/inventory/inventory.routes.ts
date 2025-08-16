import { Router } from 'express';
// import { authenticateJWT, authorizeRoles } from '../auth/auth.middleware';
import { Pool } from 'pg';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// CRUD for parts
router.get('/parts', async (req, res) => {
  const result = await pool.query('SELECT * FROM parts');
  res.json(result.rows);
});

router.post('/parts', async (req, res) => {
  const { name, part_number, supplier_id, stock, reorder_level } = req.body;
  const result = await pool.query(
    'INSERT INTO parts (name, part_number, supplier_id, stock, reorder_level) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [name, part_number, supplier_id, stock, reorder_level]
  );
  res.status(201).json(result.rows[0]);
});

// ...other CRUD endpoints for suppliers, inventory_usage

export default router;
