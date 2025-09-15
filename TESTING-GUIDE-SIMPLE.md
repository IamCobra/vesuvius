# Unit Testing Guide for Vesuvius Restaurant

## Setup Overview

Vi har sat unit testing op med følgende framework:

### 🧪 Test Stack

- **Jest**: Test framework
- **TypeScript**: Type safety in tests
- **Next.js Jest Integration**: Automatisk setup af Next.js features

### 📁 Test Struktur

```
__tests__/
├── constants/          # Tests for konstanter og config
└── utils/              # Tests for utility funktioner
```

**Hvorfor `__tests__`?** 🤔
Jest leder automatisk efter test filer i mapper der hedder `__tests__` eller filer der ender med `.test.js`. Det er industristandard og gør at Jest finder dine tests automatisk!

## 🚀 Test Commands

```bash
# Kør alle tests
npm test

# Kør tests i watch mode (genstart automatisk)
npm run test:watch

# Kør tests med coverage rapport
npm run test:coverage

# Kør specifikke tests
npm test -- --testPathPattern=constants
npm test -- --testPathPattern=utils
```

## 📝 Vores Aktuelle Tests

### 1. **Constants Tests** (Nemme!)

Test for restaurant konfiguration:

```typescript
// __tests__/constants/restaurant.test.ts
it("should have correct restaurant name", () => {
  expect(RESTAURANT_INFO.name).toBe("Vesuvius");
});
```

**Hvad tester vi:**

- ✅ Restaurant navn er korrekt
- ✅ Kontakt information er valid
- ✅ Kapacitets beregninger
- ✅ Åbningstider format
- ✅ Tidspunkter format

### 2. **Utility Functions Tests** (Også nemme!)

Test for hjælpefunktioner:

```typescript
// __tests__/utils/helpers.test.ts
it("should format price correctly", () => {
  expect(formatPrice(100)).toBe("100 kr.");
});
```

**Hvad tester vi:**

- ✅ Pris formattering
- ✅ Email validering
- ✅ Telefon validering
- ✅ Total beregning

## 🎯 Hvorfor disse tests?

### ✅ **Constants Tests**

- **Nem at forstå**: Bare sammenligning af værdier
- **Vigtig**: Sikrer konfiguration er korrekt
- **Hurtig feedback**: Opdager fejl i restaurant info med det samme

### ✅ **Utility Tests**

- **Enkel logik**: Hver funktion gør én ting
- **Praktisk**: Funktioner du faktisk bruger i appen
- **Nemt at debugge**: Hvis test fejler, ved du præcis hvad der er galt

## 📦 Hvad kan du teste næste gang?

### 🟢 Lette at tilføje

```typescript
// Flere utility funktioner
function formatDate(date: Date): string { ... }
function validateReservation(data: ReservationData): boolean { ... }
function calculateDiscount(price: number, percent: number): number { ... }
```

### 🟡 Medium sværhed

```typescript
// Business logic funktioner (uden database)
function findBestTimeSlot(partySize: number, preferredTime: string): string { ... }
function generateReceiptNumber(): string { ... }
```

### 🔴 Undgå indtil videre

- Database operationer (Prisma)
- API calls
- React komponenter
- External services

## 🔧 Debugging Tests

### Common Issues

```bash
# Module not found fejl
npm test -- --clearCache

# Se hvad der køres
npm test -- --verbose

# Kør kun én test fil
npm test constants
```

## 📋 Test Best Practices

### ✅ Gode tests

```typescript
// Specifik og klar
it("should format 100 as '100 kr.'", () => {
  expect(formatPrice(100)).toBe("100 kr.");
});

// Test edge cases
it("should handle zero price", () => {
  expect(formatPrice(0)).toBe("0 kr.");
});
```

### ❌ Undgå

```typescript
// For bred og uklar
it("should work correctly", () => {
  expect(someFunction()).toBeTruthy(); // Hvad betyder "work"?
});
```

## 🎬 Næste Skridt

1. **Kør eksisterende tests** - `npm test`
2. **Læg flere utility funktioner til** - Formattering, validering
3. **Test edge cases** - Tomme værdier, negative tal
4. **Tilføj business logic** - Uden database afhængigheder

## 🏆 Success Metrics

- ✅ **14 tests passed** - Alle vores tests virker!
- 🎯 **0 failures** - Ingen fejl
- ⚡ **Under 1 sekund** - Hurtige tests

Du har nu et solidt foundation til unit testing! 🚀
