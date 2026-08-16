# Solex Digital Operations Portal

Unified entry point for the Solex MES Portal, SAMA AI Maintenance Assistant and Solex e‑Vidhyalaya.

## Publish on GitHub Pages

1. Create a public repository named `solex-digital-portal`.
2. Upload everything from this folder without changing the folder structure.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**, branch **main**, folder **/(root)** and save.
5. Open `https://s1ddhant15.github.io/solex-digital-portal/`.

## Prototype accounts

| Access | Employee ID | Password |
| --- | --- | --- |
| Administrator | SX1001 | Admin@123 |
| Maintenance | SX2001 | Maint@123 |
| Production | SX3001 | Prod@123 |
| Quality | SX4001 | Quality@123 |
| L&D | SX5001 | Learn@123 |

Change users, permissions and application URLs inside `assets/js/config.js`.

## Security warning

The included login is a working **front-end prototype**, not production security. GitHub Pages files are public and JavaScript credentials are visible to visitors. Before sharing real operational data, replace the demo authentication with Supabase, Microsoft Entra ID, or a Solex-hosted backend. Power BI reports must also retain workspace/RLS permissions; a portal login does not replace Power BI security.

## Embedding note

The portal opens applications inside an iframe. If a future host sends an `X-Frame-Options` or CSP restriction, use the **Open in new tab** button or host all modules beneath the same protected domain.
