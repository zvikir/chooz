# Database test descriptions

- users.gender column exists and is constrained: Verifies the presence of gender column and a CHECK constraint.
- users email and username are unique: Ensures uniqueness constraints (or unique indexes) for email and username.
- FTS query returns rows for common term: Confirms full-text search query runs and returns rows.
- tag filter returns only users with selected tags: Validates tag intersection logic (e.g., Music + Hiking) returns only correct users.
