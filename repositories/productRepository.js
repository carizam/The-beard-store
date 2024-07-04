// /repositories/productRepository.js
const Product = require('../models/Products');

class ProductRepository {
    async getAll() {
        return Product.find();
    }

    async getById(id) {
        return Product.findById(id);
    }

    async create(productData) {
        const product = new Product(productData);
        return product.save();
    }

    async update(id, productData) {
        return Product.findByIdAndUpdate(id, productData, { new: true });
    }

    async delete(id) {
        return Product.findByIdAndDelete(id);
    }
}

module.exports = new ProductRepository();
