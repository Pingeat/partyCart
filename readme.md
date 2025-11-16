# Yumzy Partycart Production Bot

This repository mirrors the way we shipped the original church bot: config-driven Node.js server, WhatsApp webhook handlers, modular services, and a static public site for demos. It powers Yumzy Partycart's concierge so clients can book menus, live counters, restaurant partners, parcel support, and full party planning without leaving chat.

## Folder layout
```
.env.example          → reference environment variables for prod deploys
public/               → status page + manifest served to clients
src/config/           → env loader + runtime configuration
src/data/             → curated menus, live counters, restaurants, parcel guardrails
src/handlers/         → journey-specific response builders (menu, counter, parcel...)
src/services/         → stateful session + outbound WhatsApp service wrappers
src/webhooks/         → webhook controllers that map Meta payloads to handlers
src/server.js         → HTTP server, webhook routing, health endpoints, static hosting
```

## Environment variables
Copy `.env.example` into `.env` and populate production values before deploying.

| Variable | Description |
| --- | --- |
| `PORT` | Port exposed by the Node.js server. |
| `APP_URL` | Public base URL used in logs. |
| `META_VERIFY_TOKEN` | Token shared with Meta for webhook validation. |
| `META_WHATSAPP_TOKEN` | WhatsApp Business access token (optional locally). |
| `META_WHATSAPP_PHONE_NUMBER_ID` | Sender phone number ID for outbound replies. |

## Running locally
```bash
cp .env.example .env   # tweak values if needed
npm install            # installs a bare lockfile (no third-party deps required)
npm start              # boots the HTTP server on http://localhost:4000
```

Available endpoints:
- `GET /` – Branded status page for demos (served from `public/`).
- `GET /healthz` – Basic uptime probe for monitors.
- `GET /api/ping` – Returns the concierge greeting (handy for smoke tests).
- `GET /webhook/whatsapp` – Meta webhook verification handshake.
- `POST /webhook/whatsapp` – Receives WhatsApp messages and dispatches them to handlers.

## WhatsApp flows
All guest replies are normalized to keywords:
- `MENU` → shares curated party menus, including course-by-course deep dives.
- `EXPLORE` → surfaces the 10/20/30 pax party carts with price, pax, and hero dishes.
- `COUNTER` → lists live counter theatre setups.
- `RESTAURANT` → highlights trusted partner kitchens for fast ordering.
- `PARCEL` → confirms parcel windows, safety layers, and payload weight caps.
- `PLAN` → activates the concierge planning desk and perks summary.
- `BOOK` → sends an interactive booking template so guests can share date, menu, pax, venue, and notes.
- `ENQUIRE` → replies with concierge phone + email contacts for instant escalations.
- `HELP` → replays the greeting with available commands.

The `src/services/sessionService.js` keeps per-number transcripts just like the church bot connect card, while `src/services/partyCartService.js` pulls structured data from `src/data/catalog.js` so every reply is grounded in the Yumzy offering.

The new `src/services/bookingService.js` tracks booking stages, parses formatted guest replies, and produces a confirmation recap before nudging the human concierge team.

## Deployment checklist
1. Configure `.env` with production tokens and URLs.
2. Point the Meta webhook dashboard to `<APP_URL>/webhook/whatsapp` for both GET + POST.
3. Drop the static `public/index.html` URL into stakeholder notes so they can verify the bot is online.
4. Scale the Node.js process via PM2, systemd, or your container platform of choice.
