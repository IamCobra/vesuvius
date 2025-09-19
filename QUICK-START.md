# 🚀 VESUVIUS - QUICK START (Team Setup)

## ✅ Færdig Setup - Klar til brug!

### 📥 **Download & Setup (5 minutter)**

```bash
# 1. Clone repository
git clone [jeres-repo-url]
cd vesuvius

# 2. Install dependencies  
npm install

# 3. Copy environment fil
cp .env.local.template .env

# 4. Start database (Docker)
docker-compose -f docker-compose.local.yml up -d
# 5. Wait 10 seconds, then setup schema
Get-Content .\create-schema.sql | docker exec -i vesuvius-postgres-1 psql -U postgres -d vesuvius_db
# 6. Start development server
npm run dev
```

### 🎯 **Access Points**
- **Website:** http://localhost:3000
- **Menu:** http://localhost:3000/menu  
- **Reservation:** http://localhost:3000/reservation
- **Admin:** http://localhost:3000/admin/dashboard
- **Kitchen:** http://localhost:3000/kitchen
- **Database Admin:** http://localhost:8080 (admin@vesuvius.com / admin123)

### ⚡ **Daily Workflow**

```bash
# Start coding session
docker-compose -f docker-compose.local.yml up -d
npm run dev

# Stop when done
docker-compose -f docker-compose.local.yml down
```

### 🔧 **Common Commands**

```bash
# Database
docker-compose -f docker-compose.local.yml logs postgres  # Check DB logs
docker exec -it vesuvius-postgres-1 psql -U postgres -d vesuvius_db  # Direct DB access

# Development  
npm run build    # Test production build
npm run lint     # Check code style
```

### 🆘 **Troubleshooting**

**Port 5432 er optaget:**
```bash
# Ændr port i docker-compose.local.yml
ports:
  - "5433:5432"  # Skift til 5433

# Opdater .env
DATABASE_URL="postgresql://postgres:vesuvius_password@localhost:5433/vesuvius_db"
```

**Database data forsvundet:**
```bash
# Re-create schema
docker exec -i vesuvius-postgres-1 psql -U postgres -d vesuvius_db < create-schema.sql
```

**Fuld reset:**
```bash
docker-compose -f docker-compose.local.yml down -v
docker-compose -f docker-compose.local.yml up -d
# Wait 10 seconds
docker exec -i vesuvius-postgres-1 psql -U postgres -d vesuvius_db < create-schema.sql
```

### 👥 **Team Tips**

✅ **Alle kan køre lokalt** - ingen konflikter  
✅ **Database er isoleret** - hver person har sin egen  
✅ **Ingen netværks setup** nødvendigt  
✅ **Simpel start/stop** med én kommando  
✅ **Færdig test data** inkluderet  

### 🚀 **Næste Steps**

Når I skal lave **waiter** og **kitchen** apps:
1. Lav separate repositories
2. Sæt samme `DATABASE_URL` i deres `.env`
3. Alle apps deler samme lokale database!

**Ready to code! 🎉**
