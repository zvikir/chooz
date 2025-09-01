-- Seed tags
INSERT INTO tags (id, name, slug) VALUES
  (gen_random_uuid(), 'Hiking', 'hiking'),
  (gen_random_uuid(), 'Music', 'music'),
  (gen_random_uuid(), 'Tech', 'tech'),
  (gen_random_uuid(), 'Gaming', 'gaming'),
  (gen_random_uuid(), 'Vegan', 'vegan')
ON CONFLICT (name) DO NOTHING;

-- Seed users (password_hash is placeholder for now)
INSERT INTO users (id, email, username, password_hash, display_name, bio, birthdate, location) VALUES
  (gen_random_uuid(), 'alice@example.com', 'alice', 'DUMMY_HASH', 'Alice', 'Love trails and coffee.', '1995-06-12', 'Berlin'),
  (gen_random_uuid(), 'bob@example.com',   'bob',   'DUMMY_HASH', 'Bob',   'Music nerd and weekend gamer.', '1993-02-03', 'London'),
  (gen_random_uuid(), 'cara@example.com',  'cara',  'DUMMY_HASH', 'Cara',  'Frontend dev. Tech & vegan food.', '1997-10-21', 'Tel Aviv')
ON CONFLICT (email) DO NOTHING;

-- Map tags to users
WITH t AS (
  SELECT name, id FROM tags
), u AS (
  SELECT email, id FROM users
)
INSERT INTO user_tags (user_id, tag_id)
SELECT u.id, t.id
FROM (
  VALUES
    ('alice@example.com','Hiking'),
    ('alice@example.com','Music'),
    ('bob@example.com','Music'),
    ('bob@example.com','Gaming'),
    ('cara@example.com','Tech'),
    ('cara@example.com','Vegan'),
    ('cara@example.com','Music')
) AS pairs(email, tag)
JOIN u ON u.email = pairs.email
JOIN t ON t.name = pairs.tag
ON CONFLICT DO NOTHING;


