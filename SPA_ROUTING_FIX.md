# 🚀 SPA Routing Fix for React Router on Render

## 📋 Problem Summary

**Issue**: Refreshing deep routes (e.g., `/product/695dd50d69ad20d362606f79`) works on `localhost` but shows "Not Found" on Render deployment.

**Root Cause**: Production servers don't automatically serve `index.html` for all routes like development servers do. When you refresh a deep route, the server tries to find a file at that path and returns 404.

---

## 🔍 Why This Happens

### **On Localhost (Development)**

- **Vite Dev Server** is configured to serve `index.html` for ALL routes
- It recognizes this is an SPA and handles routing gracefully
- React Router takes over after `index.html` loads

### **On Production (Render)**

- Static file servers return files that exist on disk
- `/product/695dd50d69ad20d362606f79` doesn't exist as a file
- Server returns **404 Not Found**
- React Router never loads, so it can't handle the route

---

## ✅ Solution Options

You have **3 deployment architectures** to choose from:

### **Option 1: Static Site with Render (Recommended for You)**

Your current setup is already correct! If it's still not working, follow these steps:

#### 1️⃣ **Verify render.yaml Location**

**IMPORTANT**: `render.yaml` must be in the **repository root**, not in the `frontend/` folder.

**Move the file:**

```bash
# From frontend/render.yaml → ./render.yaml (root)
mv frontend/render.yaml ./render.yaml
```

Then update the paths:

```yaml
services:
  - type: web
    name: k-mondal-store-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    headers:
      - path: /*
        name: Cache-Control
        value: public, max-age=0, must-revalidate
    routes:
      - type: rewrite
        source: /(.*)
        destination: /index.html
```

#### 2️⃣ **Alternative: Use Render Dashboard Settings**

If you're using Render's web dashboard instead of `render.yaml`:

1. Go to your service settings on Render
2. Under **Redirects/Rewrites**, add:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Type**: Rewrite (200)

---

### **Option 2: Serve Frontend from Express Backend**

If you want a **single deployment** with both frontend and backend:

#### Update `backend/server.js`:

```javascript
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import keepAliveJob from "./config/cron.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://k-mondal-store-frontend.onrender.com",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes - These must come BEFORE static file serving
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res
    .status(200)
    .json({ status: "OK", message: "K Mondal Store API is healthy" });
});

// Serve static files from React app (PRODUCTION ONLY)
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  // Serve static files
  app.use(express.static(frontendPath));

  // SPA Fallback - serve index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// API root endpoint (for development)
app.get("/", (req, res) => {
  res.json({ message: "K Mondal Store API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Start the cron job to keep the server awake
  keepAliveJob.start();
  console.log("[Cron] Keep-alive job started - running every 14 minutes");
});

export default app;
```

**Build script** (add to `backend/package.json`):

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "cd ../frontend && npm install && npm run build"
  }
}
```

**Render configuration** (single service):

```yaml
services:
  - type: web
    name: k-mondal-store
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
```

---

### **Option 3: Netlify Deployment (Alternative Platform)**

If you want to use Netlify instead, your `_redirects` file is already correct!

#### Deploy to Netlify:

1. **Install Netlify CLI**:

   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**:
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir=dist
   ```

Your `_redirects` file will work automatically:

```
/* /index.html 200
```

---

## 🎯 Recommended Solution for Your Setup

Based on your current architecture (separate frontend/backend deployments), I recommend:

### **Use render.yaml in Repository Root**

1. **Move `render.yaml` to root**:

   ```bash
   # If it's currently in frontend/
   mv frontend/render.yaml ./render.yaml
   ```

2. **Update render.yaml**:

   ```yaml
   services:
     - type: web
       name: k-mondal-store-frontend
       env: static
       buildCommand: cd frontend && npm install && npm run build
       staticPublishPath: ./frontend/dist
       headers:
         - path: /*
           name: Cache-Control
           value: public, max-age=0, must-revalidate
       routes:
         - type: rewrite
           source: /(.*)
           destination: /index.html
   ```

3. **Commit and push**:

   ```bash
   git add render.yaml
   git commit -m "fix: Move render.yaml to root for proper SPA routing"
   git push
   ```

4. **Redeploy on Render** (automatic if connected to GitHub)

---

## 🛠️ Debugging Steps

If it still doesn't work after the fix:

### 1. Check Render Logs

```bash
# Look for:
# - Build success messages
# - "Rewrite rule applied" messages
# - Any 404 errors
```

### 2. Test Build Locally

```bash
cd frontend
npm run build
npm run preview  # Vite's preview server simulates production
```

Then visit `http://localhost:4173/product/someid` and refresh.

### 3. Verify Render Service Type

- Ensure it's set to **"Static Site"** not "Web Service"
- Check that `staticPublishPath` points to `dist` folder

### 4. Check React Router Configuration

Ensure you're using `BrowserRouter` (not `HashRouter`):

```jsx
// ✅ Correct (you're already using this)
import { BrowserRouter as Router } from "react-router-dom";

// ❌ Wrong (creates URLs like /#/product/123)
import { HashRouter as Router } from "react-router-dom";
```

---

## 📊 Comparison Table

| Method                        | Pros                       | Cons                 | Use Case         |
| ----------------------------- | -------------------------- | -------------------- | ---------------- |
| **Static Site (render.yaml)** | Fast, CDN cached, cheap    | Separate deployments | Current setup    |
| **Express Serves Frontend**   | Single deployment          | Slower, no CDN       | Simple projects  |
| **Netlify**                   | Super easy, auto-redirects | Different platform   | Migration option |

---

## 🔐 Best Practices

### 1. **Always Use a Base Path in Router**

```jsx
// In main.jsx or App.jsx
<BrowserRouter basename="/">
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/product/:id" element={<ProductDetailsPage />} />
  </Routes>
</BrowserRouter>
```

### 2. **Set Proper Cache Headers**

Already added to your `render.yaml`:

```yaml
headers:
  - path: /*
    name: Cache-Control
    value: public, max-age=0, must-revalidate
```

### 3. **Handle 404s Gracefully**

```jsx
// Add a catch-all route
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/product/:id" element={<ProductDetailsPage />} />
  {/* ... other routes ... */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### 4. **Test Production Builds Locally**

```bash
npm run build
npm run preview  # Test before deploying
```

---

## ✅ Verification Checklist

After applying the fix:

- [ ] `render.yaml` is in repository root (or dashboard settings configured)
- [ ] Rewrite rule is set to `/(.*) → /index.html`
- [ ] Build completes successfully on Render
- [ ] Refresh `/product/:id` works
- [ ] Direct URL access works
- [ ] Browser back/forward buttons work
- [ ] No console errors

---

## 🆘 Still Having Issues?

If none of these work:

1. **Check Render Service Logs**: Look for rewrite rule application
2. **Verify DNS/CDN**: Clear Cloudflare/CDN cache if applicable
3. **Contact Render Support**: Provide them with your `render.yaml`
4. **Try Netlify**: Your `_redirects` file is already perfect for it

---

## 📚 Additional Resources

- [Render Static Site Rewrites](https://render.com/docs/static-sites#spa-fallback)
- [React Router DOM Docs](https://reactrouter.com/en/main)
- [Vite Production Deployment](https://vitejs.dev/guide/static-deploy.html)

---

**Last Updated**: January 18, 2026
