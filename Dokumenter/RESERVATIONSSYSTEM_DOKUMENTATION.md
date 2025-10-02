# 📋 Vesuvius Reservationssystem - Komplet Dokumentation

## 📖 Indholdsfortegnelse

1. [System Oversigt](#system-oversigt)
2. [Database Struktur](#database-struktur)
3. [API Endpoints](#api-endpoints)
4. [ReservationService Klasse](#reservationservice-klasse)
5. [Booking Algoritme](#booking-algoritme)
6. [Tidshåndtering](#tidshåndtering)
7. [Fejlhåndtering](#fejlhåndtering)
8. [Sikkerhed og Constraints](#sikkerhed-og-constraints)

---

## 🎯 System Oversigt

Vesuvius reservationssystemet håndterer bordreservationer for en restaurant med følgende karakteristika:

- **2-personers borde**: Alle borde er 2-personers borde der kombineres for større grupper
- **120 minutters spiseperiode**: Standard spisevarighed på 2 timer
- **Overlap prevention**: Avanceret system der forhindrer dobbeltbookinger
- **Real-time ledighed**: Live tjek af bordtilgængelighed

---

## 🗄️ Database Struktur

### **DiningTable Model**

```prisma
model DiningTable {
  id          String          @id @default(cuid())
  tableNumber Int             @unique
  seats       Int             @default(4) // Antal pladser per bord
  reserved    ReservedTable[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}
```

**Formål**: Repræsenterer fysiske borde i restauranten

### **Reservation Model**

```prisma
model Reservation {
  id           String            @id @default(cuid())
  partySize    Int               // Antal gæster
  slotStartUtc DateTime          // Start tidspunkt (UTC)
  slotEndUtc   DateTime          // Slut tidspunkt (UTC)
  customerId   String?           // Reference til kunde
  customer     Customer?
  status       ReservationStatus @default(CONFIRMED)
  reserved     ReservedTable[]   // Borde tildelt denne reservation
  orders       Order[]
}
```

**Formål**: Hovedreservation med tidspunkt og gæsteantal

### **ReservedTable Model (Junction Table)**

```prisma
model ReservedTable {
  id            String      @id @default(cuid())
  startUtc      DateTime    // Duplikeret for PostgreSQL exclusion constraint
  endUtc        DateTime    // Duplikeret for PostgreSQL exclusion constraint
  reservationId String
  reservation   Reservation
  tableId       String
  table         DiningTable
}
```

**Formål**: Forbinder reservationer med specifikke borde og håndterer overlap prevention

### **Customer Model**

```prisma
model Customer {
  id           String        @id @default(cuid())
  firstName    String
  lastName     String
  email        String        @unique
  phone        String?
  reservations Reservation[]
  orders       Order[]
}
```

**Formål**: Kundeinformation for reservationer

---

## 🔌 API Endpoints

### **POST /api/reservations**

Opretter en ny reservation

**Request Body:**

```json
{
  "date": "2025-10-15",
  "time": "18:00",
  "partySize": 4,
  "customerData": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+45 12345678"
  }
}
```

**Response (Success):**

```json
{
  "success": true,
  "reservationId": "cuid_12345",
  "message": "Reservation confirmed for 4 guests",
  "tables": [
    {
      "tableId": "table_1",
      "seats": 2,
      "tableNumber": 1
    },
    {
      "tableId": "table_2",
      "seats": 2,
      "tableNumber": 2
    }
  ]
}
```

**Validering:**

- Dato og tid skal være i fremtiden
- PartySize mellem 1-16 personer
- Gyldig email format
- Alle påkrævede felter skal være udfyldt

### **GET /api/reservations**

Tjekker bordtilgængelighed for specifikt tidspunkt

**Query Parameters:**

- `date`: YYYY-MM-DD format
- `time`: HH:MM format
- `partySize`: Antal gæster

**Response:**

```json
{
  "success": true,
  "available": true,
  "availableTables": [
    { "tableId": "table_1", "seats": 2, "tableNumber": 1 },
    { "tableId": "table_2", "seats": 2, "tableNumber": 2 }
  ],
  "capacity": {
    "availableSeats": 12,
    "totalSeats": 20,
    "availabilityPercentage": 60
  }
}
```

---

## 🛠️ ReservationService Klasse

### **findAvailableTables()**

```typescript
static async findAvailableTables(
  partySize: number,
  slotStart: Date,
  diningMinutes: number = 120
): Promise<TableAssignment[]>
```

**Formål**: Finder ledige borde for et givet tidspunkt og antal gæster

**Algoritme:**

1. Beregner slutidspunkt (start + 120 minutter)
2. Finder borde der IKKE er reserveret i tidsvinduet
3. Beregner antal borde behov: `Math.ceil(partySize / 2)`
4. Returnerer første X ledige borde

**Eksempel:**

- 5 gæster → 3 borde behov (ceil(5/2) = 3)
- 4 gæster → 2 borde behov (ceil(4/2) = 2)

### **createReservation()**

```typescript
static async createReservation(
  request: ReservationRequest
): Promise<ReservationResult>
```

**Formål**: Opretter en komplet reservation med bordtildeling

**Transaktionsflow:**

1. **Find ledige borde** inden for transaktion
2. **Tjek tilgængelighed** - nok borde til gæsteantal?
3. **Opret/find kunde** - eksisterende email eller ny kunde
4. **Opret reservation** - hovedreservation i database
5. **Reserver borde** - individuelle ReservedTable entries
6. **Returner resultat** - reservation ID og borddetaljer

**Fejlhåndtering:**

- PostgreSQL exclusion constraint violation (23P01) → "Table booking conflict"
- Utilstrækkelige borde → "Not enough tables available"
- Manglende kundeinfo → "Customer information required"

### **checkSlotCapacity()**

```typescript
static async checkSlotCapacity(
  date: Date,
  timeString: string
): Promise<CapacityInfo>
```

**Formål**: Beregner restaurantens kapacitetsudnyttelse

**Beregning:**

1. Total kapacitet: Sum af alle bord seats
2. Optaget kapacitet: Sum af reserverede seats i tidsvindue
3. Ledig kapacitet: Total - Optaget
4. Procent ledighed: (Ledig / Total) × 100

### **getReservationsForDate()**

```typescript
static async getReservationsForDate(date: Date)
```

**Formål**: Henter alle reservationer for en specifik dag med fuld information

**Includes:**

- Kunde information
- Tildelte borde med bordnumre
- Sorteret efter tidspunkt

---

## 🧮 Booking Algoritme

### **2-Top Kombination Strategi**

Vesuvius bruger en simpel men effektiv strategi:

```typescript
// Beregn antal borde behov
const tablesNeeded = Math.ceil(partySize / 2);

// Eksempler:
// 1 gæst → 1 bord (2-personers)
// 2 gæster → 1 bord
// 3 gæster → 2 borde
// 4 gæster → 2 borde
// 5 gæster → 3 borde
```

**Fordele:**

- Simpel og forudsigelig
- Maksimal fleksibilitet med 2-personers borde
- Nem at implementere og debugge

**Ulemper:**

- Kan "spilde" pladser ved ulige antal gæster
- Ikke optimalt for meget store grupper

### **Bordvalg Logik**

```sql
ORDER BY seats ASC, tableNumber ASC
```

Vælger mindste borde først, derefter laveste bordnummer for konsistens.

---

## ⏰ Tidshåndtering

### **UTC vs Local Time**

```typescript
// API modtager local tid
const slotStartLocal = new Date(date);
slotStartLocal.setHours(hours, minutes, 0, 0);

// Gemmes som UTC i database
slotStartUtc: slotStartLocal;
```

**Vigtige punkter:**

- Frontend sender lokal tid
- Database gemmer UTC
- 120 minutters standard spiseperiode
- Validering: reservation skal være i fremtiden

### **Tidsvindue Overlap**

```sql
-- PostgreSQL exclusion constraint
AND: [
  { startUtc: { lt: slotEnd } },
  { endUtc: { gt: slotStart } }
]
```

Forhindrer overlappende reservationer på samme bord.

---

## 🚨 Fejlhåndtering

### **API Niveau Validering**

```typescript
// Påkrævede felter
if (!date || !time || !partySize || !customerData) {
  return { error: "Missing required fields", status: 400 };
}

// Tidsformat validering
if (timeParts.length !== 2) {
  return { error: "Invalid time format. Use HH:MM", status: 400 };
}

// Gæsteantal validering
if (partySize < 1 || partySize > 16) {
  return { error: "Party size must be between 1 and 16", status: 400 };
}

// Fremtid validering
if (slotStartLocal <= new Date()) {
  return { error: "Reservation must be in the future", status: 400 };
}
```

### **Database Niveau Fejl**

```typescript
// PostgreSQL Exclusion Constraint
if (error.code === "23P01") {
  return {
    success: false,
    message: "Table booking conflict - please try another time slot",
  };
}
```

### **Serializability Isolation**

```typescript
await prisma.$transaction(
  async (tx) => {
    // Alle database operationer
  },
  {
    isolationLevel: "Serializable", // Højeste konsistens niveau
  }
);
```

---

## 🔒 Sikkerhed og Constraints

### **PostgreSQL Exclusion Constraint**

```sql
-- Forhindrer overlappende reservationer
EXCLUDE USING gist (
  table_id WITH =,
  tsrange(start_utc, end_utc) WITH &&
);
```

**Formål**: Hardware-niveau prevention af dobbeltbookinger

### **Transaction Isolation**

- **Serializable niveau**: Højeste konsistens
- **Automatic retry**: Ved concurrent access konflikter
- **Atomic operations**: Alt-eller-intet princip

### **Input Validering**

- Email format validering
- Tidsformat parsing med fejlhåndtering
- Gæsteantal grænser (1-16)
- Fremtid validering af reservationer

---

## 📊 Eksempel Flow

### **Scenario: 4 gæster, 18:00**

1. **API Request**:

   ```json
   {
     "date": "2025-10-15",
     "time": "18:00",
     "partySize": 4,
     "customerData": {...}
   }
   ```

2. **Validering**: ✅ Alle felter OK, tid i fremtiden

3. **Find Ledige Borde**:

   ```sql
   -- Søger borde IKKE reserveret 18:00-20:00
   SELECT * FROM dining_tables
   WHERE NOT EXISTS (
     SELECT 1 FROM reserved_tables
     WHERE table_id = dining_tables.id
     AND start_utc < '2025-10-15 20:00:00'
     AND end_utc > '2025-10-15 18:00:00'
   )
   ```

4. **Bordtildeling**:

   - 4 gæster → 2 borde behov
   - Vælger bord #1 og #2

5. **Transaktion**:

   ```typescript
   await tx.reservation.create({...});
   await tx.reservedTable.createMany([
     {tableId: "table_1", startUtc: "18:00", endUtc: "20:00"},
     {tableId: "table_2", startUtc: "18:00", endUtc: "20:00"}
   ]);
   ```

6. **Resultat**:
   ```json
   {
     "success": true,
     "reservationId": "res_123",
     "tables": [
       { "tableNumber": 1, "seats": 2 },
       { "tableNumber": 2, "seats": 2 }
     ]
   }
   ```

---

## 🎯 Konklusion

Vesuvius reservationssystemet er designet med fokus på:

- **Robusthed**: PostgreSQL constraints forhindrer data inkonsistens
- **Skalerbarhed**: Effektive queries og database indekser
- **Brugervenlighed**: Simpel API med klar fejlhåndtering
- **Fleksibilitet**: 2-personers borde kan håndtere alle gruppestr.

Systemet håndterer komplekse scenarier som concurrent bookings, overlap prevention og real-time kapacitetstjek på en pålidelig måde.
