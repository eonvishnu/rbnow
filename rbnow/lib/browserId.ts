export function getOrCreateBrowserId(): string {
  if (typeof window === 'undefined') return '';

  const STORAGE_KEY = 'royal_bengal_browser_id';
  let browserId = '';

  try {
    // 1. Try reading from localStorage
    browserId = localStorage.getItem(STORAGE_KEY) || '';

    // 2. If not found in localStorage, check cookies
    if (!browserId) {
      const match = document.cookie.match(new RegExp('(^| )' + STORAGE_KEY + '=([^;]+)'));
      if (match) browserId = match[2];
    }

    // 3. If still not found, generate a new persistent UUID
    if (!browserId) {
      browserId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `browser_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    }

    // 4. Save to both localStorage and cookies (1 year expiry)
    localStorage.setItem(STORAGE_KEY, browserId);
    document.cookie = `${STORAGE_KEY}=${browserId}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (err) {
    console.error('Error in browser ID management:', err);
  }

  return browserId;
}
