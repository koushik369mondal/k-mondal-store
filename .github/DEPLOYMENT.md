# Deployment Guide

## CI/CD Pipeline Overview

This project uses GitHub Actions for continuous integration and deployment. The pipeline includes:

### 1. CI Pipeline (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

**Jobs:**

- **Backend CI**: Tests backend on Node.js 18.x and 20.x

  - Installs dependencies
  - Runs security audit
  - Validates code syntax
  - Creates build artifacts

- **Frontend CI**: Tests frontend on Node.js 18.x and 20.x

  - Installs dependencies
  - Runs security audit
  - Builds production bundle
  - Creates distribution artifacts

- **Code Quality**: Checks code quality standards

### 2. CD Pipeline (`cd.yml`)

Runs on push to `main` branch or manually triggered.

**Jobs:**

- **Deploy Backend**: Creates deployment package
- **Deploy Frontend**: Builds and prepares frontend for deployment
- **Notification**: Sends deployment status updates

### 3. Dependency Update Check (`dependency-update.yml`)

Runs weekly to check for dependency updates and security issues.

---

## Setup Instructions

### Required GitHub Secrets

Navigate to your repository → Settings → Secrets and Variables → Actions

#### For Basic Deployment:

```
# Backend Environment
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend Environment (if needed)
VITE_API_URL=https://your-backend-api.com
```

#### For Server Deployment (SSH):

```
SERVER_HOST=your-server-ip
SERVER_USERNAME=your-ssh-username
SERVER_SSH_KEY=your-private-ssh-key
```

#### For Vercel:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

#### For Netlify:

```
NETLIFY_AUTH_TOKEN=your-netlify-token
NETLIFY_SITE_ID=your-site-id
```

#### For AWS S3/CloudFront:

```
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id
```

---

## Deployment Options

### Option 1: Manual Deployment

#### Backend:

1. Download artifact from GitHub Actions
2. Extract to server
3. Install dependencies: `npm install --production`
4. Set environment variables
5. Start with PM2: `pm2 start server.js --name k-mondal-backend`

#### Frontend:

1. Build locally: `npm run build`
2. Upload `dist/` folder to hosting service
3. Configure web server (nginx/Apache)

### Option 2: Platform Deployments

#### Vercel (Frontend):

1. Uncomment Vercel section in `cd.yml`
2. Add secrets to GitHub
3. Push to main branch

#### Heroku (Backend):

```bash
heroku create k-mondal-backend
heroku config:set MONGODB_URI=... JWT_SECRET=...
git push heroku main
```

#### Railway (Full Stack):

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

#### DigitalOcean App Platform:

1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

---

## Health Checks

Health check endpoint for monitoring:

- Backend: `http://localhost:5000/health`

---

## Monitoring & Logs

### View GitHub Actions Logs:

- Go to repository → Actions tab
- Click on workflow run
- View detailed logs for each job

### PM2 Logs (if using PM2):

```bash
pm2 logs k-mondal-backend
pm2 logs k-mondal-frontend
```

---

## Rollback Strategy

### GitHub Actions:

1. Go to Actions → CD Pipeline
2. Re-run previous successful workflow

### Manual:

1. Download previous artifact
2. Deploy previous version
3. Restart services

---

## Troubleshooting

### CI Pipeline Fails:

- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check security audit results

### Deployment Fails:

- Verify all secrets are set correctly
- Check server connectivity
- Verify environment variables
- Check disk space and permissions

---

## Best Practices

1. **Always test locally before pushing**
2. **Use feature branches for development**
3. **Review security audit results**
4. **Keep dependencies updated**
5. **Monitor deployment logs**
6. **Set up alerts for failures**
7. **Regular backups of database**
8. **Use environment-specific configs**

---

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)

---

## Support

For deployment issues, contact: kmondalstore@gmail.com
