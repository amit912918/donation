import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../helpers/common/init_mysql";

interface VariantAttributes {
    id?: string;
    productId: string;
    variantName: string;
    colorName: string;
    hexCode: string;
    imageUrl?: string;
    additionalPrice: number;
  }
  
  interface VariantCreationAttributes extends Optional<VariantAttributes, "id"> {}
  
  class Variant extends Model<VariantAttributes, VariantCreationAttributes> implements VariantAttributes {
    public id!: string;
    public productId!: string;
    public variantName!: string;
    public colorName!: string;
    public hexCode!: string;
    public imageUrl!: string;
    public additionalPrice!: number;
  }
  
  Variant.init(
    {
      productId: {
        type: DataTypes.STRING,
        unique: true,
      },
      variantName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      additionalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      colorName: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: "variants",
    }
  );
  
  export { Variant };  