-- Service & Repair Schema
CREATE TABLE IF NOT EXISTS job_cards (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER REFERENCES customers(id),
  car_model VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50),
  technician_id INTEGER REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS repair_progress (
  id SERIAL PRIMARY KEY,
  job_card_id INTEGER REFERENCES job_cards(id),
  stage VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quality_checks (
  id SERIAL PRIMARY KEY,
  job_card_id INTEGER REFERENCES job_cards(id),
  checked_by INTEGER REFERENCES users(id),
  status VARCHAR(50),
  checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
