# ZECbook.com — Frontend Feature Baseline (Updated)

This document reflects the current state of the ZECbook.com frontend based on the latest implementation. The app ships with mock data for posts and focuses on clean UI flows that are ready to be connected to Supabase.

## Status (as of today)
- Completed
  - Timeline page with search, filter chips, author-initial grouping.
  - Post detail page with verified/featured visuals, reply box, wallet URI actions.
  - Global FeedbackProvider kept for future integrations.
  - Join flow added and integrated in the timeline header:
    - `JoinButton` in the header (top-right), no decorative icon.
    - `JoinModal` with 3 steps: Address → Profile → Verify.
    - Reuse `ZcashAddressInput` for address validation and hints.
    - Use `pendingEdits` from `store.jsx` to collect profile diffs (name/bio/avatar/links).
    - Build a compact memo payload and construct a `zcash:?` URI; copy/open actions provided.
    - `ProfileEditor` supports optional `initialValues` to prefill the address in Join.
- Partially Completed
  - Memo generator in Join uses a lightweight "compact" builder; not yet unified with `buildZcashEditMemo` in `ZcashFeedback.jsx`.
  - Backend placeholders exist for creating a join session, submitting profile, and verifying OTP, but there is no real backend yet.
- Not Implemented
  - Supabase-backed posts, real signature/OTP verification.
  - Share button enhancements and any social features.

## Overview
- Replace person directory with a timeline of posts.
- Post detail renders full content and reply/sign actions.
- Styles reuse existing `VerifiedBadge` and `VerifiedCardWrapper` for featured/verified visuals.
- Routing uses `/` (timeline) and `/post/:id` (detail).
- Header shows site title and `+ Join` button.

## Pages
### Timeline (`src/pages/Timeline.jsx`)
- Search bar: filters by title/body/author.
- Category chips: Featured, Top Rank, Verified, All; shows counts.
- Grouped by author initial letter to match legacy visual sections.
- Each item uses `PostCard` (click to open detail).
- Header: site title + `JoinButton` (decorative icon removed).

### Post Detail (`src/pages/PostDetail.jsx`)
- Full post view wrapped by `VerifiedCardWrapper` (yellow border for featured).
- Author avatar/name, joined date, verification badge.
- Reply address field and share button.
- Verified note banner when `verifiedCount > 0`.
- Embedded `ReplyBox` for drafting/verifying and wallet URI actions.

### Join Flow (`src/components/JoinModal.jsx` + `JoinButton.jsx`)
- Step 1 — Address: input and validate Zcash address using `ZcashAddressInput`.
- Step 2 — Profile: edit name/bio/avatar/links via `ProfileEditor`, which now supports `initialValues` to prefill address.
- Step 3 — Verify: generate compact memo from `pendingEdits` and construct a `zcash:?` URI with system address and minimum amount; actions to copy/open in wallet.
- Reserved backend interfaces: `apiCreateJoinSession`, `apiSubmitProfile`, `apiVerifyOtp` (placeholders).

## Components
- `PostCard` (`src/components/PostCard.jsx`): compact card with title, badge, author + date.
- `ReplyBox` (`src/components/ReplyBox.jsx`):
  - Draft/Verify mode pills (UI state only).
  - Text input with byte counter (base64url memo, 512‑byte budget).
  - Optional amount field.
  - Copy URI and Open in Wallet actions generate `zcash:?` links.
- `CategoryChips` (`src/components/CategoryChips.jsx`): filter chips with counts.
- `JoinButton` (`src/components/JoinButton.jsx`): opens Join modal from the header.
- `JoinModal` (`src/components/JoinModal.jsx`): three-step join process with memo/URI creation.
- Reused: `VerifiedBadge`, `VerifiedCardWrapper` for consistent styling.

## Data & Hooks
- Mock data in `src/mocks/posts.js` (sample posts with featured/verified/rank states).
- `usePosts` (`src/hooks/usePosts.js`): loads mock posts, search + multi‑filter, returns grouped lists and counters.

## Routing
- `src/App.jsx` routes:
  - `/` → `TimelinePage`
  - `/post/:id` → `PostDetailPage`
  - `*` → timeline fallback
- `BrowserRouter` retained in `src/main.jsx`; `FeedbackProvider` kept for future integrations.

## Running & Building
```bash
npm install
npm run dev     # local preview (Vite)
npm run build   # production build
```

## Future Integration (Supabase)
- Replace `getMockPosts()` with `supabase.from('messages')` query.
- Suggested table `messages` fields:
  - `id uuid pk`, `wallet_address text`, `author_alias text`, `author_wallet text`,
  - `body text`, `created_at timestamptz`, `verified_at timestamptz`, `verify_method enum`,
  - `is_featured boolean`, `rank_score int`, `status enum`, `reply_to_id uuid`, `signature text`,
  - `reply_address text`, `tags text[]`, `attachments jsonb[]`, `metadata jsonb`.
- Index by `wallet_address`, `created_at`, `is_featured`, `verified_at`, `rank_score`.
- Backend for Join: persist session/profile drafts, verify OTP/memo, unify memo builder with `buildZcashEditMemo`.

## Known Limitations
- All verification/sign flows are UI only (no real signature or OTP).
- Join memo builder is compact and local to `JoinModal`; unification with `buildZcashEditMemo` pending.
- Counts and filters reflect mock data only.
- Share button is a placeholder.

## File Map (New/Changed)
- New: `src/components/JoinButton.jsx`
- New: `src/components/JoinModal.jsx`
- Changed: `src/components/ProfileEditor.jsx` (supports `initialValues`)
- Updated: `src/pages/Timeline.jsx` (header shows `JoinButton`, icon removed)

## Visual Consistency
- Tailwind classes reuse existing theme (`index.css`, `tailwind.config.js`).
- Featured cards show yellow outline; verified shows green checks per `VerifiedBadge`.

---
This baseline now includes the Join UI, keeping the app ready for backend integration and memo unification when connecting to Supabase.