-- Inventory & Spare Parts Schema
CREATE TABLE IF NOT EXISTS parts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  part_number VARCHAR(100) UNIQUE,
  supplier_id INTEGER REFERENCES suppliers(id),
  stock INTEGER,
  reorder_level INTEGER
);

CREATE TABLE IF NOT EXISTS suppliers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  contact VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS inventory_usage (
  id SERIAL PRIMARY KEY,
  part_id INTEGER REFERENCES parts(id),
  used_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  quantity INTEGER
);
