-- Likes/Reactions table for like-match system
-- Safe to run multiple times due to IF NOT EXISTS guards

CREATE TABLE IF NOT EXISTS user_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like','pass')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (from_user_id, to_user_id),
  CHECK (from_user_id <> to_user_id)
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_user_likes_from ON user_likes(from_user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_to   ON user_likes(to_user_id);
CREATE INDEX IF NOT EXISTS idx_user_likes_from_like ON user_likes(from_user_id) WHERE action='like';
CREATE INDEX IF NOT EXISTS idx_user_likes_to_like   ON user_likes(to_user_id)   WHERE action='like';



