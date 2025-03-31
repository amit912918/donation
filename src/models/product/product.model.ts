import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../helpers/common/init_mysql";
import { Category } from "./category.models";

// Define the interface for Product attributes
interface ProductAttributes {
  pId: string;
  productName: string;
  productSku: string;
  description: string;
  details: string;
  images: string[];
  thumbnails: string[];
  cost: number;
  minSelectedQuantity: number;
  maxSelectedQuantity: number;
  availableQuantity: number;
  totalQuantity: number;
  inStock: "Yes" | "No";
  netWeight: string;
  categoryId: number;
  tagId?: number;
  rewardCoins: number;
  status: "Active" | "Inactive";
  vendor: "Ens",
  startDate: string;
  endDate: string;
  sequence: number;
  updateBy: string;
}

// Define the interface for creation attributes
interface ProductCreationAttributes extends Optional<ProductAttributes, "pId" | "sequence"> {}

// Define the Product model class
class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public pId!: string;
  public productName!: string;
  public productSku!: string;
  public description!: string;
  public details!: string;
  public images!: string[];
  public thumbnails!: string[];
  public cost!: number;
  public minSelectedQuantity!: number;
  public maxSelectedQuantity!: number;
  public availableQuantity!: number;
  public totalQuantity!: number;
  public inStock!: "Yes" | "No";
  public netWeight!: string;
  public categoryId!: number;
  public tagId?: number;
  public rewardCoins!: number;
  public status!: "Active" | "Inactive";
  public vendor!: "Ens";
  public startDate!: string;
  public endDate!: string;
  public sequence!: number;
  public updateBy!: string;
}

// Initialize the model
Product.init(
  {
    pId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    productName: {
      type: DataTypes.STRING,
    },
    productSku: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    details: {
      type: DataTypes.TEXT,
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    thumbnails: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    minSelectedQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    maxSelectedQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    availableQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    inStock: {
      type: DataTypes.ENUM("Yes", "No"),
    },
    netWeight: {
      type: DataTypes.STRING,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: Category,
        key: "id",
      },
    },
    tagId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rewardCoins: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
    vendor: {
      type: DataTypes.ENUM("Ens"),
      defaultValue: "Ens",
    },
    startDate: {
      type: DataTypes.STRING,
    },
    endDate: {
      type: DataTypes.STRING,
    },
    sequence: {
      type: DataTypes.INTEGER,
    },
    updateBy: {
      type: DataTypes.STRING,
    }
  },
  {
    sequelize,
    tableName: "products",
  }
);

// Add hooks
Product.addHook("beforeCreate", async (product: Product) => {
  const lastProduct = await Product.findOne({
    attributes: ["sequence"],
    order: [["sequence", "desc"]],
    limit: 1,
    raw: true,
  });

  const sequence = lastProduct ? lastProduct.sequence : 0;
  product.sequence = Number(sequence) + 1;
});

export { Product };