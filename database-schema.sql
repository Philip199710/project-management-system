-- ============ PROJECT MANAGEMENT SYSTEM DATABASE SCHEMA ============
-- PostgreSQL 14+
-- Deploy this schema to your Render PostgreSQL instance

-- ============ USERS TABLE ============
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- 'user', 'manager', 'admin'
    avatar_url VARCHAR(500),
    github_username VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- ============ PROJECTS TABLE ============
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id INTEGER REFERENCES users(id),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'paused', 'completed', 'cancelled'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget DECIMAL(15,2),
    github_repo VARCHAR(255),
    github_sync BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- ============ TEAM MEMBERS TABLE ============
CREATE TABLE IF NOT EXISTS team_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(100), -- 'Developer', 'Designer', 'Manager', 'Lead', etc.
    hourly_rate DECIMAL(10,2),
    max_hours DECIMAL(10,2),
    hours_used DECIMAL(10,2) DEFAULT 0,
    is_vendor BOOLEAN DEFAULT false,
    vendor_company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ TASKS TABLE ============
CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to INTEGER REFERENCES team_members(id),
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in-progress', 'review', 'completed'
    priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    estimated_hours DECIMAL(10,2),
    actual_hours DECIMAL(10,2) DEFAULT 0,
    budget_allocation DECIMAL(15,2),
    github_issue_id INTEGER,
    github_issue_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- ============ DELIVERABLES TABLE ============
CREATE TABLE IF NOT EXISTS deliverables (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'draft', 'submitted', 'approved', 'rejected'
    due_date DATE,
    submitted_by INTEGER REFERENCES team_members(id),
    submitted_at TIMESTAMP,
    approval_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ DOCUMENTS TABLE ============
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100), -- 'RFQ', 'Proposal', 'Contract', 'Report', etc.
    file_url VARCHAR(500),
    file_size INTEGER,
    file_type VARCHAR(50),
    version INTEGER DEFAULT 1,
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- ============ BUDGET ITEMS TABLE ============
CREATE TABLE IF NOT EXISTS budget_items (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(100), -- 'labor', 'materials', 'vendor', 'contingency', 'travel', etc.
    description VARCHAR(255) NOT NULL,
    planned_amount DECIMAL(15,2) NOT NULL,
    actual_amount DECIMAL(15,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'invoiced', 'paid'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ GITHUB SYNC TABLE ============
CREATE TABLE IF NOT EXISTS github_issues (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES tasks(id) ON DELETE SET NULL,
    github_issue_id INTEGER NOT NULL,
    github_issue_number INTEGER,
    title VARCHAR(500),
    body TEXT,
    status VARCHAR(50), -- 'open', 'closed'
    url VARCHAR(500),
    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ ACTIVITY LOG TABLE ============
CREATE TABLE IF NOT EXISTS activity_log (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(255),
    entity_type VARCHAR(100), -- 'project', 'task', 'document', 'budget', etc.
    entity_id INTEGER,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ AUDIT LOG TABLE ============
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(255),
    table_name VARCHAR(100),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============ INDEXES FOR PERFORMANCE ============

-- Project indexes
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Team member indexes
CREATE INDEX idx_team_members_project_id ON team_members(project_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_email ON team_members(email);

-- Task indexes
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_start_date ON tasks(start_date);
CREATE INDEX idx_tasks_end_date ON tasks(end_date);

-- Document indexes
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_task_id ON documents(task_id);
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);

-- Budget indexes
CREATE INDEX idx_budget_items_project_id ON budget_items(project_id);
CREATE INDEX idx_budget_items_category ON budget_items(category);

-- Activity log indexes
CREATE INDEX idx_activity_log_project_id ON activity_log(project_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- ============ VIEWS FOR COMMON QUERIES ============

-- Project Summary View
CREATE OR REPLACE VIEW project_summary AS
SELECT 
    p.id,
    p.name,
    p.status,
    p.start_date,
    p.end_date,
    (SELECT COUNT(*) FROM tasks WHERE project_id = p.id) as total_tasks,
    (SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'completed') as completed_tasks,
    (SELECT COUNT(*) FROM team_members WHERE project_id = p.id) as team_size,
    (SELECT SUM(planned_amount) FROM budget_items WHERE project_id = p.id) as total_budget,
    (SELECT SUM(actual_amount) FROM budget_items WHERE project_id = p.id) as actual_spent,
    ROUND(((SELECT COUNT(*) FROM tasks WHERE project_id = p.id AND status = 'completed')::float / 
           NULLIF((SELECT COUNT(*) FROM tasks WHERE project_id = p.id), 0) * 100)::numeric, 2) as completion_percentage
FROM projects p;

-- Budget Summary View
CREATE OR REPLACE VIEW budget_summary AS
SELECT 
    project_id,
    category,
    SUM(planned_amount) as planned_amount,
    SUM(actual_amount) as actual_amount,
    SUM(planned_amount) - SUM(actual_amount) as remaining_amount,
    ROUND((SUM(actual_amount)::float / NULLIF(SUM(planned_amount), 0) * 100)::numeric, 2) as percent_spent
FROM budget_items
GROUP BY project_id, category;

-- Task Status Report View
CREATE OR REPLACE VIEW task_status_report AS
SELECT 
    p.id as project_id,
    p.name as project_name,
    t.status,
    COUNT(*) as task_count,
    ROUND(AVG(EXTRACT(EPOCH FROM (t.end_date - t.start_date)) / 86400)::numeric, 0) as avg_duration_days
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, p.name, t.status;

-- ============ FUNCTIONS ============

-- Function to update project progress
CREATE OR REPLACE FUNCTION update_project_progress()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects 
    SET updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.project_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for task updates
CREATE TRIGGER trigger_update_project_on_task_change
AFTER INSERT OR UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_project_progress();

-- Function to validate budget
CREATE OR REPLACE FUNCTION validate_budget()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.actual_amount > NEW.planned_amount THEN
        RAISE WARNING 'Actual amount exceeds planned amount for budget item %', NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for budget validation
CREATE TRIGGER trigger_validate_budget
BEFORE INSERT OR UPDATE ON budget_items
FOR EACH ROW
EXECUTE FUNCTION validate_budget();

-- ============ PERMISSIONS (for Render) ============

-- Create application user (if needed)
-- CREATE USER app_user WITH PASSWORD 'secure_password';
-- GRANT CONNECT ON DATABASE projects_db TO app_user;
-- GRANT USAGE ON SCHEMA public TO app_user;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- ============ SAMPLE DATA (optional - remove for production) ============

-- Insert sample user
INSERT INTO users (email, password_hash, name, role, github_username)
VALUES (
    'admin@dynamic-apac.com',
    'hash_placeholder', -- Replace with actual bcrypt hash
    'Admin User',
    'admin',
    'dynamic-admin'
)
ON CONFLICT (email) DO NOTHING;

-- ============ END OF SCHEMA ============

-- Run this file in Render PostgreSQL console:
-- psql -h host -U user -d dbname -f database-schema.sql
