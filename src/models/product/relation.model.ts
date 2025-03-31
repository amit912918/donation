import { Product } from ".//product.model";
import { Variant } from "./variant.model";
import { Color } from "./color.model";
import { Inventory } from "./inventory.model";

Product.hasMany(Variant, { foreignKey: "productId", as: "variants" });
Variant.belongsTo(Product, { foreignKey: "productId" });

Product.hasMany(Color, { foreignKey: "productId", as: "colors" });
Color.belongsTo(Product, { foreignKey: "productId" });

Variant.hasMany(Inventory, { foreignKey: "variantId", as: "inventory" });
Inventory.belongsTo(Variant, { foreignKey: "variantId" });

Color.hasMany(Inventory, { foreignKey: "colorId", as: "inventory" });
Inventory.belongsTo(Color, { foreignKey: "colorId" });
