import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../helpers/common/init_mysql";

interface InventoryAttributes {
    id?: number;
    variantId: string;
    colorId: number;
    stock: number;
    sku: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  interface InventoryCreationAttributes extends Optional<InventoryAttributes, "id"> {}
  
  class Inventory extends Model<InventoryAttributes, InventoryCreationAttributes> implements InventoryAttributes {
    public id!: number;
    public variantId!: string;
    public colorId!: number;
    public stock!: number;
    public sku!: string;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }
  
  Inventory.init(
    {
      variantId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      colorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "inventory",
    }
  );
  
  export { Inventory };
  