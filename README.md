# Astro Cache Worker

A Cloudflare Worker that adds proper caching headers for static assets when using Astro with Cloudflare Workers + Assets (Beta).

## The Problem

When deploying an Astro site using Cloudflare Workers + Assets (Beta), the standard `_headers` file configuration for caching static assets is not supported, unlike in Cloudflare Pages. This results in assets being served without proper caching headers, potentially impacting performance.

Related issue: [Cloudflare Workers (Beta Assets). Broken Caching \_headers #13164](https://github.com/withastro/astro/issues/13164)

## The Solution

This repository provides a template for implementing a proxy worker that sits in front of your Astro application and adds appropriate caching headers for static assets. The worker:

1. Intercepts requests to your Astro application
2. Identifies static assets by their file extension
3. Adds proper caching headers (`Cache-Control: public, max-age=31536000, immutable`) for static assets
4. Passes through all other requests unchanged

## Prerequisites

This worker is designed to work in conjunction with an Astro site deployed using Cloudflare Workers + Assets. We recommend using our [astro-worker-assets](https://github.com/magnusmay/astro-worker-assets) template for the optimal setup of your Astro application.

The complete setup involves two parts:

1. Your Astro application (using [astro-worker-assets](https://github.com/magnusmay/astro-worker-assets))
2. This caching worker (which adds the proper caching headers)

## Setup

1. First, deploy your Astro application using the [astro-worker-assets](https://github.com/magnusmay/astro-worker-assets) template
2. Clone this repository
3. Update the `wrangler.jsonc` configuration to point to your Astro worker:
   ```json
   {
     "services": [
       {
         "binding": "ASTRO",
         "service": "your-astro-worker-name"
       }
     ]
   }
   ```
4. Deploy the cache worker:
   ```bash
   npm install
   npm run deploy
   ```

## Configuration

The worker includes a comprehensive list of cacheable file extensions in `src/index.ts`. You can modify this list according to your needs:

```typescript
const cacheableExtensions = new Set([
  "css",
  "js",
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "woff",
  "woff2",
  "ttf", // ... and many more
]);
```

## Development

```bash
# Install dependencies
npm install

# Generate types
npm run types

# Run locally
npm run dev

# Deploy
npm run deploy
```

## Why This Exists

Cloudflare Workers + Assets (Beta) currently doesn't support the standard `_headers` file configuration for caching, which is typically used in Cloudflare Pages deployments. This worker provides a workaround by implementing caching at the worker level, ensuring optimal performance for static assets.

When used in combination with our [astro-worker-assets](https://github.com/magnusmay/astro-worker-assets) template, you get a complete solution for deploying Astro sites on Cloudflare Workers with proper asset caching.

## License

MIT
