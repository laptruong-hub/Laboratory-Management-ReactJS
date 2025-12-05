// Storage utility that respects "Remember Me" preference
const REMEMBER_ME_KEY = "rememberMe";
const REMEMBERED_EMAIL_KEY = "rememberedEmail";

/**
 * Save the "Remember Me" preference
 */
export const setRememberMe = (value: boolean) => {
  localStorage.setItem(REMEMBER_ME_KEY, JSON.stringify(value));
};

/**
 * Get the "Remember Me" preference
 */
export const getRememberMe = (): boolean => {
  const stored = localStorage.getItem(REMEMBER_ME_KEY);
  return stored ? JSON.parse(stored) : false;
};

/**
 * Store a token in the appropriate storage based on "Remember Me" preference
 * @param key - Token key (e.g., "accessToken", "refreshToken")
 * @param value - Token value
 * @param rememberMe - Whether to use localStorage (true) or sessionStorage (false)
 */
export const setToken = (key: string, value: string, rememberMe: boolean) => {
  if (rememberMe) {
    // Remember Me checked → use localStorage (persists across sessions)
    localStorage.setItem(key, value);
    // Clear from sessionStorage if it exists
    sessionStorage.removeItem(key);
  } else {
    // Remember Me unchecked → use sessionStorage (clears when tab closes)
    sessionStorage.setItem(key, value);
    // Clear from localStorage if it exists
    localStorage.removeItem(key);
  }
};

/**
 * Get a token from storage (checks both localStorage and sessionStorage)
 * @param key - Token key (e.g., "accessToken", "refreshToken")
 * @returns Token value or null if not found
 */
export const getToken = (key: string): string | null => {
  // Check localStorage first (if Remember Me was checked)
  // Fallback to sessionStorage (if Remember Me was unchecked)
  return localStorage.getItem(key) || sessionStorage.getItem(key);
};

/**
 * Remove a token from both storages
 * @param key - Token key to remove
 */
export const removeToken = (key: string) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

/**
 * Clear all authentication-related data from both storages
 */
export const clearAllAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  localStorage.removeItem(REMEMBER_ME_KEY);
  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
};

/**
 * Save email for convenience (only if Remember Me is true)
 */
export const setRememberedEmail = (email: string, rememberMe: boolean) => {
  if (rememberMe) {
    localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
  } else {
    localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  }
};

/**
 * Get remembered email (if any)
 */
export const getRememberedEmail = (): string | null => {
  return localStorage.getItem(REMEMBERED_EMAIL_KEY);
};
