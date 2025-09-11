import 'package:flutter/material.dart';
import '../models/order.dart';
import 'status_button.dart';

class OrderCard extends StatelessWidget {
  final Order order;
  final List<OrderStatus> statuses;
  final Future<void> Function(int, OrderStatus) onChangeStatus;
  final String timeSinceLabel;
  final Color urgencyColor;

  const OrderCard({
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
                      borderRadius: BorderRadius.circular(8)),
                  child: Text(timeSinceLabel,
                      style: const TextStyle(
                          color: Colors.white, fontWeight: FontWeight.w700)),
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
                  .map((s) => StatusButton(
                      label: s.label,
                      icon: s.icon,
                      color: s.color,
                      onPressed: () => onChangeStatus(order.id, s)))
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}