# Features Documentation

This document describes all user-facing features and user flows in the Zcash.me application.

## Core Features

### 1. Profile Directory

**Description**: Browse all registered Zcash profiles in a searchable, filterable directory.

**User Flow:**
1. User lands on homepage (`/`)
2. Directory grid displays all profiles alphabetically
3. User can:
   - Scroll through profiles
   - Click on a profile to view details
   - Search by name
   - Filter by verification status, referrals, rankings, or featured status
   - Navigate alphabetically using sidebar or letter grid

**Key Features:**
- **Search Bar**: Real-time search filtering by profile name
- **Alphabet Sidebar**: Quick navigation to profiles starting with specific letters
- **Letter Grid Modal**: Visual grid of all available letters
- **Multi-Filter System**: Toggle filters for:
  - ⭐ Featured profiles
  - 🔥 Top Ranked (top 10 referrers)
  - 🟢 Verified profiles
  - 🔵 All profiles (default)

**Visual Elements:**
- Profile cards show avatar, name, verification badge, join date
- Color-coded cards based on verification and ranking status
- Compact card layout for efficient browsing

### 2. Profile Viewing

**Description**: View detailed information about individual profiles.

**User Flow:**
1. User clicks on a profile card or navigates to `/:username`
2. Full profile view displays with:
   - Large profile image
   - Full name and bio
   - Verification badges
   - Referral ranking badges
   - Zcash address (with copy button)
   - Social media links
   - QR code for address
   - Share button

**Key Features:**
- **URL-Based Navigation**: Each profile has a unique URL slug
- **Slug Generation**: 
  - Verified profiles: `/profile_name`
  - Unverified profiles: `/profile_name-123` (includes ID)
- **Conflict Resolution**: If multiple profiles share the same name, verified takes priority
- **Share Functionality**: 
  - Native Web Share API (mobile)
  - Copy URL to clipboard (desktop)
- **QR Code**: Scan QR code to send Zcash to profile address

**Profile Information Displayed:**
- Profile image (lazy-loaded, optimized)
- Display name
- Biography (if provided)
- Verification status (badge with check count)
- Referral rankings (alltime, weekly, monthly, daily)
- Join date
- Zcash address
- Social links (with verification status)
- Awards section (if ranked in top 10)

### 3. Profile Creation

**Description**: Multi-step form to create a new profile in the directory.

**User Flow:**
1. User clicks "Join" or "Add Profile" button
2. **Step 1: Name**
   - Enter display name
   - Real-time conflict checking (warns if name taken by verified profile)
   - Allows letters, numbers, underscores, emojis
3. **Step 2: Address**
   - Enter Zcash address
   - Real-time validation (must be sapling or unified address)
   - Duplicate address checking
   - Rejects transparent addresses
4. **Step 3: Referrer** (Optional)
   - Search and select referring profile
   - Autocomplete dropdown with verification badges
   - Helps with referral tracking
5. **Step 4: Links** (Optional)
   - Add social media links (X, GitHub, custom URLs)
   - Multiple link fields (add/remove dynamically)
   - URL validation
6. **Step 5: Review**
   - Review all entered information
   - Submit profile
7. Profile created → Navigate to new profile page

**Validation:**
- Name must be unique among verified profiles (case-insensitive, spaces = underscores)
- Address must be valid Zcash address (sapling or unified)
- Address must be unique (one address per profile)
- Links must be valid HTTP/HTTPS URLs if provided

**Post-Creation:**
- Cache is cleared
- Directory reloads
- User is redirected to new profile page

### 4. Profile Verification System

**Description**: Visual indicators showing profile trustworthiness.

**Verification Types:**
1. **Address Verification**: Address is verified via Zcash transaction
2. **Link Verification**: Social media links are verified

**Visual Indicators:**
- **VerifiedBadge**: Green badge with check marks (1-3)
  - 1 check = Address verified
  - 2 checks = Address + 1 link verified
  - 3 checks = Address + 2+ links verified
- **Card Styling**: 
  - Verified profiles have green borders
  - High-tier verified (3+) have gradient shimmer effect
- **Profile Status**: "Verified" or "Unverified" label

**How Verification Works:**
- Verification is performed via Zcash transactions (not in this frontend)
- Frontend displays verification status from database
- Badges update based on `address_verified` and `zcasher_links.is_verified` flags

### 5. Referral Ranking System

**Description**: Leaderboard system tracking top referrers in the network.

**Ranking Periods:**
- **All-Time**: Total referrals since beginning
- **Weekly**: Referrals in current week
- **Monthly**: Referrals in current month
- **Daily**: Referrals in current day

**Visual Indicators:**
- **ReferRankBadge**: Shows rank 1-10
  - 🥇 Gold for #1
  - 🥈 Silver for #2
  - 🥉 Bronze for #3
  - Numbered badges for #4-10
- **ReferRankBadgeMulti**: Period-specific badges
  - 🏆 All-Time (amber)
  - 📅 Weekly (sky blue)
  - 🗓️ Monthly (violet)
  - Expandable text showing period

**Display Locations:**
- Profile cards (compact view)
- Full profile view
- Awards section (when ranked)
- Leaderboard tables (in stats)

**Ranking Logic:**
- Based on `referred_by_zcasher_id` relationships
- Only top 10 referrers get badges
- Rankings update based on referral counts

### 6. Statistics Dashboard

**Description**: Comprehensive statistics about the network growth and activity.

**User Flow:**
1. User clicks "Show stats" button in directory
2. Stats panel expands showing:
   - Network summary
   - Growth charts
   - Leaderboards

**Sections:**

#### Network Summary
- Total profiles
- Verified profiles
- Referred profiles
- Verified + Referred profiles
- Other profiles (neither verified nor referred)

#### Growth Charts
- **Time Period Tabs**: Daily, Weekly, Monthly
- **Chart Types**:
  - Line chart: Growth over time
  - Bar chart: Category breakdown
- **Chart Modes**:
  - Totals: Absolute numbers
  - Percentages: Relative proportions
- **Chart Scale**:
  - Absolute: Raw numbers
  - Percent: Percentage changes

#### Leaderboard
- Top referrers table
- Columns: Rank, Name, Total Referrals, Verified Referrals, Verification %
- Sortable by time period (daily, weekly, monthly, alltime)
- Expandable to show more entries

**Features:**
- Toggle visibility of charts, summary, and leaderboard
- Responsive charts that adapt to screen size
- Export-friendly format (future enhancement)

### 7. Zcash Payment URI Generation

**Description**: Generate Zcash payment URIs and QR codes for sending payments or updating profiles.

**User Flow:**

#### Note Mode (General Payment)
1. User selects "Note" mode
2. Enters recipient address (or uses selected profile)
3. Enters amount (optional)
4. Enters memo/note text
5. QR code and URI are generated
6. User can:
   - Scan QR code with wallet
   - Copy URI to clipboard
   - Open wallet directly (if supported)

#### Sign-In Mode (Profile Update)
1. User clicks "Edit Profile" on their profile
2. Makes edits in ProfileEditor
3. Clicks "Sign In" mode
4. System generates URI with:
   - Sign-in address (special system address)
   - Minimum amount (0.001 ZEC)
   - Encoded memo with edit instructions
5. User sends transaction
6. Backend processes transaction and updates profile

**URI Format:**
```
zcash:ADDRESS?amount=AMOUNT&memo=BASE64URL_ENCODED_MEMO
```

**Features:**
- QR code generation for easy scanning
- Copy to clipboard
- Amount validation (minimum for sign-in mode)
- Memo encoding (base64url)
- Integration with ProfileEditor for pending edits
- Auto-sync with selected profile

### 8. Profile Editing

**Description**: Edit profile information via Zcash transactions.

**User Flow:**
1. User views their own profile
2. Clicks "Edit Profile" or menu → "Edit Profile"
3. ProfileEditor opens with current values
4. User edits:
   - Name
   - Bio (max 100 characters)
   - Profile image URL
   - Links (add/remove)
5. Changes are stored as "pending edits"
6. User switches to "Sign In" mode in ZcashFeedback
7. Payment URI is generated with encoded edits
8. User sends Zcash transaction
9. Backend processes transaction and updates profile

**Features:**
- Character counter for bio
- Link management (add/remove fields)
- Real-time preview of changes
- Pending edits state management
- Integration with verification system

**Security:**
- Only profile owner can edit (verified via Zcash transaction signature)
- Changes are encoded in transaction memo
- Backend validates and applies changes

### 9. Alphabetical Navigation

**Description**: Quick navigation to profiles starting with specific letters.

**Features:**
- **Alphabet Sidebar**: 
  - Shows letters that have matching profiles
  - Highlights active letter
  - Click to jump to letter section
  - Auto-hides on small screens or when directory is hidden
- **Letter Grid Modal**: 
  - Grid of all letters
  - Visual indication of letters with profiles
  - Quick access from header button

**Behavior:**
- Sidebar appears when directory is visible
- Scrolls to first profile starting with selected letter
- Updates active letter based on scroll position (if implemented)

### 10. Search Functionality

**Description**: Real-time search filtering of profiles.

**Features:**
- **Search Bar**: Fixed at top of page
- **Real-Time Filtering**: Updates as user types
- **Case-Insensitive**: Searches work regardless of case
- **Name Matching**: Searches profile names
- **Auto-Navigation**: Typing in search navigates to directory view

**Usage:**
- User types in search bar
- Directory filters to matching profiles
- Clears search to show all profiles

### 11. PWA (Progressive Web App)

**Description**: Installable web app with offline capabilities.

**Features:**
- **Installable**: 
  - Mobile: Add to home screen
  - Desktop: Install as app
- **Standalone Mode**: Opens without browser chrome
- **Offline Support**: Assets cached for offline viewing
- **App Icons**: Custom icons for home screen
- **Manifest**: App name, theme colors, display mode

**Installation:**
- **Mobile**: Browser prompts or manual "Add to Home Screen"
- **Desktop**: Install button in browser address bar

**Offline Behavior:**
- Cached assets load offline
- App shell renders
- Data requires internet connection

### 12. Responsive Design

**Description**: Optimized experience across all device sizes.

**Features:**
- **Mobile-First**: Designed for mobile, enhanced for desktop
- **Touch Support**: 
  - Touch-optimized interactions
  - Badge expansions on tap (not just hover)
  - Swipe gestures (future enhancement)
- **Adaptive Layout**: 
  - Grid adjusts to screen size
  - Sidebars hide on small screens
  - Modals adapt to viewport
- **Performance**: 
  - Lazy-loaded images
  - Optimized bundle size
  - Efficient rendering

## User Interaction Patterns

### Navigation
- **URL-Based**: All navigation updates URL (shareable links)
- **Browser History**: Back/forward buttons work correctly
- **Deep Linking**: Direct links to profiles work
- **Smooth Transitions**: Animated route transitions

### Feedback
- **Loading States**: Loading indicators during data fetches
- **Error Messages**: Clear error messages for validation failures
- **Success Feedback**: Toast notifications for successful actions
- **Visual Feedback**: Button states, hover effects, animations

### Accessibility
- **Keyboard Navigation**: All interactive elements keyboard accessible
- **Screen Reader Support**: Semantic HTML and ARIA labels
- **Focus Management**: Logical focus order
- **Color Contrast**: Meets WCAG guidelines

## Future Features

### Planned Enhancements
1. **Real-Time Updates**: Live profile updates via Supabase real-time
2. **Advanced Search**: Filter by multiple criteria simultaneously
3. **Profile Comparisons**: Compare multiple profiles side-by-side
4. **Export Data**: Export directory data as CSV/JSON
5. **Notifications**: Notify users of profile updates
6. **Dark Mode**: Toggle between light and dark themes
7. **Internationalization**: Multi-language support
8. **Analytics**: User behavior tracking and analytics
9. **Profile Verification Flow**: Frontend flow for verifying profiles
10. **Social Features**: Comments, likes, follows (if applicable)
