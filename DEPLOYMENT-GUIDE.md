# 🚀 Vesuvius Restaurant System - Deployment Guide

## 🏗️ Arkitektur Oversigt

```
                    🏢 Restaurant Setup
                           │
    ┌──────────────────────┼──────────────────────┐
    │                      │                      │
    │                      │                      │

📱 Tablet (Tjener)      🖥️ Køkken PC         💻 Manager PC
Waiter App              Kitchen App           Hjemmeside + Admin
Port 3002               Port 3001             Port 3000
│                       │                     │
│                       │                     │
└───────────────────────┼─────────────────────┘
                        │
                        │ Network (WiFi/LAN)
                        │
              ┌─────────▼─────────┐
              │  Central Server   │
              │  (Database Host)  │
              │                   │
              │  🐳 Docker:       │
              │  • PostgreSQL     │
              │  • Redis Cache    │
              │  • pgAdmin        │
              │  Port 5432        │
              └───────────────────┘
```

## 📋 System Komponenter

### 1. **Central Database Server**

- **Location:** Stationær PC (server)
- **Services:** PostgreSQL, Redis, pgAdmin
- **Port:** 5432 (PostgreSQL), 6379 (Redis), 8080 (pgAdmin)

### 2. **Web Application (Hjemmeside + Admin)**

- **URL:** `http://[server-ip]:3000`
- **Features:**
  - Kunde reservationer
  - Menu display
  - Admin dashboard (`/admin/dashboard`)
  - Restaurant management
  - Rapporter og statistikker

### 3. **Waiter App**

- **URL:** `http://[server-ip]:3002`
- **Features:**
  - Ordre håndtering
  - Bordstatus
  - Table management

### 4. **Kitchen App**

- **URL:** `http://[server-ip]:3003`
- **Features:**
  - Ordre status updates
  - Menu item availability
  - Kitchen workflow

## 🚀 Deployment Steps

### Step 1: Database Server Setup

#### A. Installer Docker på Server PC

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker

# macOS
brew install docker docker-compose

# Windows - Download Docker Desktop
```

#### B. Clone Repository på Server

```bash
git clone [repository-url]
cd vesuvius
```

#### C. Start Database Server

```bash
# Start kun database server
docker-compose -f docker-compose.database.yml up -d

# Tjek at det kører
docker-compose -f docker-compose.database.yml ps
```

#### D. Find Server IP Address

```bash
# Linux/macOS
ip addr show | grep inet
# eller
ifconfig | grep inet

# Windows
ipconfig
```

### Step 2: Individual App Deployment

#### På hver enhed (tablet/PC):

#### A. Clone Repository

```bash
git clone [repository-url]
cd vesuvius
```

#### B. Opdater DATABASE_URL i .env

```bash
# Opret .env fil
DATABASE_URL="postgresql://vesuvius_user:vesuvius_password_2024@[SERVER_IP]:5432/vesuvius"
```

#### C. Deploy Specifik App

**For Waiter Tablet:**

```bash
docker-compose -f docker-compose.waiter.yml up -d
```

**For Kitchen PC:**

```bash
docker-compose -f docker-compose.kitchen.yml up -d
```

**For Manager PC (Web + Admin):**

```bash
docker-compose -f docker-compose.web.yml up -d
```

### Step 3: Verification

#### A. Tjek Database Connection

```bash
# På server PC
docker-compose -f docker-compose.database.yml exec postgres psql -U vesuvius_user -d vesuvius -c "SELECT NOW();"
```

#### B. Test App Connectivity

- **Web App:** `http://[server-ip]:3000`
- **Waiter App:** `http://[server-ip]:3002`
- **Kitchen App:** `http://[server-ip]:3003`
- **Admin Panel:** `http://[server-ip]:3000/admin/dashboard`

## 🔧 Configuration Files

### docker-compose.database.yml (Server PC)

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:15-alpine
    container_name: vesuvius-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: vesuvius
      POSTGRES_USER: vesuvius_user
      POSTGRES_PASSWORD: vesuvius_password_2024
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - vesuvius-network

  redis:
    image: redis:7-alpine
    container_name: vesuvius-cache
    restart: unless-stopped
    ports:
      - "6379:6379"
    networks:
      - vesuvius-network

volumes:
  postgres_data:

networks:
  vesuvius-network:
    driver: bridge
```

### docker-compose.web.yml (Manager PC)

```yaml
version: "3.8"
services:
  web-app:
    build:
      context: .
      dockerfile: Dockerfile.web
    container_name: vesuvius-web
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://vesuvius_user:vesuvius_password_2024@[SERVER_IP]:5432/vesuvius
    networks:
      - vesuvius-network

networks:
  vesuvius-network:
    driver: bridge
```

## 🛠️ Maintenance Commands

### Database Backup

```bash
# Backup
docker-compose -f docker-compose.database.yml exec postgres pg_dump -U vesuvius_user vesuvius > backup.sql

# Restore
cat backup.sql | docker-compose -f docker-compose.database.yml exec -T postgres psql -U vesuvius_user -d vesuvius
```

### Log Monitoring

```bash
# Database logs
docker-compose -f docker-compose.database.yml logs -f postgres

# App logs
docker-compose -f docker-compose.web.yml logs -f web-app
```

### Updates

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose -f docker-compose.web.yml up -d --build
```

## 🔐 Security Notes

1. **Change default passwords** i production
2. **Setup firewall** på server PC
3. **Use HTTPS** i production environment
4. **Regular backups** af database
5. **Monitor logs** for suspicious activity

## 📱 Access URLs

- **Kunder (Public):** `http://[server-ip]:3000`
- **Admin Panel:** `http://[server-ip]:3000/admin/dashboard`
- **Waiter Interface:** `http://[server-ip]:3002`
- **Kitchen Interface:** `http://[server-ip]:3003`
- **Database Admin:** `http://[server-ip]:8080` (pgAdmin)

## 🆘 Troubleshooting

### Database Connection Issues

1. Tjek server IP adresse
2. Tjek firewall settings
3. Verify database container kører
4. Test network connectivity

### App Won't Start

1. Tjek Docker logs
2. Verify environment variables
3. Check port conflicts
4. Ensure database is accessible

### Performance Issues

1. Monitor database performance
2. Check system resources
3. Review application logs
4. Consider Redis caching
