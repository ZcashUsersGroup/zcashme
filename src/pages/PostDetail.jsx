// src/pages/PostDetail.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePosts from "../hooks/usePosts";
import VerifiedBadge from "../components/VerifiedBadge";
import VerifiedCardWrapper from "../components/VerifiedCardWrapper";
import ReplyBox from "../components/ReplyBox";
import shareIcon from "../assets/share.svg";

function humanDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return iso;
  }
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts } = usePosts();

  const post = posts.find((p) => p.id === id) || posts[0];

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-gray-600">Post not found.</p>
        <button className="mt-3 px-3 py-2 rounded-lg border" onClick={() => navigate("/")}>Back to timeline</button>
      </div>
    );
  }

  const avatarSrc = post.authorAvatar || "/blue_avatar_shield_transparent.png";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button className="mb-3 px-3 py-2 rounded-lg border" onClick={() => navigate("/")}>← Back to timeline</button>

      <VerifiedCardWrapper verifiedCount={post.verifiedCount} featured={post.featured} className="w-full">
        <div className="flex items-start gap-3">
          <div className="h-16 w-16 rounded-full overflow-hidden border border-gray-300">
            <img
              src={avatarSrc}
              alt={post.authorName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">{post.authorName}</h2>
                {post.verifiedCount > 0 && <VerifiedBadge verifiedCount={post.verifiedCount} />}
              </div>
              <button className="p-2 rounded-lg border hover:bg-white/60" title="Share">
                <img src={shareIcon} className="h-4 w-4" alt="share" />
              </button>
            </div>

            <p className="text-sm text-gray-600">Joined {humanDate(post.authorJoined)} · Last verified {post.verifiedCount > 0 ? "N/A" : "unknown"} · Good thru Dec 2025</p>

            {/* Reply address row */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={post.replyAddress || "u1example...mock"}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white/60"
              />
              <button className="px-3 py-2 rounded-lg border bg-white/70">Copy</button>
            </div>

            {/* Post body */}
            <div className="mt-3 rounded-lg bg-white/60 border border-gray-200 p-3">
              <h3 className="font-semibold mb-2">{post.title || "Post"}</h3>
              <p className="leading-relaxed text-gray-800 whitespace-pre-wrap">{post.body}</p>
            </div>

            {/* Verified note */}
            {post.verifiedCount > 0 && (
              <div className="mt-3 text-green-800 bg-green-100 border border-green-300 rounded-lg px-3 py-2 text-sm">
                ✅ {post.authorName} appears to be verified. <a href="#" className="underline">More</a>
              </div>
            )}
          </div>
        </div>
      </VerifiedCardWrapper>

      {/* Reply box */}
      <ReplyBox replyAddress={post.replyAddress} placeholder={`Draft a note to: ${post.authorName}`} />
    </div>
  );
}