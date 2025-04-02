import uploadSingleImage from "@/middlewares/files/product/product.file.middlewares";
import * as productController from "../../../controllers/admin/product/product.controller";
import { Router } from "express";
import uploadThumbnailImages from "@/middlewares/files/mission/thumbnail.file.middlewares";

export const adminProductRouterV1 = Router();

adminProductRouterV1.post('/upload-product-image', uploadSingleImage, productController.uploadProductImage)
adminProductRouterV1.post('/upload-thumbnail-image', uploadThumbnailImages, productController.uploadThumbnailImage)
adminProductRouterV1.post('/add-product', productController.addProduct)
adminProductRouterV1.post('/get-all-products', productController.getAllProducts)
adminProductRouterV1.post('/update-product', productController.updateProduct)
adminProductRouterV1.post('/delete-product', productController.deleteProduct)

// export = { adminProductRouterV1 }