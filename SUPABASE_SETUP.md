# Supabase Leaderboard Setup

Follow these steps to set up the online leaderboard for your game:

## 1. Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (it's free!)
3. Create a new project

## 2. Create the Leaderboard Table

1. In your Supabase project dashboard, go to the **SQL Editor**
2. Click **New Query**
3. Copy and paste this SQL code:

```sql
-- Create the leaderboard table
CREATE TABLE leaderboard (
  id BIGSERIAL PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on score for faster queries
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to read scores
CREATE POLICY "Anyone can view leaderboard"
  ON leaderboard
  FOR SELECT
  TO anon
  USING (true);

-- Create a policy to allow anyone to insert scores
CREATE POLICY "Anyone can insert scores"
  ON leaderboard
  FOR INSERT
  TO anon
  WITH CHECK (true);
```

4. Click **Run** to execute the query

## 3. Get Your API Keys

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon in the sidebar)
2. Go to **API** section
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon/public key** (a long string of characters)

## 4. Configure Your Environment

1. In your project folder, create a file named `.env` (copy from `.env.example`)
2. Add your Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

## 5. Restart Your Dev Server

If your dev server is running, restart it to load the new environment variables:

```bash
npm run dev
```

## 6. Test the Leaderboard

1. Play the game and get a score
2. Click the "LEADERBOARD" button on the main menu
3. Your score should appear!

## Optional: Set Up Score Cleanup

To prevent the leaderboard from growing too large, you can set up a PostgreSQL function to keep only the top 100 scores:

```sql
-- Function to keep only top 100 scores
CREATE OR REPLACE FUNCTION cleanup_leaderboard()
RETURNS void AS $$
BEGIN
  DELETE FROM leaderboard
  WHERE id NOT IN (
    SELECT id FROM leaderboard
    ORDER BY score DESC
    LIMIT 100
  );
END;
$$ LANGUAGE plpgsql;

-- Schedule it to run daily (requires the pg_cron extension)
-- Run this in your Supabase SQL editor:
SELECT cron.schedule(
  'cleanup-leaderboard',
  '0 0 * * *', -- Run at midnight every day
  $$SELECT cleanup_leaderboard()$$
);
```

## Troubleshooting

- **Error loading leaderboard**: Check that your Supabase URL and anon key are correct in the `.env` file
- **Scores not submitting**: Make sure the table policies are set up correctly (step 2)
- **Can't see `.env` file**: Make sure hidden files are visible in your file explorer

## Player Names

Players are automatically assigned fun random names like "HotDog123" or "MegaWiener456". These names are stored in localStorage and will persist across sessions on the same browser.
