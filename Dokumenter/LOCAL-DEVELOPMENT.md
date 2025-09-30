# 🚀 Vesuvius - Local Development Setup

## ⚡ Quick Start (5 minutter)

### 1. Clone Repository

```bash
git clone [repository-url]
cd vesuvius
```

### 2. Setup Environment

```bash
# Kopier environment template
cp .env.local.template .env

# Installer dependencies
npm install
```

### 3. Start Database (Docker)

```bash
# Start kun database og cache
docker-compose -f docker-compose.local.yml up -d

# Vent på database er klar (ca. 10 sekunder)
docker-compose -f docker-compose.local.yml logs postgres
```

### 4. Setup Database Schema

```bash
# Kør migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

### 5. Start Development Server

```bash
# Start Next.js app
npm run dev
```

## 🎯 Access Points

- **Web App**: http://localhost:3000
- **Database**: localhost:5432
- **pgAdmin**: http://localhost:8080 (admin@vesuvius.com / admin123)
- **Redis**: localhost:6379

## 🛠️ Development Commands

```bash
# Database
npm run db:migrate     # Kør migrations
npm run db:seed        # Seed database
npm run db:studio      # Åbn Prisma Studio
npm run db:reset       # Reset database

# Development
npm run dev            # Start development server
npm run build          # Build for production
npm run lint           # Lint kode
npm run type-check     # TypeScript check
```

## 🔧 Troubleshooting

### Database Connection Issues

```bash
# Check if database is running
docker-compose -f docker-compose.local.yml ps

# Restart database
docker-compose -f docker-compose.local.yml restart postgres

# Check logs
docker-compose -f docker-compose.local.yml logs postgres
```

### Port Conflicts

Hvis portene er optaget, kan du ændre dem i `docker-compose.local.yml`:

```yaml
ports:
  - "5433:5432" # Skift fra 5432 til 5433
```

Husk også at opdatere `DATABASE_URL` i `.env`.

### Clean Reset

```bash
# Stop alt
docker-compose -f docker-compose.local.yml down -v

# Slet volumes (ADVARSEL: Sletter al data!)
docker volume prune

# Start forfra
docker-compose -f docker-compose.local.yml up -d
```

## 👥 Team Development

Alle teammedlemmer kan køre dette setup lokalt:

1. Hver person har sin egen database
2. Ingen port konflikter mellem udviklere
3. Uafhængig development environment

## 📱 Multi-App Development

Når I senere skal lave waiter/kitchen apps:

```bash
# Waiter app (port 3002)
cd waiter-app
DATABASE_URL="postgresql://vesuvius_user:vesuvius_password@localhost:5432/vesuvius_db" npm run dev

# Kitchen app (port 3003)
cd kitchen-app
DATABASE_URL="postgresql://vesuvius_user:vesuvius_password@localhost:5432/vesuvius_db" npm run dev
```

Alle apps deler samme lokale database! 🎉
