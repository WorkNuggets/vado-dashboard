-- Migration: Create user_settings table
-- This table stores user-specific settings and preferences

CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,

  -- Notification preferences
  email_tour_requests BOOLEAN DEFAULT true,
  email_messages BOOLEAN DEFAULT true,
  email_digest_frequency TEXT DEFAULT 'daily' CHECK (email_digest_frequency IN ('daily', 'weekly', 'none')),

  -- Dashboard preferences
  theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
  default_dashboard_view TEXT DEFAULT 'overview',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_settings_updated_at();

-- Enable Row Level Security
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to get or create user settings
CREATE OR REPLACE FUNCTION get_or_create_user_settings(p_user_id UUID)
RETURNS user_settings AS $$
DECLARE
  v_settings user_settings;
BEGIN
  SELECT * INTO v_settings FROM user_settings WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO user_settings (user_id)
    VALUES (p_user_id)
    RETURNING * INTO v_settings;
  END IF;

  RETURN v_settings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
