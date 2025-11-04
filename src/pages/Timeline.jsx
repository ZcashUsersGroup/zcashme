// src/pages/Timeline.jsx
import React from "react";
import usePosts from "../hooks/usePosts";
import PostCard from "../components/PostCard";
import CategoryChips from "../components/CategoryChips";
import JoinButton from "../components/JoinButton";

export default function TimelinePage() {
  const { posts, grouped, letters, counts, search, setSearch, filters, setFilter, resetFilters, loading } = usePosts();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Top header */}
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold">Zecbook.com</h1>
        <div className="flex items-center gap-2">
          <JoinButton />
        </div>
      </div>

      {/* Search bar */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`search ${counts.total} posts`}
        className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 bg-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Categories */}
      <CategoryChips counts={counts} filters={filters} setFilter={setFilter} resetFilters={resetFilters} />

      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Grouped timeline */}
      <div className="space-y-4">
        {letters.map((L) => (
          <div key={L}>
            <div className="sticky top-0 z-10 bg-[var(--color-background)] py-1">
              <h2 className="font-semibold text-lg">{L}</h2>
            </div>
            <div className="space-y-3">
              {(grouped[L] || []).map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        ))}

        {letters.length === 0 && (
          <p className="text-gray-600">No posts match your filters.</p>
        )}
      </div>
    </div>
  );
}