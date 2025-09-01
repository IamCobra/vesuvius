import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting to seed database...");

  // Opretter clean menu data (ingen ordre-relaterede data)

  // Kategorier
  const appetizers = await prisma.category.create({
    data: { name: "Forretter" },
  });

  const salads = await prisma.category.create({
    data: { name: "Salater" },
  });

  const sandwiches = await prisma.category.create({
    data: { name: "Sandwiches" },
  });

  const burgers = await prisma.category.create({
    data: { name: "Burgere" },
  });

  const pasta = await prisma.category.create({
    data: { name: "Pasta" },
  });

  const soup = await prisma.category.create({
    data: { name: "Supper" },
  });

  const drinks = await prisma.category.create({
    data: { name: "Drinks" },
  });

  console.log("✅ Categories created");

  // Forretter
  await prisma.menuItem.create({
    data: {
      name: "Nachos Supreme",
      description:
        "Varme tortillachips med crispy kylling, jalapeños, gratineret med ost, serveres med salsa, guacamole og creme fraiche",
      price: 129,
      image:
        "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400&h=300&fit=crop&crop=center",
      categoryId: appetizers.id,
    },
  });

  // Salater
  await prisma.menuItem.create({
    data: {
      name: "Cæsar Salat",
      description:
        "Stegt kyllingebryst, hjertesalat vendt med cæsardressing, parmesanflager og croutoner.",
      price: 139,
      image:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center",
      categoryId: salads.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Tigerrejesalat",
      description:
        "Stegte tigerrejer med kålsalat, avocado, nudler, agurk, gulerod, edamame bønner, mynte, cashewnødder og gomadressing",
      price: 139,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center",
      categoryId: salads.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Vegetar Salat",
      description:
        "Sweet potato, falafel, babyspinat, granatæble, bulgur, feta, tomater, edamame bønner, hjemmelavet basilikumpesto, græskarkerner og mynte",
      price: 119,
      image:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center",
      categoryId: salads.id,
    },
  });

  // Sandwiches
  await prisma.menuItem.create({
    data: {
      name: "Club Sandwich",
      description:
        "Stegt kyllingebryst, sprød bacon, karrymayonnaise, tomat og salat. Serveres med pommes frites og mayonnaise",
      price: 139,
      image:
        "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop&crop=center",
      categoryId: sandwiches.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Laksesandwich",
      description:
        "Sandwich med røget laks, hjemmelavet basilikumspesto, salat, avocado og syltet rødløg. Serveres med pommes frites og mayonnaise",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400&h=300&fit=crop&crop=center",
      categoryId: sandwiches.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Spicy Steak Sandwich",
      description:
        "Sandwich med oksestrimler, salat, guacamole, jalapeños, syltede rødløg og spicy chilimayonnaise. Serveres med pommes frites og chilimayonnaise.",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
      categoryId: sandwiches.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Tunsandwich",
      description:
        "Sandwich med tunmoussé, salat, avocado, syltede rødløg og hjemmelavet basilikumspesto. Serveres med pommes frites og mayonnaise.",
      price: 139,
      image:
        "https://images.unsplash.com/photo-1580013759032-c96505e24c1f?w=400&h=300&fit=crop&crop=center",
      categoryId: sandwiches.id,
    },
  });

  // Burgere med varianter
  await prisma.menuItem.create({
    data: {
      name: "Vesuvius Burger",
      description:
        "Bøf af hakket oksekød i briochebolle med salat, pickles, tomat, syltede rødløg og burgerdressing. Serveres med pommes frites og mayonnaise.",
      price: 139,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center",
      categoryId: burgers.id,
      variants: {
        create: [
          { name: "Dobbelt", priceChange: 26 },
          { name: "Vegetarbøf", priceChange: 0 },
          { name: "Dobbelt Vegetarbøf", priceChange: 26 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Spicy Burger",
      description:
        "Bøf af hakket oksekød i briochebolle med salat, tomat, jalapeños, syltede rødløg og chilimayonnaise. Serveres med pommes frites og chilimayonnaise",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop&crop=center",
      categoryId: burgers.id,
      variants: {
        create: [
          { name: "Dobbelt", priceChange: 26 },
          { name: "Vegetarbøf", priceChange: 0 },
          { name: "Dobbelt Vegetarbøf", priceChange: 26 },
        ],
      },
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Crispy Chicken Burger",
      description:
        "Sprød kylling i briochebolle med salat, tomat, syltede rødløg, chilimayonnaise, jalapeños og guacamole. Serveres med pommes frites og mayonnaise",
      price: 139,
      image:
        "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop&crop=center",
      categoryId: burgers.id,
      variants: {
        create: [
          { name: "Dobbelt", priceChange: 26 },
          { name: "Vegetarbøf", priceChange: 0 },
          { name: "Dobbelt Vegetarbøf", priceChange: 26 },
        ],
      },
    },
  });

  // Supper
  await prisma.menuItem.create({
    data: {
      name: "Tomatsuppe",
      description:
        "Tomatsuppe med creme fraiche og frisk basilikum. Serveres med brød og smør",
      price: 99,
      image:
        "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop&crop=center",
      categoryId: soup.id,
    },
  });

  // Pasta
  await prisma.menuItem.create({
    data: {
      name: "Pasta med Kylling",
      description: "Pasta med kylling, blandede svampe og parmesan.",
      price: 169,
      image:
        "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop&crop=center",
      categoryId: pasta.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Pasta med Oksemørbrad",
      description:
        "Pasta med grilllet oksemørbrad, blandede svampe og parmesan.",
      price: 179,
      image:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop&crop=center",
      categoryId: pasta.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Pasta med Tigerrejer",
      description: "Pasta med tigerrejer, tomatsauce, parmesan og basilikum",
      price: 179,
      image:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=300&fit=crop&crop=center",
      categoryId: pasta.id,
    },
  });

  // Drinks
  await prisma.menuItem.create({
    data: {
      name: "Aperol Spritz",
      description:
        "Aperol, prosecco, danskvand, appelsinskive. Klassiskeren til en varm sommerdag. Eller bare fordi...",
      price: 85,
      image:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&crop=center",
      categoryId: drinks.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Espresso Martini",
      description:
        "Vodka/tequila, kahlua, espresso, vanilje. En klassiker med et twist, vælg mellem vodka eller tequila.",
      price: 85,
      image:
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop&crop=center",
      categoryId: drinks.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Dark n Stormy",
      description: "Mørk rom, gingerbeer, friskpresset limesat og gomme sirup.",
      price: 85,
      image:
        "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400&h=300&fit=crop&crop=center",
      categoryId: drinks.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: "Mojito",
      description: "Rom, mynte, rørsukker, friskpresset limesaft, limeskiver.",
      price: 85,
      image:
        "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop&crop=center",
      categoryId: drinks.id,
    },
  });

  console.log("🎉 Database seeded successfully!");
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

console.log("🌱 Database seeded successfully!");
