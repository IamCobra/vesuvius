# Development Setup Guide

## 🐳 To måder at køre projektet på:

### Option 1: Fuld Docker Setup (Anbefalet til produktion)

Kører HELE applikationen i Docker containers:

```bash
# Start alle services (database + web app)
docker-compose up -d

# Applikationen kører på: http://localhost:3000
# Database: internt Docker netværk
# PgAdmin: http://localhost:8080
```

**Bruger:** `docker-compose.yml` + `.env`

---

### Option 2: Lokal Development Setup

Kører KUN database i Docker, Next.js app lokalt:

```bash
# Start kun database services
docker-compose -f docker-compose.local.yml up -d

# Start Next.js app lokalt
npm run dev

# Applikationen kører på: http://localhost:3000
# Database: localhost:5432
# PgAdmin: http://localhost:8080
```

**Bruger:** `docker-compose.local.yml` + `.env.local`

---

## 🔧 Environment Files

### `.env` (til fuld Docker setup)
```env
DATABASE_URL=postgresql://postgres:password@postgres:5432/vesuvius_db
```

### `.env.local` (til lokal development)
```env
DATABASE_URL=postgresql://postgres:vesuvius_password@localhost:5432/vesuvius_db
```

**Vigtig forskel:** `postgres:5432` vs `localhost:5432`

---

## 🚨 Common Issues

### Problem: "localhost:5432 connection refused"
**Årsag:** Bruger `.env` i stedet for `.env.local` med lokal setup

**Løsning:**
```bash
# Sørg for at bruge den rigtige env fil
cp .env.local.example .env.local
```

### Problem: "postgres:5432 host not found"
**Årsag:** Bruger `.env.local` i stedet for `.env` med Docker setup

**Løsning:**
```bash
# Sørg for at bruge den rigtige env fil
cp .env.example .env
```

---

## 🎯 Anbefaling

- **Udvikling:** Brug Option 2 (lokal setup) - hurtigere hot reload
- **Testing:** Brug Option 1 (fuld Docker) - matcher produktion
- **Produktion:** Brug Option 1 (fuld Docker) - konsistent miljø
