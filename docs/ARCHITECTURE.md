# Architecture Overview

This document describes the high-level architecture and design decisions for the Zcash.me application.

## Tech Stack

### Frontend Framework
- **React 19.1.1** - Modern UI library with hooks and functional components
- **Vite 7.1.4** - Fast build tool and development server with HMR (Hot Module Replacement)
- **JavaScript/JSX** - Modern ES6+ syntax with JSX for component templates

### Styling
- **Tailwind CSS 4.1.12** - Utility-first CSS framework for rapid UI development
- **Framer Motion 12.23.24** - Animation library for smooth transitions and interactions

### Backend Integration
- **Supabase** - Backend-as-a-Service providing:
  - PostgreSQL database with real-time capabilities
  - REST API and client SDK
  - Storage for profile images
  - Authentication (if needed in future)

### Routing
- **React Router DOM 7.8.2** - Client-side routing with history API

### Data Visualization
- **Recharts 3.3.0** - Charting library for statistics and growth visualization

### Additional Libraries
- **qrcode.react 4.2.0** - QR code generation for Zcash payment URIs
- **bech32 & bs58check** - Address encoding/decoding utilities for Zcash

## Application Structure

### High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                  Browser                        │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │         React Application                │  │
│  │  (Client-Side Single Page Application)   │  │
│  │                                          │  │
│  │  ┌────────────────────────────────────┐ │  │
│  │  │    Context API (store.jsx)        │ │  │
│  │  │    - Global State Management      │ │  │
│  │  └────────────────────────────────────┘ │  │
│  │                                          │  │
│  │  ┌────────────────────────────────────┐ │  │
│  │  │    React Router                    │ │  │
│  │  │    - Wildcard Routing              │ │  │
│  │  └────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────┘  │
│                    │                           │
│                    ▼                           │
│  ┌──────────────────────────────────────────┐  │
│  │         Supabase Client SDK             │  │
│  │    (REST API + Real-time Subscriptions) │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Supabase Backend   │
         │  - PostgreSQL DB     │
         │  - Storage (images)  │
         │  - Edge Functions    │
         └──────────────────────┘
```

### Application Type
- **Frontend-only SPA** - All business logic runs in the browser
- **Stateless by design** - State is managed in React Context and synced with Supabase
- **Progressive Web App (PWA)** - Can be installed on mobile devices and desktops

## Routing Strategy

### Wildcard Route Pattern

The application uses a single wildcard route (`/*`) that handles both the directory view and individual profile pages:

```jsx
<Routes>
  <Route path="/*" element={<Directory />} />
</Routes>
```

### URL Structure

- **Root (`/`)** - Displays the full directory of profiles
- **Profile Slugs (`/:slug`)** - Individual profile pages using normalized names

### Slug Generation

Slugs are created using a normalization function that:
1. Converts to lowercase
2. Normalizes Unicode characters (NFKC)
3. Replaces spaces with underscores
4. Removes special characters except underscores and dashes

**Examples:**
- `John Doe` → `/john_doe`
- `Verified Profile` → `/verified_profile` (if verified)
- `Unverified Profile` → `/unverified_profile-123` (includes ID to ensure uniqueness)

### Profile Routing Logic

The `useProfileRouting` hook handles:
- **URL → State**: Parsing URL slugs to select the active profile
- **State → URL**: Updating the URL when a profile is selected
- **Conflict Resolution**: When multiple profiles share the same normalized name:
  - Verified profiles take priority
  - Otherwise, oldest profile (lowest ID) is selected
  - Unverified profiles use `/name-id` format

**Implementation Details:**
- Uses `useLocation()` from React Router to reactively track URL changes
- The hook's `useEffect` depends on `location.pathname` to automatically update when the URL changes
- This ensures navigation updates the UI immediately without requiring a page refresh
- Previously used `window.location.pathname` which didn't trigger React re-renders on route changes

## State Management

### Context API (store.jsx)

The application uses React Context API for global state management instead of Redux or Zustand:

**FeedbackContext** provides:
- `selectedAddress` - Currently selected Zcash address
- `setSelectedAddress` - Update selected address
- `forceShowQR` - Force QR code display (for feedback flow)
- `pendingEdits` - Temporary edits before committing via Zcash transaction
- `setPendingEdit` - Update a single pending edit field
- `clearPendingEdits` - Clear all pending edits

**Why Context API?**
- Simple global state needs (no complex async flows)
- Avoids additional dependency overhead
- React-native solution that's easy to understand
- Sufficient for the scope of this application

### Local Component State

Most components manage their own local state using `useState`:
- Form inputs (`AddUserForm`)
- UI toggles (modals, dropdowns, expanded views)
- Search queries and filters
- Loading states

### Data Fetching

- **useProfiles Hook** - Centralized profile data fetching with in-memory caching
- **Direct Supabase Calls** - Components fetch specific data when needed (e.g., profile links)

### Caching Strategy

1. **In-Memory Cache** - `cachedProfiles` variable persists across component remounts
2. **Window Global** - `window.cachedProfiles` allows access from non-React code
3. **Manual Invalidation** - Cache is cleared when new profiles are added

## PWA Configuration

### Progressive Web App Features

The application is configured as a PWA using `vite-plugin-pwa`:

**Manifest Configuration** (`vite.config.js`):
- **Name**: "Zcash.me"
- **Short Name**: "ZcashMe"
- **Display Mode**: `standalone` (feels like native app)
- **Theme Color**: `#ffffff` (white)
- **Start URL**: `/` (root path)
- **Icons**: 192x192, 512x512, and maskable 512x512 PNGs

**Service Worker**:
- **Auto-update**: Service worker updates automatically when new version is deployed
- **Offline Support**: Assets are cached for offline access
- **Background Sync**: Not currently implemented (future enhancement)

**Installation**:
Users can install the app on:
- Mobile devices (iOS Safari, Android Chrome)
- Desktop browsers (Chrome, Edge, etc.)
- The app opens in standalone mode without browser chrome

## Build Configuration

### Vite Configuration

**Plugins**:
1. `@vitejs/plugin-react` - React Fast Refresh and JSX transformation
2. `@tailwindcss/vite` - Tailwind CSS integration
3. `vite-plugin-pwa` - PWA manifest and service worker generation

**Server Configuration**:
- `historyApiFallback: true` - SPA routing support for development

**Build Configuration**:
- Entry point: `index.html`
- Output: `dist/` directory
- Optimizations: Code splitting, tree shaking, minification

### Environment Variables

Vite loads environment variables from `.env.local`:
- `VITE_SUPABASE_URL` - Supabase project URL (required)
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (required)
- `VITE_ADMIN_ADDRESS` - Optional admin address for default selection

## File Organization

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (badges, inputs, modals)
│   └── ...             # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/                # Shared utilities and helpers
├── utils/              # Pure utility functions
├── assets/             # Images, icons, SVG files
├── store.jsx           # Context API store
├── supabase.js         # Supabase client initialization
├── App.jsx             # Root component with routing
├── Directory.jsx       # Main directory view
├── AddUserForm.jsx     # Profile creation form
├── ZcashStats.jsx      # Statistics dashboard
├── ZcashFeedback.jsx   # Payment URI generator
└── main.jsx            # Application entry point
```

## Design Patterns

### Component Patterns
- **Functional Components** - All components use function syntax with hooks
- **Composition over Inheritance** - Components are composed together
- **Custom Hooks** - Reusable logic extracted into hooks (`useProfiles`, `useProfileRouting`, etc.)

### Data Flow
1. **Down**: Props flow down from parent to child
2. **Up**: Callbacks flow up from child to parent
3. **Global**: Context provides shared state across component tree
4. **External**: Supabase provides persistent data storage

### Code Organization Principles
- **Co-location** - Related code lives together
- **Single Responsibility** - Each component/hook has one clear purpose
- **DRY (Don't Repeat Yourself)** - Shared utilities in `/lib` and `/utils`
- **Separation of Concerns** - UI components, business logic, and data fetching are separated

## Performance Considerations

### Optimization Strategies
1. **Code Splitting** - Vite automatically splits vendor and app code
2. **Lazy Loading** - Images use `loading="lazy"` attribute
3. **Memoization** - `useMemo` and `useCallback` prevent unnecessary re-renders
4. **Pagination** - Profile loading uses pagination (1000 per page)
5. **Caching** - Profile data cached in memory to reduce API calls

### Bundle Size
- **Tree Shaking** - Unused code eliminated during build
- **Minification** - Production builds are minified and compressed
- **Asset Optimization** - Images optimized and served via CDN proxy

## Security Considerations

### Client-Side Security
- **Environment Variables** - Secrets stored in `.env.local` (not committed)
- **Input Validation** - All user inputs validated before submission
- **XSS Prevention** - React automatically escapes content
- **CORS** - Supabase handles CORS configuration

### Supabase Security
- **Row Level Security (RLS)** - Database policies control access
- **Anonymous Key** - Public key safe to expose (RLS enforces permissions)
- **Storage Policies** - Image uploads restricted by policy

## Future Architecture Considerations

### Potential Enhancements
1. **State Management** - Consider Zustand or Redux Toolkit if state grows complex
2. **Server-Side Rendering** - Next.js migration for SEO and performance
3. **GraphQL** - Replace REST API if query complexity increases
4. **Web Workers** - Offload heavy computations (e.g., address validation)
5. **Real-time Updates** - Supabase real-time subscriptions for live profile updates
6. **Offline First** - Service Worker with IndexedDB for offline functionality
