# 🌋 Vesuvius Restaurant System

Et komplet restaurant management system bygget med Next.js, TypeScript og PostgreSQL.

## 🏗️ System Arkitektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Web App        │    │   Waiter App    │    │   Kitchen App   │
│  (Port 3000)    │    │   (Port 3002)   │    │   (Port 3003)   │
│                 │    │                 │    │                 │
│  • Hjemmeside   │    │  • Order Taking │    │  • Order Status │
│  • Reservations │    │  • Table Status │    │  • Menu Items   │
│  • Admin Panel  │    │  • Table Mgmt   │    │  • Kitchen Flow │
│                 │    │  (Next.js App)  │    │  (Next.js App)  │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                   ┌─────────────▼─────────────────┐
                   │     Central Database         │
                   │   PostgreSQL (Port 5432)     │
                   └──────────────────────────────┘
```

## 🚀 Quick Start

### Udvikling

```bash
npm install
npm run dev
```

### Produktion (Se DEPLOYMENT-GUIDE.md)

```bash
# Database Server
docker-compose -f docker-compose.database.yml up -d

# Web App (på manager PC)
docker-compose -f docker-compose.web.yml up -d

# Waiter App (på tablet)
docker-compose -f docker-compose.waiter.yml up -d

# Kitchen App (på køkken PC)
docker-compose -f docker-compose.kitchen.yml up -d
```

## 📁 Projekt Struktur

```
vesuvius/
├── src/app/
│   ├── admin/dashboard/        # Admin panel (✅ bruges)
│   ├── api/                    # API endpoints (✅ bruges)
│   ├── components/             # Delte komponenter (✅ bruges)
│   ├── kitchen/               # Køkken interface (✅ bruges)
│   ├── menu/                  # Menu visning (✅ bruges)
│   ├── reservation/           # Reservations system (✅ bruges)
│   └── waiter/               # Tjener interface (✅ bruges)
├── docker-compose.*.yml       # Deployment configs (✅ bruges)
├── Dockerfile.*              # Container builds (✅ bruges)
├── DEPLOYMENT-GUIDE.md       # Deploy instruktioner (✅ bruges)
└── DOCUMENTATION.md          # Teknisk dokumentation (✅ bruges)
```

## 🌐 Access URLs

- **Web App (Hjemmeside + Admin):** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin/dashboard
- **Waiter App (Separate Next.js App):** http://localhost:3002
- **Kitchen App (Separate Next.js App):** http://localhost:3003

## 📚 Dokumentation

- **DEPLOYMENT-GUIDE.md** - Komplet deployment guide til produktion
- **DOCUMENTATION.md** - Teknisk dokumentation og API reference

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Deployment:** Docker, Docker Compose

## 🏃‍♂️ Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run linting
```
