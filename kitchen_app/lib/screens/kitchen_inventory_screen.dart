import 'package:flutter/material.dart';
import '../models/ingredient.dart';
import '../models/recipe.dart';
import '../data/mock_data.dart';

class KitchenInventoryScreen extends StatefulWidget {
  const KitchenInventoryScreen({super.key});

  @override
  State<KitchenInventoryScreen> createState() => _KitchenInventoryScreenState();
}

class _KitchenInventoryScreenState extends State<KitchenInventoryScreen> {
  late List<Ingredient> ingredients;
  late List<Recipe> recipes;

  @override
  void initState() {
    super.initState();
    ingredients = List.from(availableIngredients);
    recipes = List.from(allRecipes);
    updateRecipeAvailability(recipes, ingredients);
  }

  void _refreshAvailability() {
    setState(() {
      updateRecipeAvailability(recipes, ingredients);
    });
  }

  void _addIngredient(String name, int quantity, String unit) {
    setState(() {
      final index = ingredients.indexWhere((ing) => ing.name == name);
      if (index != -1) {
        ingredients[index] = Ingredient(
          name: name,
          quantity: ingredients[index].quantity + quantity,
          unit: unit,
        );
      } else {
        ingredients.add(Ingredient(name: name, quantity: quantity, unit: unit));
      }
      updateRecipeAvailability(recipes, ingredients);
    });
  }

  void _useRecipe(Recipe recipe) {
    setState(() {
      useIngredientsForRecipe(recipe, ingredients);
      updateRecipeAvailability(recipes, ingredients);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${recipe.name} er blevet lavet - ingredienser brugt'),
          backgroundColor: const Color(0xFF1B4020),
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF121212),
      appBar: AppBar(
        title: const Text('Køkken Lager & Retter'),
        backgroundColor: const Color(0xFF3A0D12),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _refreshAvailability,
            tooltip: 'Opdater tilgængelighed',
          ),
        ],
      ),
      body: DefaultTabController(
        length: 2,
        child: Column(
          children: [
            Container(
              color: const Color(0xFF3A0D12),
              child: const TabBar(
                indicatorColor: Colors.white,
                labelColor: Colors.white,
                unselectedLabelColor: Colors.grey,
                tabs: [
                  Tab(text: 'Tilgængelige Retter', icon: Icon(Icons.restaurant)),
                  Tab(text: 'Lagerbeholdning', icon: Icon(Icons.inventory_2)),
                ],
              ),
            ),
            Expanded(
              child: TabBarView(
                children: [
                  _buildRecipesTab(),
                  _buildInventoryTab(),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecipesTab() {
    final availableRecipes = recipes.where((r) => r.isAvailable).toList();
    final unavailableRecipes = recipes.where((r) => !r.isAvailable).toList();

    return RefreshIndicator(
      onRefresh: () async => _refreshAvailability(),
      backgroundColor: const Color(0xFF3A0D12),
      color: Colors.white,
      child: ListView(
        children: [
          if (availableRecipes.isNotEmpty) ...[
            _buildSectionHeader('Kan Laves Nu ✅', Colors.green),
            ...availableRecipes.map((recipe) => _buildRecipeCard(recipe, true)),
          ],
          if (unavailableRecipes.isNotEmpty) ...[
            _buildSectionHeader('Kan Ikke Laves ❌', Colors.red),
            ...unavailableRecipes.map((recipe) => _buildRecipeCard(recipe, false)),
          ],
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: const Color(0xFF1E1E1E),
      child: Text(
        title,
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: color,
        ),
      ),
    );
  }

  Widget _buildRecipeCard(Recipe recipe, bool isAvailable) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: const Color(0xFF1E1E1E),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
        side: BorderSide(
          color: isAvailable ? const Color(0xFF1B4020) : const Color(0xFF5A0A0A),
          width: 1.2,
        ),
      ),
      elevation: 4,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  recipe.name,
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: isAvailable ? Colors.white : Colors.grey[600],
                  ),
                ),
                Chip(
                  label: Text(
                    '${recipe.preparationTime} min',
                    style: const TextStyle(color: Colors.white),
                  ),
                  backgroundColor: isAvailable ? const Color(0xFF1B4020) : const Color(0xFF5A0A0A),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              recipe.description,
              style: TextStyle(color: Colors.grey[400]),
            ),
            const SizedBox(height: 12),
            const Text(
              'Ingredienser:',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.white70,
              ),
            ),
            ...recipe.ingredients.map((ing) => Text(
                  '• ${ing.requiredQuantity} ${ing.unit} ${ing.name}',
                  style: TextStyle(
                    color: _hasEnoughIngredient(ing.name, ing.requiredQuantity)
                        ? const Color(0xFF1B4020)
                        : const Color(0xFF5A0A0A),
                  ),
                )),
            const SizedBox(height: 12),
            if (isAvailable)
              ElevatedButton(
                onPressed: () => _useRecipe(recipe),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF3A0D12),
                  foregroundColor: Colors.white,
                ),
                child: const Text('Lav denne ret'),
              ),
          ],
        ),
      ),
    );
  }

  bool _hasEnoughIngredient(String name, int required) {
    final ingredient = ingredients.firstWhere(
      (ing) => ing.name == name,
      orElse: () => Ingredient(name: '', quantity: 0, unit: ''),
    );
    return ingredient.quantity >= required;
  }

  Widget _buildInventoryTab() {
    return RefreshIndicator(
      onRefresh: () async => _refreshAvailability(),
      backgroundColor: const Color(0xFF3A0D12),
      color: Colors.white,
      child: ListView(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: const Color(0xFF1E1E1E),
            child: const Text(
              'Nuværende Lagerbeholdning',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
          ...ingredients.map((ingredient) => ListTile(
                title: Text(
                  ingredient.name,
                  style: const TextStyle(color: Colors.white),
                ),
                subtitle: Text(
                  '${ingredient.quantity} ${ingredient.unit}',
                  style: const TextStyle(color: Colors.grey),
                ),
                trailing: Chip(
                  label: Text(
                    '${ingredient.quantity} ${ingredient.unit}',
                    style: const TextStyle(color: Colors.white),
                  ),
                  backgroundColor: _getIngredientColor(ingredient.quantity),
                ),
              )),
          const SizedBox(height: 20),
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton(
              onPressed: () => _showAddIngredientDialog(),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF3A0D12),
                foregroundColor: Colors.white,
              ),
              child: const Text('Tilføj Ingrediens'),
            ),
          ),
        ],
      ),
    );
  }

  Color _getIngredientColor(int quantity) {
    if (quantity > 10) return const Color(0xFF1B4020);
    if (quantity > 5) return const Color(0xFF8C6A00);
    return const Color(0xFF5A0A0A);
  }

  void _showAddIngredientDialog() {
    final nameController = TextEditingController();
    final quantityController = TextEditingController();
    final unitController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: const Color(0xFF1E1E1E),
        title: const Text(
          'Tilføj Ingrediens',
          style: TextStyle(color: Colors.white),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameController,
              decoration: const InputDecoration(
                labelText: 'Ingrediens navn',
                labelStyle: TextStyle(color: Colors.grey),
              ),
              style: const TextStyle(color: Colors.white),
            ),
            TextField(
              controller: quantityController,
              decoration: const InputDecoration(
                labelText: 'Mængde',
                labelStyle: TextStyle(color: Colors.grey),
              ),
              keyboardType: TextInputType.number,
              style: const TextStyle(color: Colors.white),
            ),
            TextField(
              controller: unitController,
              decoration: const InputDecoration(
                labelText: 'Enhed (stk, kg, L, etc.)',
                labelStyle: TextStyle(color: Colors.grey),
              ),
              style: const TextStyle(color: Colors.white),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuller', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            onPressed: () {
              final quantity = int.tryParse(quantityController.text) ?? 0;
              if (nameController.text.isNotEmpty && quantity > 0) {
                _addIngredient(
                  nameController.text,
                  quantity,
                  unitController.text.isNotEmpty ? unitController.text : 'stk',
                );
                Navigator.pop(context);
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF3A0D12),
            ),
            child: const Text('Tilføj'),
          ),
        ],
      ),
    );
  }
}