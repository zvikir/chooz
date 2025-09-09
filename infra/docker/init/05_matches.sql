-- View of mutual likes between users (reciprocal 'like')
CREATE OR REPLACE VIEW matches AS
SELECT LEAST(a.from_user_id, b.from_user_id) AS user_a,
       GREATEST(a.from_user_id, b.from_user_id) AS user_b,
       GREATEST(a.created_at, b.created_at) AS matched_at
FROM user_likes a
JOIN user_likes b
  ON a.to_user_id = b.from_user_id
 AND a.from_user_id = b.to_user_id
WHERE a.action='like' AND b.action='like'
  AND a.from_user_id < b.from_user_id;


