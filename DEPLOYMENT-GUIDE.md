# 🚀 Vesuvius Restaurant System - Multi-Repo Deployment

## 🏗️ Arkitektur - 3 Separate Repositories

```
📱 Waiter App          🖥️ Kitchen App         💻 Web App
   (Separate Repo)         (Separate Repo)        (Dette Repo)
   Maskine 2              Maskine 3              Maskine 1
       │                      │                      │
       │                      │                      │
       └──────── PostgreSQL Connection ──────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Database Server │
                    │   (Maskine 1)     │
                    │                   │
                    │  • PostgreSQL     │
                    │    Port 5432      │
                    │  • Redis Cache    │
                    │  • pgAdmin        │
                    └───────────────────┘
```

## 📋 Repository Structure

### **1. vesuvius-web (Dette Repository)**

- **Lokation:** Maskine 1 (Database Server)
- **Indhold:** Next.js hjemmeside + admin dashboard
- **Services:** Web app, PostgreSQL, Redis, pgAdmin
- **Port:** 3000 (web), 5432 (database)

### **2. vesuvius-waiter (Separat Repository)**

- **Lokation:** Maskine 2 (Tjener Tablet/PC)
- **Indhold:** Waiter application (Flutter/React)
- **Database:** Forbinder til maskine1:5432
- **Port:** 3002

### **3. vesuvius-kitchen (Separat Repository)**

- **Lokation:** Maskine 3 (Køkken PC)
- **Indhold:** Kitchen application (Flutter/React)
- **Database:** Forbinder til maskine1:5432
- **Port:** 3003

## 🚀 Deployment Steps

### **Maskine 1: Database Server + Web App**

1. **Clone dette repository:**

   ```bash
   git clone https://github.com/[username]/vesuvius-web
   cd vesuvius-web
   ```

2. **Start database server + web app:**

   ```bash
   docker-compose up -d
   ```

3. **Find IP adresse:**

   ```bash
   # Linux/Mac
   ifconfig | grep inet

   # Windows
   ipconfig
   ```

   Noter IP (f.eks. `192.168.1.100`)

### **Maskine 2: Waiter App**

1. **Clone waiter repository:**

   ```bash
   git clone https://github.com/[username]/vesuvius-waiter
   cd vesuvius-waiter
   ```

2. **Konfigurer database forbindelse:**

   ```bash
   # .env eller config fil
   DATABASE_URL=postgresql://vesuvius_user:vesuvius_password_2024@192.168.1.100:5432/vesuvius
   ```

3. **Start waiter app:**

   ```bash
   # Flutter
   flutter run --release

   # Eller Docker
   docker-compose up -d
   ```

### **Maskine 3: Kitchen App**

1. **Clone kitchen repository:**

   ```bash
   git clone https://github.com/[username]/vesuvius-kitchen
   cd vesuvius-kitchen
   ```

2. **Konfigurer database forbindelse:**

   ```bash
   # .env eller config fil
   DATABASE_URL=postgresql://vesuvius_user:vesuvius_password_2024@192.168.1.100:5432/vesuvius
   ```

3. **Start kitchen app:**

   ```bash
   # Flutter
   flutter run --release

   # Eller Docker
   docker-compose up -d
   ```

## 📋 Database Schema

**Alle 3 apps deler samme database med disse tabeller:**

```sql
-- Kunder og reservationer
customers
reservations

-- Menu og ordrer
categories
menu_items
menu_item_variants
orders
order_items

-- Restaurant data
dining_tables
staff_users
order_status_log
```

## 🌐 Access URLs

Efter deployment kan du tilgå:

- **🏠 Hjemmeside:** `http://192.168.1.100:3000`
- **👤 Admin Panel:** `http://192.168.1.100:3000/admin/dashboard`
- **👨‍💼 Waiter App:** `http://192.168.1.102:3002` (Maskine 2)
- **👨‍🍳 Kitchen App:** `http://192.168.1.103:3003` (Maskine 3)
- **🗄️ Database Admin:** `http://192.168.1.100:8080` (pgAdmin)

## 🔧 Database Connection String

**For waiter og kitchen apps:**

```
postgresql://vesuvius_user:vesuvius_password_2024@[MASKINE1_IP]:5432/vesuvius
```

## 🛠️ Management Commands

### Database Backup (Kun på Maskine 1)

```bash
docker-compose exec postgres pg_dump -U vesuvius_user vesuvius > backup.sql
```

### Se Database Status

```bash
docker-compose exec postgres pg_isready -U vesuvius_user
```

### Restart Services

```bash
# Web + Database
docker-compose restart

# Kun database
docker-compose restart postgres
```

## 🔐 Security Notes

1. **Firewall:** Åbn port 5432 på Maskine 1 for Maskine 2 og 3
2. **Database Password:** Skift default password i production
3. **Network:** Brug privat netværk mellem maskinerne
4. **SSL:** Aktivér SSL for database forbindelser i production

## 🆘 Troubleshooting

### Database Connection Issues

```bash
# Test fra Maskine 2/3
telnet 192.168.1.100 5432

# Eller med psql
psql -h 192.168.1.100 -U vesuvius_user -d vesuvius
```

### Firewall Issues (Maskine 1)

```bash
# Linux
sudo ufw allow 5432

# Windows
# Tillad port 5432 i Windows Firewall
```

**🎉 Multi-repo setup er nu klar!**
