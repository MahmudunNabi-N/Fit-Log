"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, X } from "lucide-react";

import { usePlan } from "@/context/PlanContext";
import Stats from "@/components/Stats";
import Spinner from "@/components/Spinner";

const SORTS = {
  duration: "Duration",
  caloriesBurned: "Calories",
  rating: "Rating",
};

export default function MyPlan() {
  const {
    plan,
    saved,
    done,
    ready,
    removeFromPlan,
    removeFromSaved,
    markDone,
  } = usePlan();

  const [tab, setTab] = useState("plan");
  const [sort, setSort] = useState("duration");

  const list = useMemo(
    () =>
      [...(tab === "plan" ? plan : saved)].sort(
        (a, b) => Number(b[sort] ?? 0) - Number(a[sort] ?? 0)
      ),
    [tab, plan, saved, sort]
  );

  const metrics = [
    ["Exercises", plan.length],
    [
      "Minutes",
      plan.reduce(
        (sum, workout) => sum + Number(workout.duration || 0),
        0
      ),
    ],
    [
      "Calories",
      plan.reduce(
        (sum, workout) => sum + Number(workout.caloriesBurned || 0),
        0
      ),
    ],
  ];

  return (
    <div className="mx-auto max-w-[1232px] px-4 pb-16 pt-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold uppercase leading-9">
        My Plan
      </h1>

      <p className="mt-2 text-sm text-neutral-400">
        Cap of five lifts for today. Finish them, then load more.
      </p>

      <div className="mt-6 grid grid-cols-3 divide-x divide-[#232732] rounded-2xl border border-[#232732] bg-[#13161d] py-6">
        {metrics.map(([label, value]) => (
          <div key={label} className="px-3 sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              {label}
            </p>

            <p className="mt-1 font-display text-3xl font-bold text-accent sm:text-4xl">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl border border-[#232732] bg-[#151921] p-[5px]">
          {[
            ["plan", "Today's Plan"],
            ["saved", "Saved"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-lg border px-4 py-1.5 text-xs font-semibold sm:text-sm ${
                tab === key
                  ? "border-[#2b303d] bg-[#1f242d] text-white"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-3 text-xs text-neutral-400">
          Sort By

          <span className="relative">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="h-[34px] appearance-none rounded-[9px] border border-[#232732] bg-[#13161d] pl-3 pr-8 text-xs font-semibold text-white outline-none focus:border-accent"
            >
              {Object.entries(SORTS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </span>
        </label>
      </div>

      <div className="mt-4">
        {!ready ? (
          <Spinner />
        ) : list.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#232732] bg-[#111317] py-16 text-center">
            <h2 className="font-display text-3xl font-bold uppercase">
              Nothing here yet
            </h2>

            <p className="mt-2 text-neutral-400">
              Browse the library and add a lift to get today moving.
            </p>

            <Link
              href="/"
              className="mt-6 inline-block rounded-md bg-accent px-6 py-3 font-bold uppercase text-black transition hover:brightness-110"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {list.map((workout) => {
              const isDone =
                tab === "plan" && done.includes(workout.id);

              return (
                <li
                  key={workout.id}
                  className={`flex flex-col gap-4 rounded-2xl border bg-[#14171e] p-4 sm:flex-row sm:items-center sm:justify-between ${
                    isDone
                      ? "border-accent/60"
                      : "border-[#232732]"
                  }`}
                >
                  <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                    <img
                      src={workout.image}
                      alt={workout.name}
                      className="h-40 w-full rounded-xl object-cover sm:h-20 sm:w-36 sm:shrink-0"
                    />

                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`font-display text-lg font-bold uppercase leading-6 ${
                            isDone
                              ? "text-neutral-500 line-through"
                              : ""
                          }`}
                        >
                          {workout.name}
                        </h3>

                        {isDone && (
                          <span className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                            Done
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-400">
                        {workout.equipment}
                      </p>

                      <Stats w={workout} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/workout/${workout.id}`}
                      className="inline-flex h-[34px] items-center rounded-full border border-[#374151] px-4 text-xs font-semibold transition hover:border-accent hover:text-accent"
                    >
                      View Details
                    </Link>

                    {tab === "plan" && (
                      <button
                        onClick={() => markDone(workout)}
                        disabled={isDone}
                        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Check size={14} />
                        Mark as Done
                      </button>
                    )}

                    <button
                      onClick={() =>
                        tab === "plan"
                          ? removeFromPlan(workout)
                          : removeFromSaved(workout)
                      }
                      aria-label={`Remove ${workout.name}`}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition hover:text-red-400"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}