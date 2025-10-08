# Vesuvius Restaurant System

Et komplet restaurant management system bygget med Next.js, TypeScript og PostgreSQL.

### Udvikling

```bash
npm install
npm run dev
```

### Produktion

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

## ️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Deployment:** Docker, Docker Compose

## Development Commands

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run linting
```
