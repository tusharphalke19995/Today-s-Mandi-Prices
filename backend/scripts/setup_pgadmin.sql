-- Run this in pgAdmin: Query Tool on your PostgreSQL server
-- Right-click your server -> Query Tool -> paste and Execute (F5)

-- 1. Create database
CREATE DATABASE mandi_prices
    WITH ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TEMPLATE = template0;

-- 2. Create app user (optional — or use your existing postgres user)
CREATE USER mandi_user WITH PASSWORD 'mandi_pass';

-- 3. Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mandi_prices TO mandi_user;

-- 4. Connect to mandi_prices database, then run:
--    (In pgAdmin: connect to mandi_prices, open Query Tool again)
GRANT ALL ON SCHEMA public TO mandi_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO mandi_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO mandi_user;

-- After running this, set in backend/.env:
-- DATABASE_URL=postgresql://mandi_user:mandi_pass@localhost:5432/mandi_prices
--
-- OR if using default postgres user:
-- DATABASE_URL=postgresql://postgres:YOUR_PGADMIN_PASSWORD@localhost:5432/mandi_prices
