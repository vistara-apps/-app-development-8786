# Vercel Deployment Instructions

Follow these steps to deploy the booking integration branch to Vercel:

## Prerequisites
- A Vercel account
- Access to the GitHub repository

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Log in to your Vercel account at https://vercel.com/
2. Click "Add New..." and select "Project"
3. Import the GitHub repository: `vistara-apps/-app-development-8786`
4. Select the branch: `codegen/zaa-793-3d8c2763-integrate-with-booking-software`
5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Clone the repository and checkout the branch:
   ```bash
   git clone https://github.com/vistara-apps/-app-development-8786.git
   cd -app-development-8786
   git checkout codegen/zaa-793-3d8c2763-integrate-with-booking-software
   ```

4. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

5. Follow the prompts to configure your project:
   - Set up and deploy: Yes
   - Link to existing project: Select your project or create a new one
   - Directory: ./
   - Override settings: No

## Vercel Configuration

The repository includes an updated `vercel.json` configuration file with the following settings:

```json
{
  "version": 2,
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": { "cache-control": "public, max-age=31536000, immutable" },
      "continue": true
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

This configuration:
- Specifies Vite as the framework
- Sets the build command and output directory
- Configures proper asset caching
- Ensures all routes are handled correctly for a single-page application

## Troubleshooting Module Script Loading Issues

If you encounter the error: `Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"`, the updated configuration should fix this by:

1. Properly handling asset routes with correct MIME types
2. Using the filesystem handler for static assets
3. Falling back to index.html for client-side routing

## Environment Variables

If your application requires environment variables, you can set them in the Vercel dashboard:
1. Go to your project settings
2. Navigate to the "Environment Variables" tab
3. Add the required variables

## Accessing Your Deployment

Once deployed, Vercel will provide a URL for your application (e.g., `https://your-project.vercel.app`). You can also configure custom domains in the Vercel dashboard.

