class RecipeIngredient {
  final String name;
  final int requiredQuantity;
  final String unit;

  RecipeIngredient({
    required this.name,
    required this.requiredQuantity,
    required this.unit,
  });
}

class Recipe {
  final int id;
  final String name;
  final String description;
  final List<RecipeIngredient> ingredients;
  final int preparationTime;
  bool isAvailable;

  Recipe({
    required this.id,
    required this.name,
    required this.description,
    required this.ingredients,
    required this.preparationTime,
    this.isAvailable = false,
  });
}