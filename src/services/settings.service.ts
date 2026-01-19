import { createClient } from "@/lib/supabase/client";

/**
 * Settings Service
 * Handles user settings and preferences
 *
 * NOTE: After running the migration (migrations/003_create_user_settings_table.sql),
 * regenerate types with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.types.ts
 */

// Temporary type definition until database types are regenerated
export interface UserSettings {
  id: string;
  user_id: string;
  email_tour_requests: boolean;
  email_messages: boolean;
  email_digest_frequency: "daily" | "weekly" | "none";
  theme_preference: "light" | "dark" | "system";
  default_dashboard_view: string;
  created_at: string;
  updated_at: string;
}

export interface UserSettingsUpdate {
  email_tour_requests?: boolean;
  email_messages?: boolean;
  email_digest_frequency?: "daily" | "weekly" | "none";
  theme_preference?: "light" | "dark" | "system";
  default_dashboard_view?: string;
}

/**
 * Get user settings (creates default settings if not exists)
 */
export async function getUserSettings(
  userId: string
): Promise<UserSettings | null> {
  const supabase = createClient();

  // Try to fetch existing settings
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No settings found, create default settings
      return createDefaultSettings(userId);
    }
    console.error("Error fetching user settings:", error);
    return null;
  }

  return data as UserSettings;
}

/**
 * Create default settings for a user
 */
async function createDefaultSettings(
  userId: string
): Promise<UserSettings | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_settings")
    .insert({
      user_id: userId,
      email_tour_requests: true,
      email_messages: true,
      email_digest_frequency: "daily",
      theme_preference: "system",
      default_dashboard_view: "overview",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating default settings:", error);
    return null;
  }

  return data as UserSettings;
}

/**
 * Update user settings
 */
export async function updateUserSettings(
  userId: string,
  settings: UserSettingsUpdate
): Promise<UserSettings> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_settings")
    .update({
      ...settings,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }

  return data as UserSettings;
}

/**
 * Apply theme preference to document
 */
export function applyThemePreference(theme: "light" | "dark" | "system") {
  if (typeof window === "undefined") return;

  const root = window.document.documentElement;

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    root.classList.toggle("dark", systemTheme === "dark");
  } else {
    root.classList.toggle("dark", theme === "dark");
  }

  // Store in localStorage for persistence
  localStorage.setItem("theme-preference", theme);
}

/**
 * Get stored theme preference from localStorage
 */
export function getStoredThemePreference(): "light" | "dark" | "system" {
  if (typeof window === "undefined") return "system";

  const stored = localStorage.getItem("theme-preference");
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return "system";
}

/**
 * Initialize theme on app load
 */
export function initializeTheme() {
  if (typeof window === "undefined") return;

  const theme = getStoredThemePreference();
  applyThemePreference(theme);

  // Listen for system theme changes
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const currentTheme = getStoredThemePreference();
      if (currentTheme === "system") {
        applyThemePreference("system");
      }
    });
}
