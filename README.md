# OpenFoodFacts MCP Server

A Model Context Protocol (MCP) server that integrates OpenFoodFacts API data directly into AI models, enabling natural language queries about food products, nutrition facts, and ingredients.

## Features

- **Product Search**: Search for food products by name, brand, or category
- **Barcode Lookup**: Get detailed product information using barcodes/EAN codes
- **Nutrition Analysis**: Access comprehensive nutrition facts and scores
- **Product Comparison**: Compare multiple products side-by-side
- **Allergen Information**: Get detailed allergen and ingredient information
- **Nutritional Filtering**: Search products by specific nutritional criteria
- **Category & Brand Browsing**: Explore products by category or brand

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/openfoodfacts-mcp-server.git
cd openfoodfacts-mcp-server

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Watch for changes
npm run watch

# Lint code
npm run lint

# Run tests
npm run test
```

## Available Tools

### 1. search_products
Search for food products by name, brand, or category.

**Parameters:**
- `query` (required): Search query string
- `page` (optional): Page number for pagination (default: 1)
- `page_size` (optional): Results per page (default: 20, max: 100)
- `sort_by` (optional): Sort by popularity, product_name, created_t, or last_modified_t

**Example Usage:**
```
Search for "chocolate chip cookies"
```

### 2. get_product_by_barcode
Get detailed product information using a barcode/EAN.

**Parameters:**
- `barcode` (required): Product barcode/EAN code

**Example Usage:**
```
Get product information for barcode 3017620422003
```

### 3. get_products_by_category
Browse products within a specific category.

**Parameters:**
- `category` (required): Category name (e.g., "breakfast-cereals", "yogurts")
- `page` (optional): Page number for pagination
- `page_size` (optional): Results per page

**Example Usage:**
```
Show me yogurt products
```

### 4. get_products_by_brand
Browse products from a specific brand.

**Parameters:**
- `brand` (required): Brand name (e.g., "Nestlé", "Coca-Cola")
- `page` (optional): Page number for pagination
- `page_size` (optional): Results per page

**Example Usage:**
```
Show me Nestlé products
```

### 5. get_nutrition_facts
Get detailed nutrition information for a product.

**Parameters:**
- `barcode` (required): Product barcode/EAN

**Example Usage:**
```
Get nutrition facts for barcode 3017620422003
```

### 6. compare_products
Compare nutrition facts between multiple products.

**Parameters:**
- `barcodes` (required): Array of 2-5 product barcodes

**Example Usage:**
```
Compare nutrition between products with barcodes 3017620422003 and 8712566072576
```

### 7. get_allergen_info
Get allergen and ingredient information for a product.

**Parameters:**
- `barcode` (required): Product barcode/EAN

**Example Usage:**
```
Get allergen information for barcode 3017620422003
```

### 8. search_by_nutriments
Search for products based on nutritional criteria.

**Parameters:**
- `max_fat` (optional): Maximum fat content per 100g
- `max_sugar` (optional): Maximum sugar content per 100g
- `max_salt` (optional): Maximum salt content per 100g
- `min_fiber` (optional): Minimum fiber content per 100g
- `min_protein` (optional): Minimum protein content per 100g
- `nutriscore_grade` (optional): Nutri-Score grade (A, B, C, D, E)
- `page` (optional): Page number for pagination
- `page_size` (optional): Results per page

**Example Usage:**
```
Find products with less than 5g sugar per 100g and Nutri-Score grade A
```

## Data Sources

This server uses the [OpenFoodFacts](https://openfoodfacts.org/) API, which provides:
- Product information from over 2 million food products worldwide
- Nutrition facts and scores (Nutri-Score, NOVA, Eco-Score)
- Ingredient lists and allergen information
- Product images and packaging details
- Contributor-verified data from the global community

## Natural Language Examples

Once integrated with an AI model, users can ask questions like:

- "What are the nutrition facts for the product with barcode 3017620422003?"
- "Find me low-sugar breakfast cereals"
- "Compare the nutrition between Coca-Cola and Pepsi"
- "Show me vegan products from the brand Alpro"
- "What allergens are in this product?" (with barcode)
- "Find products with high protein and low fat content"
- "What are the ingredients in Nutella?"

## Configuration

The server uses the OpenFoodFacts public API at `https://world.openfoodfacts.org`. No API key is required, but please be respectful of rate limits.

## Error Handling

The server includes comprehensive error handling for:
- Invalid barcodes or product codes
- Network connectivity issues
- API rate limiting
- Invalid search parameters
- Missing product data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## MCP Integration

### Adding to Claude Desktop

To use this server with Claude Desktop, add the following to your MCP configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "openfoodfacts": {
      "command": "node",
      "args": ["/path/to/openfoodfacts-mcp-server/dist/index.js"],
      "env": {}
    }
  }
}
```

### Using with Other MCP Clients

The server can be used with any MCP-compatible client by running:

```bash
npx openfoodfacts-mcp-server
```

## API Response Format

### Product Summary Format
```json
{
  "barcode": "3017620422003",
  "name": "Nutella",
  "brands": "Ferrero",
  "categories": "Sweet spreads",
  "nutriscore_grade": "E",
  "nova_group": 4,
  "basic_nutrition": {
    "energy_kcal_100g": 539,
    "fat_100g": 30.9,
    "sugars_100g": 56.3,
    "salt_100g": 0.107,
    "proteins_100g": 6.3
  }
}
```

### Detailed Product Format
```json
{
  "barcode": "3017620422003",
  "name": "Nutella",
  "brands": "Ferrero",
  "categories": "Sweet spreads, Cocoa and hazelnuts spreads",
  "nutriscore_grade": "E",
  "nova_group": 4,
  "ecoscore_grade": "D",
  "nutrition_per_100g": {
    "energy-kcal_100g": 539,
    "fat_100g": 30.9,
    "saturated-fat_100g": 10.6,
    "sugars_100g": 56.3,
    "salt_100g": 0.107,
    "fiber_100g": 0,
    "proteins_100g": 6.3,
    "carbohydrates_100g": 57.5
  },
  "ingredients": "Sugar, palm oil, hazelnuts, skimmed milk powder...",
  "allergens": "Milk, nuts",
  "image_url": "https://static.openfoodfacts.org/images/products/301/762/042/2003/front_en.jpg"
}
```

## Nutritional Scores Explained

### Nutri-Score
- **A**: Best nutritional quality (dark green)
- **B**: Good nutritional quality (light green)
- **C**: Fair nutritional quality (yellow)
- **D**: Poor nutritional quality (orange)
- **E**: Worst nutritional quality (red)

### NOVA Groups
- **1**: Unprocessed or minimally processed foods
- **2**: Processed culinary ingredients
- **3**: Processed foods
- **4**: Ultra-processed food and drink products

### Eco-Score
- **A**: Very low environmental impact
- **B**: Low environmental impact
- **C**: Moderate environmental impact
- **D**: High environmental impact
- **E**: Very high environmental impact

## Use Cases

### For Nutritionists and Dietitians
- Quickly access comprehensive nutrition data
- Compare products for dietary recommendations
- Identify allergens and ingredients
- Find products meeting specific nutritional criteria

### For Developers
- Integrate food data into health and fitness apps
- Build nutrition tracking applications
- Create recipe analysis tools
- Develop dietary restriction filters

### For Consumers
- Make informed food choices through AI assistance
- Compare similar products easily
- Understand nutritional content in natural language
- Get allergen warnings and ingredient information

### For Researchers
- Access large-scale food product data
- Analyze nutritional trends across categories
- Study ingredient patterns and formulations
- Research environmental impact of food products

## Rate Limiting and Best Practices

While OpenFoodFacts doesn't enforce strict rate limits, please be respectful:

- Cache frequently accessed data when possible
- Don't make excessive concurrent requests
- Consider implementing request delays for bulk operations
- Use pagination for large result sets

## Troubleshooting

### Common Issues

**"Product not found" errors:**
- Verify the barcode is correct (13-digit EAN or UPC)
- Some products may not be in the OpenFoodFacts database
- Regional products might have limited availability

**Empty nutrition data:**
- Not all products have complete nutritional information
- Data quality varies by product and contributor
- Consider using multiple data sources for critical applications

**Search returning no results:**
- Try broader search terms
- Check spelling and language
- Some categories/brands may have different names in the database

### Debug Mode

Run the server with debug logging:

```bash
DEBUG=* npm start
```

## Roadmap

- [ ] Add caching layer for improved performance
- [ ] Implement batch operations for multiple products
- [ ] Add support for product suggestions/recommendations
- [ ] Include price comparison data where available
- [ ] Add support for user preferences and dietary restrictions
- [ ] Implement fuzzy search for better product matching
- [ ] Add support for recipe nutrition analysis

## Contributing Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Add JSDoc comments for public methods
- Write unit tests for new features

### Testing
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- product.test.ts
```

### Submitting Issues
Please include:
- Node.js version
- Error messages and stack traces
- Steps to reproduce
- Expected vs actual behavior

## Security

This server:
- Makes only read-only requests to OpenFoodFacts
- Does not store or cache sensitive data
- Does not require authentication or API keys
- Follows OpenFoodFacts terms of service

## Performance

Typical response times:
- Product lookup by barcode: 200-500ms
- Product search: 300-800ms
- Category browsing: 400-1000ms

Performance factors:
- Network latency to OpenFoodFacts servers
- Product data completeness
- Search complexity

## Acknowledgments

- [OpenFoodFacts](https://openfoodfacts.org/) - Open database of food products
- [Model Context Protocol](https://modelcontextprotocol.io/) - Protocol specification
- The global community of OpenFoodFacts contributors