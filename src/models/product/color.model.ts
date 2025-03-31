import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../helpers/common/init_mysql";

interface ColorAttributes {
    id?: number;
    productId: string;
    variantId: string;
    colorName: string;
    hexCode: string;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  interface ColorCreationAttributes extends Optional<ColorAttributes, "id" | "imageUrl"> {}
  
  class Color extends Model<ColorAttributes, ColorCreationAttributes> implements ColorAttributes {
    public id!: number;
    public productId!: string;
    public variantId!: string;
    public colorName!: string;
    public hexCode!: string;
    public imageUrl!: string;
  
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }
  
  Color.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      variantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      colorName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hexCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "colors",
    }
  );
  
  export { Color };
  