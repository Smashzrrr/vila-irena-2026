# Vila Irena — premium landing page s kalendarom dostupnosti

Landing stranica za Vila Irenu (Bruška, zaleđe Zadra): dvije dalmatinske kamene kuće s bazenom,
8 gostiju. Gosti vide dostupnost u kalendaru, odaberu raspon datuma i pošalju upit; vlasnik
potvrđuje emailom. Bez online plaćanja.

## Stack

- Next.js 16 (App Router, Turbopack) + TypeScript strict
- Tailwind 4 (`@theme` tokeni u `app/globals.css`)
- Motion 12 (`motion/react`) za animacije, s potpunim reduced-motion fallbackom
- Zod validacija, Resend (Tier 1 email), Web3Forms (Tier 2), Upstash (opcionalni rate limit)
- Vitest za pure logiku (iCal parser, booking pravila, date math, dictionary parity)
- Bez baze. Lead capture je email-first s 3-tier safety netom.

## Pokretanje

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest
npm run build      # production build
npm run images     # regeneriraj public/images/ + lib/image-manifest.ts iz slike/
```

## Env varijable (.env.local, vidi .env.local.example)

| Var | Što radi | Bez nje |
|-----|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | canonical/sitemap/OG | localhost fallback |
| `AIRBNB_ICAL_URL` | pravi blokirani datumi s Airbnb-a | mock demo datumi |
| `RESEND_API_KEY` + `INQUIRY_TO_EMAIL` + `INQUIRY_FROM_EMAIL` | Tier 1 email upita | pada na Tier 2 |
| `WEB3FORMS_ACCESS_KEY` | Tier 2 fallback | pada na Tier 3 (log) |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | distribuirani rate limit | in-memory best-effort |

**3-tier inquiry pipeline** (`app/api/inquiry/route.ts`): Resend → Web3Forms → `INQUIRY_FALLBACK`
JSON dump u Vercel logs. Gost uvijek vidi success ako je payload uhvaćen bilo gdje; lead se nikad
tiho ne gubi. Honeypot polje + rate limit (5/10min/IP) + Zod + GDPR consent.

**Kalendar**: `GET /api/availability` čita Airbnb iCal feed (revalidate 1h) ili mock.
Logika u `lib/booking-logic.ts`: noći su blokirane (ne dani), changeover dani su validni
check-in/checkout, min 2 noći (config: `lib/config.ts`).

## i18n

EN (default) + HR + DE. `proxy.ts` radi Accept-Language redirect za `/`. Rječnici u
`dictionaries/*.json`; parity test pada ako ključevi nisu identični u sva tri.

## Slike

Izvorne WhatsApp fotke u `slike/` (gitignored). `npm run images` (sharp) generira
optimizirane verzije u `public/images/` + manifest s blur placeholderima. Kuracija
(odabir, kategorije, hero) definirana je u `scripts/optimize-images.mjs`.

## TODO prije produkcije (podaci od vlasnika)

1. `AIRBNB_ICAL_URL`: Airbnb host kalendar > Availability > Connect to another website
2. Email za upite + Resend račun s verificiranom domenom + Web3Forms key
3. Cijene (trenutno "na upit" pristup) i potvrda min broja noći (default 2)
4. Domena (`NEXT_PUBLIC_SITE_URL`)
5. Privacy: tko je voditelj obrade (vlasnik ili agencija Booking-Adria) + kontakt
6. Geo koordinate za JSON-LD
7. Fotke u originalnoj rezoluciji (trenutne su WhatsApp 2048px, upotrebljive ali ne idealne)

## Deploy

Vercel, static + 2 API rute. **Deploy samo uz eksplicitno odobrenje.**
