# 🚀 Deployment Checklist - SPA Routing Fix

## ✅ Pre-Deployment Checklist

### 1. **File Location Verification**

- [ ] `render.yaml` is in **repository root** (not in `frontend/` folder)
- [ ] `_redirects` file exists in `frontend/public/` (for Netlify backup)

### 2. **Configuration Verification**

- [ ] `render.yaml` contains correct rewrite rule:
  ```yaml
  routes:
    - type: rewrite
      source: /(.*)
      destination: /index.html
  ```
- [ ] Build command points to correct directory:
  ```yaml
  buildCommand: cd frontend && npm install && npm run build
  ```
- [ ] Static publish path is correct:
  ```yaml
  staticPublishPath: ./frontend/dist
  ```

### 3. **React Router Setup**

- [ ] Using `BrowserRouter` (not `HashRouter`)
- [ ] Base path is set to `/` (default)
- [ ] All routes are defined correctly

### 4. **Environment Variables**

- [ ] `VITE_API_URL` is set correctly in Render dashboard
- [ ] Backend CORS allows frontend domain

---

## 🔧 Deployment Steps

### **Option A: Using render.yaml (Recommended)**

1. **Commit the root-level render.yaml**:

   ```bash
   git add render.yaml
   git commit -m "fix: Add render.yaml to root for SPA routing"
   git push origin main
   ```

2. **Remove old frontend/render.yaml** (if exists):

   ```bash
   git rm frontend/render.yaml
   git commit -m "chore: Remove duplicate render.yaml from frontend"
   git push origin main
   ```

3. **Trigger Render deployment**:
   - Render will auto-detect the `render.yaml`
   - Or manually trigger from dashboard

4. **Verify deployment**:
   ```bash
   node verify-spa-routing.js https://your-app.onrender.com
   ```

---

### **Option B: Using Render Dashboard**

If not using `render.yaml`, configure manually:

1. **Go to Render Dashboard** → Your Service → Settings

2. **Set Build & Deploy**:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

3. **Add Rewrite Rule**:
   - Go to **Redirects/Rewrites**
   - Add rule:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Type**: Rewrite (200)

4. **Save and Redeploy**

---

### **Option C: Express Backend Serves Frontend**

Use this for a **single deployment**:

1. **Update backend/package.json**:

   ```json
   {
     "scripts": {
       "start": "node server-with-frontend.js",
       "build": "cd ../frontend && npm install && npm run build"
     }
   }
   ```

2. **Update backend environment**:

   ```env
   NODE_ENV=production
   ```

3. **Deploy as single Node.js service**:

   ```yaml
   services:
     - type: web
       name: k-mondal-store
       env: node
       buildCommand: cd backend && npm install && npm run build
       startCommand: cd backend && npm start
   ```

4. **Update frontend API URL** to same domain:
   ```javascript
   // frontend/.env.production
   VITE_API_URL=/api
   ```

---

## 🧪 Testing Checklist

After deployment:

### **Manual Testing**

- [ ] Visit homepage: `https://your-app.onrender.com/`
- [ ] Navigate to product: `https://your-app.onrender.com/product/123`
- [ ] **Refresh the page** (Ctrl+R or F5)
- [ ] Should stay on product page (not 404)
- [ ] Test other routes: `/cart`, `/login`, `/admin`

### **Automated Testing**

```bash
# Run verification script
node verify-spa-routing.js https://your-app.onrender.com
```

### **Browser Testing**

- [ ] Open DevTools → Network tab
- [ ] Refresh deep route
- [ ] Should see `200` for `index.html` (not 404)
- [ ] Check console for React errors

---

## 🐛 Troubleshooting Guide

### ❌ **Still Getting 404**

**Possible Causes**:

1. `render.yaml` not in root
2. Service type is "Web Service" (should be "Static Site")
3. Rewrite rule not applied

**Solutions**:

```bash
# 1. Check file location
ls -la render.yaml  # Should be in root

# 2. Check Render logs for "Rewrite rule applied"
# Go to Render Dashboard → Logs

# 3. Verify service type in Render dashboard
# Should show "Static Site" not "Web Service"
```

---

### ❌ **API Calls Failing**

**Possible Causes**:

1. CORS not configured
2. API URL incorrect
3. Environment variables missing

**Solutions**:

1. **Update backend CORS**:

   ```javascript
   // backend/server.js
   const corsOptions = {
     origin: [
       "http://localhost:3000",
       "https://k-mondal-store-frontend.onrender.com",
     ],
     credentials: true,
   };
   ```

2. **Check frontend API URL**:

   ```javascript
   // frontend/.env.production
   VITE_API_URL=https://k-mondal-store-backend.onrender.com
   ```

3. **Verify environment variables** in Render dashboard

---

### ❌ **Blank Page After Refresh**

**Possible Causes**:

1. JavaScript errors
2. Base path mismatch
3. Assets not loading

**Solutions**:

1. **Check browser console** for errors

2. **Verify base path**:

   ```jsx
   // App.jsx
   <BrowserRouter basename="/">  {/* Should be "/" */}
   ```

3. **Check asset paths** in built files:
   ```bash
   # Check dist/index.html
   # Links should be relative: /assets/... not ./assets/...
   ```

---

## 📊 Deployment Status Check

Use this checklist to verify everything:

```bash
# 1. Check if render.yaml exists in root
[ -f render.yaml ] && echo "✅ render.yaml found" || echo "❌ render.yaml missing"

# 2. Check if build succeeds locally
cd frontend && npm run build && echo "✅ Build successful" || echo "❌ Build failed"

# 3. Preview locally (simulates production)
npm run preview
# Then test: http://localhost:4173/product/123 (refresh)

# 4. Test deployed site
node verify-spa-routing.js https://your-app.onrender.com
```

---

## 📱 Quick Reference

### **Working Configuration (render.yaml)**

```yaml
services:
  - type: web
    name: k-mondal-store-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    routes:
      - type: rewrite
        source: /(.*)
        destination: /index.html
```

### **Working Configuration (Express)**

```javascript
// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}
```

### **Working Configuration (\_redirects for Netlify)**

```
/* /index.html 200
```

---

## ✅ Success Indicators

You'll know it's working when:

1. ✅ Refreshing any route shows the correct page (not 404)
2. ✅ Direct URL access works: `https://app.com/product/123`
3. ✅ Browser back/forward buttons work
4. ✅ No console errors
5. ✅ Verification script shows all tests passed

---

## 🆘 Need Help?

If you're still stuck:

1. **Check Render logs**: Dashboard → Your Service → Logs
2. **Review build output**: Look for "Rewrite rule applied"
3. **Test locally**: `npm run build && npm run preview`
4. **Contact support**: Provide `render.yaml` and error logs

---

**Last Updated**: January 18, 2026
