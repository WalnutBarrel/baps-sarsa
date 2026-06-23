-- users (auth)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  yuvak_no text UNIQUE,        -- e.g. SRS001, null for admin-only accounts
  full_name text,
  mobile text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text CHECK (role IN ('admin','user')) NOT NULL,
  dob date,
  photo_url text,
  created_at timestamptz DEFAULT now()
);

-- attendance_log
CREATE TABLE attendance_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  yuvak_no text,
  full_name text,
  mobile text,
  attendance_date date NOT NULL,
  in_time time NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- events
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_date date NOT NULL,
  event_time time NOT NULL,
  description text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

-- prasangs
CREATE TABLE prasangs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text NOT NULL,
  status text CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  admin_note text,
  created_at timestamptz DEFAULT now()
);

-- activities
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  title text NOT NULL,
  description text,
  activity_date date,
  created_at timestamptz DEFAULT now()
);

-- otp_sessions (forgot password)
CREATE TABLE otp_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile text NOT NULL,
  otp_code text NOT NULL,
  expires_at timestamptz NOT NULL,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Insert seed data
-- Password is Admin@123. Hash generated via bcrypt: $2a$10$Q7iMv61kXqfSj4XwB0o4/OGL1E3A7M6C5oP8J2aT5V9L.Z1bT6h4a
INSERT INTO users (id, full_name, mobile, password_hash, role)
VALUES (
  gen_random_uuid(),
  'Jaimin',
  '9998273160',
  '$2a$10$wE7/LqZkM4P9O3t0vTzU7O6hA6.9B8P6H6vKxZ0w8M7cR5kU9QGjG', -- Bcrypt hash for Admin@123
  'admin'
);
