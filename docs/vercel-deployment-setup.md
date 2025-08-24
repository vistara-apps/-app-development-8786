# Vercel Deployment Setup Guide

This guide explains how to set up the Vercel deployment for this project using GitHub Actions.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. The project imported into Vercel
3. GitHub repository access with permission to add secrets

## Setup Steps

### 1. Get Vercel Deployment Tokens

1. Log in to your Vercel account
2. Go to your account settings (click on your profile picture in the top right corner)
3. Navigate to the "Tokens" tab
4. Create a new token with "Full Account" scope
5. Copy the token value (you'll need it for the GitHub secrets)

### 2. Get Vercel Project Information

1. In your Vercel dashboard, select the project
2. Go to the "Settings" tab
3. Scroll down to find:
   - **Project ID**: Located in the "Project ID" field
   - **Org ID**: Located in the "Organization ID" field

### 3. Add GitHub Secrets

Add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to "Settings" > "Secrets and variables" > "Actions"
3. Add the following secrets:
   - `VERCEL_TOKEN`: The token you created in step 1
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

### 4. GitHub Actions Workflow

The GitHub Actions workflow is already set up in `.github/workflows/vercel-deploy.yml`. It will:

- Deploy preview environments for pull requests
- Deploy to production when changes are pushed to the main branch

## How It Works

- **Pull Requests**: When a PR is opened or updated, a preview deployment is created
- **Main Branch**: When changes are pushed to the main branch, a production deployment is triggered

## Troubleshooting

If you encounter issues with the deployment:

1. Check that all secrets are correctly set in GitHub
2. Verify that the Vercel project is correctly set up
3. Check the GitHub Actions logs for detailed error messages

## Additional Configuration

You can customize the Vercel deployment by creating a `vercel.json` file in the root of your project. This allows you to configure:

- Build settings
- Environment variables
- Redirects and rewrites
- Headers and other advanced options

For more information, refer to the [Vercel documentation](https://vercel.com/docs/concepts/projects/project-configuration).

