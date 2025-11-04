# Setup & Configuration Guide

This document provides step-by-step instructions for setting up the Zcash.me application for development and production.

## Prerequisites

### Required Software

- **Node.js**: Version 18.x or higher
  - Download from [nodejs.org](https://nodejs.org/)
  - Verify installation: `node --version`
- **npm**: Comes with Node.js (version 9.x or higher)
  - Verify installation: `npm --version`
- **Git**: For cloning the repository
  - Download from [git-scm.com](https://git-scm.com/)

### Recommended Tools

- **Code Editor**: VS Code, WebStorm, or your preferred editor
- **Browser**: Chrome, Firefox, Edge, or Safari (latest versions)
- **Supabase Account**: For database access

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/ZcashUsersGroup/zcashme
cd zcashme
```

### 2. Install Dependencies

```bash
npm install
```

**Alternative (clean install):**
```bash
npm ci
```
This installs exact versions from `package-lock.json` for reproducible builds.

### 3. Environment Variables Setup

Create a `.env.local` file in the project root:

```bash
# Copy example file (if exists)
cp .env.example .env.local

# Or create new file
touch .env.local
```

Add the following variables:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_ADDRESS=optional-admin-address
```

#### Obtaining Supabase Credentials

1. **Create Supabase Account**: Go to [supabase.com](https://supabase.com) and sign up
2. **Create Project**: Create a new project (or use existing)
3. **Get Credentials**:
   - Navigate to **Settings → API**
   - Copy **Project URL** → use as `VITE_SUPABASE_URL`
   - Copy **`anon` `public` key** → use as `VITE_SUPABASE_ANON_KEY`

#### Optional: Admin Address

If you want a default profile selected on app load:
- Set `VITE_ADMIN_ADDRESS` to a Zcash address
- This address will be pre-selected in the app

### 4. Verify Installation

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

You should see the application running. If you see a blank screen or errors, check the troubleshooting section below.

## Development

### Start Development Server

```bash
npm run dev
```

**Server Options:**
- **Host**: Usually `localhost`
- **Port**: Usually `5173` (Vite auto-selects if busy)
- **HMR**: Hot Module Replacement enabled (changes reflect instantly)

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

**Build Output:**
- `dist/index.html` - Entry HTML file
- `dist/assets/` - Compiled JS, CSS, and assets
- `dist/manifest.webmanifest` - PWA manifest
- `dist/service-worker.js` - Service worker for PWA

### Preview Production Build

```bash
npm run preview
```

This serves the `dist/` directory locally to test the production build.

### Linting

```bash
npm run lint
```

Checks code for linting errors and warnings.

## Project Structure

```
zcashme/
├── public/                 # Static assets (icons, favicons)
│   ├── icon-192.png
│   ├── icon-512.png
│   └── manifest.webmanifest
├── src/                    # Source code
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Shared utilities
│   ├── utils/              # Pure utility functions
│   ├── assets/             # Images, icons, SVG files
│   ├── App.jsx             # Root component
│   ├── Directory.jsx       # Main directory view
│   ├── main.jsx            # Entry point
│   └── supabase.js         # Supabase client
├── docs/                   # Documentation
├── deprecated/             # Deprecated/unused files
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
├── .env.local              # Environment variables (not committed)
└── README.md               # Project README
```

## Configuration

### Vite Configuration

The Vite configuration is in `vite.config.js`:

**Key Settings:**
- **React Plugin**: Fast Refresh enabled
- **Tailwind CSS**: Integrated via Vite plugin
- **PWA Plugin**: Service worker and manifest generation
- **History API Fallback**: Enabled for SPA routing

### Tailwind CSS

Tailwind is configured via `@tailwindcss/vite` plugin. Configuration is in:
- `tailwind.config.js` (if exists)
- Inline in `vite.config.js`

### PWA Configuration

PWA settings are in `vite.config.js` under `VitePWA`:

- **Manifest**: App name, icons, theme colors
- **Service Worker**: Auto-update enabled
- **Icons**: 192x192, 512x512, maskable icons

## Troubleshooting

### Common Issues

#### 1. Blank Screen / "supabaseUrl is required" Error

**Symptom**: Blank screen with console error about missing Supabase URL.

**Solution**:
1. Verify `.env.local` exists in project root
2. Check environment variables are correct:
   ```bash
   # Windows PowerShell
   Get-Content .env.local
   
   # Linux/Mac
   cat .env.local
   ```
3. Restart dev server after creating/modifying `.env.local`
4. Ensure variable names start with `VITE_` prefix

#### 2. Build Errors

**Symptom**: `npm run build` fails with errors.

**Solutions**:
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Check Node.js version (requires 18+):
  ```bash
  node --version
  ```
- Clear Vite cache:
  ```bash
  rm -rf node_modules/.vite
  ```

#### 3. Port Already in Use

**Symptom**: "Port 5173 is already in use" error.

**Solutions**:
- Use a different port:
  ```bash
  npm run dev -- --port 3000
  ```
- Kill process using port 5173:
  ```bash
  # Windows
  netstat -ano | findstr :5173
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -ti:5173 | xargs kill
  ```

#### 4. Module Not Found Errors

**Symptom**: Import errors like "Cannot find module 'X'".

**Solutions**:
- Reinstall dependencies:
  ```bash
  npm install
  ```
- Check if package is in `package.json`
- Clear node_modules cache

#### 5. Images Not Loading

**Symptom**: Profile images show as broken or don't load.

**Solutions**:
- Check Supabase Storage bucket configuration
- Verify image URLs in database are correct
- Check CORS settings in Supabase
- Verify CDN proxy function is deployed

#### 6. Routing Not Working

**Symptom**: Direct URLs return 404 or don't navigate correctly, OR URL changes but page content doesn't update until refresh.

**Solutions**:
- Verify `historyApiFallback: true` in `vite.config.js`
- For production, configure server to serve `index.html` for all routes
- Check React Router version compatibility
- **URL Changes But Page Doesn't Update**: This was fixed by using `useLocation()` hook in `useProfileRouting`. The hook now properly reacts to URL changes using `location.pathname` in the dependency array, ensuring the page updates immediately when navigating without requiring a refresh.

### Debugging Tips

#### Enable Verbose Logging

Add to `vite.config.js`:
```javascript
export default defineConfig({
  // ... existing config
  logLevel: 'info', // or 'verbose'
})
```

#### Browser DevTools

- **Console**: Check for JavaScript errors
- **Network Tab**: Verify API calls and responses
- **Application Tab**: Check service worker, cache, localStorage
- **React DevTools**: Install browser extension for React debugging

#### Supabase Debugging

- Check Supabase dashboard for:
  - Database query logs
  - API request logs
  - Storage access logs
- Verify RLS policies allow public reads
- Check environment variables match Supabase project

## Production Deployment

### Build Process

1. **Set Production Environment Variables**:
   ```bash
   # Create .env.production (or use CI/CD secrets)
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Test Production Build**:
   ```bash
   npm run preview
   ```

### Deployment Options

#### Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Add environment variables in Vercel dashboard

#### Netlify

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Deploy:
   ```bash
   netlify deploy --prod
   ```

3. Configure redirects in `netlify.toml`:
   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### GitHub Pages

1. Install `gh-pages`:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add to `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

#### Traditional Hosting

1. Build:
   ```bash
   npm run build
   ```

2. Upload `dist/` contents to web server

3. Configure server to:
   - Serve `index.html` for all routes (SPA routing)
   - Enable HTTPS
   - Set proper cache headers

### Post-Deployment Checklist

- [ ] Environment variables set correctly
- [ ] Build succeeds without errors
- [ ] All routes work (SPA routing configured)
- [ ] Service worker registers correctly
- [ ] PWA installable
- [ ] Images load correctly
- [ ] API calls work (CORS configured)
- [ ] HTTPS enabled
- [ ] Analytics/tracking configured (if applicable)

## Development Workflow

### Making Changes

1. **Create Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**: Edit files in `src/`

3. **Test Locally**: `npm run dev` and verify changes

4. **Lint**: `npm run lint` (fix any errors)

5. **Build**: `npm run build` (ensure no build errors)

6. **Commit**: `git commit -m "feat: your feature description"`

7. **Push**: `git push origin feature/your-feature-name`

### Code Style

- **JavaScript/JSX**: Follow ESLint rules
- **Formatting**: Prettier (if configured) or consistent formatting
- **Naming**: 
  - Components: PascalCase (`ProfileCard`)
  - Functions: camelCase (`handleSubmit`)
  - Constants: UPPER_SNAKE_CASE (`MIN_SIGNIN_AMOUNT`)

### Testing

Currently, the project doesn't have automated tests. Consider adding:
- Unit tests (Jest + React Testing Library)
- Integration tests
- E2E tests (Playwright or Cypress)

## Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)

## Getting Help

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check `docs/` folder for detailed guides
- **Community**: Reach out to Zcash Users Group
