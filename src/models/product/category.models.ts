import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../helpers/common/init_mysql";

// Define the interface for Category attributes
interface CategoryAttributes {
  id?: number; // Auto-generated ID field
  categoryName: string;
  parentId: string;
  status: "Active" | "Inactive";
}

// Define the interface for creation attributes
interface CategoryCreationAttributes extends Optional<CategoryAttributes, "id" | "parentId"> {}

// Define the Category model class
class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public categoryName!: string;
  public parentId!: string;
  public status!: "Active" | "Inactive";
}

// Initialize the model
Category.init(
  {
    categoryName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.STRING,
      defaultValue: "-1",
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    }
  },
  {
    sequelize,
    tableName: "category",
  }
);

export { Category };