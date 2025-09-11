import '../models/ingredient.dart';
import '../models/recipe.dart';

// Tilgængelige ingredienser i køkkenet
List<Ingredient> availableIngredients = [
  Ingredient(name: 'Oksekød', quantity: 15, unit: 'kg'),
  Ingredient(name: 'Kylling', quantity: 8, unit: 'kg'),
  Ingredient(name: 'Løg', quantity: 20, unit: 'stk'),
  Ingredient(name: 'Hvidløg', quantity: 30, unit: 'fed'),
  Ingredient(name: 'Tomater', quantity: 25, unit: 'stk'),
  Ingredient(name: 'Salat', quantity: 10, unit: 'stk'),
  Ingredient(name: 'Pasta', quantity: 12, unit: 'kg'),
  Ingredient(name: 'Ris', quantity: 18, unit: 'kg'),
  Ingredient(name: 'Ost', quantity: 7, unit: 'kg'),
  Ingredient(name: 'Fløde', quantity: 6, unit: 'L'),
  Ingredient(name: 'Smør', quantity: 5, unit: 'kg'),
  Ingredient(name: 'Olivenolie', quantity: 8, unit: 'L'),
  Ingredient(name: 'Kartofler', quantity: 30, unit: 'kg'),
  Ingredient(name: 'Gulerødder', quantity: 15, unit: 'kg'),
];

// Alle retter på menuen
List<Recipe> allRecipes = [
  Recipe(
    id: 1,
    name: 'Classic Burger',
    description: 'Juicy beef burger with fresh vegetables',
    preparationTime: 15,
    ingredients: [
      RecipeIngredient(name: 'Oksekød', requiredQuantity: 200, unit: 'g'),
      RecipeIngredient(name: 'Løg', requiredQuantity: 1, unit: 'stk'),
      RecipeIngredient(name: 'Tomater', requiredQuantity: 2, unit: 'stk'),
      RecipeIngredient(name: 'Salat', requiredQuantity: 1, unit: 'stk'),
    ],
  ),
  Recipe(
    id: 2,
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with bacon and cheese',
    preparationTime: 20,
    ingredients: [
      RecipeIngredient(name: 'Pasta', requiredQuantity: 300, unit: 'g'),
      RecipeIngredient(name: 'Ost', requiredQuantity: 150, unit: 'g'),
      RecipeIngredient(name: 'Fløde', requiredQuantity: 2, unit: 'dl'),
    ],
  ),
  Recipe(
    id: 3,
    name: 'Grilled Chicken',
    description: 'Grilled chicken breast with herbs',
    preparationTime: 25,
    ingredients: [
      RecipeIngredient(name: 'Kylling', requiredQuantity: 400, unit: 'g'),
      RecipeIngredient(name: 'Hvidløg', requiredQuantity: 3, unit: 'fed'),
      RecipeIngredient(name: 'Olivenolie', requiredQuantity: 2, unit: 'spsk'),
    ],
  ),
  Recipe(
    id: 4,
    name: 'Vegetable Risotto',
    description: 'Creamy risotto with seasonal vegetables',
    preparationTime: 30,
    ingredients: [
      RecipeIngredient(name: 'Ris', requiredQuantity: 250, unit: 'g'),
      RecipeIngredient(name: 'Løg', requiredQuantity: 2, unit: 'stk'),
      RecipeIngredient(name: 'Gulerødder', requiredQuantity: 3, unit: 'stk'),
      RecipeIngredient(name: 'Fløde', requiredQuantity: 1, unit: 'dl'),
    ],
  ),
];

// Funktion til at tjekke om en ret kan laves
bool canMakeRecipe(Recipe recipe, List<Ingredient> ingredients) {
  for (var required in recipe.ingredients) {
    final available = ingredients.firstWhere(
      (ing) => ing.name == required.name,
      orElse: () => Ingredient(name: '', quantity: 0, unit: ''),
    );
    
    if (available.quantity < required.requiredQuantity) {
      return false;
    }
  }
  return true;
}

// Funktion til at opdatere tilgængelighed for alle retter
void updateRecipeAvailability(List<Recipe> recipes, List<Ingredient> ingredients) {
  for (var recipe in recipes) {
    recipe.isAvailable = canMakeRecipe(recipe, ingredients);
  }
}

// Funktion til at bruge ingredienser (når en ret laves)
void useIngredientsForRecipe(Recipe recipe, List<Ingredient> ingredients) {
  for (var required in recipe.ingredients) {
    final index = ingredients.indexWhere((ing) => ing.name == required.name);
    if (index != -1) {
      ingredients[index] = Ingredient(
        name: ingredients[index].name,
        quantity: ingredients[index].quantity - required.requiredQuantity,
        unit: ingredients[index].unit,
      );
    }
  }
}