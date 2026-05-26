import { useEffect, useState, useCallback } from 'react';

const KEY = 'mf_recently_viewed';
const MAX = 12;

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Tracks the last MAX product IDs the user has viewed in localStorage.
 * Returns { ids, push, clear }.
 */
export default function useRecentlyViewed() {
  const [ids, setIds] = useState(() => read());

  // Sync if another tab updates the list.
  useEffect(() => {
    const onStorage = (e) => { if (e.key === KEY) setIds(read()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const push = useCallback((id) => {
    if (!id) return;
    setIds((prev) => {
      const next = [id, ...prev.filter((x) => x !== id)].slice(0, MAX);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch { /* noop */ }
    setIds([]);
  }, []);

  return { ids, push, clear };
}
