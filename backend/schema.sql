-- PsycheAI PostgreSQL Database Schema
-- Complete SQL schema for emotional counseling platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: users
-- Stores user account information and authentication credentials
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for users table
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

COMMENT ON TABLE users IS 'User accounts and authentication';
COMMENT ON COLUMN users.id IS 'Unique user identifier (UUID)';
COMMENT ON COLUMN users.email IS 'User email address (unique, used for login)';
COMMENT ON COLUMN users.name IS 'User full name';
COMMENT ON COLUMN users.password IS 'Bcrypt hashed password';

-- ============================================================================
-- TABLE: sessions (Conversations)
-- Represents individual chat sessions between user and AI
-- ============================================================================

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    title VARCHAR(255),
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for sessions table
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
CREATE INDEX idx_sessions_ended_at ON sessions(ended_at);

COMMENT ON TABLE sessions IS 'Chat sessions (conversations) between user and AI';
COMMENT ON COLUMN sessions.id IS 'Unique session identifier';
COMMENT ON COLUMN sessions.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN sessions.started_at IS 'Session start timestamp';
COMMENT ON COLUMN sessions.ended_at IS 'Session end timestamp (NULL if active)';
COMMENT ON COLUMN sessions.title IS 'Optional session title/summary';

-- ============================================================================
-- TABLE: messages
-- Stores individual messages within chat sessions
-- ============================================================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    emotion VARCHAR(50),
    sentiment DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_session FOREIGN KEY (session_id) 
        REFERENCES sessions(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for messages table
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_emotion ON messages(emotion);
CREATE INDEX idx_messages_role ON messages(role);

COMMENT ON TABLE messages IS 'Individual chat messages within sessions';
COMMENT ON COLUMN messages.id IS 'Unique message identifier';
COMMENT ON COLUMN messages.session_id IS 'Foreign key to sessions table';
COMMENT ON COLUMN messages.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN messages.role IS 'Message sender: user or assistant';
COMMENT ON COLUMN messages.content IS 'Message text content';
COMMENT ON COLUMN messages.emotion IS 'Detected emotion (happy, sad, anxious, etc.)';
COMMENT ON COLUMN messages.sentiment IS 'Sentiment score (-1.0 to 1.0)';

-- ============================================================================
-- TABLE: emotion_logs (Emotional Analysis)
-- Tracks emotional states over time for analytics
-- ============================================================================

CREATE TABLE emotion_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    emotion VARCHAR(50) NOT NULL,
    intensity DECIMAL(3,2) NOT NULL CHECK (intensity >= 0 AND intensity <= 1),
    context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_emotion_logs_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for emotion_logs table
CREATE INDEX idx_emotion_logs_user_id ON emotion_logs(user_id);
CREATE INDEX idx_emotion_logs_emotion ON emotion_logs(emotion);
CREATE INDEX idx_emotion_logs_created_at ON emotion_logs(created_at);
CREATE INDEX idx_emotion_logs_user_created ON emotion_logs(user_id, created_at);

COMMENT ON TABLE emotion_logs IS 'Emotional analysis records for tracking over time';
COMMENT ON COLUMN emotion_logs.id IS 'Unique log identifier';
COMMENT ON COLUMN emotion_logs.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN emotion_logs.emotion IS 'Emotion type (happy, sad, anxious, angry, fearful, neutral)';
COMMENT ON COLUMN emotion_logs.intensity IS 'Emotion intensity (0.0 to 1.0)';
COMMENT ON COLUMN emotion_logs.context IS 'Optional context/trigger for the emotion';

-- ============================================================================
-- TABLE: reports
-- Stores generated wellness reports and analytics summaries
-- ============================================================================

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('weekly', 'monthly', 'custom', 'annual')),
    title VARCHAR(255) NOT NULL,
    data JSONB NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reports_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for reports table
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_generated_at ON reports(generated_at);
CREATE INDEX idx_reports_data ON reports USING GIN (data);

COMMENT ON TABLE reports IS 'Generated wellness reports and analytics summaries';
COMMENT ON COLUMN reports.id IS 'Unique report identifier';
COMMENT ON COLUMN reports.user_id IS 'Foreign key to users table';
COMMENT ON COLUMN reports.report_type IS 'Type of report (weekly, monthly, custom, annual)';
COMMENT ON COLUMN reports.title IS 'Report title';
COMMENT ON COLUMN reports.data IS 'JSONB data containing report details';
COMMENT ON COLUMN reports.generated_at IS 'Report generation timestamp';

-- ============================================================================
-- TABLE: user_preferences
-- Stores user settings and preferences
-- ============================================================================

CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL,
    theme VARCHAR(20) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    notifications BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    email_digest BOOLEAN DEFAULT FALSE,
    data_retention INTEGER DEFAULT 365,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_preferences_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for user_preferences table
CREATE UNIQUE INDEX idx_preferences_user_id ON user_preferences(user_id);

COMMENT ON TABLE user_preferences IS 'User settings and preferences';
COMMENT ON COLUMN user_preferences.id IS 'Unique preference identifier';
COMMENT ON COLUMN user_preferences.user_id IS 'Foreign key to users table (unique)';
COMMENT ON COLUMN user_preferences.theme IS 'UI theme preference (light, dark, auto)';
COMMENT ON COLUMN user_preferences.notifications IS 'Enable/disable notifications';
COMMENT ON COLUMN user_preferences.language IS 'Preferred language code';
COMMENT ON COLUMN user_preferences.timezone IS 'User timezone';
COMMENT ON COLUMN user_preferences.email_digest IS 'Enable weekly email digest';
COMMENT ON COLUMN user_preferences.data_retention IS 'Days to retain data';

-- ============================================================================
-- TRIGGERS
-- Automatic timestamp updates
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for user_preferences table
CREATE TRIGGER update_preferences_updated_at 
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS
-- Useful views for common queries
-- ============================================================================

-- View: Active sessions with message counts
CREATE OR REPLACE VIEW active_sessions_summary AS
SELECT 
    s.id,
    s.user_id,
    u.name as user_name,
    s.started_at,
    s.title,
    COUNT(m.id) as message_count,
    MAX(m.created_at) as last_message_at
FROM sessions s
JOIN users u ON s.user_id = u.id
LEFT JOIN messages m ON s.id = m.session_id
WHERE s.ended_at IS NULL
GROUP BY s.id, s.user_id, u.name, s.started_at, s.title;

COMMENT ON VIEW active_sessions_summary IS 'Summary of active chat sessions with message counts';

-- View: User emotion statistics
CREATE OR REPLACE VIEW user_emotion_stats AS
SELECT 
    user_id,
    emotion,
    COUNT(*) as count,
    ROUND(AVG(intensity), 2) as avg_intensity,
    MAX(created_at) as last_occurrence
FROM emotion_logs
GROUP BY user_id, emotion;

COMMENT ON VIEW user_emotion_stats IS 'Aggregated emotion statistics per user';

-- View: Recent user activity
CREATE OR REPLACE VIEW recent_user_activity AS
SELECT 
    u.id as user_id,
    u.name,
    u.email,
    COUNT(DISTINCT s.id) as total_sessions,
    COUNT(m.id) as total_messages,
    MAX(m.created_at) as last_activity,
    COUNT(DISTINCT DATE(m.created_at)) as active_days
FROM users u
LEFT JOIN sessions s ON u.id = s.user_id
LEFT JOIN messages m ON u.id = m.user_id
WHERE m.created_at >= NOW() - INTERVAL '30 days'
GROUP BY u.id, u.name, u.email;

COMMENT ON VIEW recent_user_activity IS 'User activity summary for last 30 days';

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Uncomment to insert sample data

/*
-- Sample user
INSERT INTO users (id, email, name, password) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo@psycheai.com', 'Demo User', '$2a$10$abcdefghijklmnopqrstuvwxyz');

-- Sample session
INSERT INTO sessions (id, user_id, title) VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'First Session');

-- Sample messages
INSERT INTO messages (session_id, user_id, role, content, emotion) VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'user', 'I am feeling anxious today', 'anxious'),
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'assistant', 'I understand. Would you like to talk about what is making you feel anxious?', 'anxious');

-- Sample emotion logs
INSERT INTO emotion_logs (user_id, emotion, intensity, context) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'anxious', 0.75, 'Work stress'),
('550e8400-e29b-41d4-a716-446655440000', 'happy', 0.85, 'Good news from family');

-- Sample user preferences
INSERT INTO user_preferences (user_id, theme, notifications, language) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'dark', true, 'en');
*/

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to get user's emotion distribution
CREATE OR REPLACE FUNCTION get_emotion_distribution(p_user_id UUID, p_days INTEGER DEFAULT 30)
RETURNS TABLE (
    emotion VARCHAR(50),
    count BIGINT,
    percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        el.emotion,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
    FROM emotion_logs el
    WHERE el.user_id = p_user_id
      AND el.created_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY el.emotion
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_emotion_distribution IS 'Get emotion distribution for a user over specified days';

-- Function to calculate user streak
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_streak INTEGER := 0;
    v_current_date DATE := CURRENT_DATE;
    v_has_activity BOOLEAN;
BEGIN
    LOOP
        SELECT EXISTS(
            SELECT 1 FROM messages
            WHERE user_id = p_user_id
              AND DATE(created_at) = v_current_date
        ) INTO v_has_activity;
        
        IF v_has_activity THEN
            v_streak := v_streak + 1;
            v_current_date := v_current_date - 1;
        ELSE
            EXIT;
        END IF;
    END LOOP;
    
    RETURN v_streak;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_user_streak IS 'Calculate consecutive days of user activity';

-- ============================================================================
-- GRANTS (Adjust based on your user setup)
-- ============================================================================

-- Grant permissions to application user (replace 'psycheai_app' with your user)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO psycheai_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO psycheai_app;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO psycheai_app;

-- ============================================================================
-- SCHEMA VERSION
-- ============================================================================

CREATE TABLE IF NOT EXISTS schema_version (
    version VARCHAR(20) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

INSERT INTO schema_version (version, description) VALUES
('1.0.0', 'Initial schema with users, sessions, messages, emotion_logs, reports, and user_preferences');

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
