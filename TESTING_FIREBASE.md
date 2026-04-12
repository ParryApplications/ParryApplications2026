# Testing Firebase "Become a Tutor" Visibility Feature

## Problem
When opening the website directly from `file://` protocol (double-clicking HTML files), Firebase cannot connect properly due to CORS restrictions. This causes the "Become a Tutor" visibility feature to not work correctly.

## Solution: Test with a Local Web Server

### Option 1: Using Python (Recommended for Quick Testing)

**If you have Python 3 installed:**
```bash
cd NewPortfolio
python3 -m http.server 8000
```

**If you have Python 2 installed:**
```bash
cd NewPortfolio
python -m SimpleHTTPServer 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 2: Using Node.js http-server

**Install http-server globally:**
```bash
npm install -g http-server
```

**Run the server:**
```bash
cd NewPortfolio
http-server -p 8000
```

Then open your browser and go to: `http://localhost:8000`

### Option 3: Using VS Code Live Server Extension

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 4: Deploy to Firebase Hosting (Production Testing)

```bash
cd NewPortfolio
firebase init hosting
# Select your project: parryapplications2026
# Set public directory: . (current directory)
# Configure as single-page app: No
# Set up automatic builds: No
# Don't overwrite existing files

firebase deploy --only hosting
```

## How to Test the Feature

### 1. Set Firebase Database Value

Go to Firebase Console:
- Navigate to: https://console.firebase.google.com
- Select project: **parryapplications2026**
- Go to **Realtime Database**
- Add/Edit the node: `BecomeATutor`

### 2. Test with `false` value

Set in Firebase:
```json
{
  "BecomeATutor": false
}
```

**Expected Result:**
- ❌ "Become a Tutor" button in navigation should be **HIDDEN**
- ❌ "Become a Tutor" section on services.html should be **HIDDEN**
- ❌ Footer links to "Become a Tutor" should be **HIDDEN**
- Console log: "Tutor vacancy not available - elements hidden"

### 3. Test with `true` value

Set in Firebase:
```json
{
  "BecomeATutor": true
}
```

**Expected Result:**
- ✅ "Become a Tutor" button in navigation should be **VISIBLE**
- ✅ "Become a Tutor" section on services.html should be **VISIBLE**
- ✅ Footer links to "Become a Tutor" should be **VISIBLE**
- Console log: "Tutor vacancy available - elements shown"

### 4. Test with no value (null/undefined)

Delete the `BecomeATutor` node from Firebase.

**Expected Result:**
- ✅ All elements should be **VISIBLE** (default behavior)
- Console log: "Tutor vacancy available - elements shown"

## Checking Console Logs

1. Open browser Developer Tools (F12 or Right-click → Inspect)
2. Go to **Console** tab
3. Look for messages:
   - "Firebase initialized successfully"
   - "Tutor vacancy available - elements shown" OR
   - "Tutor vacancy not available - elements hidden"

## Troubleshooting

### Issue: Elements still visible when BecomeATutor = false

**Possible causes:**
1. Not testing on a web server (using file:// protocol)
2. Firebase database rules blocking read access
3. Browser cache - try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**Solution:**
- Use one of the local server options above
- Check Firebase Database Rules:
  ```json
  {
    "rules": {
      ".read": true,
      ".write": true
    }
  }
  ```

### Issue: Console shows "Error checking tutor vacancy"

**Possible causes:**
1. Firebase not initialized properly
2. Database rules blocking access
3. Network connectivity issues

**Solution:**
- Check Firebase configuration in `js/firebase-config.js`
- Verify database URL is correct
- Check Firebase Database Rules allow read access

## Current Implementation

The feature works as follows:

1. **On page load**, `checkAndUpdateTutorButton()` function is called
2. Function queries Firebase for `BecomeATutor` value
3. Based on the value:
   - `false` → Hide all "Become a Tutor" elements
   - `true` or `null` → Show all "Become a Tutor" elements
4. On error → Default to showing elements (fail-safe)

## Files Involved

- [`js/firebase-config.js`](js/firebase-config.js) - Contains `checkTutorVacancy()` function
- [`js/main.js`](js/main.js) - Contains `checkAndUpdateTutorButton()` function
- All HTML files with "Become a Tutor" button in navigation
- [`services.html`](services.html) - Contains the "Become a Tutor" section (id="become-tutor")
