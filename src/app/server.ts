import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Hent alle aktive ordrer (til køkken)
app.get("/orders", async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { status: { in: ["ORDERED", "IN_PREPARATION"] } },
    include: {
      items: { include: { menuItem: true } },
      customer: true,
    },
    orderBy: { createdAt: "asc" },
  });
  res.json(orders);
});

// Opdater ordrestatus
app.put("/orders/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });
    res.json(updated);
  } catch (e) {
    res.status(400).json({ error: "Kunne ikke opdatere ordre" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 API kører på http://localhost:${PORT}`);
});
