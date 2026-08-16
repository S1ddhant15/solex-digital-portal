# Solex Digital Operations Portal

Unified entry point for Solex Manufacturing Analytics, SAMA AI Maintenance Assistant and Solex e‑Vidhyalaya.

## Interface and routing

- The portal overview opens at full browser width after login with the navigation sidebar collapsed.
- Use the **☰ menu button** to open or close the sidebar on desktop and mobile.
- The shared theme uses Solex orange, charcoal and grey across login, overview and application controls.
- Applications open in a full-viewport embedded workspace. Deep links such as `index.html?app=learning` return to the requested application after authentication.
- The full-screen application toolbar includes its own **☰ portal menu**, so navigation remains available while Analytics, SAMA or e‑Vidhyalaya is open.
- e‑Vidhyalaya reads the same `solexPortalSession` used by MES and SAMA; it does not maintain a separate user list.
- Use `launcher.html` as the official portal link. Its premium solar-module screen requests true browser fullscreen from the **Enter Digital Operations** click, then opens login and the complete portal inside that same fullscreen document. **Close Portal ×** closes the portal experience and exits fullscreen.
- The launcher restores the Solex logo and the ecosystem flow **SEE → ANALYZE → SOLVE → LEARN → IMPROVE**. In standalone mode the portal remains inside the same full-screen document after login, preventing navigation from cancelling browser full-screen.
- Browser security prevents any public URL from entering fullscreen automatically during page load. The launcher therefore starts fullscreen at the earliest permitted moment: the **Open Digital Operations Portal** click, before the login screen appears.
- The V12 premium interface adds a unified glass-and-metal visual system across launcher, login, overview, navigation, KPI cards, application cards, profile, administration and docked application controls without changing access logic.
- The V13 refinement removes all visible prototype employee IDs/passwords from the login interface and adds stronger Solex solar-manufacturing branding across the complete experience.
- The V14 executive refinement introduces a variable-style corporate typography system and rewrites launcher, login, command center, cards, profile, access control and application actions with clearer operational language.
- Embedded application controls are docked below the application instead of floating over the Analytics, SAMA or e‑Vidhyalaya header.
- A browser tab opened directly at `index.html` cannot always be closed by page JavaScript. For reliable close-window behaviour, launch through `launcher.html` and allow popups for the GitHub Pages site.

## Publish on GitHub Pages

1. Create a public repository named `solex-digital-portal`.
2. Upload everything from this folder without changing the folder structure.
3. Open **Settings → Pages**.
4. Select **Deploy from a branch**, branch **main**, folder **/(root)** and save.
5. Use `https://s1ddhant15.github.io/solex-digital-portal/launcher.html` as the Digital Operations Portal link.

## Access configuration

Employee users, permissions and application URLs are managed inside `assets/config.js` for this front-end prototype. No employee IDs or passwords are displayed on the portal interface.

## SAMA department controls

| Department | Machine / production view | Process parameters | Request change | Approve change |
| --- | ---: | ---: | ---: | ---: |
| Production | Yes | No | No | No |
| Quality | Yes | Yes | Yes | No |
| Maintenance | Yes | Yes | No | No |
| Process Engineering | Yes | Yes | Yes | Yes, except own request |
| Management | Yes | Yes | No | No |
| Operations Excellence Admin | Yes | Yes | Yes | Yes, except own request |

The active SAMA interface contains **AI Chat**, **Machine Status** and **Why SAMA**. Analytics and other legacy SAMA routes are blocked by the shared session guard.

## Security warning

The included login is a working **front-end prototype**, not production security. GitHub Pages files are public and JavaScript credentials are visible to visitors. Before sharing real operational data, replace the demo authentication with Supabase, Microsoft Entra ID, or a Solex-hosted backend. Power BI reports must also retain workspace/RLS permissions; a portal login does not replace Power BI security.

## Embedding note

The portal opens applications inside an iframe. If a future host sends an `X-Frame-Options` or CSP restriction, use **Open separately** or host all modules beneath the same protected domain.
