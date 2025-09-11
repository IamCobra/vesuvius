import 'package:flutter/material.dart';

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
        return const Color(0xFF8C6A00);
      case OrderStatus.inProgress:
        return const Color(0xFF0A1A40);
      case OrderStatus.ready:
        return const Color(0xFF1B4020);
      case OrderStatus.complications:
        return const Color(0xFF5A0A0A);
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