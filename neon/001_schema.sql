BEGIN;
CREATE TABLE IF NOT EXISTS requests (
 id text PRIMARY KEY,user_id text NOT NULL,name text NOT NULL,contact text NOT NULL,
 category text NOT NULL,origin text NOT NULL,destination text NOT NULL,date text NOT NULL,
 passengers integer NOT NULL CHECK(passengers BETWEEN 1 AND 200),details text NOT NULL,
 status text NOT NULL DEFAULT 'Novo' CHECK(status IN ('Novo','Em atendimento','Confirmado','Concluído','Cancelado')),
 created_at text NOT NULL,pickup_time text NOT NULL DEFAULT '',notes text NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS request_events(id text PRIMARY KEY,request_id text NOT NULL REFERENCES requests(id),description text NOT NULL,created_at text NOT NULL);
CREATE TABLE IF NOT EXISTS client_profiles(user_id text PRIMARY KEY,name text NOT NULL,contact text NOT NULL);
CREATE TABLE IF NOT EXISTS request_messages(id text PRIMARY KEY,request_id text NOT NULL REFERENCES requests(id),sender text NOT NULL CHECK(sender IN ('cliente','equipe')),body text NOT NULL,created_at text NOT NULL);
CREATE INDEX IF NOT EXISTS requests_user_created_idx ON requests(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS requests_date_status_idx ON requests(date,status);
CREATE INDEX IF NOT EXISTS request_events_request_idx ON request_events(request_id,created_at DESC);
CREATE INDEX IF NOT EXISTS request_messages_request_idx ON request_messages(request_id,created_at);
-- Application tables are server-only; Neon Auth manages its own schema.
REVOKE ALL ON requests,request_events,client_profiles,request_messages FROM PUBLIC;
COMMIT;
