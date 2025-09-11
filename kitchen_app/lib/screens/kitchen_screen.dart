import 'dart:async';
import 'package:flutter/material.dart';
import '../models/order.dart';
import '../data/mock_orders.dart';
import '../widgets/order_card.dart';

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
      content: Row(children: const [
        CircularProgressIndicator(strokeWidth: 2),
        SizedBox(width: 12),
        Text('Opdaterer status…')
      ]),
      duration: const Duration(seconds: 2),
    );
    ScaffoldMessenger.of(context).showSnackBar(snack);

    try {
      final updated = await mockUpdateStatus(orderId, newStatus);
      await _loadOrders();
      ScaffoldMessenger.of(context).hideCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Ordre #${updated.id} flyttet til "${updated.status.label}" ✅'),
        backgroundColor: Colors.grey[900],
      ));
    } catch (e) {
      ScaffoldMessenger.of(context).hideCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
          content: Text('Kunne ikke opdatere status'), backgroundColor: Colors.red));
    }
  }

  String _timeSince(DateTime placedAt) {
    final diff = DateTime.now().difference(placedAt).inMinutes;
    return diff == 0 ? 'Nu' : '$diff min';
  }

  Color _urgencyColor(Order order) {
    final diff = DateTime.now().difference(order.placedAt).inMinutes;
    if (diff < 5) return const Color(0xFF1B4020);
    if (diff < 15) return const Color(0xFF8C6A00);
    return const Color(0xFF5A0A0A);
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
              tooltip: 'Opdater', onPressed: _loadOrders, icon: const Icon(Icons.refresh))
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            if (loading)
              LinearProgressIndicator(
                  minHeight: 4,
                  color: Theme.of(context).primaryColor,
                  backgroundColor: Colors.grey[900]),
            if (error.isNotEmpty)
              Container(
                width: double.infinity,
                color: Colors.red.shade900,
                padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
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
                    final filtered = orders.where((o) => o.status == status).toList();
                    return Container(
                      decoration: BoxDecoration(
                        color: const Color(0xFF1C1C1C),
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: const [
                          BoxShadow(
                              color: Colors.black54, blurRadius: 6, offset: Offset(0, 3))
                        ],
                        border: Border.all(color: status.color.withOpacity(0.35), width: 1.2),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            decoration: BoxDecoration(
                                color: status.color,
                                borderRadius: const BorderRadius.vertical(top: Radius.circular(14))),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(children: [
                                  Icon(status.icon, color: Colors.white),
                                  const SizedBox(width: 8),
                                  Text(status.label,
                                      style: const TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16))
                                ]),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                      color: Colors.white24,
                                      borderRadius: BorderRadius.circular(20)),
                                  child: Text('${filtered.length}',
                                      style: const TextStyle(
                                          color: Colors.white, fontWeight: FontWeight.w700)),
                                ),
                              ],
                            ),
                          ),
                          Expanded(
                            child: filtered.isEmpty
                                ? Center(
                                    child: Text('Ingen ordrer',
                                        style: TextStyle(
                                            color: Colors.grey[500], fontStyle: FontStyle.italic)))
                                : ListView.builder(
                                    padding: const EdgeInsets.all(12),
                                    itemCount: filtered.length,
                                    itemBuilder: (context, idx) {
                                      final order = filtered[idx];
                                      return OrderCard(
                                        order: order,
                                        statuses: statuses,
                                        onChangeStatus: _updateStatus,
                                        timeSinceLabel: _timeSince(order.placedAt),
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