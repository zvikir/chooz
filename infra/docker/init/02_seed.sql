-- Seed tags
INSERT INTO tags (id, name, slug) VALUES
  (gen_random_uuid(), 'Hiking', 'hiking'),
  (gen_random_uuid(), 'Music', 'music'),
  (gen_random_uuid(), 'Tech', 'tech'),
  (gen_random_uuid(), 'Gaming', 'gaming'),
  (gen_random_uuid(), 'Vegan', 'vegan')
ON CONFLICT (name) DO NOTHING;

-- generate bcrypt hashes for 'password' using pgcrypto's crypt() + gen_salt('bf')
INSERT INTO users (id, email, username, password_hash, display_name, bio, gender, birthdate, location) VALUES
  (gen_random_uuid(), 'alice@example.com', 'alice', crypt('password', gen_salt('bf')), 'Alice', 'Love trails and coffee.', 'female', '1995-06-12', 'Berlin'),
  (gen_random_uuid(), 'bob@example.com',   'bob',   crypt('password', gen_salt('bf')), 'Bob',   'Music nerd and weekend gamer.', 'male', '1993-02-03', 'London'),
  (gen_random_uuid(), 'cara@example.com',  'cara',  crypt('password', gen_salt('bf')), 'Cara',  'Frontend dev. Tech & vegan food.', 'female', '1997-10-21', 'Tel Aviv')
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

-- default primary photos by gender
INSERT INTO photos (user_id, url, is_primary)
SELECT u.id,
       CASE WHEN u.gender='male' THEN '/images/default-male.svg' ELSE '/images/default-female.svg' END,
       TRUE
FROM users u
LEFT JOIN photos p ON p.user_id = u.id AND p.is_primary = TRUE
WHERE p.id IS NULL;


