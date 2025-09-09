-- Enrich database with more tags and users
-- This script adds 20 more tags and 50 more users with realistic profiles

-- Add 20 more diverse tags
INSERT INTO tags (id, name, slug) VALUES
  (gen_random_uuid(), 'Photography', 'photography'),
  (gen_random_uuid(), 'Cooking', 'cooking'),
  (gen_random_uuid(), 'Travel', 'travel'),
  (gen_random_uuid(), 'Fitness', 'fitness'),
  (gen_random_uuid(), 'Yoga', 'yoga'),
  (gen_random_uuid(), 'Reading', 'reading'),
  (gen_random_uuid(), 'Art', 'art'),
  (gen_random_uuid(), 'Dancing', 'dancing'),
  (gen_random_uuid(), 'Movies', 'movies'),
  (gen_random_uuid(), 'Coffee', 'coffee'),
  (gen_random_uuid(), 'Wine', 'wine'),
  (gen_random_uuid(), 'Crafting', 'crafting'),
  (gen_random_uuid(), 'Gardening', 'gardening'),
  (gen_random_uuid(), 'Volunteering', 'volunteering'),
  (gen_random_uuid(), 'Languages', 'languages'),
  (gen_random_uuid(), 'Meditation', 'meditation'),
  (gen_random_uuid(), 'Board Games', 'board-games'),
  (gen_random_uuid(), 'Podcasts', 'podcasts'),
  (gen_random_uuid(), 'Fashion', 'fashion'),
  (gen_random_uuid(), 'Sustainability', 'sustainability')
ON CONFLICT (name) DO NOTHING;

-- Add additional lifestyle and interest tags for more variety
INSERT INTO tags (id, name, slug) VALUES
  (gen_random_uuid(), 'Running', 'running'),
  (gen_random_uuid(), 'Cycling', 'cycling'),
  (gen_random_uuid(), 'Climbing', 'climbing'),
  (gen_random_uuid(), 'Surfing', 'surfing'),
  (gen_random_uuid(), 'Skateboarding', 'skateboarding'),
  (gen_random_uuid(), 'Theater', 'theater'),
  (gen_random_uuid(), 'Poetry', 'poetry'),
  (gen_random_uuid(), 'Astronomy', 'astronomy'),
  (gen_random_uuid(), 'Baking', 'baking'),
  (gen_random_uuid(), 'Tea', 'tea'),
  (gen_random_uuid(), 'Beer', 'beer'),
  (gen_random_uuid(), 'Whiskey', 'whiskey'),
  (gen_random_uuid(), 'Startups', 'startups'),
  (gen_random_uuid(), 'Investing', 'investing'),
  (gen_random_uuid(), 'Pets', 'pets'),
  (gen_random_uuid(), 'Cats', 'cats'),
  (gen_random_uuid(), 'Dogs', 'dogs'),
  (gen_random_uuid(), 'Architecture', 'architecture'),
  (gen_random_uuid(), 'History', 'history'),
  (gen_random_uuid(), 'Science', 'science')
ON CONFLICT (name) DO NOTHING;

-- Add 50 more users with realistic profiles
INSERT INTO users (id, email, username, password_hash, display_name, bio, gender, birthdate, location) VALUES
  -- Female users (25)
  (gen_random_uuid(), 'sophia@example.com', 'sophia', crypt('password', gen_salt('bf')), 'Sophia', 'Photographer and coffee enthusiast. Love capturing moments and exploring new cafes.', 'female', '1992-03-15', 'New York, NY'),
  (gen_random_uuid(), 'emma@example.com', 'emma', crypt('password', gen_salt('bf')), 'Emma', 'Yoga instructor and wellness coach. Passionate about mindfulness and helping others find balance.', 'female', '1988-07-22', 'Los Angeles, CA'),
  (gen_random_uuid(), 'olivia@example.com', 'olivia', crypt('password', gen_salt('bf')), 'Olivia', 'Chef and food blogger. Creating delicious plant-based recipes and sharing culinary adventures.', 'female', '1995-11-08', 'Portland, OR'),
  (gen_random_uuid(), 'ava@example.com', 'ava', crypt('password', gen_salt('bf')), 'Ava', 'Travel blogger and adventure seeker. Always planning the next trip and documenting beautiful places.', 'female', '1990-05-14', 'Miami, FL'),
  (gen_random_uuid(), 'isabella@example.com', 'isabella', crypt('password', gen_salt('bf')), 'Isabella', 'Fitness trainer and nutritionist. Helping people achieve their health goals through sustainable lifestyle changes.', 'female', '1987-09-30', 'Austin, TX'),
  (gen_random_uuid(), 'mia@example.com', 'mia', crypt('password', gen_salt('bf')), 'Mia', 'Artist and creative soul. Expressing myself through painting, pottery, and mixed media art.', 'female', '1993-12-03', 'Seattle, WA'),
  (gen_random_uuid(), 'charlotte@example.com', 'charlotte', crypt('password', gen_salt('bf')), 'Charlotte', 'Dance instructor and performer. Love all forms of dance from ballet to contemporary.', 'female', '1991-04-17', 'Chicago, IL'),
  (gen_random_uuid(), 'amelia@example.com', 'amelia', crypt('password', gen_salt('bf')), 'Amelia', 'Film critic and movie buff. Always up for discussing the latest releases and classic cinema.', 'female', '1989-08-25', 'Boston, MA'),
  (gen_random_uuid(), 'harper@example.com', 'harper', crypt('password', gen_salt('bf')), 'Harper', 'Book lover and aspiring writer. Coffee shops, libraries, and cozy reading nooks are my happy places.', 'female', '1994-01-12', 'Denver, CO'),
  (gen_random_uuid(), 'evelyn@example.com', 'evelyn', crypt('password', gen_salt('bf')), 'Evelyn', 'Wine sommelier and hospitality professional. Passionate about wine education and creating memorable experiences.', 'female', '1986-06-28', 'Napa Valley, CA'),
  (gen_random_uuid(), 'abigail@example.com', 'abigail', crypt('password', gen_salt('bf')), 'Abigail', 'Craft enthusiast and DIY queen. Knitting, crocheting, and creating handmade gifts for loved ones.', 'female', '1992-10-05', 'Nashville, TN'),
  (gen_random_uuid(), 'emily@example.com', 'emily', crypt('password', gen_salt('bf')), 'Emily', 'Gardener and plant parent. Growing vegetables, herbs, and creating beautiful indoor gardens.', 'female', '1988-02-19', 'Portland, ME'),
  (gen_random_uuid(), 'elizabeth@example.com', 'elizabeth', crypt('password', gen_salt('bf')), 'Elizabeth', 'Volunteer coordinator and social worker. Dedicated to making a positive impact in my community.', 'female', '1985-11-14', 'Philadelphia, PA'),
  (gen_random_uuid(), 'sofia@example.com', 'sofia', crypt('password', gen_salt('bf')), 'Sofia', 'Polyglot and language teacher. Fluent in 4 languages and passionate about cultural exchange.', 'female', '1990-07-07', 'San Francisco, CA'),
  (gen_random_uuid(), 'madison@example.com', 'madison', crypt('password', gen_salt('bf')), 'Madison', 'Meditation teacher and mindfulness practitioner. Helping others find peace and inner calm.', 'female', '1993-03-26', 'Boulder, CO'),
  (gen_random_uuid(), 'avery@example.com', 'avery', crypt('password', gen_salt('bf')), 'Avery', 'Board game designer and enthusiast. Love strategy games and creating new gaming experiences.', 'female', '1987-09-11', 'Minneapolis, MN'),
  (gen_random_uuid(), 'ella@example.com', 'ella', crypt('password', gen_salt('bf')), 'Ella', 'Podcast producer and audio storyteller. Creating content that inspires and educates listeners.', 'female', '1991-05-23', 'Brooklyn, NY'),
  (gen_random_uuid(), 'scarllett@example.com', 'scarllett', crypt('password', gen_salt('bf')), 'Scarllett', 'Fashion designer and stylist. Creating sustainable fashion and helping others express their style.', 'female', '1989-12-16', 'Los Angeles, CA'),
  (gen_random_uuid(), 'grace@example.com', 'grace', crypt('password', gen_salt('bf')), 'Grace', 'Environmental activist and sustainability consultant. Committed to protecting our planet.', 'female', '1992-08-09', 'Portland, OR'),
  (gen_random_uuid(), 'chloe@example.com', 'chloe', crypt('password', gen_salt('bf')), 'Chloe', 'Music producer and DJ. Creating electronic beats and curating amazing playlists for every mood.', 'female', '1994-04-02', 'Detroit, MI'),
  (gen_random_uuid(), 'victoria@example.com', 'victoria', crypt('password', gen_salt('bf')), 'Victoria', 'Tech entrepreneur and startup founder. Building the future through innovative technology solutions.', 'female', '1988-10-18', 'San Jose, CA'),
  (gen_random_uuid(), 'riley@example.com', 'riley', crypt('password', gen_salt('bf')), 'Riley', 'Adventure photographer and outdoor enthusiast. Capturing the beauty of nature and extreme sports.', 'female', '1990-01-31', 'Salt Lake City, UT'),
  (gen_random_uuid(), 'aria@example.com', 'aria', crypt('password', gen_salt('bf')), 'Aria', 'Opera singer and voice coach. Passionate about classical music and helping others find their voice.', 'female', '1986-06-13', 'New Orleans, LA'),
  (gen_random_uuid(), 'lily@example.com', 'lily', crypt('password', gen_salt('bf')), 'Lily', 'Marine biologist and ocean conservationist. Protecting marine life and educating others about our oceans.', 'female', '1991-11-27', 'San Diego, CA'),
  (gen_random_uuid(), 'aria@example.com', 'aria2', crypt('password', gen_salt('bf')), 'Aria', 'Chef and restaurant owner. Creating innovative fusion cuisine and supporting local farmers.', 'female', '1987-03-04', 'Charleston, SC'),

  -- Male users (25)
  (gen_random_uuid(), 'liam@example.com', 'liam', crypt('password', gen_salt('bf')), 'Liam', 'Software engineer and tech enthusiast. Building cool apps and exploring the latest in AI and machine learning.', 'male', '1989-04-20', 'San Francisco, CA'),
  (gen_random_uuid(), 'noah@example.com', 'noah', crypt('password', gen_salt('bf')), 'Noah', 'Photographer and visual storyteller. Capturing the essence of urban life and street photography.', 'male', '1992-08-15', 'New York, NY'),
  (gen_random_uuid(), 'oliver@example.com', 'oliver', crypt('password', gen_salt('bf')), 'Oliver', 'Chef and culinary innovator. Experimenting with molecular gastronomy and farm-to-table cuisine.', 'male', '1986-12-03', 'Portland, OR'),
  (gen_random_uuid(), 'william@example.com', 'william', crypt('password', gen_salt('bf')), 'William', 'Travel writer and adventure seeker. Documenting off-the-beaten-path destinations and cultural experiences.', 'male', '1990-07-28', 'Miami, FL'),
  (gen_random_uuid(), 'james@example.com', 'james', crypt('password', gen_salt('bf')), 'James', 'Personal trainer and fitness coach. Helping people transform their lives through strength training and nutrition.', 'male', '1988-02-14', 'Austin, TX'),
  (gen_random_uuid(), 'benjamin@example.com', 'benjamin', crypt('password', gen_salt('bf')), 'Benjamin', 'Yoga instructor and meditation teacher. Guiding others on their journey to inner peace and mindfulness.', 'male', '1993-10-09', 'Seattle, WA'),
  (gen_random_uuid(), 'lucas@example.com', 'lucas', crypt('password', gen_salt('bf')), 'Lucas', 'Artist and muralist. Creating large-scale public art that brings communities together.', 'male', '1991-05-22', 'Chicago, IL'),
  (gen_random_uuid(), 'henry@example.com', 'henry', crypt('password', gen_salt('bf')), 'Henry', 'Dance choreographer and performer. Blending contemporary and hip-hop styles in innovative ways.', 'male', '1987-09-16', 'Los Angeles, CA'),
  (gen_random_uuid(), 'alexander@example.com', 'alexander', crypt('password', gen_salt('bf')), 'Alexander', 'Film director and cinematographer. Creating compelling visual stories that resonate with audiences.', 'male', '1989-01-25', 'Boston, MA'),
  (gen_random_uuid(), 'mason@example.com', 'mason', crypt('password', gen_salt('bf')), 'Mason', 'Book publisher and literary agent. Discovering and nurturing new voices in contemporary literature.', 'male', '1985-11-08', 'Denver, CO'),
  (gen_random_uuid(), 'michael@example.com', 'michael', crypt('password', gen_salt('bf')), 'Michael', 'Wine maker and vineyard owner. Crafting exceptional wines and sharing the art of winemaking.', 'male', '1988-06-12', 'Napa Valley, CA'),
  (gen_random_uuid(), 'ethan@example.com', 'ethan', crypt('password', gen_salt('bf')), 'Ethan', 'Craft brewer and beer sommelier. Creating unique brews and educating others about craft beer culture.', 'male', '1992-03-07', 'Portland, OR'),
  (gen_random_uuid(), 'daniel@example.com', 'daniel', crypt('password', gen_salt('bf')), 'Daniel', 'Urban farmer and sustainability advocate. Growing food in the city and promoting local agriculture.', 'male', '1990-08-19', 'Nashville, TN'),
  (gen_random_uuid(), 'jacob@example.com', 'jacob', crypt('password', gen_salt('bf')), 'Jacob', 'Community organizer and social justice advocate. Working to create positive change in society.', 'male', '1987-04-13', 'Philadelphia, PA'),
  (gen_random_uuid(), 'logan@example.com', 'logan', crypt('password', gen_salt('bf')), 'Logan', 'Language teacher and translator. Fluent in 5 languages and passionate about cultural exchange.', 'male', '1993-12-01', 'San Francisco, CA'),
  (gen_random_uuid(), 'jackson@example.com', 'jackson', crypt('password', gen_salt('bf')), 'Jackson', 'Meditation teacher and wellness coach. Helping others find balance and inner peace through mindfulness.', 'male', '1989-07-24', 'Boulder, CO'),
  (gen_random_uuid(), 'levi@example.com', 'levi', crypt('password', gen_salt('bf')), 'Levi', 'Board game designer and publisher. Creating engaging games that bring people together.', 'male', '1991-02-17', 'Minneapolis, MN'),
  (gen_random_uuid(), 'sebastian@example.com', 'sebastian', crypt('password', gen_salt('bf')), 'Sebastian', 'Podcast host and audio engineer. Creating compelling content and helping others tell their stories.', 'male', '1986-10-30', 'Brooklyn, NY'),
  (gen_random_uuid(), 'mateo@example.com', 'mateo', crypt('password', gen_salt('bf')), 'Mateo', 'Fashion designer and stylist. Creating sustainable menswear and helping others develop their personal style.', 'male', '1992-05-11', 'Los Angeles, CA'),
  (gen_random_uuid(), 'owen@example.com', 'owen', crypt('password', gen_salt('bf')), 'Owen', 'Environmental scientist and climate researcher. Working to understand and combat climate change.', 'male', '1988-09-26', 'Portland, OR'),
  (gen_random_uuid(), 'theo@example.com', 'theo', crypt('password', gen_salt('bf')), 'Theo', 'Music producer and sound engineer. Creating electronic music and helping artists realize their vision.', 'male', '1994-01-18', 'Detroit, MI'),
  (gen_random_uuid(), 'aiden@example.com', 'aiden', crypt('password', gen_salt('bf')), 'Aiden', 'Tech entrepreneur and venture capitalist. Investing in innovative startups and building the future.', 'male', '1987-06-05', 'San Jose, CA'),
  (gen_random_uuid(), 'samuel@example.com', 'samuel', crypt('password', gen_salt('bf')), 'Samuel', 'Adventure guide and outdoor educator. Leading expeditions and teaching wilderness survival skills.', 'male', '1990-03-29', 'Salt Lake City, UT'),
  (gen_random_uuid(), 'joseph@example.com', 'joseph', crypt('password', gen_salt('bf')), 'Joseph', 'Jazz musician and music teacher. Playing saxophone and sharing the joy of music with others.', 'male', '1985-11-22', 'New Orleans, LA'),
  (gen_random_uuid(), 'john@example.com', 'john', crypt('password', gen_salt('bf')), 'John', 'Marine biologist and conservation photographer. Documenting marine life and advocating for ocean protection.', 'male', '1991-08-14', 'San Diego, CA'),
  (gen_random_uuid(), 'david@example.com', 'david', crypt('password', gen_salt('bf')), 'David', 'Restaurant owner and food critic. Creating memorable dining experiences and supporting local chefs.', 'male', '1988-12-07', 'Charleston, SC')
ON CONFLICT (email) DO NOTHING;

-- Map tags to users (realistic combinations)
WITH t AS (
  SELECT name, id FROM tags
), u AS (
  SELECT email, id FROM users
)
INSERT INTO user_tags (user_id, tag_id)
SELECT u.id, t.id
FROM (
  VALUES
    -- Sophia (Photography, Coffee, Travel)
    ('sophia@example.com', 'Photography'),
    ('sophia@example.com', 'Coffee'),
    ('sophia@example.com', 'Travel'),
    
    -- Emma (Yoga, Meditation, Fitness)
    ('emma@example.com', 'Yoga'),
    ('emma@example.com', 'Meditation'),
    ('emma@example.com', 'Fitness'),
    
    -- Olivia (Cooking, Vegan, Sustainability)
    ('olivia@example.com', 'Cooking'),
    ('olivia@example.com', 'Vegan'),
    ('olivia@example.com', 'Sustainability'),
    
    -- Ava (Travel, Photography, Languages)
    ('ava@example.com', 'Travel'),
    ('ava@example.com', 'Photography'),
    ('ava@example.com', 'Languages'),
    
    -- Isabella (Fitness, Cooking, Health)
    ('isabella@example.com', 'Fitness'),
    ('isabella@example.com', 'Cooking'),
    ('isabella@example.com', 'Meditation'),
    
    -- Mia (Art, Crafting, Reading)
    ('mia@example.com', 'Art'),
    ('mia@example.com', 'Crafting'),
    ('mia@example.com', 'Reading'),
    
    -- Charlotte (Dancing, Music, Fitness)
    ('charlotte@example.com', 'Dancing'),
    ('charlotte@example.com', 'Music'),
    ('charlotte@example.com', 'Fitness'),
    
    -- Amelia (Movies, Reading, Coffee)
    ('amelia@example.com', 'Movies'),
    ('amelia@example.com', 'Reading'),
    ('amelia@example.com', 'Coffee'),
    
    -- Harper (Reading, Coffee, Languages)
    ('harper@example.com', 'Reading'),
    ('harper@example.com', 'Coffee'),
    ('harper@example.com', 'Languages'),
    
    -- Evelyn (Wine, Cooking, Travel)
    ('evelyn@example.com', 'Wine'),
    ('evelyn@example.com', 'Cooking'),
    ('evelyn@example.com', 'Travel'),
    
    -- Abigail (Crafting, Art, Sustainability)
    ('abigail@example.com', 'Crafting'),
    ('abigail@example.com', 'Art'),
    ('abigail@example.com', 'Sustainability'),
    
    -- Emily (Gardening, Sustainability, Cooking)
    ('emily@example.com', 'Gardening'),
    ('emily@example.com', 'Sustainability'),
    ('emily@example.com', 'Cooking'),
    
    -- Elizabeth (Volunteering, Sustainability, Reading)
    ('elizabeth@example.com', 'Volunteering'),
    ('elizabeth@example.com', 'Sustainability'),
    ('elizabeth@example.com', 'Reading'),
    
    -- Sofia (Languages, Travel, Music)
    ('sofia@example.com', 'Languages'),
    ('sofia@example.com', 'Travel'),
    ('sofia@example.com', 'Music'),
    
    -- Madison (Meditation, Yoga, Reading)
    ('madison@example.com', 'Meditation'),
    ('madison@example.com', 'Yoga'),
    ('madison@example.com', 'Reading'),
    
    -- Avery (Board Games, Gaming, Coffee)
    ('avery@example.com', 'Board Games'),
    ('avery@example.com', 'Gaming'),
    ('avery@example.com', 'Coffee'),
    
    -- Ella (Podcasts, Music, Reading)
    ('ella@example.com', 'Podcasts'),
    ('ella@example.com', 'Music'),
    ('ella@example.com', 'Reading'),
    
    -- Scarllett (Fashion, Art, Sustainability)
    ('scarllett@example.com', 'Fashion'),
    ('scarllett@example.com', 'Art'),
    ('scarllett@example.com', 'Sustainability'),
    
    -- Grace (Sustainability, Volunteering, Gardening)
    ('grace@example.com', 'Sustainability'),
    ('grace@example.com', 'Volunteering'),
    ('grace@example.com', 'Gardening'),
    
    -- Chloe (Music, Dancing, Coffee)
    ('chloe@example.com', 'Music'),
    ('chloe@example.com', 'Dancing'),
    ('chloe@example.com', 'Coffee'),
    
    -- Victoria (Tech, Gaming, Coffee)
    ('victoria@example.com', 'Tech'),
    ('victoria@example.com', 'Gaming'),
    ('victoria@example.com', 'Coffee'),
    
    -- Riley (Photography, Travel, Fitness)
    ('riley@example.com', 'Photography'),
    ('riley@example.com', 'Travel'),
    ('riley@example.com', 'Fitness'),
    
    -- Aria (Music, Art, Reading)
    ('aria@example.com', 'Music'),
    ('aria@example.com', 'Art'),
    ('aria@example.com', 'Reading'),
    
    -- Lily (Sustainability, Volunteering, Reading)
    ('lily@example.com', 'Sustainability'),
    ('lily@example.com', 'Volunteering'),
    ('lily@example.com', 'Reading'),
    
    -- Aria2 (Cooking, Wine, Travel)
    ('aria@example.com', 'Cooking'),
    ('aria@example.com', 'Wine'),
    ('aria@example.com', 'Travel'),
    
    -- Male users
    -- Liam (Tech, Gaming, Coffee)
    ('liam@example.com', 'Tech'),
    ('liam@example.com', 'Gaming'),
    ('liam@example.com', 'Coffee'),
    
    -- Noah (Photography, Travel, Art)
    ('noah@example.com', 'Photography'),
    ('noah@example.com', 'Travel'),
    ('noah@example.com', 'Art'),
    
    -- Oliver (Cooking, Wine, Travel)
    ('oliver@example.com', 'Cooking'),
    ('oliver@example.com', 'Wine'),
    ('oliver@example.com', 'Travel'),
    
    -- William (Travel, Photography, Languages)
    ('william@example.com', 'Travel'),
    ('william@example.com', 'Photography'),
    ('william@example.com', 'Languages'),
    
    -- James (Fitness, Cooking, Meditation)
    ('james@example.com', 'Fitness'),
    ('james@example.com', 'Cooking'),
    ('james@example.com', 'Meditation'),
    
    -- Benjamin (Yoga, Meditation, Reading)
    ('benjamin@example.com', 'Yoga'),
    ('benjamin@example.com', 'Meditation'),
    ('benjamin@example.com', 'Reading'),
    
    -- Lucas (Art, Crafting, Sustainability)
    ('lucas@example.com', 'Art'),
    ('lucas@example.com', 'Crafting'),
    ('lucas@example.com', 'Sustainability'),
    
    -- Henry (Dancing, Music, Fitness)
    ('henry@example.com', 'Dancing'),
    ('henry@example.com', 'Music'),
    ('henry@example.com', 'Fitness'),
    
    -- Alexander (Movies, Art, Reading)
    ('alexander@example.com', 'Movies'),
    ('alexander@example.com', 'Art'),
    ('alexander@example.com', 'Reading'),
    
    -- Mason (Reading, Coffee, Languages)
    ('mason@example.com', 'Reading'),
    ('mason@example.com', 'Coffee'),
    ('mason@example.com', 'Languages'),
    
    -- Michael (Wine, Cooking, Travel)
    ('michael@example.com', 'Wine'),
    ('michael@example.com', 'Cooking'),
    ('michael@example.com', 'Travel'),
    
    -- Ethan (Crafting, Coffee, Board Games)
    ('ethan@example.com', 'Crafting'),
    ('ethan@example.com', 'Coffee'),
    ('ethan@example.com', 'Board Games'),
    
    -- Daniel (Gardening, Sustainability, Cooking)
    ('daniel@example.com', 'Gardening'),
    ('daniel@example.com', 'Sustainability'),
    ('daniel@example.com', 'Cooking'),
    
    -- Jacob (Volunteering, Sustainability, Reading)
    ('jacob@example.com', 'Volunteering'),
    ('jacob@example.com', 'Sustainability'),
    ('jacob@example.com', 'Reading'),
    
    -- Logan (Languages, Travel, Music)
    ('logan@example.com', 'Languages'),
    ('logan@example.com', 'Travel'),
    ('logan@example.com', 'Music'),
    
    -- Jackson (Meditation, Yoga, Reading)
    ('jackson@example.com', 'Meditation'),
    ('jackson@example.com', 'Yoga'),
    ('jackson@example.com', 'Reading'),
    
    -- Levi (Board Games, Gaming, Coffee)
    ('levi@example.com', 'Board Games'),
    ('levi@example.com', 'Gaming'),
    ('levi@example.com', 'Coffee'),
    
    -- Sebastian (Podcasts, Music, Reading)
    ('sebastian@example.com', 'Podcasts'),
    ('sebastian@example.com', 'Music'),
    ('sebastian@example.com', 'Reading'),
    
    -- Mateo (Fashion, Art, Sustainability)
    ('mateo@example.com', 'Fashion'),
    ('mateo@example.com', 'Art'),
    ('mateo@example.com', 'Sustainability'),
    
    -- Owen (Sustainability, Volunteering, Gardening)
    ('owen@example.com', 'Sustainability'),
    ('owen@example.com', 'Volunteering'),
    ('owen@example.com', 'Gardening'),
    
    -- Theo (Music, Dancing, Coffee)
    ('theo@example.com', 'Music'),
    ('theo@example.com', 'Dancing'),
    ('theo@example.com', 'Coffee'),
    
    -- Aiden (Tech, Gaming, Coffee)
    ('aiden@example.com', 'Tech'),
    ('aiden@example.com', 'Gaming'),
    ('aiden@example.com', 'Coffee'),
    
    -- Samuel (Photography, Travel, Fitness)
    ('samuel@example.com', 'Photography'),
    ('samuel@example.com', 'Travel'),
    ('samuel@example.com', 'Fitness'),
    
    -- Joseph (Music, Art, Reading)
    ('joseph@example.com', 'Music'),
    ('joseph@example.com', 'Art'),
    ('joseph@example.com', 'Reading'),
    
    -- John (Sustainability, Volunteering, Reading)
    ('john@example.com', 'Sustainability'),
    ('john@example.com', 'Volunteering'),
    ('john@example.com', 'Reading'),
    
    -- David (Cooking, Wine, Travel)
    ('david@example.com', 'Cooking'),
    ('david@example.com', 'Wine'),
    ('david@example.com', 'Travel')
) AS pairs(email, tag)
JOIN u ON u.email = pairs.email
JOIN t ON t.name = pairs.tag
ON CONFLICT DO NOTHING;

-- Give every user 2-4 additional random tags (no duplicates)
WITH per_user AS (
  SELECT u.id AS user_id, (2 + floor(random() * 3))::int AS extra_count
  FROM users u
), candidates AS (
  SELECT 
    pu.user_id,
    t.id AS tag_id,
    ROW_NUMBER() OVER (PARTITION BY pu.user_id ORDER BY random()) AS rn,
    pu.extra_count
  FROM per_user pu
  CROSS JOIN tags t
  LEFT JOIN user_tags ut ON ut.user_id = pu.user_id AND ut.tag_id = t.id
  WHERE ut.user_id IS NULL
)
INSERT INTO user_tags (user_id, tag_id)
SELECT user_id, tag_id
FROM candidates
WHERE rn <= extra_count
ON CONFLICT DO NOTHING;

-- Randomize birthdates to create more varied ages (18-55 years)
UPDATE users
SET birthdate = (
  CURRENT_DATE
  - (INTERVAL '1 year' * ((18 + floor(random() * 38))::int))
  - (INTERVAL '1 day' * ((floor(random() * 365))::int))
)
WHERE email LIKE '%@example.com%';

-- Add unique profile photos using Pravatar for each user
-- Pravatar only has images 1-70 available, so we'll use those for all users
WITH user_images AS (
  SELECT 
    u.id,
    u.email,
    u.gender,
    ROW_NUMBER() OVER (ORDER BY u.created_at) as user_num
  FROM users u
  ORDER BY u.created_at
)
INSERT INTO photos (user_id, url, is_primary)
SELECT 
  ui.id,
  'https://i.pravatar.cc/400?img=' || ((ui.user_num - 1) % 70 + 1),
  TRUE
FROM user_images ui
LEFT JOIN photos p ON p.user_id = ui.id AND p.is_primary = TRUE
WHERE p.id IS NULL;
