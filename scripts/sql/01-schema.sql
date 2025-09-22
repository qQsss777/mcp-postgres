-- 1. Activer l'extension TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- 2. Créer la table des logs applicatifs
CREATE TABLE logs (
    id SERIAL,
    log_time TIMESTAMPTZ NOT NULL DEFAULT now(),
    service_name TEXT NOT NULL,
    user_id TEXT,
    ip_address INET,
    log_level TEXT NOT NULL,
    message TEXT NOT NULL,
    status_code INT,
    PRIMARY KEY (id, log_time)
);

-- 3. Convertir la table en hypertable pour TimescaleDB
SELECT create_hypertable('logs', 'log_time', if_not_exists => TRUE);