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

The repository already includes a `vercel.json` configuration file with the following settings:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

This configuration:
- Uses the static build preset for Vite
- Sets the output directory to `dist`
- Configures routes to support client-side routing

## Environment Variables

If your application requires environment variables, you can set them in the Vercel dashboard:
1. Go to your project settings
2. Navigate to the "Environment Variables" tab
3. Add the required variables

## Troubleshooting

- **Build Errors**: Check the build logs in the Vercel dashboard for any errors
- **Routing Issues**: Ensure the routes in `vercel.json` are correctly configured
- **API Connection Issues**: Verify that your API endpoints are correctly configured and accessible

## Accessing Your Deployment

Once deployed, Vercel will provide a URL for your application (e.g., `https://your-project.vercel.app`). You can also configure custom domains in the Vercel dashboard.

