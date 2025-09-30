# Vesuvius Reservation System - Komplet Guide

Dette dokument forklarer hele reservation-systemet i Vesuvius restauranten, fra database til frontend.

## Oversigt af Systemet

Reservation-systemet består af følgende hovedkomponenter:

1. **Database Layer** (Prisma Schema)
2. **Service Layer** (`ReservationService`)
3. **API Layer** (`/api/reservations`)
4. **Frontend Layer** (`/reservation` side)

---

## 1. DATABASE STRUKTUR (Prisma Schema)

### Hovedmodeller til Reservationer:

#### DiningTable (Bordene)

```prisma
model DiningTable {
  id          String          @id @default(cuid())
  tableNumber Int             @unique
  seats       Int             @default(4)
  reserved    ReservedTable[]
}
```

- **Koncept**: Alle borde er 2-personers borde
- **Flexibilitet**: Kombineres for større selskaber (3-4 personer = 2 borde, osv.)

#### Customer (Kunder)

```prisma
model Customer {
  id           String        @id @default(cuid())
  firstName    String
  lastName     String
  email        String        @unique
  phone        String?
  reservations Reservation[]
}
```

- Gemmer kunde-information
- Email er unik identifikator

#### Reservation (Reservationer)

```prisma
model Reservation {
  id           String            @id @default(cuid())
  partySize    Int
  slotStartUtc DateTime
  slotEndUtc   DateTime         // slotStartUtc + 120 minutter
  customerId   String?
  customer     Customer?         @relation(fields: [customerId], references: [id])
  status       ReservationStatus @default(CONFIRMED)
  reserved     ReservedTable[]
}
```

- **Koncept**: Fast 120 minutters spisetid
- **Status typer**: CONFIRMED, CANCELLED, COMPLETED, NO_SHOW

#### ReservedTable (Bord-reservationer)

```prisma
model ReservedTable {
  id            String      @id @default(cuid())
  startUtc      DateTime
  endUtc        DateTime
  reservationId String
  reservation   Reservation @relation(fields: [reservationId], references: [id], onDelete: Cascade)
  tableId       String
  table         DiningTable @relation(fields: [tableId], references: [id])
}
```

- **Vigtig**: Forhindrer overlap mellem reservationer på samme bord
- **PostgreSQL Exclusion Constraint**: Sikrer ingen tidskonflikter

---

## 2. SERVICE LAYER (ReservationService)

### Hovedfunktioner:

#### `findAvailableTables(partySize, slotStart, diningMinutes)`

**Formål**: Find ledige borde for et givet tidspunkt

**Logik**:

1. Beregn slut-tid (start + 120 minutter)
2. Find alle borde IKKE reserveret i tidsvinduet
3. Beregn hvor mange borde der er nødvendige: `Math.ceil(partySize / 2)`
4. Returner de første tilgængelige borde

```typescript
// Eksempel: 5 personer = Math.ceil(5/2) = 3 borde
const tablesNeeded = Math.ceil(partySize / 2);
```

#### `createReservation(request)`

**Formål**: Opret ny reservation med bord-tildeling

**Proces**:

1. Start **Serializable Transaction** (højeste isolationsniveau)
2. Find tilgængelige borde inden for transaktionen
3. Opret/find kunde
4. Opret reservation
5. Opret ReservedTable entries for hvert bord
6. Returner resultat

**Fejlhåndtering**:

- PostgreSQL constraint violation (23P01) → "Table booking conflict"
- Ikke nok borde → "Not enough tables available"

#### `checkSlotCapacity(date, timeString)`

**Formål**: Check tilgængelighed for UI (bruges til at vise ledige tider)

**Returnerer**:

```typescript
{
  availableSeats: number;
  totalSeats: number;
  availabilityPercentage: number;
}
```

---

## 3. API LAYER (/api/reservations/route.ts)

### POST Endpoint

**Formål**: Modtag reservation-anmodninger fra frontend

**Input validering**:

- partySize (1-20 personer)
- Dato skal være i fremtiden
- Email format validering

**Proces**:

1. Parse og validér input data
2. Konvertér lokal tid til UTC
3. Kald `ReservationService.createReservation()`
4. Returner resultat til frontend

**Response format**:

```typescript
{
  success: boolean,
  reservationId?: string,
  message: string,
  tables?: Array<{ tableNumber: number; seats: number }>
}
```

---

## 4. FRONTEND LAYER (/reservation/page.tsx)

### State Management

```typescript
const [reservationData, setReservationData] = useState({
  guests: 2,
  date: "",
  time: "",
  name: "",
  email: "",
  phone: "",
});
```

### UI Flow (3-trinns modal):

#### Trin 1: Valg af dato, tid og antal gæster

- **Tidsmuligheder**: 10:00-22:00 (hver 30. minut)
- **Real-time availability check**: Når bruger ændrer dato/tid
- **Validering**: Dato skal være i dag eller fremtiden

#### Trin 2: Kunde-information

- Navn, email, telefon
- Email validering
- Form submission til API

#### Trin 3: Bekræftelse

- Viser reservations-ID
- Tildelte borde information
- Bekræftelses-besked

### Availability Checking

```typescript
const checkAvailability = async (date: string, time: string) => {
  // Kalder API for at tjekke tilgængelighed
  // Opdaterer availabilityData state
};
```

---

## 5. VIGTIGE KONCEPTER

### Bord-kombinationsstrategi

- **Alle borde er 2-personers**
- **1-2 gæster**: 1 bord
- **3-4 gæster**: 2 borde
- **5-6 gæster**: 3 borde
- **7-8 gæster**: 4 borde

### Tidsbaseret Booking

- **Fast spisetid**: 120 minutter
- **Tidsslots**: Hver 30. minut fra 10:00-22:00
- **Overlap prevention**: PostgreSQL exclusion constraints

### Transaction Safety

- **Serializable isolation**: Forhindrer race conditions
- **Atomicity**: Enten oprettes hele reservationen eller intet
- **Consistency**: Database constraint enforcement

### Fejlhåndtering

- **Constraint violations**: Elegant fejlbesked til bruger
- **Kapacitetsproblemer**: "Ikke nok borde tilgængelige"
- **Validering**: Client-side og server-side validation

---

## 6. DATAFLOW EKSEMPEL

### Scenarie: Bruger booker bord til 4 personer

1. **Frontend**: Bruger vælger 4 gæster, dato og tid
2. **Availability Check**: API tjekker tilgængelighed
3. **Form Submission**: Bruger udfylder kontaktinfo
4. **API Call**: POST til `/api/reservations`
5. **Service Call**: `ReservationService.createReservation()`
6. **Database Transaction**:
   - Find 2 ledige borde (4 personer ÷ 2 = 2 borde)
   - Opret kunde record
   - Opret reservation record
   - Opret 2 ReservedTable records
7. **Response**: Returner reservation-ID og bord-numre
8. **Frontend**: Vis bekræftelse med detaljer

---

## 7. FILER AT UNDERSØGE

### Backend Logic:

- `src/app/lib/reservation-service.ts` - Hovedlogik
- `src/app/api/reservations/route.ts` - API endpoint
- `prisma/schema.prisma` - Database struktur

### Frontend:

- `src/app/reservation/page.tsx` - Bruger interface
- `src/app/lib/prisma.ts` - Database forbindelse

### Database:

- `prisma/migrations/` - Database schema evolution
- `prisma/seed.ts` - Test data

Dette system sikrer robust, skalerbar reservation-håndtering med komplet konflikt-forebyggelse og brugervenlig interface.
