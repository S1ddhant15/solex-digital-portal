# Solex Digital Operations Portal

Unified entry point for the Solex MES Portal, SAMA AI Maintenance Assistant and Solex e‑Vidhyalaya.

## Interface and routing

- The portal overview opens at full browser width after login with the navigation sidebar collapsed.
- Use the **☰ menu button** to open or close the sidebar on desktop and mobile.
- The shared theme uses Solex orange, charcoal and grey across login, overview and application controls.
- Applications open in a full-viewport embedded workspace. Deep links such as `index.html?app=learning` return to the requested application after authentication.
- The full-screen application toolbar includes its own **☰ portal menu**, so navigation remains available while MES, SAMA or e‑Vidhyalaya is open.
- e‑Vidhyalaya reads the same `solexPortalSession` used by MES and SAMA; it does not maintain a separate user list.

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
| Process Engineering | SX4501 | Process@123 |
| L&D | SX5001 | Learn@123 |
| PPC | SX6001 | Ppc@123 |
| Management | SX7001 | Manage@123 |

Change users, permissions and application URLs inside `assets/config.js`.

## SAMA department controls

| Department | Machine / production view | Process parameters | Request change | Approve change |
| --- | ---: | ---: | ---: | ---: |
| Production | Yes | No | No | No |
| Quality | Yes | Yes | Yes | No |
| Maintenance | Yes | Yes | No | No |
| Process Engineering | Yes | Yes | Yes | Yes, except own request |
| Management | Yes | Yes | No | No |
| Operations Excellence Admin | Yes | Yes | Yes | Yes, except own request |

The active SAMA interface contains only **AI Chat** and **Machine Status**. Analytics and other legacy SAMA routes are blocked by the shared session guard.

## Security warning

The included login is a working **front-end prototype**, not production security. GitHub Pages files are public and JavaScript credentials are visible to visitors. Before sharing real operational data, replace the demo authentication with Supabase, Microsoft Entra ID, or a Solex-hosted backend. Power BI reports must also retain workspace/RLS permissions; a portal login does not replace Power BI security.

## Embedding note

The portal opens applications inside an iframe. If a future host sends an `X-Frame-Options` or CSP restriction, use the **Open in new tab** button or host all modules beneath the same protected domain.
