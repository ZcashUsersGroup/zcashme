# Component Documentation

This document describes the React component hierarchy, responsibilities, and usage patterns in the Zcash.me application.

## Component Hierarchy

```
App
└── FeedbackProvider (Context)
    └── Directory
        ├── ProfileCard (compact)
        ├── ProfileCard (full view)
        ├── AddUserForm (modal)
        ├── ZcashStats
        ├── ZcashFeedback
        ├── AlphabetSidebar
        └── LetterGridModal
```

## Core Components

### `App.jsx`

**Purpose**: Root component with routing configuration

**Responsibilities:**
- Sets up React Router with BrowserRouter
- Provides FeedbackContext to entire app
- Handles search query state
- Renders Directory component for all routes (wildcard routing)

**Key Features:**
- Single wildcard route (`/*`) handles all paths
- Search query state management
- Navigates to root when search is active

**Usage:**
```jsx
<FeedbackProvider>
  <Routes>
    <Route path="/*" element={<Directory />} />
  </Routes>
</FeedbackProvider>
```

### `Directory.jsx`

**Purpose**: Main directory view and profile grid container

**Responsibilities:**
- Displays profile grid or single profile view
- Manages search and filtering
- Handles profile selection and routing
- Coordinates visibility of stats, forms, and modals

**State Management:**
- `search` - Search query string
- `activeLetter` - Currently selected alphabet letter
- `isJoinOpen` - AddUserForm modal visibility
- `showStats` - ZcashStats visibility
- `filters` - Multi-filter state (verified, referred, ranked, featured)

**Key Features:**
- Alphabetical filtering with sidebar
- Multi-filter system (verified, referred, ranked, featured)
- Search functionality
- Letter grid modal for quick navigation
- Profile routing integration

**Dependencies:**
- `useProfiles` - Fetches profile data
- `useProfileRouting` - Handles URL synchronization
- `useAlphaVisibility` - Controls alphabet sidebar visibility
- `useDirectoryVisibility` - Controls directory grid visibility

### `ProfileCard.jsx`

**Purpose**: Displays individual profile information in compact or full view

**Responsibilities:**
- Renders profile information (name, image, badges, links)
- Handles profile interactions (share, copy address, edit)
- Shows verification badges and referral ranks
- Displays profile links and awards

**Props:**
- `profile` (object, required) - Profile data object
- `onSelect` (function) - Callback when profile is selected
- `fullView` (boolean) - Whether to show full or compact view
- `warning` (object, optional) - Warning message and link
- `cacheVersion` (string/number) - Cache busting version for images

**Two Display Modes:**

1. **Compact View** (`fullView={false}`):
   - Small circular avatar (45px)
   - Name with verification badge
   - Join date and referral badges
   - Clickable to expand to full view

2. **Full View** (`fullView={true}`):
   - Large circular avatar (80px)
   - Full name and bio
   - All badges and awards
   - Links section
   - Share and edit buttons
   - QR code for address
   - Menu with additional actions

**Key Features:**
- Lazy-loaded profile images with cache busting
- Verification badge display
- Referral ranking badges (alltime, weekly, monthly, daily)
- Share functionality (Web Share API or copy URL)
- Address copy button
- Profile editor integration
- Awards display (when ranked)

**Color Coding:**
- **Blue**: Default/unranked profiles
- **Green**: Verified profiles
- **Gradient (Green-Orange)**: Verified + Ranked
- **Gradient (Blue-Red/Orange)**: Unverified + Ranked

### `AddUserForm.jsx`

**Purpose**: Multi-step form for creating new profiles

**Responsibilities:**
- Collects profile information (name, address, referrer, links)
- Validates inputs (address format, name uniqueness, URLs)
- Submits profile and links to Supabase
- Handles conflict detection (duplicate names/addresses)

**Form Steps:**
1. **Name** - Profile display name with conflict checking
2. **Address** - Zcash address with format validation
3. **Referrer** - Optional referrer selection (autocomplete)
4. **Links** - Social media and website links
5. **Review** - Final confirmation before submission

**Validation:**
- Name: Required, checked for conflicts with verified profiles
- Address: Required, must be valid Zcash address (sapling or unified), checked for duplicates
- Referrer: Optional, must exist in database
- Links: Optional, must be valid URLs if provided

**Key Features:**
- Animated step transitions (Framer Motion)
- Real-time validation and conflict detection
- Referrer autocomplete dropdown
- Dynamic link fields (add/remove)
- Platform-specific link builders (X, GitHub, etc.)
- Error handling and user feedback

**Post-Submission:**
- Clears cache
- Navigates to new profile page
- Reloads directory data

### `ZcashFeedback.jsx`

**Purpose**: Generates Zcash payment URIs and QR codes for profile updates

**Responsibilities:**
- Generates Zcash payment URIs with memo fields
- Displays QR codes for easy scanning
- Supports both "Note" (general payment) and "Sign In" (profile update) modes
- Integrates with ProfileEditor for pending edits

**Modes:**
1. **Note Mode**: General payment URI with memo
2. **Sign In Mode**: Profile update URI with encoded edit instructions

**Key Features:**
- QR code generation (qrcode.react)
- Payment URI generation (Zcash URI scheme)
- Memo encoding (base64url)
- Copy to clipboard
- Auto-sync with selected profile
- Minimum amount validation for sign-in mode

**URI Format:**
```
zcash:ADDRESS?amount=AMOUNT&memo=MEMO
```

### `ZcashStats.jsx`

**Purpose**: Statistics dashboard showing network growth and leaderboards

**Responsibilities:**
- Displays network-wide statistics
- Shows growth charts (daily, weekly, monthly)
- Renders referral leaderboards
- Provides filtering and view options

**Data Sources:**
- `network_summary` - Aggregate statistics
- `growth_over_time_daily` - Daily growth metrics
- `growth_over_time` - Weekly growth metrics
- `growth_over_time_monthly` - Monthly growth metrics
- `referrer_ranked_*` - Leaderboard views

**Visualizations:**
- Line charts for growth over time
- Bar charts for category breakdowns
- Summary matrices showing profile categories
- Leaderboard tables

**Key Features:**
- Multiple time period views (daily, weekly, monthly)
- Chart mode toggles (totals vs. percentages)
- Summary statistics display
- Top referrers leaderboard
- Responsive charts (Recharts)

## Shared Components

### Badge Components

#### `VerifiedBadge.jsx`

**Purpose**: Displays verification status with animated text

**Props:**
- `verified` (boolean) - Whether profile is verified
- `verifiedCount` (number) - Number of verifications (1-3)
- `compact` (boolean) - Minimal display mode

**Features:**
- Expandable text on hover/touch
- Multiple check icons (1-3 based on verification count)
- Green gradient styling for verified
- Gray styling for unverified
- Touch device support with auto-collapse

**Usage:**
```jsx
<VerifiedBadge verified={true} verifiedCount={2} />
```

#### `ReferRankBadge.jsx`

**Purpose**: Displays referral ranking for top 10 referrers

**Props:**
- `rank` (number) - Ranking (1-10)

**Features:**
- Color coding by rank (gold for #1, silver for #2, bronze for #3)
- Only shows for ranks 1-10
- Medal emojis for top 3

#### `ReferRankBadgeMulti.jsx`

**Purpose**: Displays referral ranking with period indicator

**Props:**
- `rank` (number) - Ranking (1-10)
- `period` (string) - "all", "weekly", or "monthly"
- `alwaysOpen` (boolean) - Keep text expanded

**Features:**
- Period-specific emojis and colors
- Expandable text showing period
- Touch device support

### UI Components

#### `AlphabetSidebar.jsx`

**Purpose**: Sidebar with alphabet letters for quick navigation

**Features:**
- Shows letters that have matching profiles
- Highlights active letter
- Clickable letter navigation
- Scrolls to profiles starting with selected letter

#### `LetterGridModal.jsx`

**Purpose**: Modal grid of all available letters

**Features:**
- Grid layout of letters
- Visual indication of letters with profiles
- Click to navigate to letter
- Closes after selection

#### `VerifiedCardWrapper.jsx`

**Purpose**: Wraps profile cards with verification-based styling

**Props:**
- `verifiedCount` (number) - Number of verifications
- `featured` (boolean) - Whether profile is featured
- `onClick` (function) - Click handler
- `children` (ReactNode) - Card content

**Features:**
- Color-coded borders based on verification count
- Featured profiles get yellow glow
- Hover animations (scale)
- Animated gradient shimmer for high-tier verified profiles

#### `ZcashAddressInput.jsx`

**Purpose**: Input field with Zcash address validation

**Features:**
- Real-time address validation
- Visual feedback for valid/invalid addresses
- Supports all Zcash address types
- Format-specific styling

#### `ProfileEditor.jsx`

**Purpose**: Inline editor for profile fields

**Features:**
- Editable name, bio, image URL, links
- Character counters
- Link management (add/remove)
- Pending edits state management
- Integration with ZcashFeedback for transaction generation

#### `CopyButton.jsx`

**Purpose**: Button that copies text to clipboard

**Features:**
- Visual feedback on copy
- Checkmark icon on success
- Timeout to reset state

#### `Toast.jsx`

**Purpose**: Toast notification component

**Features:**
- Auto-dismiss after timeout
- Manual close button
- Fade in/out animations

#### `HelpIcon.jsx`

**Purpose**: Help icon with tooltip

**Features:**
- Hover/touch to show tooltip
- Positioned tooltip
- Responsive positioning

## Custom Hooks

### `useProfiles.js`

**Purpose**: Fetches and caches all profiles

**Returns:**
- `profiles` (array) - Array of profile objects
- `loading` (boolean) - Loading state

**Features:**
- In-memory caching across remounts
- Pagination support (1000 per page)
- Enriches profiles with referral ranks
- Exports `cachedProfiles` for external access

### `useProfileRouting.js`

**Purpose**: Synchronizes URL and selected profile state

**Parameters:**
- `profiles` - Array of profiles
- `selectedAddress` - Currently selected address
- `setSelectedAddress` - Setter function
- `showDirectory` - Directory visibility state
- `setShowDirectory` - Setter function

**Features:**
- URL → State: Parses URL slugs to select profile
- State → URL: Updates URL when profile selected
- Conflict resolution for duplicate names
- Handles both verified and unverified profile slugs

**Implementation:**
- Uses `useLocation()` from React Router to reactively track URL changes
- The effect that reads the URL depends on `location.pathname`, ensuring it re-runs when the route changes
- This provides immediate UI updates on navigation without requiring page refresh
- Previously, the hook only reacted to profile changes, not URL changes, causing navigation to require a refresh

### `useTouchDevice.js`

**Purpose**: Detects if device supports touch events

**Returns:**
- `isTouchDevice` (boolean) - True if touch-capable

**Usage:**
Used to adjust UI behavior for touch devices (e.g., badge interactions).

### `useAlphaVisibility.js`

**Purpose**: Controls alphabet sidebar visibility

**Parameters:**
- `showDirectory` - Whether directory is visible

**Returns:**
- `showAlpha` (boolean) - Whether to show alphabet sidebar

**Features:**
- Only shows when directory is visible
- Responsive behavior

### `useDirectoryVisibility.js`

**Purpose**: Manages directory grid visibility state

**Returns:**
- `showDirectory` (boolean) - Directory visibility
- `setShowDirectory` (function) - Setter
- `showDirLabel` (boolean) - Label visibility

**Features:**
- Persists scroll position when hiding
- Restores scroll position when showing
- Auto-hides label after timeout

## Utility Functions

### Badge Helpers (`src/lib/badgeHelpers.js`)

**Functions:**
- `getExpandableTextClasses(open, maxWidth)` - Generates CSS classes for expandable text
- `badgeBaseClasses` - Base classes for badge containers
- `badgeContainerClasses` - Common badge container classes
- `createTouchHandler(setOpen, isTouchDevice)` - Touch event handler factory

### Address Validation (`src/utils/zcashAddressUtils.js`)

**Functions:**
- `validateZcashAddress(address)` - Validates Zcash address format

### Other Utilities

- `computeGoodThru.js` - Calculates profile expiration date
- `isNewProfile.js` - Determines if profile is new (< 7 days)

## Component Communication Patterns

### Props Down, Events Up

Standard React pattern:
- Parent passes data down via props
- Child calls callbacks to notify parent

### Context for Global State

`FeedbackContext` provides:
- Selected profile address
- Pending edits
- QR code display control

### Custom Events

Window-level events for cross-component communication:
- `enterSignInMode` - Triggered when entering profile edit mode
- `pendingEditsUpdated` - Broadcasts pending edits changes
- `closeDirectory` - Closes directory view

### URL as Source of Truth

Profile selection is driven by URL:
- User navigates to `/:slug` → Profile selected
- Profile selected → URL updates to `/:slug`
- Browser back/forward works correctly

## Styling Approach

### Tailwind CSS

All components use Tailwind utility classes:
- Utility-first approach
- Responsive design with breakpoint prefixes
- Dark mode support (though currently forced to light mode)

### Framer Motion

Animations for:
- Modal transitions
- Step transitions (AddUserForm)
- Card hover effects
- Badge expansions

### Custom CSS

Minimal custom CSS:
- Global styles in `index.css`
- Component-specific styles via Tailwind classes

## Performance Optimizations

### Memoization

- `useMemo` for expensive computations (filtering, sorting)
- `useCallback` for stable function references

### Lazy Loading

- Images use `loading="lazy"` attribute
- Components could be code-split (not currently implemented)

### Efficient Re-renders

- Context split to prevent unnecessary re-renders
- Local state for UI-only concerns

## Testing Considerations

### Component Testing

Components can be tested with:
- React Testing Library
- Jest
- Mock Supabase client
- Mock hooks

### Integration Testing

Test user flows:
- Profile creation flow
- Profile viewing and navigation
- Search and filtering
- Badge interactions
