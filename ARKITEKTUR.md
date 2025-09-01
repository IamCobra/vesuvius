# Vesuvius Restaurant - Webpage Arkitektur

Overordnet Arkitektur

### Tech Stack
- **Framework**: Next.js 15.4.6 (App Router)
- **Database**: PostgreSQL 15 + Prisma ORM
- **Styling**: Tailwind CSS 3.4.17
- **Deployment**: Docker containers
- **Language**: TypeScript + React 19
- **Admin UI**: pgAdmin 4 (http://localhost:8080)

Folder Structure


vesuvius/
├── src/
│   └── app/                    # Next.js App Router
│       ├── components/         # Genbrugelige komponenter
│       ├── admin/             # Admin dashboard evt også auth.
│       ├── kitchen/           # Køkkenskærm
│       ├── menu/              # Menu side
│       ├── contact/           # Kontakt side
│       ├── globals.css        # Global styling
│       ├── layout.tsx         # Root layout
│       └── page.tsx           # Forside
├── prisma/                    # Database schema & migrations
├── docker-compose.yml         # Docker setup
└── package.json               # Dependencies


Design System

Farver (Burgundy tema)

```css
--burgundy-primary: #B94A5F    /* Primær farve */
--burgundy-dark: #962E44       /* Mørkere variant */
--burgundy-light: #F6EDE6      /* Lys baggrund */
```

Komponenter

- **Navigation**: Sticky navigation bar
- **Footer**: Kontakt info (danske adresser/telefon)
- **Cards**: Menu items, dashboard widgets
- **heroSection**
- **Cart** 

Database Design

Hovedtabeller

```sql
Category (kategorier)
├── id, name, description
├── menuItems[] (relation)

MenuItem (menupunkter)
├── id, name, description, price
├── category (relation)
├── variants[] (relation)
├── image (string URL)

MenuItemVariant (varianter)
├── id, name, priceChange
├── menuItem (relation)
```

Mock Data

- Seeded via `prisma/seed.ts`
- Kategorier: Pizza, Pasta, Salater, Foretter, Desserts
- Ca. 20+ menu items med billeder
- Varianter: Størrelse, tilføjelser etc.

Side Struktur

1. **Forside** (`/`)

- Hero section med restaurant info
- Featured menu items
- Call-to-action buttons
- **Design**: Burgundy tema

2. **Menu** (`/menu`)

- Server Component: Henter data fra database
- Kategori-baseret visning
- Billeder på alle menu items


3. **Admin Dashboard** (`/admin/dashboard`)

- **Client Component**: Real-time charts
- Salgsstatistik og grafer
- Ordrestyring
- Menu administration
- **Tech**: Recharts library

4. **Køkkenskærm** (`/kitchen`)

- **Client Component**: Real-time order updates
- Ordrestatus: `queued → in_progress → ready`
- Bordnummer visning
- Tid siden ordre
- **Mock data**: Frontend-only lige nu

5. **Kontakt** (`/contact`)

- Danske kontaktoplysninger
- Åbningstider
- Adresse: Vejnavn 12, 5000 Odense C
- Telefon: +45 65 12 34 56

Data Flow

Frontend → Database

```
Menu Page → getMenuData() → Prisma → PostgreSQL
Admin → Chart komponenter → Mock/Real data
Kitchen → WebSocket (future) → Order system
```

State Management

- **Server Components**: Database queries
- **Client Components**: useState/useEffect
- **Ingen global state** (Redux/Zustand) endnu

Development Workflow

Commands

```bash
# Development
npm run dev              # Start dev server

# Database
docker compose up -d     # Start PostgreSQL + pgAdmin
npx prisma migrate dev   # Run migrations
npm run db:seed          # Seed data
npx prisma studio        # DB admin UI (or pgAdmin at :8080)

# Production
npm run build           # Build for production
npm run lint            # Check code quality
```

Environment Setup

1. Clone repository
2. `npm install`
3. `docker compose up -d`
4. `npx prisma migrate dev`
5. `npx prisma db seed`
6. `npm run dev`

Responsive Design

Breakpoints (Tailwind)

- **Mobile**: Default (< 640px)
- **Tablet**: `sm:` (≥ 640px)
- **Desktop**: `lg:` (≥ 1024px)

Layout Patterns

- **Grid**: Menu items, dashboard widgets
- **Flexbox**: Navigation, form layouts
- **Cards**: Consistent padding/shadow system

Key Features

Implemented

- Responsive dansk restaurant website
- Database-driven menu med billeder
- Admin dashboard med charts
- Køkkenskærm prototype
- Docker deployment setup
- TypeScript type safety

Planned

- Real-time order system
- Table reservation
- User authentication
- Mobile app (Flutter)

Team Collaboration

Code Standards

- **Sprog**: Dansk for UI text, Engelsk for kode
- **Komponenter**: PascalCase
- **Props**: TypeScript interfaces
- **CSS**: Tailwind utility classes
