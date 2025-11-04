# Database Schema & Integration

This document describes the Supabase database schema, tables, views, and how the application integrates with the database.

## Supabase Setup

### Client Configuration

The Supabase client is initialized in `src/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Environment Variables

Required environment variables (in `.env.local`):
- `VITE_SUPABASE_URL` - Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

**Note**: The anon key is safe to expose in client-side code because Row Level Security (RLS) policies enforce access control at the database level.

## Database Tables

### `zcasher`

The main profiles table storing user information.

**Columns:**
- `id` (integer, primary key) - Unique profile ID
- `name` (text, not null) - Display name of the profile
- `address` (text, not null, unique) - Zcash address (sapling, transparent, or unified)
- `bio` (text, nullable) - Optional biography text
- `profile_image_url` (text, nullable) - URL to profile image (stored in Supabase Storage)
- `address_verified` (boolean, default false) - Whether the address is verified
- `last_verified_at` (timestamp, nullable) - Last verification timestamp
- `last_signed_at` (timestamp, nullable) - Last time profile was updated via Zcash transaction
- `referred_by` (text, nullable) - Name of referring profile
- `referred_by_zcasher_id` (integer, nullable) - ID of referring profile (foreign key)
- `featured` (boolean, default false) - Whether profile is featured
- `slug` (text, nullable) - URL-friendly slug (generated from name)
- `created_at` (timestamp, default now()) - Profile creation timestamp
- `joined_at` (timestamp, nullable) - Alternative join date field

**Indexes:**
- Primary key on `id`
- Unique index on `address`
- Index on `name` for search performance
- Index on `referred_by_zcasher_id` for referral queries

**Relationships:**
- One-to-many with `zcasher_links` (via `zcasher_id`)
- One-to-many with `zcasher_items` (via `zcasher_id`)
- Self-referential (via `referred_by_zcasher_id`)

### `zcasher_links`

Social media and external links associated with profiles.

**Columns:**
- `id` (integer, primary key) - Unique link ID
- `zcasher_id` (integer, foreign key → `zcasher.id`) - Profile this link belongs to
- `label` (text, nullable) - Display label (often auto-generated from URL)
- `url` (text, not null) - Full URL of the link
- `is_verified` (boolean, default false) - Whether the link is verified
- `verification_expires_at` (timestamp, nullable) - When verification expires (if applicable)
- `created_at` (timestamp, default now()) - Link creation timestamp

**Indexes:**
- Primary key on `id`
- Index on `zcasher_id` for efficient profile lookups
- Index on `is_verified` for filtering verified links

**Common Link Types:**
- X (Twitter): `https://x.com/username`
- GitHub: `https://github.com/username`
- Website/Blog: Custom URLs
- Other: Any valid HTTP/HTTPS URL

### `zcasher_items`

Additional profile items (currently used for verified addresses).

**Columns:**
- `id` (integer, primary key) - Unique item ID
- `zcasher_id` (integer, foreign key → `zcasher.id`) - Profile this item belongs to
- `kind` (text, not null) - Type of item (e.g., "address")
- `value` (text, nullable) - Item value/content
- `is_verified` (boolean, default false) - Whether the item is verified
- `verification_expires_at` (timestamp, nullable) - When verification expires
- `created_at` (timestamp, default now()) - Item creation timestamp

**Indexes:**
- Primary key on `id`
- Index on `zcasher_id`
- Index on `kind` and `is_verified` for filtering

## Database Views

### `zcasher_with_referral_rank`

Enhanced view of `zcasher` table with referral ranking information.

**Additional Columns:**
- `referral_count` (integer) - Total number of referrals
- `verified_referrals` (integer) - Number of verified referrals
- `referral_rank` (integer, nullable) - Overall referral rank

**Usage:**
This view is used in `useProfiles` hook to efficiently load profiles with referral data in a single query.

### `referrer_ranked_alltime`

Leaderboard view showing all-time top referrers.

**Columns:**
- `referred_by_zcasher_id` (integer) - ID of the referring profile
- `referred_by` (text) - Name of the referring profile
- `total_referrals` (integer) - Total number of referrals
- `verified_referrals` (integer) - Number of verified referrals
- `verified_ratio_pct` (numeric) - Percentage of verified referrals
- `rank_alltime` (integer) - All-time ranking (1 = highest)

**Usage:**
Queried to display top 10 all-time referrers in stats and badges.

### `referrer_ranked_weekly`

Same structure as `referrer_ranked_alltime` but filtered to the current week.

**Columns:**
- Same as `referrer_ranked_alltime`
- `rank_weekly` instead of `rank_alltime`

### `referrer_ranked_monthly`

Same structure but filtered to the current month.

**Columns:**
- Same as `referrer_ranked_alltime`
- `rank_monthly` instead of `rank_alltime`

### `referrer_ranked_daily`

Same structure but filtered to the current day.

**Columns:**
- Same as `referrer_ranked_alltime`
- `rank_daily` instead of `rank_alltime`

### `network_summary`

Aggregate statistics about the entire network.

**Columns:**
- `total_profiles` (integer) - Total number of profiles
- `verified_profiles` (integer) - Number of verified profiles
- `referred_profiles` (integer) - Number of profiles with referrals
- `verified_referred_profiles` (integer) - Number of profiles that are both verified and referred
- `other_profiles` (integer) - Profiles that are neither verified nor referred
- `last_updated` (timestamp) - Last time summary was computed

**Usage:**
Displayed in `ZcashStats` component to show network-wide statistics.

### `growth_over_time_daily`

Daily growth metrics.

**Columns:**
- `day_start` (date) - Start of the day
- `total_profiles` (integer) - Total profiles on this day
- `verified_profiles` (integer) - Verified profiles on this day
- `referred_profiles` (integer) - Referred profiles on this day
- `verified_referred_profiles` (integer) - Both verified and referred on this day

**Usage:**
Used for daily growth charts in `ZcashStats`.

### `growth_over_time` (weekly)

Same structure as daily but aggregated by week.

**Columns:**
- `week_start` (date) - Start of the week
- Same metrics columns as daily view

### `growth_over_time_monthly`

Same structure but aggregated by month.

**Columns:**
- `month_start` (date) - Start of the month
- Same metrics columns as daily view

## Query Patterns

### Loading All Profiles

The `useProfiles` hook uses a pagination strategy:

```javascript
const pageSize = 1000;
let all = [];
let from = 0;

while (true) {
  const { data, error, count } = await supabase
    .from("zcasher_with_referral_rank")
    .select("*", { count: "exact" })
    .order("name", { ascending: true })
    .range(from, from + pageSize - 1);

  if (error) break;
  
  all = all.concat(data || []);
  total = count || total;
  
  if (!data?.length || all.length >= total) break;
  from += pageSize;
}
```

**Optimization**: Profile data is cached in memory to avoid repeated fetches.

### Loading Profile Links

Links are loaded on-demand when a profile card is expanded:

```javascript
const { data, error } = await supabase
  .from("zcasher_links")
  .select("id, label, url, is_verified")
  .eq("zcasher_id", profile.id)
  .order("id", { ascending: true });
```

### Enriching Profiles with Ranks

To avoid N+1 queries, ranks are fetched in bulk and merged:

```javascript
// Fetch top 10 from each leaderboard
const [{ data: lbAll }, { data: lbWeek }, { data: lbMonth }] = await Promise.all([
  supabase.from("referrer_ranked_alltime").select("referred_by_zcasher_id, rank_alltime").limit(10),
  supabase.from("referrer_ranked_weekly").select("referred_by_zcasher_id, rank_weekly").limit(10),
  supabase.from("referrer_ranked_monthly").select("referred_by_zcasher_id, rank_monthly").limit(10),
]);

// Create lookup maps
const rankAll = new Map(lbAll.map(r => [String(r.referred_by_zcasher_id), r.rank_alltime]));
const rankWeek = new Map(lbWeek.map(r => [String(r.referred_by_zcasher_id), r.rank_weekly]));
const rankMonth = new Map(lbMonth.map(r => [String(r.referred_by_zcasher_id), r.rank_monthly]));

// Merge into profiles
const enriched = profiles.map(p => ({
  ...p,
  rank_alltime: rankAll.get(String(p.id)) || 0,
  rank_weekly: rankWeek.get(String(p.id)) || 0,
  rank_monthly: rankMonth.get(String(p.id)) || 0,
}));
```

### Creating a New Profile

Multi-step process in `AddUserForm.jsx`:

```javascript
// 1. Insert profile
const { data: profile, error } = await supabase
  .from("zcasher")
  .insert([{
    name: name.trim(),
    address: address.trim(),
    referred_by: referrer?.name || null,
    referred_by_zcasher_id: referrer?.id || null,
  }])
  .select()
  .single();

// 2. Insert links (if any)
for (const url of finalLinks) {
  await supabase.from("zcasher_links").insert([{
    zcasher_id: profile.id,
    label: url.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    url,
    is_verified: false,
  }]);
}
```

## Caching Strategy

### In-Memory Cache

Profiles are cached in a module-level variable:

```javascript
let cachedProfiles = null;

export default function useProfiles() {
  const [profiles, setProfiles] = useState(cachedProfiles || []);
  // ...
}
```

**Benefits:**
- Instant initial render if cache exists
- Reduces database load
- Persists across component remounts

**Cache Invalidation:**
Cache is cleared when new profiles are added:
```javascript
window.cachedProfiles = null;
// Force reload
window.location.reload();
```

### Window Global Cache

For non-React code access:
```javascript
if (typeof window !== "undefined") {
  window.cachedProfiles = enriched;
}
```

## Row Level Security (RLS)

### Policies

Supabase uses Row Level Security to control access:

**Read Policies:**
- Public read access to `zcasher` table (all profiles visible)
- Public read access to `zcasher_links` table
- Public read access to all leaderboard views

**Write Policies:**
- Insert allowed for new profiles (address validation required)
- Updates restricted (typically via Zcash transactions, not direct DB writes)
- Deletes restricted (admin-only, if implemented)

**Storage Policies:**
- Public read access to profile images
- Upload restricted (admin-only or authenticated users)

## Image Storage

### Supabase Storage

Profile images are stored in Supabase Storage buckets:

**Bucket Structure:**
- `public/profile-images/` - Publicly accessible profile images

**CDN Proxy:**
The application uses a Supabase Edge Function (`cdn-proxy`) to:
- Optimize images on-the-fly
- Convert to WebP format
- Resize images
- Add caching headers

**Usage:**
```javascript
const renderUrl = `${projectUrl}/storage/v1/render/image/public/${relPath}?width=${width}&quality=${quality}&format=webp`;
```

**Image URLs:**
Profile images include version suffixes for cache busting:
```javascript
const versionSuffix = profile.last_signed_at
  ? `?v=${encodeURIComponent(profile.last_signed_at)}`
  : "";
const finalUrl = rawUrl + versionSuffix;
```

## Data Integrity

### Constraints

1. **Unique Address**: Each Zcash address can only be associated with one profile
2. **Foreign Keys**: `zcasher_links.zcasher_id` and `zcasher_items.zcasher_id` reference `zcasher.id`
3. **Cascade Deletes**: Links and items are deleted when a profile is deleted (if implemented)

### Validation

**Client-Side:**
- Address format validation using `validateZcashAddress` utility
- Name uniqueness checks before submission
- URL validation for links

**Server-Side:**
- Database constraints enforce data integrity
- RLS policies prevent unauthorized access
- Address uniqueness enforced at database level

## Performance Considerations

### Query Optimization

1. **Pagination**: Large datasets loaded in chunks (1000 records)
2. **Selective Fields**: Only fetch required columns (`select("id, name, address")`)
3. **Indexes**: Database indexes on frequently queried columns
4. **Bulk Operations**: Use `Promise.all()` for parallel queries

### Caching

1. **Client Cache**: In-memory cache reduces API calls
2. **CDN Cache**: Images cached via CDN proxy with 24-hour TTL
3. **Browser Cache**: Static assets cached by browser

## Migration Notes

If you need to modify the schema:

1. **Add Columns**: Use Supabase migration tool or SQL editor
2. **Update Views**: Modify views to include new columns
3. **Update Application**: Update TypeScript types (if used) and component code
4. **Test**: Verify queries and UI still work correctly

## Future Enhancements

### Potential Schema Changes

1. **Audit Logging**: Add `audit_log` table to track profile changes
2. **Notifications**: Add `notifications` table for user alerts
3. **Preferences**: Add `user_preferences` table for user settings
4. **Activity Feed**: Add `activity` table to track profile updates

### Performance Improvements

1. **Materialized Views**: Cache expensive aggregations
2. **Full-Text Search**: Add PostgreSQL full-text search for names
3. **Read Replicas**: Use read replicas for heavy read workloads
4. **Connection Pooling**: Configure connection pooling for high traffic
