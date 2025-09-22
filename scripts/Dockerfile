FROM timescale/timescaledb:latest-pg17
COPY ./scripts/sql/01-schema.sql /docker-entrypoint-initdb.d/01-schema.sql
COPY ./scripts/sql/02-inserts.sql /docker-entrypoint-initdb.d/02-inserts.sql
COPY ./scripts/conf/pg_hba.conf /etc/postgresql/pg_hba.conf
COPY ./scripts/conf/postgresql.conf /etc/postgresql/postgresql.conf
EXPOSE 5432
