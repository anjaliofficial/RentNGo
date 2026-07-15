"use client";

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <section className="-mt-10 relative z-20">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="grid gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search equipment..."
            className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Location"
            className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select className="rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Categories</option>
            <option>Camera</option>
            <option>Drone</option>
            <option>Power Tools</option>
            <option>Camping</option>
            <option>Music</option>
          </select>

          <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700">
            <Search size={20} />
            Search
          </button>
        </div>
      </div>
    </section>
  );
}