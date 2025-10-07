import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  console.log("Clearing existing data...");
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservedTable.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.diningTable.deleteMany();
  await prisma.menuItemVariant.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.roles.deleteMany();
  console.log("Data cleared successfully");

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Appetizers & Salater",
      },
    }),
    prisma.category.create({
      data: {
        name: "Sandwiches",
      },
    }),
    prisma.category.create({
      data: {
        name: "Burgere",
      },
    }),
    prisma.category.create({
      data: {
        name: "Supper & Pastaretter",
      },
    }),
    prisma.category.create({
      data: {
        name: "Cocktails & Drinks",
      },
    }),
  ]);

  console.log("Categories created:", categories.length);

  const menuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        name: "Nachos Supreme",
        description:
          "Varme tortillachips med crispy kylling, jalapeños, gratineret med ost, serveres med salsa, guacamole og creme fraiche",
        price: 129.0,
        categoryId: categories[0].id,
        image:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Cæsar Salat",
        description:
          "Stegt kyllingebryst, hjertesalat vendt med cæsardressing, parmesanflager og croutoner",
        price: 139.0,
        categoryId: categories[0].id,
        image:
          "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Tigerrejesalat",
        description:
          "Stegte tigerrejer med kålsalat, avocado, nudler, agurk, gulerod, edamame bønner, mynte, cashewnødder og gomadressing",
        price: 139.0,
        categoryId: categories[0].id,
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Vegetar Salat",
        description:
          "Sweet potato, falafel, babyspinat, granatæble, bulgur, feta, tomater, edamame bønner, hjemmelavet basilikumpesto, græskarkerner og mynte",
        price: 119.0,
        categoryId: categories[0].id,
        image:
          "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=400&fit=crop",
      },
    }),

    // Sandwiches
    prisma.menuItem.create({
      data: {
        name: "Club Sandwich",
        description:
          "Stegt kyllingebryst, sprød bacon, karrymayonnaise, tomat og salat. Serveres med pommes frites og mayonnaise",
        price: 139.0,
        categoryId: categories[1].id,
        image:
          "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Laksesandwich",
        description:
          "Sandwich med røget laks, hjemmelavet basilikumspesto, salat, avocado og syltet rødløg. Serveres med pommes frites og mayonnaise",
        price: 149.0,
        categoryId: categories[1].id,
        image:
          "https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Spicy Steak Sandwich",
        description:
          "Sandwich med oksestrimler, salat, guacamole, jalapeños, syltede rødløg og spicy chilimayonnaise. Serveres med pommes frites og chilimayonnaise",
        price: 149.0,
        categoryId: categories[1].id,
        image:
          "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Tunsandwich",
        description:
          "Sandwich med tunmoussé, salat, avocado, syltede rødløg og hjemmelavet basilikumspesto. Serveres med pommes frites og mayonnaise",
        price: 139.0,
        categoryId: categories[1].id,
        image:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=400&fit=crop",
      },
    }),

    // Burgere
    prisma.menuItem.create({
      data: {
        name: "Vesuvius Burger",
        description:
          "Bøf af hakket oksekød i briochebolle med salat, pickles, tomat, syltede rødløg og burgerdressing. Serveres med pommes frites og mayonnaise",
        price: 149.0,
        categoryId: categories[2].id,
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Spicy Burger",
        description:
          "Bøf af hakket oksekød i briochebolle med salat, tomat, jalapeños, syltede rødløg og chilimayonnaise. Serveres med pommes frites og chilimayonnaise",
        price: 149.0,
        categoryId: categories[2].id,
        image:
          "https://images.unsplash.com/photo-1521305916504-4a1121188589?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Crispy Chicken Burger",
        description:
          "Sprød kylling i briochebolle med salat, tomat, syltede rødløg, chilimayonnaise, jalapeños og guacamole. Serveres med pommes frites og mayonnaise",
        price: 149.0,
        categoryId: categories[2].id,
        image:
          "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&h=400&fit=crop",
      },
    }),

    // Supper & Pastaretter
    prisma.menuItem.create({
      data: {
        name: "Tomatsuppe",
        description:
          "Tomatsuppe med creme fraiche og frisk basilikum. Serveres med brød og smør",
        price: 99.0,
        categoryId: categories[3].id,
        image:
          "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Pasta med Kylling",
        description: "Pasta med kylling, blandede svampe og parmesan",
        price: 169.0,
        categoryId: categories[3].id,
        image:
          "https://images.unsplash.com/photo-1573225342350-16731dd9bf3d?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Pasta med Oksemørbrad",
        description:
          "Pasta med grilllet oksemørbrad, blandede svampe og parmesan",
        price: 179.0,
        categoryId: categories[3].id,
        image:
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Pasta med Tigerrejer",
        description: "Pasta med tigerrejer, tomatsauce, parmesan og basilikum",
        price: 179.0,
        categoryId: categories[3].id,
        image:
          "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&h=400&fit=crop",
      },
    }),

    // Cocktails & Drinks
    prisma.menuItem.create({
      data: {
        name: "Aperol Spritz",
        description:
          "Aperol, prosecco, danskvand, appelsinskive. Klassiskeren til en varm sommerdag. Eller bare fordi...",
        price: 85.0,
        categoryId: categories[4].id,
        image:
          "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Espresso Martini",
        description:
          "Vodka/tequila, kahlua, espresso, vanilje. En klassiker med et twist, vælg mellem vodka eller tequila",
        price: 85.0,
        categoryId: categories[4].id,
        image:
          "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Dark n Stormy",
        description:
          "Mørk rom, gingerbeer, friskpresset limesat og gomme sirup",
        price: 85.0,
        categoryId: categories[4].id,
        image:
          "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Mojito",
        description: "Rom, mynte, rørsukker, friskpresset limesaft, limeskiver",
        price: 85.0,
        categoryId: categories[4].id,
        image:
          "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Gin Tonic",
        description: "Gin, tonic, citronskive",
        price: 85.0,
        categoryId: categories[4].id,
        image:
          "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Moscow Mule",
        description: "Vodka, friskpresset limesaft, gingerbeer",
        price: 85.0,
        categoryId: categories[4].id,
        image:
          "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Strawberry Daiquiri",
        description: "Lys rom, jordbær, friskpresset lime, gomme sirup",
        price: 85.0,
        categoryId: categories[4].id,
        image:
          "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Gin Hass",
        description: "Gin, mangojuice, frisk lime og lemon",
        price: 85.0,
        categoryId: categories[4].id,
        image:
          "https://images.unsplash.com/photo-1605270012917-bf3c98a2e1ea?w=500&h=400&fit=crop",
      },
    }),
  ]);

  console.log("Menu items created:", menuItems.length);

  const diningTables = [];

  for (let i = 1; i <= 25; i++) {
    const table = await prisma.diningTable.create({
      data: {
        tableNumber: i,
        seats: 2,
      },
    });
    diningTables.push(table);
  }
  console.log("Dining tables created:", diningTables.length);

  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "12345678",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "87654321",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Alice",
        lastName: "Johnson",
        email: "alice.j@example.com",
        phone: "55512345",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Bob",
        lastName: "Brown",
        email: "bob.brown@example.com",
        phone: "44498765",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Chris",
        lastName: "Davis",
        email: "chris.d@example.com",
        phone: "33322111",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Eva",
        lastName: "Martinez",
        email: "eva.m@example.com",
        phone: "66677888",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Frank",
        lastName: "Wilson",
        email: "frank.w@example.com",
        phone: "11122233",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Grace",
        lastName: "Taylor",
        email: "grace.t@example.com",
        phone: "77788899",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Henry",
        lastName: "Anderson",
        email: "henry.a@example.com",
        phone: "88899900",
      },
    }),
    prisma.customer.create({
      data: {
        firstName: "Ivy",
        lastName: "Thomas",
        email: "ivy.t@example.com",
        phone: "22233344",
      },
    }),
  ]);

  console.log("Customers created:", customers.length);

  // Create sample reservations with UTC timestamps and 120-minute dwell time
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  // Helper function to create UTC datetime from date and time
  function createUtcDateTime(date: Date, timeString: string): Date {
    const [hours, minutes] = timeString.split(":").map(Number);
    // Create a date string in ISO format with the local time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hoursStr = String(hours).padStart(2, "0");
    const minutesStr = String(minutes).padStart(2, "0");

    // Parse as Europe/Copenhagen time and convert to UTC
    const localDateString = `${year}-${month}-${day}T${hoursStr}:${minutesStr}:00`;
    // This assumes the server is configured with the correct timezone
    return new Date(localDateString);
  }

  const reservations = await Promise.all([
    prisma.reservation.create({
      data: {
        partySize: 2,
        slotStartUtc: createUtcDateTime(tomorrow, "18:00"),
        slotEndUtc: createUtcDateTime(tomorrow, "20:00"), // 120 minutes later
        customerId: customers[0].id,
        status: "CONFIRMED",
      },
    }),
    prisma.reservation.create({
      data: {
        partySize: 4,
        slotStartUtc: createUtcDateTime(tomorrow, "18:30"),
        slotEndUtc: createUtcDateTime(tomorrow, "20:30"), // 120 minutes later
        customerId: customers[1].id,
        status: "CONFIRMED",
      },
    }),
    prisma.reservation.create({
      data: {
        partySize: 3,
        slotStartUtc: createUtcDateTime(dayAfter, "19:00"),
        slotEndUtc: createUtcDateTime(dayAfter, "21:00"), // 120 minutes later
        customerId: customers[2].id,
        status: "CONFIRMED",
      },
    }),
    prisma.reservation.create({
      data: {
        partySize: 6,
        slotStartUtc: createUtcDateTime(dayAfter, "19:30"),
        slotEndUtc: createUtcDateTime(dayAfter, "21:30"), // 120 minutes later
        customerId: customers[3].id,
        status: "CONFIRMED",
      },
    }),
  ]);

  console.log("Reservations created:", reservations.length);

  // Create reserved tables (link reservations to tables with time ranges)
  await Promise.all([
    prisma.reservedTable.create({
      data: {
        reservationId: reservations[0].id,
        tableId: diningTables[0].id, // 2-top for party of 2
        startUtc: reservations[0].slotStartUtc,
        endUtc: reservations[0].slotEndUtc,
      },
    }),
    prisma.reservedTable.create({
      data: {
        reservationId: reservations[1].id,
        tableId: diningTables[16].id, // Table 17: 4-top for party of 4
        startUtc: reservations[1].slotStartUtc,
        endUtc: reservations[1].slotEndUtc,
      },
    }),
    prisma.reservedTable.create({
      data: {
        reservationId: reservations[2].id,
        tableId: diningTables[17].id, // Table 18: 4-top for party of 3
        startUtc: reservations[2].slotStartUtc,
        endUtc: reservations[2].slotEndUtc,
      },
    }),
    prisma.reservedTable.create({
      data: {
        reservationId: reservations[3].id,
        tableId: diningTables[18].id, // Table 19: 6-top for party of 6
        startUtc: reservations[3].slotStartUtc,
        endUtc: reservations[3].slotEndUtc,
      },
    }),
  ]);

  console.log("Reserved tables created");

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        reservationId: reservations[0].id,
        customerId: customers[0].id,
        status: "ORDERED",
        totalPrice: 248.0,
      },
    }),
    prisma.order.create({
      data: {
        reservationId: reservations[1].id,
        customerId: customers[1].id,
        status: "SERVED",
        totalPrice: 415.0,
      },
    }),
  ]);

  console.log("Orders created:", orders.length);

  // Create order items
  await Promise.all([
    prisma.orderItem.create({
      data: {
        orderId: orders[0].id,
        menuItemId: menuItems[0].id,
        quantity: 2,
        unitPrice: menuItems[0].price,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[0].id,
        menuItemId: menuItems[2].id,
        quantity: 1,
        unitPrice: menuItems[2].price,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[1].id,
        menuItemId: menuItems[3].id,
        quantity: 2,
        unitPrice: menuItems[3].price,
      },
    }),
    prisma.orderItem.create({
      data: {
        orderId: orders[1].id,
        menuItemId: menuItems[4].id,
        quantity: 3,
        unitPrice: menuItems[4].price,
      },
    }),
  ]);

  console.log("Order items created");

  await Promise.all([
    prisma.roles.createMany({
      data: [
        { roleName: "ADMIN" },
        { roleName: "COOK" },
        { roleName: "WAITER" },
        { roleName: "USER" },
      ],
    }),
  ]);

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
