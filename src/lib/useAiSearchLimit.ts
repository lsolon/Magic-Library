import { useState, useEffect } from 'react';

const MAX_SEARCHES = 5;
const HOURS_24 = 24 * 60 * 60 * 1000;
const STORAGE_KEY = 'magic_library_ai_searches';

interface LimitState {
  count: number;
  firstSearchAt: number | null;
}

export function useAiSearchLimit() {
  const [state, setState] = useState<LimitState>({ count: 0, firstSearchAt: null });
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number } | null>(null);

  useEffect(() => {
    // Load from local storage on mount
    const loadState = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as LimitState;
          
          if (parsed.firstSearchAt) {
            const now = Date.now();
            const timePassed = now - parsed.firstSearchAt;
            
            // If 24 hours have passed, reset
            if (timePassed >= HOURS_24) {
              const resetState = { count: 0, firstSearchAt: null };
              setState(resetState);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(resetState));
            } else {
              setState(parsed);
            }
          } else {
            setState(parsed);
          }
        }
      } catch (err) {
        console.error("Error reading limit state", err);
      }
    };
    
    loadState();
    
    // Set up a timer to update the countdown every minute
    const interval = setInterval(() => {
      loadState();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (state.firstSearchAt) {
      const updateTimeLeft = () => {
        const now = Date.now();
        const resetTime = state.firstSearchAt! + HOURS_24;
        const diff = Math.max(0, resetTime - now);
        
        if (diff === 0) {
          setTimeLeft(null);
          const resetState = { count: 0, firstSearchAt: null };
          setState(resetState);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(resetState));
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          setTimeLeft({ hours, minutes });
        }
      };
      
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 60000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft(null);
    }
  }, [state.firstSearchAt, state.count]);

  const incrementSearch = () => {
    setState((prev) => {
      const newState = {
        count: prev.count + 1,
        firstSearchAt: prev.firstSearchAt || Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  };

  const searchesLeft = Math.max(0, MAX_SEARCHES - state.count);
  const canSearch = searchesLeft > 0;

  return {
    searchesLeft,
    canSearch,
    timeLeft,
    incrementSearch,
    maxSearches: MAX_SEARCHES
  };
}
