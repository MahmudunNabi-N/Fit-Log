# 💪 FitLog — Workout Library

FitLog is a dark, responsive workout library built with Next.js App Router. Browse workouts, view workout details, add exercises to today's plan, save workouts for later, and track your plan with live stats.

## Technologies

- Next.js 14 (App Router)
- React 18
- Tailwind CSS 3
- lucide-react
- Google Fonts: Inter + Oswald
- localStorage for persistence
- FitLog REST API

## Key Features

1. Responsive navbar with live Plan and Saved counters.
2. Hero/banner section with anchor navigation to the workout library.
3. Responsive workout library with API-driven workout cards.
4. Dynamic workout detail pages with specs, instructions, add/save actions and toast notifications.
5. My Plan page with Today's Plan and Saved tabs, live Exercises/Minutes/Calories metrics, sorting, mark-as-done and remove actions.
6. Five-workout plan limit with useful feedback.
7. Loading states, empty states and custom 404 page.
8. Plan, saved and done state persists across reloads using localStorage.

## API

Primary API:
- All workouts: https://api.abcz.workers.dev/api/fitlog
- Single workout: https://api.abcz.workers.dev/api/fitlog/:id

Fallback API:
- All workouts: https://api.api-store.workers.dev/api/fitlog
- Single workout: https://api.api-store.workers.dev/api/fitlog/:id

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3001.

## Build

```bash
npm run build
npm start
```

## Deployment

Vercel is recommended for the easiest Next.js deployment.

## Submission Links

- Live Link: add your deployed URL here
- GitHub Repository: add your GitHub URL here
