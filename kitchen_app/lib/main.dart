import 'dart:async';
import 'package:flutter/material.dart';

void main() {
  runApp(const KitchenApp());
}

class KitchenApp extends StatelessWidget {
  const KitchenApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Køkken Skærm',
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF3A0D12), // dyb burgundy
        scaffoldBackgroundColor: const Color(0xFF121212), // næsten sort
        textTheme: const TextTheme(
          bodyMedium: TextStyle(fontSize: 16, color: Color(0xFFE0E0E0)),
          bodySmall: TextStyle(fontSize: 14, color: Color(0xFF999999)),
          titleLarge: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: Color(0xFFF5E6E6), // lys burgundy-tekst
          ),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF3A0D12), // dyb burgundy
          foregroundColor: Colors.white,
          elevation: 3,
          titleTextStyle: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
        cardTheme: CardThemeData(
          color: const Color(0xFF1E1E1E),
          shadowColor: Colors.black87,
          elevation: 4,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
        snackBarTheme: const SnackBarThemeData(
          backgroundColor: Color(0xFF1E1E1E),
          contentTextStyle: TextStyle(color: Colors.white),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ButtonStyle(
            backgroundColor: MaterialStatePropertyAll(Color(0xFF3A0D12)), // burgundy
            foregroundColor: MaterialStatePropertyAll(Colors.white),
            shape: MaterialStatePropertyAll(
              RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(14)),
              ),
            ),
            padding: MaterialStatePropertyAll(
              EdgeInsets.symmetric(horizontal: 18, vertical: 14),
            ),
            elevation: MaterialStatePropertyAll(2),
          ),
        ),
      ),
      home: const KitchenScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

// ---------------- MODEL ----------------
enum OrderStatus { queued, inProgress, ready, complications }

extension OrderStatusProps on OrderStatus {
  String get label {
    switch (this) {
      case OrderStatus.queued:
        return 'Afventer';
      case OrderStatus.inProgress:
        return 'I gang';
      case OrderStatus.ready:
        return 'Færdig';
      case OrderStatus.complications:
        return 'Komplikation';
    }
  }

  IconData get icon {
    switch (this) {
      case OrderStatus.queued:
        return Icons.schedule;
      case OrderStatus.inProgress:
        return Icons.kitchen;
      case OrderStatus.ready:
        return Icons.check_circle;
      case OrderStatus.complications:
        return Icons.error;
    }
  }

  Color get color {
    switch (this) {
      case OrderStatus.queued:
        return const Color(0xFF8C6A00); // mørk guld
      case OrderStatus.inProgress:
        return const Color(0xFF0A1A40); // meget mørkeblå
      case OrderStatus.ready:
        return const Color(0xFF1B4020); // mørk grøn
      case OrderStatus.complications:
        return const Color(0xFF5A0A0A); // dyb mørkerød
    }
  }
}

class OrderItem {
  final int qty;
  final String name;
  OrderItem({required this.qty, required this.name});
}

class Order {
  final int id;
  final String table;
  OrderStatus status;
  final List<OrderItem> items;
  final DateTime placedAt;

  Order({
    required this.id,
    required this.table,
    required this.status,
    required this.items,
    required this.placedAt,
  });
}

// ---------------- MOCK DATA ----------------
List<Order> _mockOrders = [
  Order(
    id: 101,
    table: 'Bord 4',
    status: OrderStatus.queued,
    items: [
      OrderItem(qty: 2, name: 'Pizza Margherita'),
      OrderItem(qty: 1, name: 'Pasta Carbonara'),
    ],
    placedAt: DateTime.now().subtract(const Duration(minutes: 5)),
  ),
  Order(
    id: 102,
    table: 'Bord 7',
    status: OrderStatus.inProgress,
    items: [OrderItem(qty: 1, name: 'Lasagne')],
    placedAt: DateTime.now().subtract(const Duration(minutes: 12)),
  ),
  Order(
    id: 103,
    table: 'Takeaway',
    status: OrderStatus.ready,
    items: [OrderItem(qty: 3, name: 'Pizza Vesuvio')],
    placedAt: DateTime.now().subtract(const Duration(minutes: 20)),
  ),
];

Future<List<Order>> mockFetchOrders() async {
  await Future.delayed(const Duration(milliseconds: 200));
  return _mockOrders
      .map((o) => Order(
            id: o.id,
            table: o.table,
            status: o.status,
            items: List.from(o.items),
            placedAt: o.placedAt,
          ))
      .toList();
}

Future<Order> mockUpdateStatus(int orderId, OrderStatus newStatus) async {
  await Future.delayed(const Duration(milliseconds: 200));
  final idx = _mockOrders.indexWhere((o) => o.id == orderId);
  if (idx == -1) throw Exception('Order not found');
  _mockOrders[idx].status = newStatus;
  return _mockOrders[idx];
}

// ---------------- UI ----------------
class KitchenScreen extends StatefulWidget {
  const KitchenScreen({super.key});

  @override
  State<KitchenScreen> createState() => _KitchenScreenState();
}

class _KitchenScreenState extends State<KitchenScreen> {
  List<Order> orders = [];
  String error = '';
  bool loading = false;
  Timer? _refreshTimer;
  final refreshInterval = const Duration(seconds: 8);

  @override
  void initState() {
    super.initState();
    _loadOrders();
    _refreshTimer = Timer.periodic(refreshInterval, (_) => _loadOrders());
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    super.dispose();
  }

  Future<void> _loadOrders() async {
    setState(() => loading = true);
    try {
      final data = await mockFetchOrders();
      data.sort((a, b) => a.placedAt.compareTo(b.placedAt));
      setState(() {
        orders = data;
        error = '';
      });
    } catch (e) {
      setState(() => error = 'Kan ikke hente ordrer');
    } finally {
      setState(() => loading = false);
    }
  }

  Future<void> _updateStatus(int orderId, OrderStatus newStatus) async {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    final snack = SnackBar(
      content: Row(
        children: const [
          CircularProgressIndicator(strokeWidth: 2),
          SizedBox(width: 12),
          Text('Opdaterer status…'),
        ],
      ),
      duration: const Duration(seconds: 2),
    );
    ScaffoldMessenger.of(context).showSnackBar(snack);

    try {
      final updated = await mockUpdateStatus(orderId, newStatus);
      await _loadOrders();
      ScaffoldMessenger.of(context).hideCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content:
            Text('Ordre #${updated.id} flyttet til "${updated.status.label}" ✅'),
        backgroundColor: Colors.grey[900],
      ));
    } catch (e) {
      ScaffoldMessenger.of(context).hideCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
        content: Text('Kunne ikke opdatere status'),
        backgroundColor: Colors.red,
      ));
    }
  }

  String _timeSince(DateTime placedAt) {
    final diff = DateTime.now().difference(placedAt).inMinutes;
    return diff == 0 ? 'Nu' : '$diff min';
  }

  Color _urgencyColor(Order order) {
    final diff = DateTime.now().difference(order.placedAt).inMinutes;
    if (diff < 5) return const Color(0xFF1B4020); // mørkegrøn
    if (diff < 15) return const Color(0xFF8C6A00); // mørk guld
    return const Color(0xFF5A0A0A); // mørkerød
  }

  @override
  Widget build(BuildContext context) {
    final statuses = OrderStatus.values;
    final width = MediaQuery.of(context).size.width;
    final crossAxisCount = width > 1200 ? 4 : width > 800 ? 2 : 1;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Køkken — Ordreoversigt'),
        actions: [
          IconButton(
            tooltip: 'Opdater',
            onPressed: _loadOrders,
            icon: const Icon(Icons.refresh),
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            if (loading)
              LinearProgressIndicator(
                minHeight: 4,
                color: Theme.of(context).primaryColor,
                backgroundColor: Colors.grey[900],
              ),
            if (error.isNotEmpty)
              Container(
                width: double.infinity,
                color: Colors.red.shade900,
                padding:
                    const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                child: Text(error,
                    style: const TextStyle(color: Colors.white, fontSize: 16)),
              ),
            Expanded(
              child: RefreshIndicator(
                onRefresh: _loadOrders,
                color: Theme.of(context).primaryColor,
                backgroundColor: Colors.black,
                child: GridView.count(
                  crossAxisCount: crossAxisCount,
                  padding: const EdgeInsets.all(12),
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  children: statuses.map((status) {
                    final filtered =
                        orders.where((o) => o.status == status).toList();

                    return Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF1C1C1C),
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: const [
                          BoxShadow(
                              color: Colors.black54,
                              blurRadius: 6,
                              offset: Offset(0, 3))
                        ],
                        border: Border.all(
                            color: status.color.withOpacity(0.35), width: 1.2),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 10),
                            decoration: BoxDecoration(
                              color: status.color,
                              borderRadius: const BorderRadius.vertical(
                                  top: Radius.circular(14)),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Icon(status.icon, color: Colors.white),
                                    const SizedBox(width: 8),
                                    Text(status.label,
                                        style: const TextStyle(
                                            color: Colors.white,
                                            fontWeight: FontWeight.bold,
                                            fontSize: 16)),
                                  ],
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.white24,
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text('${filtered.length}',
                                      style: const TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.w700)),
                                ),
                              ],
                            ),
                          ),
                          Expanded(
                            child: filtered.isEmpty
                                ? Center(
                                    child: Text(
                                      'Ingen ordrer',
                                      style: TextStyle(
                                          color: Colors.grey[500],
                                          fontStyle: FontStyle.italic),
                                    ),
                                  )
                                : ListView.builder(
                                    padding: const EdgeInsets.all(12),
                                    itemCount: filtered.length,
                                    itemBuilder: (context, idx) {
                                      final order = filtered[idx];
                                      return _OrderCard(
                                        order: order,
                                        statuses: statuses,
                                        onChangeStatus: _updateStatus,
                                        timeSinceLabel:
                                            _timeSince(order.placedAt),
                                        urgencyColor: _urgencyColor(order),
                                      );
                                    },
                                  ),
                          ),
                        ],
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _OrderCard extends StatelessWidget {
  final Order order;
  final List<OrderStatus> statuses;
  final Future<void> Function(int orderId, OrderStatus newStatus)
      onChangeStatus;
  final String timeSinceLabel;
  final Color urgencyColor;

  const _OrderCard({
    required this.order,
    required this.statuses,
    required this.onChangeStatus,
    required this.timeSinceLabel,
    required this.urgencyColor,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(children: [
                  Text('#${order.id}',
                      style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 16,
                          color: Colors.white)),
                  const SizedBox(width: 12),
                  Text(order.table,
                      style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 15,
                          color: Colors.white70)),
                ]),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                  decoration: BoxDecoration(
                    color: urgencyColor,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    timeSinceLabel,
                    style: const TextStyle(
                        color: Colors.white, fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: order.items
                  .map((it) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 2),
                        child: Text('${it.qty}× ${it.name}',
                            style: const TextStyle(
                                fontSize: 15, color: Colors.white70)),
                      ))
                  .toList(),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 10,
              runSpacing: 8,
              children: statuses
                  .where((s) => s != order.status)
                  .map((s) => _StatusButton(
                        label: s.label,
                        icon: s.icon,
                        color: s.color,
                        onPressed: () => onChangeStatus(order.id, s),
                      ))
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatusButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final Color color;
  final VoidCallback onPressed;

  const _StatusButton({
    required this.label,
    required this.icon,
    required this.color,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, color: Colors.white, size: 20),
      label: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Text(
          label,
          style: const TextStyle(
              fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white),
        ),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
        minimumSize: const Size(140, 52),
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        elevation: 2,
      ),
    );
  }
}
