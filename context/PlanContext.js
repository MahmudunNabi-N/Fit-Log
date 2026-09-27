'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const PlanContext = createContext(null);
export const PLAN_CAP = 5;
const STORAGE_KEY = 'fitlog-state-v1';

export function PlanProvider({ children }) {
  const [plan, setPlan] = useState([]);
  const [saved, setSaved] = useState([]);
  const [done, setDone] = useState([]);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const state = JSON.parse(raw);
        setPlan(Array.isArray(state.plan) ? state.plan : []);
        setSaved(Array.isArray(state.saved) ? state.saved : []);
        setDone(Array.isArray(state.done) ? state.done : []);
      }
    } catch {
      // Ignore corrupted or unavailable storage and start clean.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ plan, saved, done })
      );
    } catch {
      // Ignore storage quota / privacy mode errors.
    }
  }, [plan, saved, done, ready]);

  const toast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((current) => [...current, { id, message, type }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 2600);
  }, []);

  const addToPlan = useCallback(
    (workout) => {
      if (plan.some((item) => item.id === workout.id)) {
        toast(`${workout.name} is already in today's plan`, 'info');
        return;
      }

      if (plan.length >= PLAN_CAP) {
        toast(`Plan is full (${PLAN_CAP} lifts max)`, 'error');
        return;
      }

      setPlan((current) => [...current, workout]);
      toast(`Added ${workout.name} to today's plan`);
    },
    [plan, toast]
  );

  const addToSaved = useCallback(
    (workout) => {
      if (saved.some((item) => item.id === workout.id)) {
        toast(`${workout.name} is already saved`, 'info');
        return;
      }

      setSaved((current) => [...current, workout]);
      toast(`Saved ${workout.name} for later`);
    },
    [saved, toast]
  );

  const removeFromPlan = useCallback(
    (workout) => {
      setPlan((current) => current.filter((item) => item.id !== workout.id));
      setDone((current) => current.filter((id) => id !== workout.id));
      toast(`Removed ${workout.name} from today's plan`, 'info');
    },
    [toast]
  );

  const removeFromSaved = useCallback(
    (workout) => {
      setSaved((current) => current.filter((item) => item.id !== workout.id));
      toast(`Removed ${workout.name} from saved`, 'info');
    },
    [toast]
  );

  const markDone = useCallback(
    (workout) => {
      if (done.includes(workout.id)) {
        toast(`${workout.name} is already done`, 'info');
        return;
      }

      setDone((current) => [...current, workout.id]);
      toast(`Marked ${workout.name} as done`);
    },
    [done, toast]
  );

  return (
    <PlanContext.Provider
      value={{
        plan,
        saved,
        done,
        ready,
        addToPlan,
        addToSaved,
        removeFromPlan,
        removeFromSaved,
        markDone,
      }}
    >
      {children}

      <div className="fixed bottom-4 left-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none sm:left-auto">
        {toasts.map((item) => (
          <div
            key={item.id}
            className={`toast-in pointer-events-auto rounded-lg border bg-card px-4 py-3 text-sm font-medium shadow-lg ${
              item.type === 'success'
                ? 'border-accent text-accent'
                : item.type === 'error'
                  ? 'border-red-500 text-red-400'
                  : 'border-line text-white'
            }`}
          >
            {item.message}
          </div>
        ))}
      </div>
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);

  if (!context) {
    throw new Error('usePlan must be used inside PlanProvider');
  }

  return context;
}
