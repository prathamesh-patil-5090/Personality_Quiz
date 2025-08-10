# Anti-Fingerprinting Vite + React App

A comprehensive Vite + React web application specifically designed to evade technology fingerprinting tools like Wappalyzer, BuiltWith, WhatRuns, and similar scanners.

## 🔒 Anti-Fingerprinting Features Implemented

### 1. **Asset Obfuscation**
- ✅ Hashed filenames for all JS, CSS, and static assets
- ✅ No obvious framework identifiers in file names
- ✅ Custom chunk naming to avoid `vendor` or `react` patterns
- ✅ Separated asset types into obfuscated directories

### 2. **DOM Marker Removal**
- ✅ Custom mount point ID (`app-container` instead of `root`)
- ✅ ReactDOM.createRoot uses the custom ID
- ✅ No React-specific DOM attributes or comments

### 3. **Metadata and Headers**
- ✅ Removed Vite branding from HTML
- ✅ Generic meta tags and title
- ✅ Vercel headers configuration removes `X-Powered-By`
- ✅ Custom server headers for obfuscation

### 4. **Delayed/Conditional Loading**
- ✅ React app loads only after user interaction
- ✅ Dynamic imports for heavy components
- ✅ Lazy loading with custom suspense boundaries
- ✅ Interaction-based feature loading

### 5. **Aggressive Minification**
- ✅ Terser with maximum compression settings
- ✅ Console statements removal in production
- ✅ Variable and function name mangling
- ✅ Comment and whitespace stripping

### 6. **Bot Detection**
- ✅ Server-side User-Agent analysis
- ✅ Client-side headless browser detection
- ✅ Honeypot API routes with fake technology information
- ✅ Suspicious pattern matching for scanning tools

### 7. **Additional Security Measures**
- ✅ Right-click and keyboard shortcut disabling
- ✅ Console method obfuscation
- ✅ DevTools detection
- ✅ Misleading robots.txt entries

## 📁 File Structure

```
├── api/
│   ├── index.js           # Main bot detection API
│   └── tech-stack.js      # Honeypot with fake tech info
├── public/
│   ├── robots.txt         # Bot-confusing entries
│   ├── favicon.ico        # Generic favicon
│   └── 404.html          # Framework-agnostic 404
├── src/
│   ├── components/
│   │   ├── AntiFingerprint.jsx    # Client-side protection
│   │   ├── DelayedFeature.jsx     # Conditional loading demo
│   │   └── HeavyComponent.jsx     # Dynamically loaded component
│   ├── utils/
│   │   └── botDetection.js        # Advanced bot detection
│   ├── App.jsx           # Main app with obfuscated structure
│   ├── main.jsx          # Custom mount point and delayed init
│   └── index.css         # Framework-agnostic styling
├── vite.config.js        # Production-hardened build config
├── vercel.json           # Header removal and API routes
└── package.json          # Clean dependencies
```

## 🚀 Deployment Instructions

### For Vercel:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel:**
   ```bash
   npx vercel --prod
   ```

### Configuration Files:

- **`vercel.json`**: Removes identifying headers and sets up API routes
- **`vite.config.js`**: Configures aggressive minification and asset obfuscation
- **`robots.txt`**: Contains misleading entries to confuse scanners

## 🛡️ How It Evades Detection

### Wappalyzer Evasion:
- No React-specific DOM patterns
- Obfuscated asset names
- Misleading server headers
- Dynamic loading prevents immediate detection

### BuiltWith Evasion:
- Hashed and renamed all build artifacts
- No framework-identifying meta tags
- Custom mount points and component structure
- Bot detection returns fake technology stack

### WhatRuns Evasion:
- Aggressive code minification
- Client-side bot detection
- Delayed script loading
- Console method obfuscation

### General Scanner Evasion:
- User-Agent pattern matching
- Headless browser detection
- Honeypot API routes
- Interaction-required initialization

## 🔧 Key Technical Features

### Build Configuration (`vite.config.js`):
```javascript
// Aggressive minification with Terser
minify: 'terser'
terserOptions: {
  compress: { drop_console: true }
  mangle: { toplevel: true }
}

// Asset obfuscation
chunkFileNames: () => `assets/[hash].js`
entryFileNames: `assets/[hash].js`
assetFileNames: `assets/[hash].[ext]`
```

### Custom Mount Point (`main.jsx`):
```javascript
// Custom ID instead of 'root'
createRoot(document.getElementById('app-container'))

// Delayed initialization
addInteractionListeners()
```

### Bot Detection (`api/index.js`):
```javascript
// Advanced User-Agent analysis
const botPatterns = ['wappalyzer', 'whatruns', 'builtwith', ...]
const isBot = detectBot(userAgent, headers)
```

## 📊 Effectiveness

This implementation makes it extremely difficult for automated tools to:
- Identify React as the frontend framework
- Detect Vite as the build tool
- Determine the hosting platform
- Analyze the technology stack
- Perform automated scanning

The app appears as a vanilla JavaScript website to most fingerprinting tools while maintaining full React functionality for legitimate users.

## ⚠️ Important Notes

- Some anti-fingerprinting measures may affect user experience
- Legitimate users with accessibility tools might be impacted
- Regular updates may be needed as detection tools evolve
- Consider the trade-offs between security and usability

## 🔄 Maintenance

Regularly review and update:
- Bot detection patterns
- User-Agent blacklists
- Asset naming strategies
- Header configurations

This ensures continued effectiveness against evolving fingerprinting techniques.
