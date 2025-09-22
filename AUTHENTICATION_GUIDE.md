# Vesuvius Authentication System Guide

## 🔐 **Komplet JWT Authentication System**

Vi har nu implementeret et fuldt funktionelt authentication system med NextAuth.js og JWT tokens.

---

## 📋 **Hvad Vi Har Implementeret:**

### ✅ **1. Database Schema (Prisma)**
- **User model** med rolle-baseret adgang (USER, ADMIN, WAITER, KITCHEN)
- **Account, Session, VerificationToken** modeller for NextAuth.js
- **Password hashing** med bcryptjs

### ✅ **2. NextAuth.js Konfiguration**
- **JWT strategy** for token-baseret auth
- **Credentials provider** for email/password login
- **Custom callbacks** for rolle-håndtering
- **Session management**

### ✅ **3. API Endpoints**
- **`/api/auth/[...nextauth]`** - NextAuth.js handler
- **`/api/auth/register`** - Bruger registrering med password hashing

### ✅ **4. Frontend Komponenter**
- **Login side** (`/auth/signin`) - Elegant login form
- **Signup side** (`/auth/signup`) - Registrering med validering
- **Navigation** med auth status og user menu
- **Admin dashboard** (`/admin`) - Rolle-beskyttet side

### ✅ **5. Security Features**
- **Middleware** til rute-beskyttelse baseret på roller
- **Password hashing** med bcrypt
- **JWT tokens** for session management
- **Role-based access control** (RBAC)

---

## 🎯 **Hvordan Det Virker:**

### **User Flow:**
1. **Ny bruger** → Går til `/auth/signup` → Opretter konto
2. **Eksisterende bruger** → Går til `/auth/signin` → Logger ind
3. **Authentication** → JWT token genereres og gemmes
4. **Navigation** → Viser bruger menu med navn/email
5. **Logout** → Token slettes, bruger sendes til forside

### **Admin Flow:**
1. **Admin bruger** logger ind
2. **Navigation** viser "Admin Panel" link
3. **Middleware** checker rolle ved `/admin` access
4. **Admin dashboard** vises kun for ADMIN rolle

---

## 🔧 **Hvordan At Bruge Det:**

### **1. Start Serveren:**
```bash
npm run dev
# App kører på http://localhost:3001
```

### **2. Opret Første Admin Bruger:**
Du kan oprette en admin bruger ved at:
- Gå til `/auth/signup`
- Opret en bruger
- Manuelt opdater `role` i databasen til "ADMIN"

```sql
-- I Prisma Studio eller direkte i PostgreSQL
UPDATE users SET role = 'ADMIN' WHERE email = 'din@email.dk';
```

### **3. Test Authentication:**
- **Login/Logout** - Test basis funktionalitet
- **Protected Routes** - Prøv at gå til `/admin` uden login
- **Role Access** - Test at kun admins kan se admin panel

---

## 🛡️ **Security Features:**

### **Password Security:**
- Passwords hashes med **bcryptjs** (12 rounds)
- Ingen plaintext passwords i database

### **JWT Security:**
- **NEXTAUTH_SECRET** for token signing
- **Short-lived sessions** med automatic refresh
- **httpOnly cookies** (NextAuth.js standard)

### **Role-Based Access:**
```typescript
// Middleware checker automatisk:
"/admin/*" → Kun ADMIN rolle
"/waiter/*" → WAITER eller ADMIN rolle  
"/kitchen/*" → KITCHEN eller ADMIN rolle
```

---

## 🎨 **UI Features:**

### **Navigation Updates:**
- **Ikke logget ind**: "Log ind" + "Opret konto" knapper
- **Logget ind**: User avatar + dropdown menu med logout
- **Admin bruger**: Ekstra "Admin Panel" link
- **Mobile responsive** auth menu

### **Form Features:**
- **Real-time validation**
- **Loading states** med spinners
- **Error handling** med brugervenlige beskeder
- **Auto-login** efter registrering

---

## 📂 **Filer Structure:**

```
src/
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts    # NextAuth handler
│   │   └── register/route.ts         # Registrering endpoint
│   ├── auth/
│   │   ├── signin/page.tsx           # Login side
│   │   └── signup/page.tsx           # Registrering side
│   ├── admin/page.tsx                # Admin dashboard
│   ├── components/
│   │   ├── navigation.tsx            # Opdateret med auth
│   │   └── providers.tsx             # SessionProvider
│   ├── lib/auth.ts                   # NextAuth konfiguration
│   └── layout.tsx                    # Opdateret med providers
├── types/next-auth.d.ts              # TypeScript types
├── middleware.ts                     # Rute beskyttelse
└── prisma/schema.prisma              # Auth modeller
```

---

## 🚀 **Næste Skridt:**

### **Forbedringer Du Kan Tilføje:**
1. **Email verification** for nye brugere
2. **Password reset** funktionalitet  
3. **OAuth providers** (Google, Facebook)
4. **User management** i admin panel
5. **Audit logging** for admin handlinger

### **Integration Med Reservations:**
```typescript
// Du kan nu linke reservationer til brugere:
const reservation = await prisma.reservation.create({
  data: {
    // ... reservation data
    customerId: session.user.id, // Link til logged-in user
  }
});
```

---

## 🎉 **Resultat:**

Du har nu et **professionelt authentication system** med:
- ✅ Sikker password håndtering
- ✅ JWT token-baseret sessions  
- ✅ Rolle-baseret adgangskontrol
- ✅ Responsive UI med auth states
- ✅ Middleware beskyttelse
- ✅ Type-safe TypeScript implementation

**System er klar til produktion** med små justeringer til secrets og environment konfiguration! 🚀