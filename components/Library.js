'use client';

import { useEffect, useState } from 'react';
import { fetchWorkouts } from '@/lib/api';
import WorkoutCard from './WorkoutCard';
import Spinner from './Spinner';

export default function Library() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetchWorkouts()
      .then((data) => {
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load workouts');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="library"
      className="mx-auto mt-12 max-w-[1280px] scroll-mt-24 px-4 sm:mt-16 sm:px-6"
    >
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold uppercase">The Library</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Twelve lifts covering every major muscle group.
        </p>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-12 text-center">
          <p className="text-red-400">{error}. Please refresh the page.</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#232732] py-16 text-center text-neutral-400">
          No workouts found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((workout) => (
            <WorkoutCard key={workout.id} w={workout} />
          ))}
        </div>
      )}
    </section>
  );
}
