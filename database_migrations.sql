-- ============================================
-- ESWODZAR - Social Features Database Migration
-- ============================================
-- Execute este script en Supabase SQL Editor
-- ============================================

-- ============================================
-- FASE 1: PERFILES DE USUARIO
-- ============================================

-- Crear ENUM para nivel de fitness
CREATE TYPE fitness_level AS ENUM ('beginner', 'intermediate', 'advanced');

-- Crear ENUM para visibilidad
CREATE TYPE visibility_type AS ENUM ('public', 'members_only', 'private');

-- Tabla de perfiles de usuario (extensión de auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    profile_photo_url TEXT,
    bio TEXT CHECK (char_length(bio) <= 200),
    fitness_level fitness_level DEFAULT 'beginner',
    visibility visibility_type DEFAULT 'members_only',
    total_events_attended INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear perfiles para usuarios existentes (extraer nombre de auth.users)
-- Crear perfiles para usuarios existentes (extraer nombre de auth.users)
INSERT INTO user_profiles (id, first_name, last_name)
SELECT 
    id,
    SPLIT_PART(raw_user_meta_data->>'name', ' ', 1) as first_name,
    CASE 
        WHEN POSITION(' ' IN raw_user_meta_data->>'name') > 0 
        THEN SUBSTRING(raw_user_meta_data->>'name' FROM POSITION(' ' IN raw_user_meta_data->>'name') + 1)
        ELSE '' 
    END as last_name
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para calcular estadísticas de usuario
CREATE OR REPLACE FUNCTION calculate_user_stats(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total_events INTEGER;
    v_current_streak INTEGER;
    v_longest_streak INTEGER;
BEGIN
    -- Contar eventos asistidos
    SELECT COUNT(*) INTO v_total_events
    FROM registrations
    WHERE user_id = p_user_id AND status = 'confirmed';
    
    -- Calcular racha actual (eventos consecutivos)
    WITH event_dates AS (
        SELECT DISTINCT DATE(e.date) as event_date
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.user_id = p_user_id 
        AND r.status = 'confirmed'
        AND e.date <= NOW()
        ORDER BY event_date DESC
    ),
    streaks AS (
        SELECT 
            event_date,
            event_date - (ROW_NUMBER() OVER (ORDER BY event_date DESC))::INTEGER * INTERVAL '1 week' as streak_group
        FROM event_dates
    )
    SELECT COUNT(*) INTO v_current_streak
    FROM streaks
    WHERE streak_group = (SELECT streak_group FROM streaks LIMIT 1);
    
    -- Calcular racha más larga
    WITH event_dates AS (
        SELECT DISTINCT DATE(e.date) as event_date
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.user_id = p_user_id 
        AND r.status = 'confirmed'
        ORDER BY event_date
    ),
    streaks AS (
        SELECT 
            event_date,
            event_date - (ROW_NUMBER() OVER (ORDER BY event_date))::INTEGER * INTERVAL '1 week' as streak_group
        FROM event_dates
    ),
    streak_counts AS (
        SELECT streak_group, COUNT(*) as streak_length
        FROM streaks
        GROUP BY streak_group
    )
    SELECT COALESCE(MAX(streak_length), 0) INTO v_longest_streak
    FROM streak_counts;
    
    -- Actualizar perfil
    UPDATE user_profiles
    SET 
        total_events_attended = v_total_events,
        current_streak = COALESCE(v_current_streak, 0),
        longest_streak = COALESCE(v_longest_streak, 0)
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies para user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

-- Usuarios pueden ver perfiles públicos
CREATE POLICY "Users can view public profiles"
    ON user_profiles FOR SELECT
    USING (visibility = 'public');

-- Usuarios logueados pueden ver perfiles de miembros
CREATE POLICY "Members can view members_only profiles"
    ON user_profiles FOR SELECT
    USING (
        visibility = 'members_only' 
        AND auth.uid() IS NOT NULL
    );

-- Usuarios pueden actualizar solo su perfil
CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- ============================================
-- FASE 2: SISTEMA DE AMIGOS
-- ============================================

-- Crear ENUM para estado de amistad
CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'blocked');

-- Tabla de amistades
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status friendship_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT different_users CHECK (user_id != friend_id),
    CONSTRAINT unique_friendship UNIQUE (user_id, friend_id)
);

-- Índices para búsquedas rápidas
CREATE INDEX idx_friendships_user_id ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX idx_friendships_status ON friendships(status);

-- Trigger para updated_at
CREATE TRIGGER update_friendships_updated_at
    BEFORE UPDATE ON friendships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para enviar solicitud de amistad
CREATE OR REPLACE FUNCTION send_friend_request(p_friend_id UUID)
RETURNS UUID AS $$
DECLARE
    v_friendship_id UUID;
BEGIN
    -- Verificar que no existe ya una amistad
    IF EXISTS (
        SELECT 1 FROM friendships 
        WHERE (user_id = auth.uid() AND friend_id = p_friend_id)
           OR (user_id = p_friend_id AND friend_id = auth.uid())
    ) THEN
        RAISE EXCEPTION 'Friendship already exists';
    END IF;
    
    -- Crear solicitud
    INSERT INTO friendships (user_id, friend_id, status)
    VALUES (auth.uid(), p_friend_id, 'pending')
    RETURNING id INTO v_friendship_id;
    
    RETURN v_friendship_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para aceptar solicitud de amistad
CREATE OR REPLACE FUNCTION accept_friend_request(p_friendship_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE friendships
    SET status = 'accepted', updated_at = NOW()
    WHERE id = p_friendship_id 
    AND friend_id = auth.uid()
    AND status = 'pending';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Friend request not found or already processed';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener amigos de un usuario
CREATE OR REPLACE FUNCTION get_user_friends(p_user_id UUID)
RETURNS TABLE (
    friend_id UUID,
    friend_name TEXT,
    friend_photo TEXT,
    friendship_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN f.user_id = p_user_id THEN f.friend_id
            ELSE f.user_id
        END as friend_id,
        COALESCE(up.first_name || ' ' || up.last_name, 'Usuario') as friend_name,
        up.profile_photo_url as friend_photo,
        f.created_at as friendship_date
    FROM friendships f
    LEFT JOIN user_profiles up ON (
        CASE 
            WHEN f.user_id = p_user_id THEN f.friend_id
            ELSE f.user_id
        END = up.id
    )
    WHERE (f.user_id = p_user_id OR f.friend_id = p_user_id)
    AND f.status = 'accepted';
END;
$$ LANGUAGE plpgsql;

-- RLS Policies para friendships
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver sus propias amistades
CREATE POLICY "Users can view own friendships"
    ON friendships FOR SELECT
    USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Usuarios pueden crear solicitudes de amistad
CREATE POLICY "Users can create friend requests"
    ON friendships FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Usuarios pueden actualizar amistades donde son el receptor
CREATE POLICY "Users can update received requests"
    ON friendships FOR UPDATE
    USING (auth.uid() = friend_id);

-- ============================================
-- FASE 3: GAMIFICACIÓN - BADGES
-- ============================================

-- Tabla de badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    criteria JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de badges de usuarios
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_badge UNIQUE (user_id, badge_id)
);

-- Índices
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);

-- Insertar badges iniciales
INSERT INTO badges (name, description, icon, criteria) VALUES
('Primera Vez', 'Asististe a tu primer evento de ESWODZAR', '🎉', '{"type": "events_attended", "count": 1}'),
('Racha de 5', 'Mantuviste una racha de 5 eventos consecutivos', '🔥', '{"type": "streak", "count": 5}'),
('Racha de 10', 'Mantuviste una racha de 10 eventos consecutivos', '🔥🔥', '{"type": "streak", "count": 10}'),
('Almuerzo Legendario', 'Asististe a 10 almuerzos', '🥖', '{"type": "events_with_lunch", "count": 10}'),
('Early Bird', 'Te registraste 7+ días antes del evento', '🐦', '{"type": "early_registration", "days": 7}'),
('Social Butterfly', 'Tienes 10 o más amigos', '🦋', '{"type": "friends_count", "count": 10}'),
('Feedback Master', 'Valoraste 5 o más eventos', '⭐', '{"type": "ratings_given", "count": 5}'),
('Veterano', 'Asististe a 25 eventos', '🏆', '{"type": "events_attended", "count": 25}'),
('Leyenda', 'Asististe a 50 eventos', '👑', '{"type": "events_attended", "count": 50}');

-- Función para verificar y otorgar badges
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_badge RECORD;
    v_events_attended INTEGER;
    v_current_streak INTEGER;
    v_events_with_lunch INTEGER;
    v_friends_count INTEGER;
    v_ratings_count INTEGER;
BEGIN
    -- Obtener estadísticas del usuario
    SELECT total_events_attended, current_streak 
    INTO v_events_attended, v_current_streak
    FROM user_profiles WHERE id = p_user_id;
    
    -- Contar eventos con almuerzo
    SELECT COUNT(*) INTO v_events_with_lunch
    FROM registrations
    WHERE user_id = p_user_id 
    AND lunch_option = true 
    AND status = 'confirmed';
    
    -- Contar amigos
    SELECT COUNT(*) INTO v_friends_count
    FROM friendships
    WHERE (user_id = p_user_id OR friend_id = p_user_id)
    AND status = 'accepted';
    
    -- Contar valoraciones
    SELECT COUNT(*) INTO v_ratings_count
    FROM event_ratings
    WHERE user_id = p_user_id;
    
    -- Verificar cada badge
    FOR v_badge IN SELECT * FROM badges LOOP
        -- Verificar si ya tiene el badge
        IF NOT EXISTS (
            SELECT 1 FROM user_badges 
            WHERE user_id = p_user_id AND badge_id = v_badge.id
        ) THEN
            -- Verificar criterios según tipo
            CASE v_badge.criteria->>'type'
                WHEN 'events_attended' THEN
                    IF v_events_attended >= (v_badge.criteria->>'count')::INTEGER THEN
                        INSERT INTO user_badges (user_id, badge_id) 
                        VALUES (p_user_id, v_badge.id);
                    END IF;
                    
                WHEN 'streak' THEN
                    IF v_current_streak >= (v_badge.criteria->>'count')::INTEGER THEN
                        INSERT INTO user_badges (user_id, badge_id) 
                        VALUES (p_user_id, v_badge.id);
                    END IF;
                    
                WHEN 'events_with_lunch' THEN
                    IF v_events_with_lunch >= (v_badge.criteria->>'count')::INTEGER THEN
                        INSERT INTO user_badges (user_id, badge_id) 
                        VALUES (p_user_id, v_badge.id);
                    END IF;
                    
                WHEN 'friends_count' THEN
                    IF v_friends_count >= (v_badge.criteria->>'count')::INTEGER THEN
                        INSERT INTO user_badges (user_id, badge_id) 
                        VALUES (p_user_id, v_badge.id);
                    END IF;
                    
                WHEN 'ratings_given' THEN
                    IF v_ratings_count >= (v_badge.criteria->>'count')::INTEGER THEN
                        INSERT INTO user_badges (user_id, badge_id) 
                        VALUES (p_user_id, v_badge.id);
                    END IF;
            END CASE;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies para badges
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver badges
CREATE POLICY "Anyone can view badges"
    ON badges FOR SELECT
    USING (true);

-- Todos pueden ver badges de usuarios
CREATE POLICY "Anyone can view user badges"
    ON user_badges FOR SELECT
    USING (true);

-- ============================================
-- FASE 4: LEADERBOARD
-- ============================================

-- Tabla de leaderboard mensual
CREATE TABLE monthly_leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    events_attended INTEGER DEFAULT 0,
    badges_earned INTEGER DEFAULT 0,
    total_score INTEGER DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_month UNIQUE (user_id, month)
);

-- Índices
CREATE INDEX idx_leaderboard_month ON monthly_leaderboard(month);
CREATE INDEX idx_leaderboard_rank ON monthly_leaderboard(rank);

-- Función para calcular puntuación de usuario
CREATE OR REPLACE FUNCTION calculate_user_score(
    p_user_id UUID,
    p_month DATE
)
RETURNS INTEGER AS $$
DECLARE
    v_events INTEGER;
    v_badges INTEGER;
    v_score INTEGER;
BEGIN
    -- Contar eventos del mes
    SELECT COUNT(*) INTO v_events
    FROM registrations r
    JOIN events e ON r.event_id = e.id
    WHERE r.user_id = p_user_id
    AND r.status = 'confirmed'
    AND DATE_TRUNC('month', e.date) = DATE_TRUNC('month', p_month);
    
    -- Contar badges ganados en el mes
    SELECT COUNT(*) INTO v_badges
    FROM user_badges
    WHERE user_id = p_user_id
    AND DATE_TRUNC('month', earned_at) = DATE_TRUNC('month', p_month);
    
    -- Calcular puntuación (eventos * 10 + badges * 50)
    v_score := (v_events * 10) + (v_badges * 50);
    
    RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar leaderboard mensual
CREATE OR REPLACE FUNCTION update_monthly_leaderboard()
RETURNS VOID AS $$
DECLARE
    v_current_month DATE;
    v_user RECORD;
BEGIN
    v_current_month := DATE_TRUNC('month', CURRENT_DATE);
    
    -- Para cada usuario activo
    FOR v_user IN 
        SELECT DISTINCT user_id 
        FROM registrations 
        WHERE DATE_TRUNC('month', created_at) = v_current_month
    LOOP
        INSERT INTO monthly_leaderboard (user_id, month, events_attended, badges_earned, total_score)
        VALUES (
            v_user.user_id,
            v_current_month,
            (SELECT COUNT(*) FROM registrations r JOIN events e ON r.event_id = e.id 
             WHERE r.user_id = v_user.user_id AND r.status = 'confirmed' 
             AND DATE_TRUNC('month', e.date) = v_current_month),
            (SELECT COUNT(*) FROM user_badges 
             WHERE user_id = v_user.user_id 
             AND DATE_TRUNC('month', earned_at) = v_current_month),
            calculate_user_score(v_user.user_id, v_current_month)
        )
        ON CONFLICT (user_id, month) 
        DO UPDATE SET
            events_attended = EXCLUDED.events_attended,
            badges_earned = EXCLUDED.badges_earned,
            total_score = EXCLUDED.total_score,
            updated_at = NOW();
    END LOOP;
    
    -- Actualizar rankings
    WITH ranked_users AS (
        SELECT 
            id,
            ROW_NUMBER() OVER (PARTITION BY month ORDER BY total_score DESC) as new_rank
        FROM monthly_leaderboard
        WHERE month = v_current_month
    )
    UPDATE monthly_leaderboard ml
    SET rank = ru.new_rank
    FROM ranked_users ru
    WHERE ml.id = ru.id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies para leaderboard
ALTER TABLE monthly_leaderboard ENABLE ROW LEVEL SECURITY;

-- Todos pueden ver el leaderboard
CREATE POLICY "Anyone can view leaderboard"
    ON monthly_leaderboard FOR SELECT
    USING (true);

-- ============================================
-- FASE 5: VALORACIONES Y FEEDBACK
-- ============================================

-- Tabla de valoraciones de eventos
CREATE TABLE event_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    wod_feedback TEXT CHECK (char_length(wod_feedback) <= 500),
    lunch_feedback TEXT CHECK (char_length(lunch_feedback) <= 500),
    location_suggestion TEXT CHECK (char_length(location_suggestion) <= 200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_event_rating UNIQUE (user_id, event_id)
);

-- Índices
CREATE INDEX idx_event_ratings_event_id ON event_ratings(event_id);
CREATE INDEX idx_event_ratings_user_id ON event_ratings(user_id);
CREATE INDEX idx_event_ratings_rating ON event_ratings(rating);

-- Trigger para updated_at
CREATE TRIGGER update_event_ratings_updated_at
    BEFORE UPDATE ON event_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Vista para valoraciones promedio de eventos
CREATE OR REPLACE VIEW event_average_ratings AS
SELECT 
    event_id,
    ROUND(AVG(rating)::numeric, 1) as average_rating,
    COUNT(*) as total_ratings
FROM event_ratings
GROUP BY event_id;

-- Función para obtener valoración promedio de un evento
CREATE OR REPLACE FUNCTION get_event_average_rating(p_event_id BIGINT)
RETURNS TABLE (
    average_rating NUMERIC,
    total_ratings BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROUND(AVG(rating)::numeric, 1),
        COUNT(*)
    FROM event_ratings
    WHERE event_id = p_event_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies para event_ratings
ALTER TABLE event_ratings ENABLE ROW LEVEL SECURITY;

-- Solo asistentes pueden valorar eventos pasados
CREATE POLICY "Attendees can rate past events"
    ON event_ratings FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM registrations r
            JOIN events e ON r.event_id = e.id
            WHERE r.event_id = event_ratings.event_id 
            AND r.user_id = auth.uid()
            AND r.status = 'confirmed'
            AND e.date < NOW()
        )
        AND user_id = auth.uid()
    );

-- Usuarios pueden ver todas las valoraciones
CREATE POLICY "Anyone can view ratings"
    ON event_ratings FOR SELECT
    USING (true);

-- Usuarios pueden actualizar su propia valoración
CREATE POLICY "Users can update own ratings"
    ON event_ratings FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS AUTOMÁTICOS
-- ============================================

-- Trigger: Actualizar estadísticas después de asistir a evento
CREATE OR REPLACE FUNCTION update_stats_after_event()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
        PERFORM calculate_user_stats(NEW.user_id);
        PERFORM check_and_award_badges(NEW.user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_stats_after_event
    AFTER INSERT OR UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_stats_after_event();

-- Trigger: Verificar badges después de nueva amistad
CREATE OR REPLACE FUNCTION check_badges_after_friendship()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' THEN
        PERFORM check_and_award_badges(NEW.user_id);
        PERFORM check_and_award_badges(NEW.friend_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_badges_after_friendship
    AFTER INSERT OR UPDATE ON friendships
    FOR EACH ROW
    EXECUTE FUNCTION check_badges_after_friendship();

-- Trigger: Verificar badges después de valoración
CREATE OR REPLACE FUNCTION check_badges_after_rating()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM check_and_award_badges(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_badges_after_rating
    AFTER INSERT ON event_ratings
    FOR EACH ROW
    EXECUTE FUNCTION check_badges_after_rating();

-- ============================================
-- FASE 3: LISTA DE ASISTENTES
-- ============================================

-- Función para obtener asistentes de un evento respetando privacidad
CREATE OR REPLACE FUNCTION get_event_attendees(
    p_event_id BIGINT,
    p_current_user_id UUID
)
RETURNS TABLE (
    user_id UUID,
    first_name TEXT,
    last_name TEXT,
    profile_photo_url TEXT,
    is_friend BOOLEAN,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        up.id as user_id,
        up.first_name,
        up.last_name,
        up.profile_photo_url,
        EXISTS (
            SELECT 1 FROM friendships f 
            WHERE (f.user_id = p_current_user_id AND f.friend_id = up.id)
               OR (f.user_id = up.id AND f.friend_id = p_current_user_id)
            AND f.status = 'accepted'
        ) as is_friend,
        r.status::TEXT
    FROM registrations r
    JOIN user_profiles up ON r.user_id = up.id
    WHERE r.event_id = p_event_id
    AND r.status = 'confirmed'
    AND (
        -- Lógica de Visibilidad
        up.visibility = 'public'
        OR up.visibility = 'members_only'
        OR (up.visibility = 'friends_only' AND EXISTS (
            SELECT 1 FROM friendships f 
            WHERE (f.user_id = p_current_user_id AND f.friend_id = up.id)
               OR (f.user_id = up.id AND f.friend_id = p_current_user_id)
            AND f.status = 'accepted'
        ))
        OR up.id = p_current_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FIN DE MIGRACIÓN
-- ============================================

-- Verificar que todo se creó correctamente
SELECT 'Migration completed successfully!' as status;
