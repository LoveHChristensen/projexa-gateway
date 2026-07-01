# projexa-gateway

Reverse proxy for [projexa.me](https://projexa.me). Routes path prefixes to separate Render services so you only need one custom domain.

| Path | Backend |
|------|---------|
| `/` | ProjectManager (main site) |
| `/afterglow` | AfterGlow static site |
| `/ontherocks` | On The Rocks static site |

## Environment variables

Set these on the Render service:

| Variable | Example |
|----------|---------|
| `MAIN_UPSTREAM` | `https://projectmanager-m9k9.onrender.com` |
| `AFTERGLOW_UPSTREAM` | `https://afterglow-0cb6.onrender.com` |
| `ONTHEROCKS_UPSTREAM` | `https://ontherocks.onrender.com` |

Use the internal `*.onrender.com` URL from each service's Render dashboard (Settings → URL).

## Deploy on Render

1. Push this repo to GitHub.
2. **New → Blueprint** (or Web Service) and connect the repo.
3. Set `AFTERGLOW_UPSTREAM` and `ONTHEROCKS_UPSTREAM` in the dashboard.
4. Add custom domain **`projexa.me`** to this service only.
5. Remove `projexa.me` from the ProjectManager static site service.
6. Update Namecheap DNS using the A records Render shows for the gateway.

## Sub-apps under a path

AfterGlow and On The Rocks must be served with a base path. Add to each site's `index.html`:

```html
<base href="/afterglow/">
```

```html
<base href="/ontherocks/">
```

Redeploy those sites after adding the tag.

## Add another project later

Add a new `handle` block in `Caddyfile`, set an env var in `render.yaml`, and configure `basePath` / `<base href>` in that app.
