const PRIMARY_BASE = 'https://api.abcz.workers.dev/api/fitlog';
const FALLBACK_BASE = 'https://api.api-store.workers.dev/api/fitlog';

async function requestJson(url) {
  const response = await fetch(url, {
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json();
}

export async function fetchWorkouts() {
  try {
    const data = await requestJson(PRIMARY_BASE);
    if (!Array.isArray(data)) throw new Error('Invalid workout data');
    return data;
  } catch (primaryError) {
    try {
      const data = await requestJson(FALLBACK_BASE);
      if (!Array.isArray(data)) throw new Error('Invalid workout data');
      return data;
    } catch {
      throw new Error('Failed to load workouts');
    }
  }
}

export async function fetchWorkout(id) {
  const urls = [`${PRIMARY_BASE}/${id}`, `${FALLBACK_BASE}/${id}`];

  for (const url of urls) {
    try {
      const data = await requestJson(url);
      if (data && !data.error && data.id !== undefined) return data;
    } catch {
      // Try the fallback API.
    }
  }

  throw new Error('Workout not found');
}
