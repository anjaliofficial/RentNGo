"use client";

import { Search } from "lucide-react";

const CATEGORIES = [
  "All Categories",
  "Photography & Video",
  "Drones",
  "Power Tools",
  "Camping Equipment",
  "Musical Instruments",
];

export default function SearchBar() {
  return (
    <div className="rounded-card border border-neutral-100 bg-white p-4 shadow-card">
      <div className="grid gap-3 md:grid-cols-4">
        <input
          type="text"
          placeholder="Search equipment..."
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-secondary-500"
        />
        <input
          type="text"
          placeholder="Location"
          className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-secondary-500"
        />
        <select className="rounded-lg border border-neutral-200 px-3 py-2.5 text-sm outline-none focus:border-secondary-500">
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button className="btn-secondary">
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </div>
  );
}
