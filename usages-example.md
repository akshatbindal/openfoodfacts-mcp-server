# Usage Examples

This document provides practical examples of how to use the OpenFoodFacts MCP Server with natural language queries through AI models.

## Basic Product Search

### Example 1: Simple Product Search
**User Query:** "Find me information about Nutella"

**MCP Tool Call:** `search_products`
```json
{
  "query": "Nutella"
}
```

**Result:** Returns a list of Nutella products with basic nutrition information, barcodes, and brands.

### Example 2: Category-Based Search
**User Query:** "Show me some yogurt products"

**MCP Tool Call:** `get_products_by_category`
```json
{
  "category": "yogurts",
  "page_size": 10
}
```

**Result:** Returns yogurt products from the database with nutritional summaries.

## Nutrition Analysis

### Example 3: Detailed Nutrition Facts
**User Query:** "What are the nutrition facts for the product with barcode 3017620422003?"

**MCP Tool Call:** `get_nutrition_facts`
```json
{
  "barcode": "3017620422003"
}
```

**Result:** Returns comprehensive nutrition information per 100g, including calories, fats, sugars, proteins, etc.

### Example 4: Product Comparison
**User Query:** "Compare the nutrition between Coca-Cola and Pepsi"

First, search for both products to get their barcodes, then:

**MCP Tool Call:** `compare_products`
```json
{
  "barcodes": ["5449000000996", "12000171"]
}
```

**Result:** Side-by-side nutrition comparison showing differences in calories, sugar content, etc.

## Health-Conscious Searches

### Example 5: Low-Sugar Products
**User Query:** "Find products with less than 5g of sugar per 100g"

**MCP Tool Call:** `search_by_nutriments`
```json
{
  "max_sugar": 5,
  "page_size": 20
}
```

**Result:** Returns products meeting the sugar criteria, useful for diabetic diets.

### Example 6: High-Protein, Low-Fat Foods
**User Query:** "Show me foods with high protein and low fat content"

**MCP Tool Call:** `search_by_nutriments`
```json
{
  "min_protein": 15,
  "max_fat": 5,
  "page_size": 15
}
```

**Result:** Returns products suitable for fitness-oriented diets.

### Example 7: Nutri-Score Filtering
**User Query:** "Find healthy breakfast cereals with Nutri-Score A or B"

**MCP Tool Call:** `search_by_nutriments`
```json
{
  "nutriscore_grade": "A"
}
```

Then filter by category or search for "breakfast cereals" with good Nutri-Score.

## Allergen and Ingredient Information

### Example 8: Allergen Check
**User Query:** "What allergens are in this product with barcode 8712566072576?"

**MCP Tool Call:** `get_allergen_info`
```json
{
  "barcode": "8712566072576"
}
```

**Result:** Returns detailed allergen information, traces, and ingredient list.

### Example 9: Brand-Specific Search
**User Query:** "Show me all Nestlé products available"

**MCP Tool Call:** `get_products_by_brand`
```json
{
  "brand": "Nestlé",
  "page": 1,
  "page_size": 25
}
```

**Result:** Returns Nestlé products with their basic information and nutrition summaries.

## Advanced Queries

### Example 10: Multi-Criteria Search
**User Query:** "Find vegan protein bars with less than 10g sugar and more than 15g protein"

This would involve multiple tool calls:
1. Search for "protein bars"
2. Filter by nutritional criteria
3. Check ingredients for vegan compatibility

**MCP Tool Calls:**
```json
// First search
{
  "tool": "search_products",
  "query": "protein bar vegan"
}

// Then filter by nutrition
{
  "tool": "search_by_nutriments",
  "max_sugar": 10,
  "min_protein": 15
}
```

### Example 11: Detailed Product Analysis
**User Query:** "Give me a complete analysis of the product with barcode 3017620422003"

This involves multiple tool calls:

**MCP Tool Calls:**
```json
// Get basic product info
{
  "tool": "get_product_by_barcode",
  "barcode": "3017620422003"
}

// Get detailed nutrition
{
  "tool": "get_nutrition_facts",
  "barcode": "3017620422003"
}

// Get allergen info
{
  "tool": "get_allergen_info",
  "barcode": "3017620422003"
}
```

**Result:** Comprehensive product analysis including nutrition scores, ingredients, allergens, and environmental impact.

## Practical AI Conversation Examples

### Conversation 1: Dietary Planning
```
User: I'm diabetic and need to find low-sugar snacks. Can you help?

AI: I'll help you find low-sugar snacks suitable for a diabetic diet. Let me search for products with low sugar content.

[Calls search_by_nutriments with max_sugar: 5]

Based on the OpenFoodFacts database, here are some low-sugar snack options:
- Product A: 2.1g sugar per 100g, Nutri-Score B
- Product B: 3.4g sugar per 100g, Nutri-Score A
- Product C: 1.8g sugar per 100g, Nutri-Score A

Would you like me to get more detailed nutrition information for any of these products?
```

### Conversation 2: Allergen Management
```
User: My child is allergic to nuts and dairy. Can you check if this cereal is safe? The barcode is 1234567890123.

AI: I'll check the allergen information for that product right away.

[Calls get_allergen_info with the barcode]

I've found the product information. Unfortunately, this cereal contains:
- Allergens: Milk, Tree nuts (hazelnuts)
- May contain traces of: Other nuts, Soy

This product is NOT safe for your child due to both dairy and nut content. Would you like me to search for nut-free and dairy-free cereal alternatives?
```

### Conversation 3: Nutrition Comparison
```
User: I'm trying to choose between two pasta sauces. Can you compare their nutrition? Barcodes are 1111111111111 and 2222222222222.

AI: I'll compare the nutrition facts of both pasta sauces for you.

[Calls compare_products with both barcodes]

Here's the nutritional comparison per 100g:

Sauce A (Barcode: 1111111111111):
- Calories: 85 kcal
- Fat: 4.2g
- Sugar: 8.1g
- Salt: 1.2g
- Nutri-Score: C

Sauce B (Barcode: 2222222222222):
- Calories: 62 kcal
- Fat: 2.1g
- Sugar: 6.3g
- Salt: 0.9g
- Nutri-Score: B

Sauce B appears to be the healthier choice with lower calories, fat, sugar, and salt content, plus a better Nutri-Score rating.
```

## Integration Tips

1. **Natural Language Processing**: The AI can interpret various ways users ask about nutrition and food products
2. **Multi-Step Queries**: Complex requests often require multiple tool calls to gather complete information
3. **Context Awareness**: The AI can remember previous searches in the conversation and build upon them
4. **Educational Responses**: The AI can explain nutrition scores, ingredient concerns, and dietary implications
5. **Personalization**: The AI can tailor responses based on mentioned dietary restrictions or health goals

## Best Practices for AI Integration

1. **Always verify barcodes** before making API calls
2. **Handle missing data gracefully** - not all products have complete information
3. **Provide context** for nutrition scores and values
4. **Suggest alternatives** when products don't meet user criteria
5. **Educate users** about reading nutrition labels and understanding food quality indicators