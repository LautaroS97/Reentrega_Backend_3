import fs from "fs/promises";

class ProductManagerFilesystem {
  constructor() {
    this.path = "./data.json";
    this.init();
  }

  async init() {
    try {
      const existFile = await fs.access(this.path).then(() => true).catch(() => false);
      if (!existFile) await fs.writeFile(this.path, "[]");
    } catch (error) {
      console.log(error);
    }
  }

  async getProducts() {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      return JSON.parse(response);
    } catch (error) {
      console.log(error);
    }
  }

  async saveProduct({ title, description, price, code, thumbnail, stock }) {
    if (!title || !description || !price || !code || !thumbnail || !stock)
      return { error: "Las variables son obligatorias" };
  
    const newProduct = { title, description, price, code, thumbnail, stock };
    const products = await this.getProducts();
  
    newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;
    products.push(newProduct);
  
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return newProduct;
    } catch (error) {
      console.log(error);
      return { error: "Error al guardar el producto" };
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((product) => product.id === id);
  }

  async update(id, { title, description, price, code, thumbnail, stock }) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id === id);
  
    if (productIndex === -1) return { error: "El producto no existe." };
  
    products[productIndex] = {
      ...products[productIndex],
      title,
      description,
      price,
      code,
      thumbnail,
      stock,
    };
  
    try {
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
      return products[productIndex];
    } catch (error) {
      console.log(error);
      return { error: "Error al actualizar el producto" };
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) return { error: "El producto no existe." };

    const deletedProduct = products.splice(productIndex, 1);
    await this.writeFile(products);

    return deletedProduct[0];
  }

  async writeFile(data) {
    try {
      await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    } catch (error) {
      console.log(error);
    }
  }
}

export default ProductManagerFilesystem;