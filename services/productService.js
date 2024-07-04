// /services/productService.js
const productRepository = require('../repositories/productRepository');

class ProductService {
    async getAllProducts() {
        return productRepository.getAll();
    }

    async getProductById(id) {
        return productRepository.getById(id);
    }

    async createProduct(productData) {
        return productRepository.create(productData);
    }

    async updateProduct(id, productData) {
        return productRepository.update(id, productData);
    }

    async deleteProduct(id) {
        return productRepository.delete(id);
    }
}

module.exports = new ProductService();
