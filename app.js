import express from "express";
import ProductManagerFilesystem from "./productManager.js";

const app = express();
const PORT = 8080;
const productManager = new ProductManagerFilesystem();

app.use(express.json());

app.get("/api/products", async (req, res) => {
  const { limit } = req.query;
  const allProducts = await productManager.getProducts();
  const products = limit ? allProducts.slice(0, limit) : allProducts;
  res.send({ success: true, products });
});

productManager.saveProduct({
  title: "Civilización VI",
  description: "Juego de estrategia para PC",
  price: 800,
  code: "1234",
  thumbnail: "./img/CivilizacionVI.jpg",
  stock: 10
})
  .then(newProduct => {
    console.log("Nuevo producto agregado:", newProduct);
  })
  .catch(error => {
    console.error("Error al agregar el producto:", error);
  });

app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));