import { Router } from "express";
import { Category } from "../../../models/product/category.models";
import { Product } from "@/models/product/product.model";
import { Variant } from "@/models/product/variant.model";
const modelRouter = Router();

// Product
Product.sync({ alter: true }).then(() => {
  console.log('Update Product table successfully!');
}).catch((error) => {
  console.error('Unable to Update Product table : ', error);
});

Category.sync({ alter: true }).then(() => {
  console.log('Update Category table successfully!');
}).catch((error) => {
  console.error('Unable to Update Category table : ', error);
});

Variant.sync({ alter: true }).then(() => {
  console.log('Update Variant table successfully!');
}).catch((error) => {
  console.error('Unable to Update Variant table : ', error);
});

export default modelRouter;