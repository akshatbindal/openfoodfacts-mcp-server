#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
class OpenFoodFactsServer {
    server;
    baseUrl = 'https://world.openfoodfacts.org';
    constructor() {
        this.server = new Server({
            name: 'openfoodfacts-server',
            version: '1.0.0',
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'search_products',
                        description: 'Search for food products by name, brand, or category',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: 'Search query (product name, brand, or category)',
                                },
                                page: {
                                    type: 'number',
                                    description: 'Page number for pagination (default: 1)',
                                    default: 1,
                                },
                                page_size: {
                                    type: 'number',
                                    description: 'Number of results per page (default: 20, max: 100)',
                                    default: 20,
                                },
                                sort_by: {
                                    type: 'string',
                                    description: 'Sort results by: popularity, product_name, created_t, last_modified_t',
                                    enum: ['popularity', 'product_name', 'created_t', 'last_modified_t'],
                                    default: 'popularity',
                                },
                            },
                            required: ['query'],
                        },
                    },
                    {
                        name: 'get_product_by_barcode',
                        description: 'Get detailed product information by barcode/EAN',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                barcode: {
                                    type: 'string',
                                    description: 'Product barcode/EAN (e.g., 3017620422003)',
                                },
                            },
                            required: ['barcode'],
                        },
                    },
                    {
                        name: 'get_products_by_category',
                        description: 'Get products from a specific category',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                category: {
                                    type: 'string',
                                    description: 'Category name (e.g., "breakfast-cereals", "yogurts", "beverages")',
                                },
                                page: {
                                    type: 'number',
                                    description: 'Page number for pagination (default: 1)',
                                    default: 1,
                                },
                                page_size: {
                                    type: 'number',
                                    description: 'Number of results per page (default: 20, max: 100)',
                                    default: 20,
                                },
                            },
                            required: ['category'],
                        },
                    },
                    {
                        name: 'get_products_by_brand',
                        description: 'Get products from a specific brand',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                brand: {
                                    type: 'string',
                                    description: 'Brand name (e.g., "Nestlé", "Coca-Cola", "Danone")',
                                },
                                page: {
                                    type: 'number',
                                    description: 'Page number for pagination (default: 1)',
                                    default: 1,
                                },
                                page_size: {
                                    type: 'number',
                                    description: 'Number of results per page (default: 20, max: 100)',
                                    default: 20,
                                },
                            },
                            required: ['brand'],
                        },
                    },
                    {
                        name: 'get_nutrition_facts',
                        description: 'Get detailed nutrition facts for a product by barcode',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                barcode: {
                                    type: 'string',
                                    description: 'Product barcode/EAN',
                                },
                            },
                            required: ['barcode'],
                        },
                    },
                    {
                        name: 'compare_products',
                        description: 'Compare nutrition facts between multiple products',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                barcodes: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                    },
                                    description: 'Array of product barcodes to compare',
                                    minItems: 2,
                                    maxItems: 5,
                                },
                            },
                            required: ['barcodes'],
                        },
                    },
                    {
                        name: 'get_allergen_info',
                        description: 'Get allergen information for a product',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                barcode: {
                                    type: 'string',
                                    description: 'Product barcode/EAN',
                                },
                            },
                            required: ['barcode'],
                        },
                    },
                    {
                        name: 'search_by_nutriments',
                        description: 'Search products by nutritional criteria',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                max_fat: {
                                    type: 'number',
                                    description: 'Maximum fat content per 100g',
                                },
                                max_sugar: {
                                    type: 'number',
                                    description: 'Maximum sugar content per 100g',
                                },
                                max_salt: {
                                    type: 'number',
                                    description: 'Maximum salt content per 100g',
                                },
                                min_fiber: {
                                    type: 'number',
                                    description: 'Minimum fiber content per 100g',
                                },
                                min_protein: {
                                    type: 'number',
                                    description: 'Minimum protein content per 100g',
                                },
                                nutriscore_grade: {
                                    type: 'string',
                                    description: 'Nutri-Score grade (A, B, C, D, E)',
                                    enum: ['A', 'B', 'C', 'D', 'E'],
                                },
                                page: {
                                    type: 'number',
                                    description: 'Page number for pagination (default: 1)',
                                    default: 1,
                                },
                                page_size: {
                                    type: 'number',
                                    description: 'Number of results per page (default: 20, max: 100)',
                                    default: 20,
                                },
                            },
                        },
                    },
                ],
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case 'search_products':
                        return await this.searchProducts(args);
                    case 'get_product_by_barcode':
                        return await this.getProductByBarcode(args);
                    case 'get_products_by_category':
                        return await this.getProductsByCategory(args);
                    case 'get_products_by_brand':
                        return await this.getProductsByBrand(args);
                    case 'get_nutrition_facts':
                        return await this.getNutritionFacts(args);
                    case 'compare_products':
                        return await this.compareProducts(args);
                    case 'get_allergen_info':
                        return await this.getAllergenInfo(args);
                    case 'search_by_nutriments':
                        return await this.searchByNutriments(args);
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Tool ${name} not found`);
                }
            }
            catch (error) {
                if (error instanceof McpError) {
                    throw error;
                }
                throw new McpError(ErrorCode.InternalError, `Error executing tool ${name}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    async searchProducts(args) {
        const { query, page = 1, page_size = 20, sort_by = 'popularity' } = args;
        const url = `${this.baseUrl}/search.json`;
        const params = {
            search_terms: query,
            page,
            page_size: Math.min(page_size, 100),
            sort_by,
            json: 1,
        };
        const response = await axios.get(url, { params });
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        query,
                        total_products: response.data.count,
                        page: response.data.page,
                        total_pages: response.data.page_count,
                        products: response.data.products.map(this.formatProductSummary),
                    }, null, 2),
                },
            ],
        };
    }
    async getProductByBarcode(args) {
        const { barcode } = args;
        const url = `${this.baseUrl}/api/v0/product/${barcode}.json`;
        const response = await axios.get(url);
        if (response.data.status === 0) {
            throw new McpError(ErrorCode.InvalidRequest, `Product with barcode ${barcode} not found`);
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(this.formatProductDetails(response.data.product), null, 2),
                },
            ],
        };
    }
    async getProductsByCategory(args) {
        const { category, page = 1, page_size = 20 } = args;
        const url = `${this.baseUrl}/category/${category}.json`;
        const params = {
            page,
            page_size: Math.min(page_size, 100),
            json: 1,
        };
        const response = await axios.get(url, { params });
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        category,
                        total_products: response.data.count,
                        page: response.data.page,
                        total_pages: response.data.page_count,
                        products: response.data.products.map(this.formatProductSummary),
                    }, null, 2),
                },
            ],
        };
    }
    async getProductsByBrand(args) {
        const { brand, page = 1, page_size = 20 } = args;
        const url = `${this.baseUrl}/brand/${brand}.json`;
        const params = {
            page,
            page_size: Math.min(page_size, 100),
            json: 1,
        };
        const response = await axios.get(url, { params });
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        brand,
                        total_products: response.data.count,
                        page: response.data.page,
                        total_pages: response.data.page_count,
                        products: response.data.products.map(this.formatProductSummary),
                    }, null, 2),
                },
            ],
        };
    }
    async getNutritionFacts(args) {
        const { barcode } = args;
        const url = `${this.baseUrl}/api/v0/product/${barcode}.json`;
        const response = await axios.get(url);
        if (response.data.status === 0) {
            throw new McpError(ErrorCode.InvalidRequest, `Product with barcode ${barcode} not found`);
        }
        const product = response.data.product;
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        product_name: product.product_name,
                        barcode: product.code,
                        nutrition_per_100g: product.nutriments || {},
                        nutriscore_grade: product.nutriscore_grade,
                        nova_group: product.nova_group,
                        ecoscore_grade: product.ecoscore_grade,
                    }, null, 2),
                },
            ],
        };
    }
    async compareProducts(args) {
        const { barcodes } = args;
        const products = await Promise.all(barcodes.map(async (barcode) => {
            try {
                const url = `${this.baseUrl}/api/v0/product/${barcode}.json`;
                const response = await axios.get(url);
                return response.data.status === 1 ? response.data.product : null;
            }
            catch {
                return null;
            }
        }));
        const validProducts = products.filter(p => p !== null);
        if (validProducts.length < 2) {
            throw new McpError(ErrorCode.InvalidRequest, 'At least 2 valid products required for comparison');
        }
        const comparison = validProducts.map(product => ({
            product_name: product.product_name,
            barcode: product.code,
            nutriscore_grade: product.nutriscore_grade,
            nutrition_per_100g: {
                energy_kcal: product.nutriments?.['energy-kcal_100g'] || 0,
                fat: product.nutriments?.fat_100g || 0,
                saturated_fat: product.nutriments?.['saturated-fat_100g'] || 0,
                sugars: product.nutriments?.sugars_100g || 0,
                salt: product.nutriments?.salt_100g || 0,
                fiber: product.nutriments?.fiber_100g || 0,
                protein: product.nutriments?.proteins_100g || 0,
                carbohydrates: product.nutriments?.carbohydrates_100g || 0,
            },
        }));
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ comparison }, null, 2),
                },
            ],
        };
    }
    async getAllergenInfo(args) {
        const { barcode } = args;
        const url = `${this.baseUrl}/api/v0/product/${barcode}.json`;
        const response = await axios.get(url);
        if (response.data.status === 0) {
            throw new McpError(ErrorCode.InvalidRequest, `Product with barcode ${barcode} not found`);
        }
        const product = response.data.product;
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        product_name: product.product_name,
                        barcode: product.code,
                        allergens: product.allergens || 'No allergen information available',
                        traces: product.traces || 'No trace information available',
                        ingredients: product.ingredients_text || 'No ingredient information available',
                    }, null, 2),
                },
            ],
        };
    }
    async searchByNutriments(args) {
        const { max_fat, max_sugar, max_salt, min_fiber, min_protein, nutriscore_grade, page = 1, page_size = 20 } = args;
        const searchParams = new URLSearchParams();
        searchParams.append('json', '1');
        searchParams.append('page', page.toString());
        searchParams.append('page_size', Math.min(page_size, 100).toString());
        if (max_fat !== undefined)
            searchParams.append('nutriment_fat_100g_max', max_fat.toString());
        if (max_sugar !== undefined)
            searchParams.append('nutriment_sugars_100g_max', max_sugar.toString());
        if (max_salt !== undefined)
            searchParams.append('nutriment_salt_100g_max', max_salt.toString());
        if (min_fiber !== undefined)
            searchParams.append('nutriment_fiber_100g_min', min_fiber.toString());
        if (min_protein !== undefined)
            searchParams.append('nutriment_proteins_100g_min', min_protein.toString());
        if (nutriscore_grade)
            searchParams.append('nutriscore_grade', nutriscore_grade.toLowerCase());
        const url = `${this.baseUrl}/search.json?${searchParams.toString()}`;
        const response = await axios.get(url);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        search_criteria: args,
                        total_products: response.data.count,
                        page: response.data.page,
                        total_pages: response.data.page_count,
                        products: response.data.products.map(this.formatProductSummary),
                    }, null, 2),
                },
            ],
        };
    }
    formatProductSummary(product) {
        return {
            barcode: product.code,
            name: product.product_name || 'Unknown',
            brands: product.brands || 'Unknown',
            categories: product.categories || 'Unknown',
            nutriscore_grade: product.nutriscore_grade || 'Unknown',
            nova_group: product.nova_group || 'Unknown',
            basic_nutrition: {
                energy_kcal_100g: product.nutriments?.['energy-kcal_100g'] || 0,
                fat_100g: product.nutriments?.fat_100g || 0,
                sugars_100g: product.nutriments?.sugars_100g || 0,
                salt_100g: product.nutriments?.salt_100g || 0,
                proteins_100g: product.nutriments?.proteins_100g || 0,
            },
        };
    }
    formatProductDetails(product) {
        return {
            barcode: product.code,
            name: product.product_name || 'Unknown',
            brands: product.brands || 'Unknown',
            categories: product.categories || 'Unknown',
            nutriscore_grade: product.nutriscore_grade || 'Unknown',
            nova_group: product.nova_group || 'Unknown',
            ecoscore_grade: product.ecoscore_grade || 'Unknown',
            nutrition_per_100g: product.nutriments || {},
            ingredients: product.ingredients_text || 'No ingredient information',
            allergens: product.allergens || 'No allergen information',
            traces: product.traces || 'No trace information',
            labels: product.labels || 'No label information',
            packaging: product.packaging || 'No packaging information',
            stores: product.stores || 'No store information',
            countries: product.countries || 'No country information',
            image_url: product.image_url,
            image_nutrition_url: product.image_nutrition_url,
            image_ingredients_url: product.image_ingredients_url,
        };
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('OpenFoodFacts MCP Server running on stdio');
    }
}
const server = new OpenFoodFactsServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map