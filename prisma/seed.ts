import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clean existing data (in correct order due to foreign key constraints)
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.reservedTable.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.diningTable.deleteMany();

  console.log("🗑️  Cleaned existing data");

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: "appetizers-salater",
        name: "Appetizers & Salater",
      },
    }),
    prisma.category.create({
      data: {
        id: "sandwiches",
        name: "Sandwiches",
      },
    }),
    prisma.category.create({
      data: {
        id: "burgere",
        name: "Burgere",
      },
    }),
    prisma.category.create({
      data: {
        id: "supper-pasta",
        name: "Supper & Pastaretter",
      },
    }),
    prisma.category.create({
      data: {
        id: "cocktails-drinks",
        name: "Cocktails & Drinks",
      },
    }),
  ]);

  console.log("✅ Created categories");

  // Create menu items
  const menuItems = await Promise.all([
    // Appetizers & Salater
    prisma.menuItem.create({
      data: {
        id: "caesar-salad",
        name: "Caesar Salad",
        description:
          "Klassisk caesar salat med sprøde croutoner, parmesan og hjemmelavet dressing",
        price: 145,
        categoryId: "appetizers-salater",
        image:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
      },
    }),
    prisma.menuItem.create({
      data: {
        id: "caprese-salad",
        name: "Caprese Salad",
        description:
          "Frisk mozzarella, modne tomater og basilikum drysset med balsamico",
        price: 135,
        categoryId: "appetizers-salater",
        image:
          "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400",
      },
    }),
    prisma.menuItem.create({
      data: {
        id: "vesuvius-bruschetta",
        name: "Vesuvius Bruschetta",
        description:
          "Ristet brød toppet med friske tomater, hvidløg og basilikum",
        price: 95,
        categoryId: "appetizers-salater",
        image:
          "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400",
      },
    }),
    prisma.menuItem.create({
      data: {
        id: "antipasti-platte",
        name: "Antipasti Platte",
        description:
          "Udvalg af italienske pølser, oste, oliven og soltørrede tomater",
        price: 195,
        categoryId: "appetizers-salater",
        image:
          "https://images.unsplash.com/photo-1544025162-d76694265947?w=400",
      },
    }),

    // Sandwiches
    prisma.menuItem.create({
      data: {
        id: "vesuvius-club",
        name: "Vesuvius Club Sandwich",
        description:
          "Trelags sandwich med kylling, bacon, salat, tomat og aioli",
        price: 165,
        categoryId: "sandwiches",
        image:
          "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=400",
      },
    }),
    prisma.menuItem.create({
      data: {
        id: "prosciutto-sandwich",
        name: "Prosciutto & Mozarella Sandwich",
        description:
          "Lufttørret skinke med cremet mozarella, rucola og balsamico glaze",
        price: 155,
        categoryId: "sandwiches",
        image:
          "https://images.unsplash.com/photo-1565060299809-add3c8946c3d?w=400",
      },
    }),
    prisma.menuItem.create({
      data: {
        id: "grilled-veggie",
        name: "Grilled Veggie Sandwich",
        description:
          "Grillede grøntsager med hummus, avocado og friske krydderurter",
        price: 135,
        categoryId: "sandwiches",
        image:
          "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400",
      },
    }),
    prisma.menuItem.create({
      data: {
        id: "steak-sandwich",
        name: "Vesuvius Steak Sandwich",
        description:
          "Mørt oksekød med karameliseret løg, rucola og trøffel mayonnaise",
        price: 195,
        categoryId: "sandwiches",
        image:
          "https://images.unsplash.com/photo-1565299585323-38174c4a6688?w=400",
      },
    }),

    // Burgere
    prisma.menuItem.create({
      data: {
        id: "vesuvius-burger",
        name: "Vesuvius Classic Burger",
        description:
          "Saftig oksekødsbøf med cheddar, salat, tomat, løg og vores specialsauce",
        price: 175,
        categoryId: "burgere",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
      },
    }),
    prisma.menuItem.create({
      data: {
        id: "truffle-burger",
        name: "Truffle Mushroom Burger",
        description: "Luksus burger med trøffel svampe, gruyere ost og rucola",
        price: 215,
        categoryId: "burgere",
        image:
          "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400",
      },
    }),
    prisma.menuItem.create({
      data: {
        id: "chicken-burger",
        name: "Crispy Chicken Burger",
        description: "Sprød paneret kyllingebryst med coleslaw og chilimayo",
        price: 165,
        categoryId: "burgere",
        image:
          "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=400",
      },
    }),

    // Supper & Pastaretter
    prisma.menuItem.create({
      data: {
        id: "vesuvius-pasta",
        name: "Vesuvius Signature Pasta",
        description:
          "Hjemmelavet pasta med italienske pølser, tomater og basilikum",
        price: 185,
        categoryId: "supper-pasta",
        image:
          "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400",
      },
    }),
    prisma.menuItem.create({
      data: {
        id: "tomato-soup",
        name: "Vesuvius Tomato Soup",
        description: "Cremet tomatsuppe med friske krydderurter og parmesan",
        price: 115,
        categoryId: "supper-pasta",
        image:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400",
      },
    }),

    // Cocktails & Drinks
    prisma.menuItem.create({
      data: {
        id: "vesuvius-mojito",
        name: "Vesuvius Mojito",
        description: "Klassisk mojito med mint, lime og hvid rom",
        price: 95,
        categoryId: "cocktails-drinks",
        image:
          "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400",
      },
    }),
    prisma.menuItem.create({
      data: {
        id: "volcanic-punch",
        name: "Volcanic Punch",
        description: "Vores signatur cocktail med eksotiske frugter og rom",
        price: 125,
        categoryId: "cocktails-drinks",
        image:
          "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400",
      },
    }),
    prisma.menuItem.create({
      data: {
        id: "italian-spritz",
        name: "Italian Spritz",
        description: "Forfriskende aperitif med prosecco, aperol og sodavand",
        price: 85,
        categoryId: "cocktails-drinks",
        image:
          "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
      },
    }),
  ]);

  console.log("✅ Created menu items");

  // Create time slots
  const timeSlots = await Promise.all([
    // Frokost slots
    prisma.timeSlot.create({
      data: {
        id: "slot1",
        startTime: "11:00",
        endTime: "13:00",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot2",
        startTime: "11:15",
        endTime: "13:15",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot3",
        startTime: "11:30",
        endTime: "13:30",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot4",
        startTime: "11:45",
        endTime: "13:45",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot5",
        startTime: "12:00",
        endTime: "14:00",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot6",
        startTime: "12:15",
        endTime: "14:15",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot7",
        startTime: "12:30",
        endTime: "14:30",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot8",
        startTime: "12:45",
        endTime: "14:45",
        maxTables: 25,
      },
    }),

    // Middag slots
    prisma.timeSlot.create({
      data: {
        id: "slot9",
        startTime: "18:00",
        endTime: "20:00",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot10",
        startTime: "18:15",
        endTime: "20:15",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot11",
        startTime: "18:30",
        endTime: "20:30",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot12",
        startTime: "18:45",
        endTime: "20:45",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot13",
        startTime: "19:00",
        endTime: "21:00",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot14",
        startTime: "19:15",
        endTime: "21:15",
        maxTables: 25,
      },
    }),
    prisma.timeSlot.create({
      data: {
        id: "slot15",
        startTime: "19:30",
        endTime: "21:30",
        maxTables: 25,
      },
    }),
  ]);

  console.log("✅ Created time slots");

  // Create dining tables - 25 tables with 2 seats each
  const diningTables = await Promise.all([
    prisma.diningTable.create({
      data: { id: "table1", tableNumber: 1, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table2", tableNumber: 2, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table3", tableNumber: 3, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table4", tableNumber: 4, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table5", tableNumber: 5, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table6", tableNumber: 6, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table7", tableNumber: 7, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table8", tableNumber: 8, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table9", tableNumber: 9, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table10", tableNumber: 10, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table11", tableNumber: 11, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table12", tableNumber: 12, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table13", tableNumber: 13, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table14", tableNumber: 14, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table15", tableNumber: 15, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table16", tableNumber: 16, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table17", tableNumber: 17, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table18", tableNumber: 18, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table19", tableNumber: 19, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table20", tableNumber: 20, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table21", tableNumber: 21, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table22", tableNumber: 22, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table23", tableNumber: 23, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table24", tableNumber: 24, seats: 2 },
    }),
    prisma.diningTable.create({
      data: { id: "table25", tableNumber: 25, seats: 2 },
    }),
  ]);

  console.log("✅ Created dining tables");

  console.log("🌱 Seed completed successfully!");
  console.log(`📊 Created:
  - ${categories.length} categories
  - ${menuItems.length} menu items  
  - ${timeSlots.length} time slots
  - ${diningTables.length} dining tables`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
