# 🔄 Migration fra Express til Next.js API Routes

## 📋 Oversigt

Vi har besluttet at fjerne den separate Express server og i stedet bruge Next.js API routes for al backend funktionalitet. Dette giver os en mere konsistent arkitektur og nemmere deployment. (Også det i har fulgt fra begyndelsen, ingen nødvendighed for at ændre dette nu)

## 🗂️ Hvad der blev fjernet

Din Express server fil (`src/app/server.ts`) blev fjernet sammen med:

- `express` package
- `cors` package
- Port 4000 server setup

## 🎯 Migration Plan

### **Original Express Endpoints:**

```typescript
// Din gamle Express kode:
app.get("/orders", async (req, res) => { ... })
app.put("/orders/:id/status", async (req, res) => { ... })
```

### **Nye Next.js API Routes:**

## 📁 Fil Struktur

Opret følgende filer i Next.js projektet:

```
src/app/api/
├── kitchen/
│   └── orders/
│       ├── route.ts                    # GET /api/kitchen/orders
│       └── [id]/
│           └── status/
│               └── route.ts            # PUT /api/kitchen/orders/:id/status
└── waiter/
    └── orders/
        ├── route.ts                    # GET, POST /api/waiter/orders
        └── [id]/
            └── route.ts                # GET, PUT, DELETE /api/waiter/orders/:id
```

---

## 🍳 Kitchen API Routes

### **Fil:** `src/app/api/kitchen/orders/route.ts`

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET: Hent alle aktive ordrer til køkken
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ["ORDERED", "IN_PREPARATION"] },
      },
      include: {
        items: {
          include: { menuItem: true },
        },
        customer: true,
        reservation: {
          include: {
            reserved: {
              include: { table: true },
            },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Transform til mobile app format
    const transformedOrders = orders.map((order) => ({
      id: order.id,
      status: order.status,
      tableNumber:
        order.tableNumber || order.reservation?.reserved[0]?.table?.tableNumber,
      customerName: order.customer?.firstName + " " + order.customer?.lastName,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        notes: item.customizations,
        price: item.unitPrice,
      })),
      notes: order.notes,
      createdAt: order.createdAt,
      totalPrice: order.totalPrice,
    }));

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
      count: transformedOrders.length,
    });
  } catch (error) {
    console.error("Error fetching kitchen orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
```

### **Fil:** `src/app/api/kitchen/orders/[id]/status/route.ts`

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// PUT: Opdater ordrestatus
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const { status } = await request.json();

    // Validér status
    const validStatuses = [
      "ORDERED",
      "IN_PREPARATION",
      "READY",
      "SERVED",
      "COMPLETED",
      "CANCELLED",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        items: { include: { menuItem: true } },
        customer: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: `Ordre status opdateret til ${status}`,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { success: false, message: "Kunne ikke opdatere ordre status" },
      { status: 400 }
    );
  }
}
```

---

## 👨‍💼 Waiter API Routes

### **Fil:** `src/app/api/waiter/orders/route.ts`

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET: Hent ordrer for tjener (færdige til servering)
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: { in: ["READY", "SERVED"] },
      },
      include: {
        items: { include: { menuItem: true } },
        customer: true,
        reservation: {
          include: {
            reserved: {
              include: { table: true },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    const transformedOrders = orders.map((order) => ({
      id: order.id,
      status: order.status,
      tableNumber:
        order.tableNumber || order.reservation?.reserved[0]?.table?.tableNumber,
      customerName: order.customer?.firstName + " " + order.customer?.lastName,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.menuItem.name,
        quantity: item.quantity,
        price: item.unitPrice,
      })),
      totalPrice: order.totalPrice,
      updatedAt: order.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      orders: transformedOrders,
    });
  } catch (error) {
    console.error("Error fetching waiter orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST: Opret ny ordre (fra tjener app - walk-in kunder)
export async function POST(request: Request) {
  try {
    const { customerId, tableNumber, items, notes } = await request.json();

    // Validering
    if (!tableNumber || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Table number and items are required" },
        { status: 400 }
      );
    }

    // Beregn total pris
    let totalPrice = 0;
    for (const item of items) {
      const menuItem = await prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });
      if (menuItem) {
        totalPrice += Number(menuItem.price) * item.quantity;
      }
    }

    const newOrder = await prisma.order.create({
      data: {
        customerId: customerId || null,
        tableNumber: parseInt(tableNumber),
        status: "ORDERED",
        totalPrice,
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            customizations: item.customizations || null,
          })),
        },
      },
      include: {
        items: { include: { menuItem: true } },
        customer: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
      message: "Ordre oprettet succesfuldt",
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
```

---

## 📱 Mobile App Integration

### **Flutter HTTP Calls:**

```dart
class ApiService {
  static const String baseUrl = 'https://jeres-domain.com/api';

  // Køkken app: Hent ordrer
  static Future<List<Order>> getKitchenOrders() async {
    final response = await http.get(
      Uri.parse('$baseUrl/kitchen/orders'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return (data['orders'] as List)
          .map((order) => Order.fromJson(order))
          .toList();
    }
    throw Exception('Failed to load orders');
  }

  // Køkken app: Opdater status
  static Future<bool> updateOrderStatus(String orderId, String status) async {
    final response = await http.put(
      Uri.parse('$baseUrl/kitchen/orders/$orderId/status'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'status': status}),
    );

    return response.statusCode == 200;
  }

  // Tjener app: Hent ordrer
  static Future<List<Order>> getWaiterOrders() async {
    final response = await http.get(
      Uri.parse('$baseUrl/waiter/orders'),
      headers: {'Content-Type': 'application/json'},
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return (data['orders'] as List)
          .map((order) => Order.fromJson(order))
          .toList();
    }
    throw Exception('Failed to load orders');
  }

  // Tjener app: Opret ordre
  static Future<Order> createOrder(CreateOrderRequest orderData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/waiter/orders'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(orderData.toJson()),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return Order.fromJson(data['order']);
    }
    throw Exception('Failed to create order');
  }
}
```

---

## 🚀 Deployment Guide

### **Lokal Development:**

```bash
# Kør Next.js server (både frontend og API)
npm run dev

# API endpoints vil være tilgængelige på:
# http://localhost:3000/api/kitchen/orders
# http://localhost:3000/api/waiter/orders
```

### **Production URLs:**

```
Køkken: https://vesuvius-app.com/api/kitchen/orders
Tjener: https://vesuvius-app.com/api/waiter/orders
```

---

## ⚡ Fordele ved Next.js API Routes

1. **Konsistent Arkitektur:** Alt i samme projekt
2. **Bedre Performance:** Ingen separate server at vedligeholde
3. **Automatisk CORS:** Next.js håndterer cross-origin requests
4. **TypeScript Support:** Fuld type safety
5. **Nemmere Deployment:** Kun én applikation at deploye
6. **Bedre Error Handling:** Konsistent fejlhåndtering
7. **Samme Database Connection:** Deler Prisma client

---

## 🔧 Migration Checklist

- [ ] Opret kitchen API routes
- [ ] Opret waiter API routes
- [ ] Test endpoints med Postman/Thunder Client
- [ ] Opdater mobile app URLs
- [ ] Test integration med mobile apps
- [ ] Deploy til production
- [ ] Verificer alt fungerer

---

## 📞 Support

Hvis du har spørgsmål til migrationen, kontakt development teamet eller check Next.js dokumentationen:

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Prisma Client](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

**Happy coding! 🚀**
