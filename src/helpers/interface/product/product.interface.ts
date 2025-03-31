export interface ProductValidatedData {
    productName: string;
    productSku: string;
    description?: string;
    details?: string;
    images?: string[];
    thumbnails?: string[];
    cost: number;
    minSelectedQuantity?: number;
    maxSelectedQuantity?: number;
    availableQuantity: number;
    totalQuantity: number;
    inStock: "Yes" | "No";
    netWeight?: string;
    categoryId: number;
    rewardCoins?: number;
    status?: "Active" | "Inactive";
    vendor: "Ens";
    startDate?: string;
    endDate?: string;
    variants?: VariantValidatedData[];
    updateBy: string;
  }
  
  export interface VariantValidatedData {
  variantName: string;
  colorName: string;
  hexCode: string;
  imageUrl: string;
  additionalPrice: number
}

export interface ColorValidatedData {
  colorName: string;
  hexCode: string;
  inventory: number;
}

export interface UpdateProductData {
  productId: number;
  productName?: string;
  productSku?: string;
  description?: string;
  details?: string;
  images?: string[];
  thumbnails?: string[];
  cost?: number;
  minSelectedQuantity?: number;
  maxSelectedQuantity?: number;
  availableQuantity?: number;
  totalQuantity?: number;
  inStock?: "Yes" | "No";
  netWeight?: string;
  categoryId?: number;
  rewardCoins?: number;
  status?: "Active" | "Inactive";
  vendor: "Ens";
  startDate?: string;
  endDate?: string;
  updateBy: string;
  variants?: VariantValidatedData[];
}
