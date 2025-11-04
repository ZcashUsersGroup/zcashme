// src/components/CategoryChips.jsx
import React from "react";

export default function CategoryChips({ counts, filters, setFilter, resetFilters }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <button
        className={`px-2.5 py-1 rounded-full text-sm border ${filters.featured ? "bg-yellow-100 border-yellow-400" : "bg-white/50 border-gray-300"}`}
        onClick={() => {
          setFilter("featured", !filters.featured);
          setFilter("all", false);
        }}
      >
        🌟 Featured ({counts.featured})
      </button>

      <button
        className={`px-2.5 py-1 rounded-full text-sm border ${filters.ranked ? "bg-orange-100 border-orange-400" : "bg-white/50 border-gray-300"}`}
        onClick={() => {
          setFilter("ranked", !filters.ranked);
          setFilter("all", false);
        }}
      >
        🔝 Top Rank ({counts.ranked})
      </button>

      <button
        className={`px-2.5 py-1 rounded-full text-sm border ${filters.verified ? "bg-green-100 border-green-400" : "bg-white/50 border-gray-300"}`}
        onClick={() => {
          setFilter("verified", !filters.verified);
          setFilter("all", false);
        }}
      >
        ✅ Verified ({counts.verified})
      </button>

      <button
        className={`px-2.5 py-1 rounded-full text-sm border ${filters.all ? "bg-blue-100 border-blue-400" : "bg-white/50 border-gray-300"}`}
        onClick={resetFilters}
      >
        🔎 All ({counts.total})
      </button>

      {/* Placeholders for consistency with screenshots */}
      <button className="px-2.5 py-1 rounded-full text-sm border bg-white/50 border-gray-300">📊 Show stats</button>
      <button className="px-2.5 py-1 rounded-full text-sm border bg-white/50 border-gray-300">💬 Feedback</button>
    </div>
  );
}