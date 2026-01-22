-- Run this query to set up the Deploy Postgres database
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    project_id VARCHAR(256) NOT NULL UNIQUE,
    region VARCHAR(256) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX project_id_idx ON projects (project_id);
