import 'dart:async';
import '../models/order.dart';

final _mockOrders = <Order>[
  Order(
    id: 1,
    table: 'A1',
    status: OrderStatus.queued,
    items: [OrderItem(qty: 2, name: 'Burger'), OrderItem(qty: 1, name: 'Cola')],
    placedAt: DateTime.now().subtract(const Duration(minutes: 3)),
  ),
  Order(
    id: 2,
    table: 'B2',
    status: OrderStatus.inProgress,
    items: [OrderItem(qty: 1, name: 'Pizza')],
    placedAt: DateTime.now().subtract(const Duration(minutes: 7)),
  ),
];

Future<List<Order>> mockFetchOrders() async {
  await Future.delayed(const Duration(milliseconds: 500));
  return List<Order>.from(_mockOrders);
}

Future<Order> mockUpdateStatus(int id, OrderStatus status) async {
  await Future.delayed(const Duration(milliseconds: 500));
  final order = _mockOrders.firstWhere((o) => o.id == id);
  order.status = status;
  return order;
}