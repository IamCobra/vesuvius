# 🔐 Vesuvius Sikkerhedsdokumentation

## 📖 Oversigt for Nybegyndere

Denne dokumentation forklarer sikkerhedssystemet i Vesuvius restaurantens hjemmeside på en måde, så alle kan forstå det - også hvis du er ny til programmering!

## 🎯 Hvad beskytter vores sikkerhedssystem?

### 1. **Login/Logout System** 🔑

- Kun registrerede brugere kan logge ind
- Passwords er krypteret i databasen (ingen kan se dem)
- Automatisk logout efter 1 time
- Forskellige brugerroller: USER, ADMIN, WAITER, KITCHEN

### 2. **Rate Limiting** 🛡️

- Beskytter mod folk der prøver at gætte passwords
- Maksimalt 5 login forsøg per IP adresse per 15 minutter
- Automatisk blokering og reset

### 3. **Password Sikkerhed** 🔒

- Mindst 8 tegn langt
- Skal indeholde: lille bogstav, stort bogstav, tal, specialtegn
- Eksempel på gyldigt password: `MyPassword123!`

---

## 🏗️ Teknisk Arkitektur

```
Frontend (React/Next.js)
    ↓
NextAuth.js (Session Management)
    ↓
Rate Limiting (Prisma Database)
    ↓
User Authentication (bcrypt + Database)
    ↓
Role-based Access Control
```

---

## 📁 Fil Struktur og Formål

### `/src/app/lib/auth.ts` - Hovedkonfiguration

**Hvad gør den?**

- Konfigurerer NextAuth.js (login systemet)
- Definerer hvordan login skal fungere
- Sætter session timeout til 1 time
- Håndterer brugerroller

**Vigtige funktioner:**

- `authorize()` - Tjekker om email/password er korrekt
- `jwt()` callback - Håndterer JWT tokens
- `session()` callback - Opdaterer session data

### `/src/app/lib/rate-limit.ts` - Brute Force Beskyttelse

**Hvad gør den?**

- Tæller login forsøg per IP adresse
- Blokerer IP'er der prøver for ofte
- Automatisk reset efter timeout

**Vigtige funktioner:**

- `checkRateLimit()` - Hovedfunktionen der tjekker om login er tilladt
- `getClientIP()` - Finder brugerens IP adresse

### `/src/app/api/auth/register/route.ts` - Brugeroprettelse

**Hvad gør den?**

- Håndterer når nye brugere registrerer sig
- Validerer password krav
- Krypterer passwords før gem i database
- Inkluderer rate limiting

### `/prisma/schema.prisma` - Database Structure

**Vigtige tabeller:**

- `User` - Brugerkonti med roles
- `LoginAttempt` - Rate limiting data
- `Session` / `Account` - NextAuth.js data

---

## 🔒 Sikkerhedsflow Step-by-Step

### Når en bruger prøver at logge ind:

1. **📝 Bruger udfylder login form**

   - Email og password sendes til serveren

2. **🔍 Rate Limiting Check**

   - System tjekker: Har denne IP prøvet for mange gange?
   - Hvis ja → Blokér forsøget
   - Hvis nej → Fortsæt til næste step

3. **🗃️ Database Lookup**

   - Find bruger med den email adresse
   - Hvis ikke fundet → Afvis login

4. **🔐 Password Verification**

   - Sammenlign indtastet password med krypteret version
   - Bruger bcrypt bibliotek (industri standard)
   - Hvis forkert → Afvis login

5. **🎫 Session Creation**

   - Opret JWT token med bruger info
   - Sæt token til at udløbe efter 1 time
   - Send token til browseren som cookie

6. **✅ Success Redirect**
   - Redirect bruger til forsiden
   - Navigation viser "logget ind" tilstand

### Når en session tjekkes:

1. **🎫 Token Validation**

   - Er JWT token gyldigt og ikke udløbet?

2. **👤 User Existence Check**

   - Eksisterer brugeren stadig i databasen?
   - Er kontoen aktiv?

3. **🔄 Role Update**
   - Hent frisk rolle fra database
   - Opdater session med nyeste info

---

## ⚙️ Konfiguration og Indstillinger

### Rate Limiting Indstillinger

```typescript
// I rate-limit.ts
const MAX_ATTEMPTS = 5; // Antal tilladte forsøg
const WINDOW_MINUTES = 15; // Timeout periode i minutter
```

### Session Indstillinger

```typescript
// I auth.ts
session: {
  maxAge: 60 * 60,    // 1 time (3600 sekunder)
}
```

### Password Krav

```typescript
// I register/route.ts
- Minimum 8 tegn
- Mindst 1 lille bogstav (a-z)
- Mindst 1 stort bogstav (A-Z)
- Mindst 1 tal (0-9)
- Mindst 1 specialtegn (!@#$%^&*(),.?":{}|<>)
```

---

## 🚨 Almindelige Problemer og Løsninger

### Problem: "For mange forsøg" fejl

**Årsag:** IP adressen har prøvet at logge ind for mange gange
**Løsning:** Vent 15 minutter, eller ryd rate limiting data i databasen

### Problem: Session udløber hurtigt

**Årsag:** Session timeout er sat til 1 time
**Løsning:** Ændr `maxAge` i auth.ts eller log ind igen

### Problem: Password afvist selvom det er korrekt

**Årsag:** Password opfylder ikke sikkerhedskravene
**Løsning:** Tjek at password har alle påkrævede tegn typer

### Problem: "Cannot find name 'prisma'" fejl

**Årsag:** Prisma client er ikke genereret efter database ændringer
**Løsning:** Kør `npx prisma generate`

---

## 🔧 Hvordan man ændrer sikkerhedsindstillinger

### Ændre Rate Limiting

1. Åbn `/src/app/lib/rate-limit.ts`
2. Ændr `MAX_ATTEMPTS` og `WINDOW_MINUTES`
3. Genstart serveren

### Ændre Session Timeout

1. Åbn `/src/app/lib/auth.ts`
2. Ændr `maxAge` værdien (i sekunder)
3. Genstart serveren

### Ændre Password Krav

1. Åbn `/src/app/api/auth/register/route.ts`
2. Modificer regex pattern i password validering
3. Genstart serveren

---

## 🛠️ Vedligeholdelse

### Ryd gamle rate limiting data

```sql
-- Kør denne SQL hver måned
DELETE FROM "login_attempts"
WHERE "lastAttempt" < NOW() - INTERVAL '30 days';
```

### Tjek sikkerhedslog

```javascript
// Se seneste login forsøg
const attempts = await prisma.loginAttempt.findMany({
  orderBy: { lastAttempt: "desc" },
  take: 10,
});
```

---

## 📚 Yderligere Læsning

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [bcrypt Library Guide](https://www.npmjs.com/package/bcryptjs)
- [JWT Token Security](https://jwt.io/introduction)
- [Prisma ORM Documentation](https://www.prisma.io/docs)

---

## 🆘 Hjælp og Support

Hvis du støder på problemer:

1. **Tjek terminalen** for fejlbeskeder
2. **Læs denne dokumentation** igen
3. **Kig i browseren's console** for frontend fejl
4. **Tjek database forbindelsen** med `npx prisma studio`

**Husk:** Sikkerhed er vigtigt, men det skal ikke gøre systemet ubrugeligt! 🎯
