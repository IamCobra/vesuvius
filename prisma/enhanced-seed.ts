import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data in correct order to handle foreign key constraints
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.reservedTable.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.diningTable.deleteMany();
  await prisma.menuItemVariant.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Pizzaer",
      },
    }),
    prisma.category.create({
      data: {
        name: "Salater",
      },
    }),
    prisma.category.create({
      data: {
        name: "Hovedretter",
      },
    }),
    prisma.category.create({
      data: {
        name: "Desserter",
      },
    }),
    prisma.category.create({
      data: {
        name: "Drikkevarer",
      },
    }),
  ]);

  console.log("Categories created:", categories.length);

  // Create menu items based on your SQL test data
  const menuItems = await Promise.all([
    prisma.menuItem.create({
      data: {
        name: "Margherita Pizza",
        description: "Klassisk pizza med tomat, mozzarella og basilikum",
        price: 89.00,
        categoryId: categories[0].id,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Caesar Salad",
        description: "Romaine salat, krutonger, parmesan, Caesar dressing",
        price: 68.00,
        categoryId: categories[1].id,
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Grillet Laks",
        description: "Frisk laksefilet med citron-smør sauce",
        price: 165.00,
        categoryId: categories[2].id,
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Spaghetti Carbonara",
        description: "Pasta med æg, ost, pancetta og peber",
        price: 125.00,
        categoryId: categories[2].id,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Chokoladekage",
        description: "Rig chokoladekage med ganache",
        price: 58.00,
        categoryId: categories[3].id,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Beef Burger",
        description: "Saftig oksekød med salat, tomat og ost",
        price: 115.00,
        categoryId: categories[2].id,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Kylling Curry",
        description: "Krydret kylling curry med ris",
        price: 118.00,
        categoryId: categories[2].id,
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Vegetar Wok",
        description: "Sæsonens grøntsager med soya sauce",
        price: 95.00,
        categoryId: categories[2].id,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Tiramisu",
        description: "Kaffe-smagssat italiensk dessert",
        price: 72.00,
        categoryId: categories[3].id,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=400&fit=crop",
      },
    }),
    prisma.menuItem.create({
      data: {
        name: "Hjemmelavet Limonade",
        description: "Friskpresset citron juice drik",
        price: 38.00,
        categoryId: categories[4].id,
        image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&h=400&fit=crop",
      },
    }),
  ]);

  console.log("Menu items created:", menuItems.length);

  // Create time slots (based on your ReservationTimes, converted to dinner service)
  const timeSlots = await Promise.all([
    prisma.timeSlot.create({ data: { startTime: "17:00", endTime: "19:00", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "17:15", endTime: "19:15", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "17:30", endTime: "19:30", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "17:45", endTime: "19:45", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "18:00", endTime: "20:00", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "18:15", endTime: "20:15", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "18:30", endTime: "20:30", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "18:45", endTime: "20:45", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "19:00", endTime: "21:00", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "19:15", endTime: "21:15", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "19:30", endTime: "21:30", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "19:45", endTime: "21:45", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "20:00", endTime: "22:00", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "20:15", endTime: "22:15", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "20:30", endTime: "22:30", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "20:45", endTime: "22:45", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "21:00", endTime: "23:00", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "21:15", endTime: "23:15", maxTables: 10 } }),
    prisma.timeSlot.create({ data: { startTime: "21:30", endTime: "23:30", maxTables: 10 } }),
  ]);

  console.log("Time slots created:", timeSlots.length);

  // Create dining tables (20 tables as in your SQL)
  const diningTables = [];
  for (let i = 1; i <= 20; i++) {
    const table = await prisma.diningTable.create({
      data: {
        tableNumber: i,
        seats: i <= 10 ? 2 : i <= 16 ? 4 : 6, // Varied table sizes
      },
    });
    diningTables.push(table);
  }

  console.log("Dining tables created:", diningTables.length);

  // Create customers (based on your Resevators data)
  const customers = await Promise.all([
    prisma.customer.create({ data: { firstName: "John", lastName: "Doe", email: "john.doe@example.com", phone: "12345678" } }),
    prisma.customer.create({ data: { firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", phone: "87654321" } }),
    prisma.customer.create({ data: { firstName: "Alice", lastName: "Johnson", email: "alice.j@example.com", phone: "55512345" } }),
    prisma.customer.create({ data: { firstName: "Bob", lastName: "Brown", email: "bob.brown@example.com", phone: "44498765" } }),
    prisma.customer.create({ data: { firstName: "Chris", lastName: "Davis", email: "chris.d@example.com", phone: "33322111" } }),
    prisma.customer.create({ data: { firstName: "Eva", lastName: "Martinez", email: "eva.m@example.com", phone: "66677888" } }),
    prisma.customer.create({ data: { firstName: "Frank", lastName: "Wilson", email: "frank.w@example.com", phone: "11122233" } }),
    prisma.customer.create({ data: { firstName: "Grace", lastName: "Taylor", email: "grace.t@example.com", phone: "77788899" } }),
    prisma.customer.create({ data: { firstName: "Henry", lastName: "Anderson", email: "henry.a@example.com", phone: "88899900" } }),
    prisma.customer.create({ data: { firstName: "Ivy", lastName: "Thomas", email: "ivy.t@example.com", phone: "22233344" } }),
  ]);

  console.log("Customers created:", customers.length);

  // Create sample reservations
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);

  const reservations = await Promise.all([
    prisma.reservation.create({
      data: {
        partySize: 2,
        reservationDate: tomorrow,
        customerId: customers[0].id,
        timeSlotId: timeSlots[4].id, // 18:00
        status: "CONFIRMED",
      },
    }),
    prisma.reservation.create({
      data: {
        partySize: 4,
        reservationDate: tomorrow,
        customerId: customers[1].id,
        timeSlotId: timeSlots[6].id, // 18:30
        status: "CONFIRMED",
      },
    }),
    prisma.reservation.create({
      data: {
        partySize: 3,
        reservationDate: dayAfter,
        customerId: customers[2].id,
        timeSlotId: timeSlots[8].id, // 19:00
        status: "CONFIRMED",
      },
    }),
    prisma.reservation.create({
      data: {
        partySize: 6,
        reservationDate: dayAfter,
        customerId: customers[3].id,
        timeSlotId: timeSlots[10].id, // 19:30
        status: "CONFIRMED",
      },
    }),
  ]);

  console.log("Reservations created:", reservations.length);

  // Create reserved tables (link reservations to tables)
  await Promise.all([
    prisma.reservedTable.create({ data: { reservationId: reservations[0].id, tableId: diningTables[0].id } }),
    prisma.reservedTable.create({ data: { reservationId: reservations[1].id, tableId: diningTables[1].id } }),
    prisma.reservedTable.create({ data: { reservationId: reservations[1].id, tableId: diningTables[2].id } }),
    prisma.reservedTable.create({ data: { reservationId: reservations[2].id, tableId: diningTables[3].id } }),
    prisma.reservedTable.create({ data: { reservationId: reservations[3].id, tableId: diningTables[4].id } }),
    prisma.reservedTable.create({ data: { reservationId: reservations[3].id, tableId: diningTables[5].id } }),
  ]);

  console.log("Reserved tables created");

  // Create sample orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        reservationId: reservations[0].id,
        customerId: customers[0].id,
        status: "ORDERED",
        totalPrice: 248.00,
      },
    }),
    prisma.order.create({
      data: {
        reservationId: reservations[1].id,
        customerId: customers[1].id,
        status: "SERVED",
        totalPrice: 415.00,
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
        unitPrice: menuItems[0].price 
      } 
    }),
    prisma.orderItem.create({ 
      data: { 
        orderId: orders[0].id, 
        menuItemId: menuItems[2].id, 
        quantity: 1, 
        unitPrice: menuItems[2].price 
      } 
    }),
    prisma.orderItem.create({ 
      data: { 
        orderId: orders[1].id, 
        menuItemId: menuItems[3].id, 
        quantity: 2, 
        unitPrice: menuItems[3].price 
      } 
    }),
    prisma.orderItem.create({ 
      data: { 
        orderId: orders[1].id, 
        menuItemId: menuItems[4].id, 
        quantity: 3, 
        unitPrice: menuItems[4].price 
      } 
    }),
  ]);

  console.log("Order items created");

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
