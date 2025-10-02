# GitHub Explorer (React + TypeScript + Vite)

Search GitHub users and view all their public repositories. Handles pagination, loading and error states, and shows a rate-limit notice. Optional: provide a GitHub token to raise rate limits.

## Quick start

```bash
npm i
npm run dev
```

Open the printed local URL.

## Optional: GitHub token

Create a `.env` file in the project root:

```
VITE_GITHUB_TOKEN=ghp_xxx
```

This is optional but recommended to avoid hitting unauthenticated rate limits.
