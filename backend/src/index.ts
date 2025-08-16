import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

import userRoutes from './modules/user/user.routes';
import salesRoutes from './modules/sales/sales.routes';
import serviceRoutes from './modules/service/service.routes';
import inventoryRoutes from './modules/inventory/inventory.routes';
import customerRoutes from './modules/customer/customer.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';

dotenv.config();


const app = express();
// Allow CORS from frontend in Docker and local
app.use(cors({
  origin: [
    'http://localhost:3000', // Vite dev server
    'http://localhost:5173', // Vite dev server (default)
    'http://frontend:3000',  // Docker Compose frontend service
    'http://backend:4000',   // Docker Compose backend service (self)
    'http://127.0.0.1:5173'  // Vite dev server (127.0.0.1)
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/analytics', analyticsRoutes);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// TODO: Add routes for auth, sales, service, inventory, customer, analytics

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
