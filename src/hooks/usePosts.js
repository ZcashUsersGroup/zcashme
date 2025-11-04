// src/hooks/usePosts.js
import { useEffect, useMemo, useState } from "react";
import { getMockPosts } from "../mocks/posts";

/**
 * usePosts: provides timeline posts with search and category filtering.
 * Categories mirror Zcash.me chips: Featured, Top Rank, Verified, All.
 */
export default function usePosts() {
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    featured: true,
    verified: false,
    ranked: false,
    all: false,
  });

  useEffect(() => {
    setLoading(true);
    // Later: replace with Supabase query. For now, mock.
    const posts = getMockPosts();
    setAllPosts(posts);
    setLoading(false);
  }, []);

  const norm = (s = "") =>
    s
      .toString()
      .normalize("NFKC")
      .trim()
      .toLowerCase();

  const filtered = useMemo(() => {
    let s = [...allPosts];

    if (filters.all) {
      // no filters
    } else {
      if (filters.featured) s = s.filter((p) => Boolean(p.featured));
      if (filters.verified) s = s.filter((p) => (p.verifiedCount ?? 0) > 0);
      if (filters.ranked) s = s.filter((p) => (p.rankScore ?? 0) > 0);
    }

    if (search.trim()) {
      const q = norm(search);
      s = s.filter(
        (p) =>
          norm(p.title).includes(q) ||
          norm(p.body).includes(q) ||
          norm(p.authorName).includes(q)
      );
    }

    // Sort by createdAt desc (timeline)
    s.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Group by author initial to mimic directory letter groups (for visuals)
    const grouped = s.reduce((acc, p) => {
      const first = (p.authorName?.[0] || "#").toUpperCase();
      (acc[first] ||= []).push(p);
      return acc;
    }, {});
    const letters = Object.keys(grouped).sort();

    const counts = {
      total: allPosts.length,
      featured: allPosts.filter((p) => p.featured).length,
      verified: allPosts.filter((p) => (p.verifiedCount ?? 0) > 0).length,
      ranked: allPosts.filter((p) => (p.rankScore ?? 0) > 0).length,
    };

    return { list: s, grouped, letters, counts };
  }, [allPosts, search, filters]);

  const setFilter = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => setFilters({ featured: false, verified: false, ranked: false, all: true });

  return {
    posts: filtered.list,
    grouped: filtered.grouped,
    letters: filtered.letters,
    counts: filtered.counts,
    loading,
    search,
    setSearch,
    filters,
    setFilter,
    resetFilters,
  };
}