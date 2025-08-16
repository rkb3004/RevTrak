-- Sales Management Schema
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  inquiry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50),
  assigned_to INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS test_drives (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id),
  scheduled_at TIMESTAMP,
  car_model VARCHAR(100),
  status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS financing (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id),
  provider VARCHAR(100),
  amount NUMERIC,
  status VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES leads(id),
  delivery_date TIMESTAMP,
  status VARCHAR(50)
);
